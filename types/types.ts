// types for hooks and services

// ─── Chat ────────────────────────────────────────────────────────────────────

export type MessageRole = 'user' | 'assistant';

export type Message = {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
};

// ─── Recipe ──────────────────────────────────────────────────────────────────

export type Ingredient = {
  amount: number;
  unit: string; // "g", "ml", "tsp", "piece", ""
  name: string;
};

export type Recipe = {
  title: string;
  description: string;
  servings: number;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  ingredients: Ingredient[];
  steps: string[];
};

// ─── API ─────────────────────────────────────────────────────────────────────

// What the AI always returns
export type AIResponse = {
  message: string;       // conversational reply shown in chat
  recipe: Recipe | null; // null if still clarifying
};

export type OpenAIMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

// ─── StorageEntry ────────────────────────────────────────────────────────────

export type SavedConversation = {
  id: string;
  updatedAt: number;
  messages: Message[];
  recipe: Recipe | null; // null if user never got to a recipe
};