// Key for OpenAI API
export const OPENAI_API_KEY = 'Key_HERE';

if (!OPENAI_API_KEY && typeof window !== 'undefined') {
  console.warn('EXPO_PUBLIC_OPENAI_API_KEY is not set');
}
