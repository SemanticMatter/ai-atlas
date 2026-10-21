#!/usr/bin/env python3
"""Measure HTTP reachability, never semantic correctness. No third-party packages."""
import argparse, concurrent.futures, datetime, hashlib, json, re, threading, time
from collections import Counter
from pathlib import Path
from urllib import request, error, parse
ROOT=Path(__file__).resolve().parent.parent
UA='AI-Atlas-Link-Checker/1.1 (reference availability audit)'
CHALLENGES=('verify you are human','checking your browser','just a moment...','enable javascript and cookies to continue')

def permitted_url(url):
 parsed=parse.urlsplit(url);host=parsed.hostname or ''
 import ipaddress
 try:private=not ipaddress.ip_address(host).is_global
 except ValueError:private=host in ('localhost','') or host.endswith(('.local','.localhost'))
 return parsed.scheme=='https' and not parsed.username and not parsed.password and not private

class CheckedRedirect(request.HTTPRedirectHandler):
 def redirect_request(self,req,fp,code,msg,headers,newurl):
  if not permitted_url(newurl):raise ValueError('Redirect target is not a permitted HTTPS reference')
  return super().redirect_request(req,fp,code,msg,headers,newurl)

def now():return datetime.datetime.now(datetime.timezone.utc).isoformat(timespec='seconds')
def classify(status,body='',network_error=None):
 if network_error:return 'network_error'
 if status in (404,410):return 'not_found'
 if status==429:return 'rate_limited'
 if status in (401,403) or any(s in body.lower() for s in CHALLENGES):return 'access_restricted'
 if status is not None and 200<=status<300:return 'reachable'
 return 'http_error'
def collect():
 refs=set()
 for p in sorted((ROOT/'content').glob('enrichment-*.json')):
  for t in json.loads(p.read_text()):refs.update(r['url'] for r in t['refs'])
 learning=json.loads((ROOT/'content/learning.json').read_text())
 for f in learning['frontiers']:refs.update(r['url'] for r in f['refs'])
 history=json.loads((ROOT/'content/history-base.json').read_text())
 for n in history['nodes']:refs.update(history['sources'][k] for k in n['refs'])
 return sorted(refs)
def fingerprint(urls):return hashlib.sha256('\n'.join(sorted(urls)).encode()).hexdigest()

def probe(url,method,timeout):
 start=time.monotonic();record={'method':method,'checked_at':now(),'http_status':None,'final_url':url}
 try:
  req=request.Request(url,method=method,headers={'User-Agent':UA,'Accept':'text/html,application/pdf;q=0.9,*/*;q=0.5'})
  try:response=request.build_opener(CheckedRedirect()).open(req,timeout=timeout)
  except error.HTTPError as e:response=e
  with response as r:
   record.update(http_status=r.status,final_url=r.geturl(),content_type=r.headers.get('Content-Type',''))
   text=''
   if method=='GET' and ('html' in record['content_type'] or 'text/' in record['content_type']):text=r.read(65536).decode('utf-8',errors='replace')
   title=re.search(r'<title[^>]*>(.*?)</title>',text,re.I|re.S)
   if title:record['page_title']=re.sub(r'\s+',' ',title.group(1)).strip()[:300]
   record['state']=classify(r.status,text)
 except (error.URLError,TimeoutError,OSError,ValueError) as e:
  record.update(state='network_error',error=f'{type(e).__name__}: {e}'[:500])
 record['elapsed_ms']=round((time.monotonic()-start)*1000)
 return record

def check_one(url,timeout,delay,locks):
 parsed=parse.urlsplit(url)
 # Reject explicit local/private addresses and non-HTTPS URLs, including redirects.
 # This is a trusted catalog checker, not a general-purpose untrusted-URL proxy.
 host=parsed.hostname or ''
 if not permitted_url(url):
  return {'url':url,'checked_at':now(),'state':'not_checked','http_status':None,'final_url':url,'reason':'Not a permitted public HTTPS reference','attempts':[]}
 with locks[host]:
  head=probe(url,'HEAD',timeout);attempts=[head]
  # A successful HEAD is insufficient to detect a 200-status challenge page.
  # GET also handles servers that reject HEAD. Avoid a second request after rate limiting.
  if head['state'] not in ('rate_limited','network_error'):
   time.sleep(delay);attempts.append(probe(url,'GET',timeout))
  result=attempts[-1];time.sleep(delay)
 return {'url':url,'checked_at':result['checked_at'],'state':result['state'],'http_status':result['http_status'],'final_url':result['final_url'],'attempts':attempts}

def run():
 p=argparse.ArgumentParser(description=__doc__)
 p.add_argument('--timeout',type=float,default=12);p.add_argument('--workers',type=int,default=4);p.add_argument('--delay',type=float,default=.3)
 p.add_argument('--strict',action='store_true',help='Exit nonzero unless every URL is reachable; ordinary runs also fail on confirmed 404/410.')
 p.add_argument('--output',type=Path,default=ROOT/'content/link-checks.json')
 a=p.parse_args();urls=collect();start=now();locks={parse.urlsplit(u).hostname:threading.Lock() for u in urls}
 results=[]
 # One queue per host avoids workers waiting on a busy host while other hosts starve.
 groups={host:[u for u in urls if parse.urlsplit(u).hostname==host] for host in locks}
 def host_checks(group):return [check_one(u,a.timeout,a.delay,locks) for u in group]
 with concurrent.futures.ThreadPoolExecutor(max_workers=max(1,min(a.workers,8))) as pool:
  tasks={pool.submit(host_checks,group):host for host,group in groups.items()}
  for future in concurrent.futures.as_completed(tasks):
   results.extend(future.result())
   print(f'Checked {len(results)}/{len(urls)} references',flush=True)
 results.sort(key=lambda r:r['url']);counts=dict(sorted(Counter(r['state'] for r in results).items()))
 output={'schema_version':1,'started_at':start,'finished_at':now(),'checker_version':'1.1.0','scope':'Automated HTTP reachability. Status 2xx does not verify title, authorship, content, relevance, accessibility or scientific correctness. Access restrictions and network failures are unresolved, not broken-link findings.','reference_set_sha256':fingerprint(urls),'request_policy':{'head_then_get':True,'bounded_html_bytes':65536,'timeout_seconds':a.timeout,'workers':a.workers,'per_host_serial':True},'counts':counts,'results':results}
 a.output.parent.mkdir(parents=True,exist_ok=True);temp=a.output.with_suffix('.tmp');temp.write_text(json.dumps(output,indent=2)+'\n');temp.replace(a.output)
 print(json.dumps({'output':str(a.output),'total':len(urls),'counts':counts}))
 raise SystemExit(1 if counts.get('not_found',0) or (a.strict and counts.get('reachable',0)!=len(urls)) else 0)
if __name__=='__main__':run()
