const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const acorn = require('acorn');
const { JSDOM } = require('jsdom');
const root = path.resolve(__dirname, '..');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'manifest.json'), 'utf8'));
const dom = new JSDOM('', { url: 'https://lowfuelmotorsport.com/', runScripts: 'outside-only' });
let count = 0;
function inspectAst(node, file) {
  if (!node || typeof node !== 'object') return;
  if (node.type === 'ObjectExpression') {
    const keys = new Set();
    for (const prop of node.properties) {
      const key = prop.key?.name ?? prop.key?.value;
      if (key === undefined || prop.computed) continue;
      assert(!keys.has(key), `${file}: duplicate object key ${key}`);
      keys.add(key);
    }
  }
  for (const child of Object.values(node)) {
    if (Array.isArray(child)) child.forEach(value => inspectAst(value, file));
    else if (child && typeof child === 'object') inspectAst(child, file);
  }
}
try {
  assert.equal(manifest.manifest_version, 3);
  const scripts = manifest.content_scripts[0].js;
  assert.equal(scripts.at(-1), 'content.js');
  assert.equal(scripts[0], 'translations/common.js');
  assert(manifest.permissions.includes('storage'));
  assert(manifest.permissions.includes('activeTab'));
  for (const file of [...scripts, 'popup.js']) {
    const source = fs.readFileSync(path.join(root, file), 'utf8');
    new vm.Script(source, { filename: file });
    inspectAst(acorn.parse(source, { ecmaVersion: 'latest' }), file);
    if (file.startsWith('translations/')) dom.window.eval(source);
  }
  for (const file of ['popup.html', 'popup.css']) assert(fs.existsSync(path.join(root, file)));
  for (const file of fs.readdirSync(path.join(root, 'translations'))) {
    if (file.endsWith('.js') && file !== 'route-example.js') assert(scripts.includes(`translations/${file}`), `${file} is not loaded`);
  }
  const dictionaries = dom.window.LFM_CN_TRANSLATIONS;
  function checkScope(scope) {
    for (const kind of ['exact', 'partial']) for (const [source, target] of Object.entries(scope[kind] || {})) {
      assert(source.trim() && typeof target === 'string' && target.trim(), `invalid ${kind} entry: ${source}`);
      count++;
    }
    for (const [regex, replacement] of scope.patterns || []) {
      assert(regex instanceof dom.window.RegExp);
      assert(typeof replacement === 'string' || typeof replacement === 'function');
    }
    if (scope.selector || scope.selectors) for (const selector of scope.selectors || [scope.selector]) {
      assert(selector.trim());
      dom.window.document.querySelector(selector);
    }
  }
  checkScope(dictionaries);
  for (const scope of dictionaries.scoped) {
    assert(scope.route || scope.routes, 'route scope without route');
    checkScope(scope);
  }
  dictionaries.selectorScoped.forEach(checkScope);
  assert.equal(dictionaries.exact.Drivers, '车手');
  assert.equal(dictionaries.exact['Circuit de Spa Francorchamps (2024)'], '斯帕赛道（2024）');
  assert.equal(dictionaries.partial['OFF SEASON'], '休赛期');
  console.log(`Checked ${scripts.length} content scripts and ${count} translation entries.`);
} finally { dom.window.close(); }
