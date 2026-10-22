// Test-side network boundary. The shipped CLI has one fixed Railway URL.
const originalFetch = globalThis.fetch;
globalThis.fetch = (input, init) => {
  if (!process.env.KEYHOUSE_STUB_URL || String(input) !== 'https://backboard.railway.com/graphql/v2') {
    throw new Error('Unexpected network access');
  }
  return originalFetch(process.env.KEYHOUSE_STUB_URL, init);
};
