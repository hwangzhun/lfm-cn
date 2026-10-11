const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');
const root = path.resolve(__dirname, '..');
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
async function setup(html, options = {}) {
  const dom = new JSDOM(html, { url: options.url || 'https://lowfuelmotorsport.com/', runScripts: 'outside-only', pretendToBeVisual: true });
  const { window } = dom;
  const changes = [], messages = [];
  let enabled = options.enabled ?? true;
  window.chrome = {
    storage: {
      local: { get: (_defaults, callback) => callback({ enabled }) },
      onChanged: { addListener: listener => changes.push(listener) }
    },
    runtime: { onMessage: { addListener: listener => messages.push(listener) } }
  };
  if (options.locale !== undefined) window.localStorage.setItem('locale', options.locale);
  if (options.backup) window.localStorage.setItem('lfm-cn:locale-backup', JSON.stringify(options.backup));
  if (options.dictionary) window.LFM_CN_TRANSLATIONS = options.dictionary(window);
  else {
    const manifest = JSON.parse(fs.readFileSync(path.join(root,'manifest.json')));
    for (const script of manifest.content_scripts[0].js.slice(0,-1)) window.eval(fs.readFileSync(path.join(root,script),'utf8'));
  }
  window.eval(fs.readFileSync(path.join(root,'content.js'),'utf8'));
  await sleep(100);
  return {
    window, document: window.document,
    async toggle(value) {
      const oldValue = enabled; enabled = value;
      changes.forEach(listener=>listener({enabled:{oldValue,newValue:value}},'local'));
      await sleep(100);
    },
    status() {
      let result;
      messages.forEach(listener=>listener({type:'lfm-cn:status'}, {}, value=>result=value));
      return result;
    },
    settle: () => sleep(100), close: () => window.close()
  };
}
module.exports = { setup, sleep };
