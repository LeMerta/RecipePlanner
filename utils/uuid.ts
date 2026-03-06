// UUID generator — uses crypto.randomUUID in browsers, falls back to
// a random string for React Native which lacks the crypto API
export const uuid = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36);