import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {loadContent,root} from './content.mjs';
import {readability} from './readability.mjs';

const args=process.argv.slice(2);
const option=name=>{const i=args.indexOf(name);return i<0?null:args[i+1];};
const baselineRef=option('--baseline-ref');
const round=n=>n===null?null:Math.round(n*100)/100;
function measure(topics){
  const rows=topics.map(t=>({id:t.id,...readability(t.plain)}));
  const words=rows.reduce((n,t)=>n+t.words,0),sentences=rows.reduce((n,t)=>n+t.sentences,0);
  return {summary:{topics:rows.length,meanEstimatedGrade:round(rows.reduce((n,t)=>n+t.estimatedGrade,0)/rows.length),
    aboveGrade9:rows.filter(t=>t.estimatedGrade>9).length,words,sentences,averageSentenceWords:round(words/sentences),
    maxSentenceWords:Math.max(...rows.map(t=>t.maxSentenceWords)),semicolons:topics.reduce((n,t)=>n+(t.plain.match(/;/g)||[]).length,0)},
    topics:rows.map(r=>({...r,averageSentenceWords:round(r.averageSentenceWords),estimatedGrade:round(r.estimatedGrade)}))};
}
const d=loadContent();
const report={method:'atlas-fk-estimate-v1',scope:'plain fields only; titles and glossary excluded',
  formula:'0.39 × lexical words / sentences + 11.8 × estimated syllables / lexical words − 15.59',
  caveat:'Approximate English syllable rules and Intl.Segmenter sentence boundaries. Technical names, acronyms and short passages can distort scores. These are drafting warnings, not reading levels certified with people.',
  nodeVersion:process.version,currentVersion:d.meta.version,current:measure(d.topics)};
if(baselineRef){
  if(!/^[a-f0-9]{7,40}$/.test(baselineRef))throw new Error('Use an explicit baseline commit hash');
  const files=['a','b','c'];
  const topics=files.flatMap(s=>JSON.parse(execFileSync('git',['show',`${baselineRef}:content/enrichment-${s}.json`],{cwd:root,encoding:'utf8'})));
  report.baseline={sourceCommit:baselineRef,...measure(topics)};
}
const output=JSON.stringify(report,null,2)+'\n',out=option('--out');
if(out)fs.writeFileSync(out,output);else process.stdout.write(output);
