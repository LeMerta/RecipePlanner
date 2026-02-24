import { OPENAI_API_KEY } from '@/constants/api';
import type { AIResponse, Message, Recipe } from '@/types/message';

const MODEL = 'gpt-5-nano';

const SYSTEM_PROMPT = `
You are a friendly recipe assistant. Help the user create and refine a recipe through natural conversation.

Guidelines:
- Ask clarifying questions when needed (dietary restrictions, cuisine, skill level, servings, etc.)
- Once you have enough to go on, generate or update the recipe.
- When the user asks to change something, apply it and return the full updated recipe.
- Always respond with a raw JSON object — no markdown, no code fences, nothing else.

The JSON must always follow this exact shape:

When still clarifying (no recipe yet or no changes):
{
  "message": "Your conversational reply or question here",
  "recipe": null
}

When showing or updating a recipe:
{
  "message": "Short friendly message about what you did",
  "recipe": {
    "title": "...",
    "description": "...",
    "servings": 4,
    "prepTimeMinutes": 10,
    "cookTimeMinutes": 20,
    "ingredients": [
      { "amount": 200, "unit": "g", "name": "chicken breast" }
    ],
    "steps": [
      "Preheat oven to 180°C.",
      "Season the chicken and place in a baking dish."
    ]
  }
}

Use an empty string "" for unit when the ingredient is countable (e.g. 2 eggs).
`.trim();

type OpenAIMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

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
