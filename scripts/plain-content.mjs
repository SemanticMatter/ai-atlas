import assert from 'node:assert/strict';
import {sentences,wordCount} from './readability.mjs';

// These checks enforce an authoring contract, not clarity, accuracy or comprehension.
export function validatePlain(topic) {
  const {id, plain} = topic;
  assert.equal(typeof plain, 'string', `${id}: missing plain-language introduction`);
  assert.ok(plain.length && plain === plain.trim(), `${id}: plain must be nonempty and trimmed`);
  const words = wordCount(plain);
  assert.ok(words >= 15 && words <= 75, `${id}: plain has ${words} words; expected 15–75`);
  assert.ok(!plain.includes(';'), `${id}: plain must not contain semicolons`);
  for (const sentence of sentences(plain)) {
    assert.ok(wordCount(sentence) <= 18, `${id}: sentence has ${wordCount(sentence)} words; maximum 18: ${sentence}`);
  }
  assert.ok(!/\b(?:TODO|TBD|FIXME|lorem ipsum)\b|\[(?:insert|add|write)[^\]]*\]|^placeholder\b/i.test(plain), `${id}: placeholder in plain`);
  const normalized = value => String(value || '').trim().replace(/\s+/g, ' ').toLowerCase();
  for (const field of ['detail', 'context']) {
    assert.notEqual(normalized(plain), normalized(topic[field]), `${id}: plain repeats ${field}`);
  }
  return words;
}
