const test = require('node:test');
const assert = require('node:assert/strict');
const { setup, sleep } = require('./helpers.cjs');
function cleanup(t, env) { t.after(env.close); return env; }
test('normalizes whitespace and restores the exact source, including attributes', async t => {
  const e=cleanup(t,await setup('<html lang="en"><body><p id="p"> \nQuick   Signup\t </p><input placeholder="Quick  Signup" value="Save"><a title="Save" href="/Save">Save</a></body></html>'));
  assert.equal(e.document.querySelector('#p').textContent,' \n快速报名\t ');
  assert.equal(e.document.querySelector('input').placeholder,'快速报名');
  assert.equal(e.document.querySelector('input').value,'Save');
  assert.equal(e.document.querySelector('a').getAttribute('href'),'/Save');
  await e.toggle(false);
  assert.equal(e.document.querySelector('#p').textContent,' \nQuick   Signup\t ');
  assert.equal(e.document.querySelector('input').placeholder,'Quick  Signup');
  assert.equal(e.document.documentElement.lang,'en');
  await e.toggle(true);
  assert.equal(e.document.querySelector('#p').textContent,' \n快速报名\t ');
});
test('selector then route then global precedence, including regex before global exact',async t=>{
  const e=cleanup(t,await setup('<p class="special">Save</p><p id="route">Save</p><p id="partial">Race 99</p>',{
    url:'https://lowfuelmotorsport.com/account',
    dictionary:w=>({exact:{Save:'全局', 'Race 99':'全局比赛'},partial:{},patterns:[],scoped:[{route:'/account',patterns:[[new w.RegExp('^Save$'),'路由']],partial:{Race:'场次'}}],selectorScoped:[{selector:'.special',patterns:[[new w.RegExp('^Save$'),'选择器']]}]})
  }));
  assert.equal(e.document.querySelector('.special').textContent,'选择器');
  assert.equal(e.document.querySelector('#route').textContent,'路由');
  assert.equal(e.document.querySelector('#partial').textContent,'场次 99');
});
test('page pushState, query, hash and back-style navigation retranslate reused nodes',async t=>{
  const e=cleanup(t,await setup('<p>Save</p>',{dictionary:()=>({exact:{Save:'保存'},scoped:[{route:'/account',exact:{Save:'保存账号'}}]})}));
  const p=e.document.querySelector('p');
  e.window.history.pushState({},'', '/account?tab=1#profile');
  await sleep(350);
  assert.equal(p.textContent,'保存账号');
  e.window.history.replaceState({},'', '/accountant');
  await sleep(350);
  assert.equal(p.textContent,'保存');
  e.window.history.replaceState({},'', '/account');
  e.window.dispatchEvent(new e.window.PopStateEvent('popstate'));
  await e.settle();
  assert.equal(p.textContent,'保存账号');
});
test('translates inserted nodes and respects site changes to previously translated text and attributes',async t=>{
  const e=cleanup(t,await setup('<p title="Save">Save</p>'));
  const p=e.document.querySelector('p');
  p.firstChild.nodeValue='Cancel'; p.title='Close';
  const added=e.document.createElement('span');added.textContent='Drivers';p.append(added);
  await e.settle();
  assert.equal(p.firstChild.nodeValue,'取消');assert.equal(p.title,'关闭');assert.equal(added.textContent,'车手');
  p.firstChild.nodeValue='Site-owned content';p.title='Site-owned title';
  await e.toggle(false);
  assert.equal(p.firstChild.nodeValue,'Site-owned content');assert.equal(p.title,'Site-owned title');assert.equal(added.textContent,'Drivers');
});
test('protects editable content, usernames, chat, credentials and skipped ancestors',async t=>{
  const e=cleanup(t,await setup(`<div contenteditable=""><b>Save</b></div><div class="chat-message"><b>Save</b></div><div class="driver-name">Save</div><div class="server-password">Save</div><div translate="no"><b>Save</b></div><pre><b>Save</b></pre><textarea>Save</textarea><input type="password" value="Save"><p data-lfm-cn-skip title="Save">Save</p>`));
  for(const node of e.document.querySelectorAll('b,.driver-name,.server-password,textarea,p')) assert.equal(node.textContent,'Save');
  assert.equal(e.document.querySelector('input').value,'Save');assert.equal(e.document.querySelector('p').title,'Save');
});
test('changing ancestor skip state restores its descendants',async t=>{
  const e=cleanup(t,await setup('<div><b>Save</b></div>'));
  e.document.querySelector('div').setAttribute('translate','no');await e.settle();
  assert.equal(e.document.querySelector('b').textContent,'Save');
  e.document.querySelector('div').removeAttribute('translate');await e.settle();
  assert.equal(e.document.querySelector('b').textContent,'保存');
});
test('option labels translate without changing explicit or implicit submission values',async t=>{
  const e=cleanup(t,await setup('<select><option value="save">Save</option><option>Cancel</option><option>Unmapped</option></select>'));
  const [explicit,implicit,unmapped]=e.document.querySelectorAll('option');
  assert.equal(explicit.textContent,'保存');assert.equal(explicit.value,'save');
  assert.equal(implicit.textContent,'取消');assert.equal(implicit.value,'Cancel');assert.equal(unmapped.hasAttribute('value'),false);
  implicit.firstChild.nodeValue='Close';await e.settle();
  assert.equal(implicit.textContent,'关闭');assert.equal(implicit.value,'Close');
  await e.toggle(false);
  assert.equal(implicit.textContent,'Close');assert.equal(implicit.hasAttribute('value'),false);
  assert.equal(explicit.value,'save');
});
test('preserves a site-owned option value set after translation',async t=>{
  const e=cleanup(t,await setup('<select><option>Save</option></select>'));
  const option=e.document.querySelector('option');option.value='new-value';
  await e.toggle(false);assert.equal(option.value,'new-value');assert.equal(option.textContent,'Save');
});
test('language preferences survive reload and recover when disabled',async t=>{
  const e=cleanup(t,await setup('<html lang="de"><body><p>Save</p></body></html>',{locale:'de'}));
  assert.equal(e.window.localStorage.getItem('locale'),'en');assert.equal(e.status().refreshRequired,true);
  const backup=JSON.parse(e.window.localStorage.getItem('lfm-cn:locale-backup'));
  const reloaded=cleanup(t,await setup('<html lang="en"><body><p>Save</p></body></html>',{locale:'en',backup,enabled:false}));
  assert.equal(reloaded.window.localStorage.getItem('locale'),'de');assert.equal(reloaded.document.querySelector('p').textContent,'Save');assert.equal(reloaded.status().refreshRequired,true);
  await e.toggle(false);assert.equal(e.window.localStorage.getItem('locale'),'de');assert.equal(e.document.documentElement.lang,'de');
});
test('restores missing language preference and preserves a site language change',async t=>{
  const e=cleanup(t,await setup('<p>Save</p>'));
  await e.toggle(false);assert.equal(e.window.localStorage.getItem('locale'),null);assert.equal(e.document.documentElement.hasAttribute('lang'),false);
  await e.toggle(true);e.window.localStorage.setItem('locale','es');e.document.documentElement.lang='es';
  await e.toggle(false);assert.equal(e.window.localStorage.getItem('locale'),'es');assert.equal(e.document.documentElement.lang,'es');
});
test('global and sticky regexes are repeatable and partial replacements prefer longer sources',async t=>{
  const e=cleanup(t,await setup('<p>Race 1</p><p>Race 1</p><b>Track Long / Track Short</b>',{dictionary:w=>({patterns:[[new w.RegExp('Race (\\d+)','g'),'比赛 $1']],partial:{Track:'赛道', 'Track Long':'长赛道','Track Short':'短赛道'}})}));
  for(const p of e.document.querySelectorAll('p'))assert.equal(p.textContent,'比赛 1');
  assert.equal(e.document.querySelector('b').textContent,'长赛道 / 短赛道');
});
test('large mutation bursts settle without self-generated mutation loops',async t=>{
  const e=cleanup(t,await setup('<main></main>'));
  const main=e.document.querySelector('main');
  let mutations=0;const observer=new e.window.MutationObserver(list=>mutations+=list.length);observer.observe(main,{subtree:true,childList:true,characterData:true});t.after(()=>observer.disconnect());
  for(let i=0;i<500;i++){const p=e.document.createElement('p');p.textContent='Save';main.append(p);}
  await sleep(200);assert.equal(main.querySelectorAll('p').length,500);assert.equal(main.firstChild.textContent,'保存');
  const settled=mutations;await sleep(200);assert.equal(mutations,settled);
  await e.toggle(false);assert.equal(main.firstChild.textContent,'Save');
});
test('signup, account and report fixtures preserve controls and event handlers',async t=>{
  const e=cleanup(t,await setup(`<form id="account"><label>First name<input name="first" value="Save"></label><button type="submit">SAVE PROFILE</button></form><form id="signup"><select name="car"><option value="gt3">Car</option></select><label><input type="checkbox" name="accept">I am fully accepting the 'Code of Conduct' of the LFM racing service.</label><button type="submit">SIGN ME UP!</button></form><form id="report"><label>Your point of view<textarea name="evidence">Save</textarea></label><button type="submit">Send</button></form>`));
  let submissions=0;for(const form of e.document.forms)form.addEventListener('submit',event=>{event.preventDefault();submissions++;});
  assert.equal(e.document.querySelector('#account button').textContent,'保存资料');
  assert.equal(e.document.querySelector('#signup button').textContent,'我要报名！');
  assert.equal(new e.window.FormData(e.document.querySelector('#account')).get('first'),'Save');
  assert.equal(new e.window.FormData(e.document.querySelector('#signup')).get('car'),'gt3');
  assert.equal(new e.window.FormData(e.document.querySelector('#report')).get('evidence'),'Save');
  for(const form of e.document.forms)form.requestSubmit();assert.equal(submissions,3);
});
test('current public page labels, date and weather fragments translate consistently',async t=>{
  const e=cleanup(t,await setup('<nav>SEASON SCHEDULE</nav><p>User Online</p><p>MOST ACTIVE DRIVERS</p><p>LAPTIME BY ELO RANGE</p><time>OCT 10 2026</time><b class="weather-pill">P: 10 min. / Q: 5 min. / R: 20 min.</b><p>Safety Rating</p>'));
  assert.equal(e.document.querySelector('nav').textContent,'赛季赛程');
  assert.equal(e.document.querySelector('time').textContent,'2026年10月10日');
  assert.equal(e.document.querySelector('b').textContent,'练习: 10 分钟 / 排位: 5 分钟 / 正赛: 20 分钟');
  assert.equal(e.document.querySelector('p:last-child').textContent,'安全评分');
});
test('locale backup shared by same-origin tabs retains the original preference',async t=>{
  const first=cleanup(t,await setup('<p>Save</p>',{locale:'de'}));
  const backup=JSON.parse(first.window.localStorage.getItem('lfm-cn:locale-backup'));
  const second=cleanup(t,await setup('<p>Save</p>',{locale:'en',backup}));
  assert.equal(second.status().refreshRequired,false);
  await second.toggle(false);assert.equal(second.window.localStorage.getItem('locale'),'de');
  await first.toggle(false);assert.equal(first.window.localStorage.getItem('locale'),'de');
});
test('storage access failure does not stop DOM translation or the switch',async t=>{
  // Throwing site storage is independent from the extension settings store.
  const {JSDOM}=require('jsdom');const fs=require('node:fs');const path=require('node:path');
  const dom=new JSDOM('<p>Save</p>',{url:'https://lowfuelmotorsport.com/',runScripts:'outside-only'});t.after(()=>dom.window.close());
  const listeners=[];dom.window.chrome={storage:{local:{get:(_d,cb)=>cb({enabled:true})},onChanged:{addListener:fn=>listeners.push(fn)}},runtime:{onMessage:{addListener(){}}}};
  Object.defineProperty(dom.window,'localStorage',{get(){throw Error('blocked');}});
  dom.window.LFM_CN_TRANSLATIONS={exact:{Save:'保存'}};
  dom.window.eval(fs.readFileSync(path.resolve(__dirname,'../content.js'),'utf8'));
  await sleep(100);assert.equal(dom.window.document.querySelector('p').textContent,'保存');
  listeners[0]({enabled:{newValue:false}},'local');assert.equal(dom.window.document.querySelector('p').textContent,'Save');
});
test('an option moved into a skipped area regains its implicit value semantics',async t=>{
  const e=cleanup(t,await setup('<select><option>Save</option></select>'));
  const select=e.document.querySelector('select');const option=e.document.querySelector('option');
  select.setAttribute('translate','no');await e.settle();
  assert.equal(option.textContent,'Save');assert.equal(option.hasAttribute('value'),false);
  option.textContent='Close';await e.settle();assert.equal(option.value,'Close');
});
test('malformed locale backup cannot replace a valid language with undefined',async t=>{
  const e=cleanup(t,await setup('<p>Save</p>',{locale:'de',backup:{unexpected:true}}));
  await e.toggle(false);assert.equal(e.window.localStorage.getItem('locale'),'de');
});
test('live account and series value containers protect names and credentials while labels translate',async t=>{
  const e=cleanup(t,await setup(`<div class="field-row"><h2 class="field-label">First Name:</h2><div class="input-wrapper"><span title="Save">Save</span><input value="Save" placeholder="Search..."></div></div><div class="series-requirements-wrapper"><div><h2>SERVERPASSWORD</h2><div><h2>Save</h2></div></div><div><h2>FIXED CAR</h2><div><h2>No</h2></div></div></div>`));
  assert.equal(e.document.querySelector('.field-label').textContent,'名：');
  assert.equal(e.document.querySelector('.input-wrapper span').textContent,'Save');
  assert.equal(e.document.querySelector('.input-wrapper span').title,'Save');
  assert.equal(e.document.querySelector('input').value,'Save');
  assert.equal(e.document.querySelector('input').placeholder,'搜索...');
  const headings=[...e.document.querySelectorAll('.series-requirements-wrapper h2')].map(el=>el.textContent);
  assert.deepEqual(headings,['服务器密码','Save','固定车辆','否']);
  await e.toggle(false);assert.equal(e.document.querySelector('.field-label').textContent,'First Name:');
});
test('current login-required dynamic messages and compound weather hints translate',async t=>{
  const e=cleanup(t,await setup('<h2>SEASON 24 | WEEK 1</h2><p>SR License E2 required</p><p>License IRON required</p><span title="Driver Stint Time: 48 min">48 min.</span><div class="weather-pill" title="Sessions · P: 10 min. · Q: 20 min. · R: 270 min.">Start Times P: 15:00 · Q: 15:00 · R: 15:00</div>'));
  assert.equal(e.document.querySelector('h2').textContent,'第 24 赛季 | 第 1 周');
  assert.equal(e.document.querySelector('p').textContent,'需要 SR 驾照 E2');
  assert.equal(e.document.querySelector('span').title,'车手单次驾驶时长：48 分钟');
  assert.equal(e.document.querySelector('div').title,'比赛环节 · 练习: 10 分钟 · 排位: 20 分钟 · 正赛: 270 分钟');
  assert.equal(e.document.querySelector('div').textContent,'开始时间 练习: 15:00 · 排位: 15:00 · 正赛: 15:00');
});
test('live leaderboard name cells remain original after header translation and later DOM changes',async t=>{
  const e=cleanup(t,await setup('<table class="responsive-table"><thead><tr><th>ORIGIN</th><th>NAME</th><th>RATING</th></tr></thead><tbody><tr><td>Germany</td><td><span>Save</span></td><td>1500</td></tr></tbody></table>', { url: 'https://lowfuelmotorsport.com/statistics/ratingleaderboard' }));
  assert.equal(e.document.querySelectorAll('th')[1].textContent,'姓名');
  const name=e.document.querySelector('tbody td:nth-child(2) span');assert.equal(name.textContent,'Save');
  name.firstChild.nodeValue='Cancel';await e.settle();assert.equal(name.textContent,'Cancel');
});

test('observed race-result parameters and split account hints translate across text nodes',async t=>{
  const e=cleanup(t,await setup('<h2>SHARE RESULT</h2><p>Split 2</p><p>561 Laps</p><p> Get your LFM License for your stream! Copy the URL and add it as an <b>OBS Browser Source</b>. </p><button title="Switch to dark">Toggle menu</button>'));
  assert.equal(e.document.querySelector('h2').textContent,'分享结果');
  const paragraphs=e.document.querySelectorAll('p');
  assert.equal(paragraphs[0].textContent,'分组 2');
  assert.equal(paragraphs[1].textContent,'561 圈');
  assert.equal(paragraphs[2].textContent,' 为您的直播获取 LFM 驾照！复制 URL 并将其添加为 OBS 浏览器源. ');
  assert.equal(e.document.querySelector('button').title,'切换为暗色');
  await e.toggle(false);assert.equal(paragraphs[1].textContent,'561 Laps');
});
