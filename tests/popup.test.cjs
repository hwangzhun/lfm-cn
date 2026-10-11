const fs=require('node:fs');
const path=require('node:path');
const test=require('node:test');
const assert=require('node:assert/strict');
const {JSDOM}=require('jsdom');
const {sleep}=require('./helpers.cjs');
const root=path.resolve(__dirname,'..');
async function popup(t,options={}) {
  const dom=new JSDOM(fs.readFileSync(path.join(root,'popup.html'),'utf8'),{runScripts:'outside-only',url:'https://extension.test/'});
  t.after(()=>dom.window.close());
  const calls=[];let enabled=options.enabled??true;
  dom.window.chrome={
    storage:{local:{get:async()=>({enabled}),set:async settings=>{if(options.failSave)throw Error('storage error');enabled=settings.enabled;calls.push(['set',enabled]);}}},
    tabs:{query:async()=>[{id:1,url:options.url||'https://lowfuelmotorsport.com/'}],sendMessage:async(id,message)=>{
      calls.push(['message',message]);if(options.noReceiver)throw Error('no receiver');
      if(message.type==='lfm-cn:set-enabled')enabled=message.enabled;
      return{enabled,refreshRequired:!!options.refreshRequired};
    },reload:async id=>calls.push(['reload',id])}
  };
  dom.window.eval(fs.readFileSync(path.join(root,'popup.js'),'utf8'));await sleep(20);
  return{window:dom.window,document:dom.window.document,calls};
}
test('popup loads default setting, persists a change and synchronizes active page',async t=>{
  const p=await popup(t);const toggle=p.document.querySelector('#enabled');
  assert.equal(toggle.checked,true);assert.equal(toggle.disabled,false);
  toggle.checked=false;toggle.dispatchEvent(new p.window.Event('change'));await sleep(20);
  assert(p.calls.some(call=>call[0]==='set'&&call[1]===false));
  assert(p.calls.some(call=>call[0]==='message'&&call[1].type==='lfm-cn:set-enabled'&&call[1].enabled===false));
  assert.equal(p.document.querySelector('#status').textContent,'当前页面已恢复原文。');
});
test('popup offers reload when content script is missing or locale changed',async t=>{
  const p=await popup(t,{noReceiver:true});
  assert.equal(p.document.querySelector('#refresh').hidden,false);
  assert.match(p.document.querySelector('#status').textContent,/刷新/);
  const q=await popup(t,{refreshRequired:true});
  assert.equal(q.document.querySelector('#refresh-hint').hidden,false);
});
test('popup on unrelated sites saves preference without messaging or reloading them',async t=>{
  const p=await popup(t,{url:'https://example.com/'});const toggle=p.document.querySelector('#enabled');
  toggle.checked=false;toggle.dispatchEvent(new p.window.Event('change'));await sleep(20);
  assert.equal(p.calls.filter(call=>call[0]==='message').length,0);
  assert.equal(p.document.querySelector('#refresh').hidden,true);
  assert.match(p.document.querySelector('#status').textContent,/设置已保存/);
});
test('popup recovers its switch state after a save failure',async t=>{
  const p=await popup(t,{failSave:true});const toggle=p.document.querySelector('#enabled');
  toggle.checked=false;toggle.dispatchEvent(new p.window.Event('change'));await sleep(20);
  assert.equal(toggle.checked,true);assert.equal(toggle.disabled,false);
  assert.match(p.document.querySelector('#status').textContent,/保存失败/);
});
