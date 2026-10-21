import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
export const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
export const read=name=>JSON.parse(fs.readFileSync(path.join(root,'content',name),'utf8'));
export function loadContent(){
 const base=read('taxonomy-base.json');
 const extra=fs.readdirSync(path.join(root,'content')).filter(n=>/^enrichment-.+\.json$/.test(n)).sort().flatMap(read);
 const map=new Map(extra.map(t=>[t.id,t]));
 if(map.size!==extra.length)throw new Error('Duplicate topic enrichment IDs');
 const topics=[];
 function walk(n,facet,ancestors){if(n.children)n.children.forEach(c=>walk(c,facet,[...ancestors,n.name]));else {if(!map.has(n.id))throw new Error('Missing enrichment: '+n.id);topics.push({...n,...map.get(n.id),name:n.name,detail:n.detail,path:ancestors,facet});}}
 base.tree.forEach((n,i)=>walk(n,i+1,[]));
 const meta=read('metadata.json');
 const auditPath=path.join(root,'content/link-checks.json');
 const audit=fs.existsSync(auditPath)?JSON.parse(fs.readFileSync(auditPath,'utf8')):null;
 return {tree:base.tree,topics,glossary:read('glossary.json'),history:read('history-base.json'),...read('learning.json'),meta,updated:meta.snapshot_date,
 linkAudit:audit?{finished_at:audit.finished_at,counts:audit.counts}:null,
 linkChecks:Object.fromEntries((audit?.results||[]).map(r=>[r.url,{checked_at:r.checked_at,state:r.state,http_status:r.http_status,final_url:r.final_url}]))};
}
export function referenceURLs(d){return [...new Set([...d.topics.flatMap(t=>t.refs.map(r=>r.url)),...d.frontiers.flatMap(f=>f.refs.map(r=>r.url)),...d.history.nodes.flatMap(n=>n.refs.map(k=>d.history.sources[k]))])].sort();}
