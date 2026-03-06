// Key for OpenAI API
export const OPENAI_API_KEY = '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';

if (!OPENAI_API_KEY && typeof window !== 'undefined') {
  console.warn('EXPO_PUBLIC_OPENAI_API_KEY is not set');
}
