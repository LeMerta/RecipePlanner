import type { Message, Recipe, SavedConversation } from '@/types/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

// key for saving conversation history
const STORAGE_KEY = 'saved_conversations';

/**
 * Manages the saved Conversations in AsyncStorage. 
 * Provides functions to load, save (create/update), and delete conversations.
 */
export function useRecipeStorage() {
  const [savedConversations, setSavedConversations] = useState<SavedConversation[]>([]);

  // Load saved conversations from storage on mount
  useEffect(() => {
    loadConversations();
  }, []);

  // Loads conversations from AsyncStorage and sorts them by most recent
  const loadConversations = async () => {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    const parsed: SavedConversation[] = data ? JSON.parse(data) : [];
    setSavedConversations(parsed.sort((a, b) => b.updatedAt - a.updatedAt));
  };

  // Saves a conversation to AsyncStorage. If currentId is provided, it updates that entry; otherwise, it creates a new one.
  // Returns the id that was used (new or existing) so the caller can store it
  const saveConversation = useCallback(async (
    messages: Message[],
    recipe: Recipe | null,
    currentId: string | null
  ): Promise<string> => {
    const updatedAt = Date.now();
    let updated: SavedConversation[];
    let usedId: string;

    if (currentId) {
      // Update existing entry
      usedId = currentId;
      updated = savedConversations
        .map(c => c.id === currentId ? { ...c, messages, recipe, updatedAt } : c)
        .sort((a, b) => b.updatedAt - a.updatedAt);
    } else {
      // Create new entry
      usedId = crypto.randomUUID();
      const newEntry: SavedConversation = { id: usedId, messages, recipe, updatedAt };
      updated = [newEntry, ...savedConversations];
    }

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setSavedConversations(updated);
    return usedId;
  }, [savedConversations]);

  // deletes a conversation by id and updates storage and state
  const deleteConversation = useCallback(async (id: string) => {
    const updated = savedConversations.filter(c => c.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setSavedConversations(updated);
  }, [savedConversations]);

  return { savedConversations, saveConversation, deleteConversation };
}