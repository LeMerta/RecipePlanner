import { OPENAI_API_KEY } from '@/constants/api';
import { SYSTEM_PROMPT } from '@/constants/systemPrompt';
import type { AIResponse, Message, OpenAIMessage, Recipe } from '@/types/types';

const MODEL = 'gpt-5-nano';

//* sends message to OpenAI */
export async function sendToOpenAI(
  userMessage: string,
  chatHistory: Message[],
  currentRecipe: Recipe | null,
): Promise<AIResponse> {
  // Build the messages array:
  // 1. System prompt with instructions
  // 2. Previous chat turns for conversational memory
  // 3. Latest user message with current recipe state injected
  const messages: OpenAIMessage[] = [
    { role: 'system', content: SYSTEM_PROMPT },

    // Previous turns (so AI remembers what it asked and what user answered)
    ...chatHistory.map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),

    // Current turn — we inject the recipe state here so the AI always
    // has the full picture without relying on its memory of previous turns
    {
      role: 'user',
      content: [
        `Current recipe: ${currentRecipe ? JSON.stringify(currentRecipe) : 'none'}`,
        `User: ${userMessage}`,
      ].join('\n'),
    },
  ];

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      response_format: { type: 'json_object' }, // forces valid JSON back
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const raw: string = data.choices[0].message.content ?? '{}';

  try {
    return JSON.parse(raw) as AIResponse;
  } catch {
    return { message: "Sorry, something went wrong. Try again?", recipe: null };
  }
}
