import assert from 'node:assert/strict';
import { escapeHTML } from '../src/utils/html.js';
import { uid } from '../src/utils/id.js';
import { debounce } from '../src/utils/debounce.js';

export async function runUtilsTests() {
  assert.equal(escapeHTML('<script>'), '&lt;script&gt;');
  assert.ok(uid('test').startsWith('test_'));
  let calls = 0;
  const fn = debounce(() => calls++, 5);
  fn(); fn(); fn();
  await new Promise((resolve) => setTimeout(resolve, 20));
  assert.equal(calls, 1);
}
