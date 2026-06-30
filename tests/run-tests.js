import { runUtilsTests } from './utils.test.js';
import { runSearchTests } from './search.test.js';

await runUtilsTests();
runSearchTests();
console.log('All tests passed');
