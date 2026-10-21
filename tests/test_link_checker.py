import importlib.util, unittest
from pathlib import Path
spec=importlib.util.spec_from_file_location('checker',Path(__file__).parents[1]/'scripts/check-links.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
class StatusMeaning(unittest.TestCase):
 def test_success_is_only_reachability(self):self.assertEqual(m.classify(200,'<title>A paper</title>'),'reachable')
 def test_challenge_is_not_success(self):self.assertEqual(m.classify(200,'<title>Just a moment...</title>'),'access_restricted')
 def test_not_found_is_distinct(self):self.assertEqual(m.classify(404),'not_found')
 def test_restricted_not_missing(self):self.assertEqual(m.classify(403),'access_restricted')
 def test_rate_limit_not_missing(self):self.assertEqual(m.classify(429),'rate_limited')
 def test_timeout_not_missing(self):self.assertEqual(m.classify(None,network_error='timeout'),'network_error')
 def test_fingerprint_is_order_independent(self):self.assertEqual(m.fingerprint(['b','a']),m.fingerprint(['a','b']))
 def test_captcha_research_is_not_a_challenge(self):self.assertEqual(m.classify(200,'<title>A study of CAPTCHA recognition</title>'),'reachable')
 def test_local_or_insecure_targets_rejected(self):
  for u in ['http://example.org','https://localhost/x','https://127.0.0.1/','https://[::1]/','https://user:pass@example.org']:
   self.assertFalse(m.permitted_url(u))
 def test_redirect_target_guard(self):
  with self.assertRaises(ValueError):m.CheckedRedirect().redirect_request(None,None,302,'Found',{},'http://localhost/')
if __name__=='__main__':unittest.main()
