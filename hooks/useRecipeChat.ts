import { sendToOpenAI } from '@/services/openai';
import type { Message, Recipe } from '@/types/types';
import { useCallback, useState } from 'react';

/**
 * Manages the current chat session with the AI.
 * Handles sending messages, tracking the generated recipe,
 * and storing the id of the active conversation in storage.
 * @see {@link sendToOpenAI} for the API call implementation
 */
export function useRecipeChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);

  // Sends a user message and appends the AI response to the chat history, updates recipe
  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;

      setError(null);

      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        content: text,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      try {
        const response = await sendToOpenAI(text, messages, recipe);

        const assistantMessage: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: response.message,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, assistantMessage]);

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

  //for going back to the start of a new conversation
  const resetChat = useCallback(() => {
    setMessages([]);
    setRecipe(null);
    setError(null);
    setCurrentConversationId(null);
  }, []);

  // Called when user selects a saved conversation from the sidebar
  const loadConversation = useCallback((msgs: Message[], rec: Recipe | null, id: string) => {
    setMessages(msgs);
    setRecipe(rec);
    setError(null);
    setCurrentConversationId(id);
  }, []);

  return {
    messages,
    recipe,
    isLoading,
    error,
    currentConversationId,
    setCurrentConversationId,
    sendMessage,
    resetChat,
    loadConversation,
  };
}