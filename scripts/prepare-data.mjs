import fs from 'node:fs';
import path from 'node:path';
import {root,loadContent} from './content.mjs';
const d=loadContent();
const safe=value=>JSON.stringify(value).replace(/</g,'\\u003c').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');
function fill(template,key,value){if(template.split(key).length!==2)throw new Error('Template must contain exactly one '+key);return template.replace(key,()=>value);}
const get=n=>fs.readFileSync(path.join(root,'templates',n),'utf8');
fs.writeFileSync(path.join(root,'dist/data.js'),'window.AI_ATLAS = '+safe(d)+';\n');
const stamp=new Intl.DateTimeFormat('en-GB',{dateStyle:'long',timeZone:'UTC'}).format(new Date(d.meta.snapshot_date+'T12:00:00Z'));
const tree=fill(fill(get('tree.html'),'/*__ATLAS_DATA__*/',safe({tree:d.tree,topics:d.topics,glossary:d.glossary,linkChecks:d.linkChecks})),'<!--__SNAPSHOT_DATE__-->',stamp);
const history=fill(get('history.html'),'/*__HISTORY_DATA__*/',safe(d.history));
fs.writeFileSync(path.join(root,'content/enriched-tree.html'),tree);
for(const [name,title,fragment] of [['tree','AI techniques: a faceted classification tree',tree],['history','AI evolution: parallel traditions and combinations',history]]){
 const page=fill(fill(get('figure-shell.html'),'<!--__TITLE__-->',title),'<!--__FIGURE__-->',fragment);
 fs.writeFileSync(path.join(root,'dist/figures',name+'.html'),page);
}
for(const [from,to] of [['content/link-checks.json','dist/link-checks.json'],['CHANGELOG.md','dist/changelog.md'],['LICENSE.md','dist/license.md'],['docs/review-response.md','dist/review-response.md'],['docs/plain-language-review.md','dist/plain-language-review.md'],['docs/readability-report.json','dist/readability-report.json']])if(fs.existsSync(path.join(root,from)))fs.copyFileSync(path.join(root,from),path.join(root,to));
console.log(JSON.stringify({version:d.meta.version,topics:d.topics.length,milestones:d.history.nodes.length,journeys:d.journeys.length,figure_exports:'regenerated from shared data'}));
