import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {root,loadContent,referenceURLs,read} from './content.mjs';
import {validatePlain} from './plain-content.mjs';
import {readabilityWarnings} from './readability.mjs';
const file=n=>fs.readFileSync(path.join(root,n),'utf8');
const source=loadContent(),ctx={window:{}};
vm.runInNewContext(file('dist/data.js'),ctx);const d=JSON.parse(JSON.stringify(ctx.window.AI_ATLAS));
assert.deepEqual(d,source,'Generated app data must match canonical sources');
const ids=new Set(d.topics.map(t=>t.id));assert.equal(ids.size,d.topics.length,'Duplicate topic IDs');
assert.equal(d.tree.length,5);
const enrichment=fs.readdirSync(path.join(root,'content')).filter(n=>/^enrichment-.+\.json$/.test(n)).flatMap(read);
assert.equal(enrichment.length,d.topics.length,'Orphaned enrichment record');
function ref(r){assert.equal(new URL(r.url).protocol,'https:');assert.ok(r.title&&r.kind);assert.ok(!('verified' in r),'Do not confuse editorial dates with HTTP evidence');}
for(const t of d.topics){
 validatePlain(t);
 readabilityWarnings(t).forEach(w=>console.warn(w));
 for(const field of ['context','example','limitation'])assert.ok(t[field]?.length>50,`${t.id}: missing ${field}`);
 assert.ok(t.refs?.length,`${t.id}: no references`);t.refs.forEach(ref);
 assert.equal(new Set(t.refs.map(r=>r.url)).size,t.refs.length,`${t.id}: duplicate references`);
 for(const r of t.related)assert.ok(ids.has(r)&&r!==t.id,`${t.id}: invalid related topic ${r}`);
}
for(const j of d.journeys){assert.equal(new Set(j.topics).size,j.topics.length);for(const id of j.topics)assert.ok(ids.has(id),`${j.id}: unknown ${id}`);}
assert.deepEqual(d.glossary.map(g=>g.id),['model','training','example-label','prediction','parameters','evaluation']);
for(const g of d.glossary)assert.ok(g.term&&g.definition?.length>30,'Incomplete glossary term');
for(const f of d.frontiers){f.refs.forEach(ref);for(const id of f.topics)assert.ok(ids.has(id));}
const nodes=new Set(d.history.nodes.map(n=>n.id));assert.equal(nodes.size,d.history.nodes.length);
for(const n of d.history.nodes){assert.ok(n.row>=0&&n.row<d.history.eras.length);for(const k of n.refs)assert.equal(new URL(d.history.sources[k]).protocol,'https:');if(n.future)assert.equal(n.row,d.history.eras.length-1);}
for(const [a,b] of d.history.edges)assert.ok(nodes.has(a)&&nodes.has(b)&&a!==b,`Invalid history edge ${a} → ${b}`);
assert.equal(new Set(d.history.edges.map(e=>e.join(':'))).size,d.history.edges.length,'Duplicate history edge');
const audit=read('link-checks.json'),urls=referenceURLs(d);
assert.equal(audit.reference_set_sha256,createHash('sha256').update(urls.join('\n')).digest('hex'),'HTTP audit is stale for the current reference set');
assert.deepEqual(audit.results.map(r=>r.url).sort(),urls,'Missing/duplicate HTTP audit records');
const states=new Set(['reachable','access_restricted','rate_limited','not_found','http_error','network_error','not_checked']),counts={};
for(const r of audit.results){
 assert.ok(states.has(r.state)&&!Number.isNaN(Date.parse(r.checked_at)));counts[r.state]=(counts[r.state]||0)+1;
 assert.ok(r.attempts.length||r.state==='not_checked');
 if(r.state==='reachable')assert.ok(r.http_status>=200&&r.http_status<300);
 if(r.state==='not_found')assert.ok([404,410].includes(r.http_status));
 for(const attempt of r.attempts)assert.ok(['HEAD','GET'].includes(attempt.method)&&!Number.isNaN(Date.parse(attempt.checked_at)));
}
assert.deepEqual(counts,audit.counts);assert.equal(counts.not_found||0,0,'Confirmed missing references require resolution');
assert.equal(file('content/link-checks.json'),file('dist/link-checks.json'));
new vm.Script(file('dist/app.js'));
for(const f of ['tree','history']){
 const html=file(`dist/figures/${f}.html`);assert.ok(html.length>1000&&!/\/\*__[A-Z_]+__\*\//.test(html));
 assert.ok(html.includes('data-figure-root')&&!html.includes('<iframe'),'Figures must be direct standalone documents');
 for(const script of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g))new vm.Script(script[1]);
 for(const id of f==='tree'?ids:nodes)assert.ok(html.includes(`"id":"${id}"`),`${f} missing ${id}`);
}
assert.ok(file('dist/figures/tree.html').includes(file('content/enriched-tree.html')));
const treeData=file('content/enriched-tree.html').match(/const atlas = (.+);\n/);
assert.ok(treeData,'Tree figure must embed the canonical data');
assert.deepEqual(JSON.parse(treeData[1]).topics,d.topics,'Tree figure must preserve every topic field, including plain');
assert.deepEqual(JSON.parse(treeData[1]).glossary,d.glossary,'Tree figure glossary must match the app');
const css=file('dist/styles.css');assert.ok(!/@import|fonts\.googleapis\.com|fonts\.gstatic\.com/.test(css),'Fonts must be local');
for(const [,name] of css.matchAll(/url\((?:['"])?(fonts\/[^)'"\s]+)/g))assert.ok(fs.statSync(path.join(root,'dist',name)).size>0);
for(const name of ['dmsans-OFL.txt','instrumentserif-OFL.txt'])assert.ok(file('dist/fonts/'+name).includes('SIL OPEN FONT LICENSE'));
for(const p of ['CHANGELOG.md','LICENSE.md','docs/review-response.md'])assert.ok(file(p).length>100);
assert.ok(!file('dist/index.html').includes('codex-preview'));
console.log(JSON.stringify({topics:ids.size,milestones:nodes.size,journeys:d.journeys.length,referenceURLs:urls.length,httpAudit:counts,checks:'source consistency, graph, references, scripts, figure exports, local fonts and audit evidence'}));
