// hooks/useRecipeChat.ts
import { sendToOpenAI } from '@/services/openai';
import type { Message, Recipe } from '@/types/message';
import { useCallback, useState } from 'react';

// Small helper to generate simple unique IDs without a library
const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

export function useRecipeChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;

      setError(null);

      // Add user message to chat immediately (optimistic)
      const userMessage: Message = {
        id: uid(),
        role: 'user',
        content: text,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      try {
        // We pass the current messages (before the new one) as history.
        // The new user message is passed separately so openai.ts can
        // inject the current recipe state alongside it.
        const response = await sendToOpenAI(text, messages, recipe);

        // Add assistant reply to chat
        const assistantMessage: Message = {
          id: uid(),
          role: 'assistant',
          content: response.message,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, assistantMessage]);

        // Update recipe if the AI returned one
        if (response.recipe) {
          setRecipe(response.recipe);
        }
      } catch (e) {
        setError('Something went wrong. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    [messages, recipe, isLoading],
  );

  const resetChat = useCallback(() => {
    setMessages([]);
    setRecipe(null);
    setError(null);
  }, []);

  return {
    messages,   // render these in your chat panel
    recipe,     // render this in your left panel
    isLoading,  // show a typing indicator
    error,      // show an error banner if set
    sendMessage,
    resetChat,
  };
}