import { MobileLayout } from '@/components/MobileLayout';
import { WebLayout } from '@/components/WebLayout';
import translations, { type Language } from '@/constants/translations';
import { useRecipeChat } from '@/hooks/useRecipeChat';
import { useRecipeStorage } from '@/hooks/useRecipeStorage';
import type { SavedConversation } from '@/types/types';
import { useEffect, useState } from 'react';
import { useWindowDimensions } from 'react-native';

/** Main entry point — picks the right layout based on screen width */
export default function Index() {
  const {
    messages,
    recipe,
    isLoading,
    error,
    currentConversationId,
    setCurrentConversationId,
    sendMessage,
    resetChat,
    loadConversation,
  } = useRecipeChat();

  const { savedConversations, saveConversation, deleteConversation } = useRecipeStorage();

  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [language, setLanguage] = useState<Language>('de'); // decides language of text on site
  const t = translations[language];                         // holds translated texts

  // Auto-save whenever messages or recipe changes
  useEffect(() => {
    if (messages.length > 0) {
      saveConversation(messages, recipe, currentConversationId).then(id => {
        if (!currentConversationId) setCurrentConversationId(id);
      });
    }
  }, [messages, recipe]);

  const handleNewChat = () => {
    resetChat();
    setSidebarOpen(false);
  };

  const handleSelectConversation = (conversation: SavedConversation) => {
    loadConversation(conversation.messages, conversation.recipe, conversation.id);
    setSidebarOpen(false);
  };

  const handleDeleteConversation = (id: string) => {
    deleteConversation(id);
    if (currentConversationId === id) handleNewChat();
  };

  // Shared props passed to whichever layout is active
  const layoutProps = {
    messages,
    recipe,
    isLoading,
    error,
    savedConversations,
    currentConversationId,
    onSend: sendMessage,
    onNewChat: handleNewChat,
    onSelectConversation: handleSelectConversation,
    onDeleteConversation: handleDeleteConversation,
    sidebarOpen,
    onToggleSidebar: () => setSidebarOpen(v => !v),
    onCloseSidebar: () => setSidebarOpen(false),
    t,
    language,
    onSetLanguage: setLanguage,
  };

  return isMobile
    ? <MobileLayout {...layoutProps} />
    : <WebLayout {...layoutProps} />;
}