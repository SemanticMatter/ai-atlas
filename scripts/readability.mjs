// An English drafting aid, not a test of comprehension. No external service or dictionary.
const segmenter = new Intl.Segmenter('en', {granularity:'sentence'});
export const sentences = text => [...segmenter.segment(text)].map(s=>s.segment.trim()).filter(Boolean);
export const wordCount = text => text.trim() ? text.trim().split(/\s+/u).length : 0;

export function estimateSyllables(token) {
  // Read initialisms as letters. This is approximate (some acronyms are spoken as words).
  if (/^[A-Z]{2,}$/u.test(token)) return token.length;
  const word = token.toLowerCase().replace(/[^a-z]/g, '');
  if (!word || word.length <= 3) return 1;
  let count = (word.match(/[aeiouy]+/g) || []).length;
  if (/e$/.test(word) && !/[^aeiouy]le$/.test(word)) count--;
  if (/(?:[^td]ed|[^sxzcs]es)$/.test(word)) count--;
  return Math.max(1, count);
}

export function readability(text) {
  const chunks = sentences(text);
  const words = text.match(/[\p{L}]+(?:['’\-][\p{L}]+)*|\d+(?:\.\d+)?/gu) || [];
  const syllables = words.reduce((sum, word)=>sum+estimateSyllables(word), 0);
  const grade = words.length && chunks.length ? .39 * words.length / chunks.length + 11.8 * syllables / words.length - 15.59 : null;
  return {
    words:wordCount(text), sentences:chunks.length,
    maxSentenceWords:Math.max(0,...chunks.map(wordCount)),
    averageSentenceWords:chunks.length ? wordCount(text)/chunks.length : 0,
    estimatedGrade:grade
  };
}

export function readabilityWarnings(topic) {
  const stats = readability(topic.plain);
  return stats.estimatedGrade > 9 ? [`${topic.id}: estimated Flesch–Kincaid grade ${stats.estimatedGrade.toFixed(1)} exceeds the drafting target of 9; review wording`] : [];
}
