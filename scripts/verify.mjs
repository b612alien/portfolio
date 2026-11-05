import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import http from 'node:http';
import vm from 'node:vm';

const root = path.resolve(import.meta.dirname, '..');
const walk = dir => fs.readdirSync(dir, {withFileTypes:true}).flatMap(e => e.isDirectory() ? walk(path.join(dir,e.name)) : [path.join(dir,e.name)]);
const htmlFiles = walk(root).filter(p => p.endsWith('.html'));
const pages = htmlFiles.filter(p => path.basename(p) === 'index.html');
assert.equal(pages.length, 8);
let checked = 0;
const requests = new Set();
for (const prefix of ['/', '/repository-name/']) {
 for (const file of htmlFiles) {
  const relative = path.relative(root,file).replaceAll('\\','/');
  const pageUrl = new URL(prefix + relative.replace(/index\.html$/, ''), 'http://example.test');
  requests.add(pageUrl.pathname);
  const html = fs.readFileSync(file,'utf8');
  for (const [, attr, value] of html.matchAll(/\b(href|src)="([^"]+)"/g)) {
   if (/^(?:[a-z]+:|\/\/)/i.test(value)) continue;
   assert.ok(!value.startsWith('/'), relative + ': root absolute path ' + value);
   const url = new URL(value,pageUrl);
   assert.ok(url.pathname.startsWith(prefix), relative + ': escaped mount');
   let target = path.join(root,decodeURIComponent(url.pathname.slice(prefix.length)));
   if (url.pathname.endsWith('/')) target = path.join(target,'index.html');
   assert.ok(fs.existsSync(target), relative + ': missing ' + value);
   if (url.hash && attr === 'href') assert.ok(fs.readFileSync(target,'utf8').includes('id="' + url.hash.slice(1) + '"'), 'missing fragment');
   requests.add(url.pathname);
   checked++;
  }
 }
}
for (const file of pages) {
 const html = fs.readFileSync(file,'utf8');
 if (!['research','contact'].some(section => file.endsWith(path.join(section,'index.html')))) assert.ok(html.includes('aria-current='), 'missing current navigation');
 assert.ok(html.includes('aria-controls="main-navigation"'));
 assert.ok(html.includes('id="main-navigation"'));
 if (file.includes('collection-')) assert.match(html, /class="small-link" href="\.\.\/"/);
}
const works = fs.readFileSync(path.join(root,'works/index.html'),'utf8');
assert.equal([...works.matchAll(/class="work-card"/g)].length, 3);
assert.ok(fs.readFileSync(path.join(root,'assets/css/style.css'),'utf8').includes('.work-card[hidden]{display:none}'));

function element(classes=[],dataset={}) {
 const set = new Set(classes), handlers = {}, attributes = {};
 return {dataset, attributes, handlers, hidden:false, focused:false,
  classList:{contains:x=>set.has(x),remove:x=>set.delete(x),toggle(x,force){const on=force??!set.has(x); on?set.add(x):set.delete(x); return on;}},
  addEventListener:(event,fn)=>{handlers[event]=fn;},
  setAttribute:(key,value)=>{attributes[key]=value;},
  focus(){this.focused=true;}
 };
}
const toggle=element(), nav=element(), documentEvents={};
const filters=['all','commercial','wedding','fine','competition','experimental'].map((filter,i)=>element(i===0?['selected']:[],{filter}));
const cards=['commercial','experimental','fine'].map(category=>element([],{category}));
const document={querySelector:s=>s==='.menu-toggle'?toggle:s==='.nav'?nav:null,querySelectorAll:s=>s==='[data-filter]'?filters:cards,addEventListener:(key,fn)=>{documentEvents[key]=fn;}};
const js=fs.readFileSync(path.join(root,'assets/js/main.js'),'utf8');
vm.runInNewContext(js,{document,URLSearchParams,window:{location:{search:''}}});
toggle.handlers.click();
assert.equal(toggle.attributes['aria-expanded'],'true');
assert.ok(nav.classList.contains('open'));
documentEvents.keydown({key:'Escape'});
assert.equal(toggle.attributes['aria-expanded'],'false');
assert.ok(toggle.focused);
toggle.handlers.click();
nav.handlers.click({target:{closest:()=>({})}});
assert.equal(toggle.attributes['aria-expanded'],'false');
for (const filter of filters) {
 filter.handlers.click();
 cards.forEach(card=>assert.equal(card.hidden,filter.dataset.filter!=='all'&&card.dataset.category!==filter.dataset.filter));
 assert.equal(filter.attributes['aria-pressed'],'true');
 assert.equal(filters.filter(f=>f.classList.contains('selected')).length,1);
}
vm.runInNewContext(js,{document:{querySelector:()=>null,querySelectorAll:()=>[]}});
for(const category of ['commercial','wedding','fine','competition','experimental','unknown']){
 vm.runInNewContext(js,{document,URLSearchParams,window:{location:{search:'?category='+category}}});
 cards.forEach(card=>assert.equal(card.hidden,category!=='unknown'&&card.dataset.category!==category));
}
for(const file of pages){const html=fs.readFileSync(file,'utf8');for(const category of ['commercial','wedding','fine','competition'])assert.ok(html.includes('?category='+category));}

for(const file of htmlFiles.filter(p=>!pages.includes(p) && !p.includes(path.sep+'tools'+path.sep))) {
 const html=fs.readFileSync(file,'utf8');
 const target=html.match(/id="destination" href="([^"]+)"/)[1];
 const oldUrl=new URL(path.relative(root,file).replaceAll('\\','/'),'http://example.test/repository-name/');
 let redirected;
 vm.runInNewContext(fs.readFileSync(path.join(root,'assets/js/redirect.js'),'utf8'),{URL,document:{getElementById:()=>({href:new URL(target,oldUrl).href})},window:{location:{search:'?lang=ko',hash:'#main',replace:value=>{redirected=new URL(value);}}}});
 assert.equal(redirected.search,'?lang=ko');
 assert.equal(redirected.hash,'#main');
 assert.ok(redirected.pathname.startsWith('/repository-name/'));
}


const translationContext = {window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,'assets/js/translations.js'),'utf8'),translationContext);
const dictionary=translationContext.window.portfolioTranslations;
for(const file of pages){
 const html=fs.readFileSync(file,'utf8');
 assert.ok(html.includes('lang="ko"'));
 assert.equal([...html.matchAll(/data-language=/g)].length,2);
 for(const [,key] of html.matchAll(/data-i18n="([^"]+)"/g)){
  assert.ok(dictionary[key]?.ko && dictionary[key]?.en, 'Missing translation: '+key);
 }
}
function checkLanguage(saved,failStorage=false){
 const nodes=Object.keys(dictionary).map(key=>({dataset:{i18n:key},textContent:''}));
 const custom={dataset:{ko:'한국어 설명',en:'English description'},textContent:''};
 const buttons=['ko','en'].map(language=>element([],{language}));
 const html={lang:''}; let stored=saved;
 const doc={documentElement:html,querySelector:()=>null,querySelectorAll:selector=>selector==='[data-i18n]'?nodes:selector==='[data-ko][data-en]'?[custom]:buttons};
 const localStorage={getItem:()=>{if(failStorage)throw Error();return stored;},setItem:(key,value)=>{if(failStorage)throw Error();stored=value;}};
 vm.runInNewContext(fs.readFileSync(path.join(root,'assets/js/i18n.js'),'utf8'),{window:{portfolioTranslations:dictionary},document:doc,localStorage});
 assert.equal(html.lang,saved==='en'&&!failStorage?'en':'ko');
 for(const language of ['en','ko']){
  buttons.find(b=>b.dataset.language===language).handlers.click();
  assert.equal(html.lang,language);
  nodes.forEach(node=>assert.equal(node.textContent,dictionary[node.dataset.i18n][language]));
  assert.equal(custom.textContent,custom.dataset[language]);
  assert.equal(buttons.find(b=>b.dataset.language===language).attributes['aria-pressed'],'true');
  if(!failStorage)assert.equal(stored,language);
 }
}
checkLanguage(null);checkLanguage('en');checkLanguage(null,true);

const server=http.createServer((req,res)=>{
 let pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
 if(pathname.startsWith('/repository-name/')) pathname=pathname.slice('/repository-name'.length);
 let file=path.join(root,pathname);
 if(pathname.endsWith('/')) file=path.join(file,'index.html');
 if(!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end();return;}
 res.writeHead(200);res.end(fs.readFileSync(file));
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
try {
 for(const request of requests) {
  const response=await fetch('http://127.0.0.1:'+server.address().port+request);
  assert.equal(response.status,200,request);
  await response.arrayBuffer();
 }
} finally { await new Promise(resolve=>server.close(resolve)); }
console.log('PASS: 8 independent pages, 7 legacy redirects, '+checked+' local references across both mounts, '+requests.size+' HTTP paths; mobile menu, all filters, active navigation and redirect query/hash preservation.');
