import matchers from './matchers';
export * from './utils';

const jestExpect = global.expect;

if (jestExpect !== undefined) {
  jestExpect.extend(matchers);
} else {
  /* eslint-disable no-console */
  console.error("Unable to find Jest's global expect.");
  /* eslint-enable no-console */
}
