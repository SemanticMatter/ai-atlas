import test from 'node:test';
import assert from 'node:assert/strict';
import {validatePlain} from '../scripts/plain-content.mjs';
import {readability,readabilityWarnings,sentences} from '../scripts/readability.mjs';

const base = {id:'test-topic', detail:'Technical shorthand.', context:'A longer technical account.'};
const paragraph = 'A model learns patterns from examples to make predictions about new cases. Those predictions can fail when the examples leave out important situations.';

test('accepts a complete introduction without requiring a particular caveat word', () => {
  assert.equal(validatePlain({...base, plain:paragraph}), 23);
});

test('rejects missing, empty, untrimmed and out-of-range introductions', () => {
  for (const plain of [undefined, null, 42, '', '   ', ' '+paragraph, paragraph+' ', 'word '.repeat(14).trim(), 'word '.repeat(76).trim()]) {
    assert.throws(() => validatePlain({...base, plain}));
  }
  for (const count of [15, 75]) {
    const chunks=Array(count/15).fill('Word '+Array(14).fill('word').join(' ')+'.');
    assert.equal(validatePlain({...base, plain:chunks.join(' ')}), count);
  }
});

test('rejects semicolons and sentences over 18 words, while allowing labelled short sentences', () => {
  assert.throws(()=>validatePlain({...base,plain:paragraph.replace('.',';')}), /semicolons/);
  assert.throws(()=>validatePlain({...base,plain:Array(19).fill('word').join(' ')+'.'}), /maximum 18/);
  const plain='Online: a learner tries more actions as it learns. Offline: it uses a fixed set of past attempts. Missing cases limit what it can learn.';
  assert.doesNotThrow(()=>validatePlain({...base,plain}));
});

test('readability uses sentence boundaries rather than semicolons and preserves decimal numbers', () => {
  assert.equal(sentences('A score of 0.8 is a number; it is not a promise. Check the result.').length,2);
  assert.ok(Math.abs(readability('A cat sat on a mat.').estimatedGrade-(-1.45))<1e-9);
});

test('a high estimated reading grade warns without failing the content contract', () => {
  const topic={...base,plain:'Probabilistic representations characterize uncertain observations across complicated applications. Evaluation examines generalization alongside calibration through systematic investigation of representative populations.'};
  assert.doesNotThrow(()=>validatePlain(topic));
  assert.equal(readabilityWarnings(topic).length,1);
});

test('rejects unfinished copy and recycled technical paragraphs', () => {
  for (const plain of ['TODO '+paragraph, 'TBD '+paragraph, '[insert introduction] '+paragraph, 'Placeholder '+paragraph, 'Lorem ipsum '+paragraph]) {
    assert.throws(() => validatePlain({...base, plain}), /placeholder/);
  }
  for (const field of ['detail', 'context']) {
    assert.throws(() => validatePlain({...base, [field]:paragraph.toUpperCase(), plain:paragraph}), /repeats/);
  }
});
