import { ChatPanel } from '@/components/ChatPanel';
import { ConversationSidebar } from '@/components/ConversationSidebar';
import { RecipePanel } from '@/components/RecipePanel';
import { colors, fonts, fontSizes, spacing } from '@/constants/theme';
import translations, { type Language } from '@/constants/translations';
import { useRecipeChat } from '@/hooks/useRecipeChat';
import { useRecipeStorage } from '@/hooks/useRecipeStorage';
import type { SavedConversation } from '@/types/types';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

/** This is the main and only page of the app */
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

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [language, setLanguage] = useState<Language>('en');     // decides language of text on site
  const t = translations[language];                           // holds translated texts

  // Auto-save whenever messages or recipe changes
  useEffect(() => {
    if (messages.length > 0) {
      saveConversation(messages, recipe, currentConversationId).then(id => {
        if (!currentConversationId) setCurrentConversationId(id);
      });
    }
  }, [messages, recipe, saveConversation]);

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

  return (
    <View style={styles.root}>
      <ConversationSidebar 
        t={t}
        visible={sidebarOpen}
        conversations={savedConversations}
        activeId={currentConversationId}
        onSelect={handleSelectConversation}
        onDelete={handleDeleteConversation}
        onNewChat={handleNewChat}
      />
      {/* Closes sidebar when tapping outside */}
      {sidebarOpen && (
        <Pressable style={styles.overlay} onPress={() => setSidebarOpen(false)} />
      )}

      <View style={styles.main}>
        <View style={styles.topBar}>
          {/* Opens sidebar */}
          <Pressable style={styles.menuButton} onPress={() => setSidebarOpen(v => !v)}>
            <Text style={styles.menuIcon}>☰</Text>
          </Pressable>
          {/* site title */}
          <Text style={styles.appTitle}>{t.appTitle}</Text>
          {/* Toggle for choosing language */}
          <View style={styles.langToggle}>
            <Pressable onPress={() => setLanguage('en')}>
              <Text style={[styles.langOption, language === 'en' && styles.langActive]}>EN</Text>
            </Pressable>
            <Text style={styles.langDivider}>|</Text>
            <Pressable onPress={() => setLanguage('de')}>
              <Text style={[styles.langOption, language === 'de' && styles.langActive]}>DE</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.recipePane}>
            <RecipePanel t={t} recipe={recipe} />
          </View>
          <View style={styles.chatPane}>
            <ChatPanel
              messages={messages}
              isLoading={isLoading}
              error={error}
              onSend={sendMessage}
              t={t}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: '#00000066',
    zIndex: 99,
  },
  main: {
    width: '80%',
    maxWidth: 1200,
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIcon: {
    color: colors.textMuted,
    fontSize: fontSizes.xl,
  },
  appTitle: {
    color: colors.textPrimary,
    fontSize: fontSizes.body,
    fontWeight: '700',
    letterSpacing: 3,
    textTransform: 'uppercase',
    fontFamily: fonts?.sans,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  recipePane: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  chatPane: {
    flex: 1,
  },
  langToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  langOption: {
    color: colors.textDisabled,
    fontSize: fontSizes.md,
    fontWeight: '700',
    letterSpacing: 1,
    fontFamily: fonts?.sans,
  },
  langActive: {
    color: colors.accent,
  },
  langDivider: {
    color: colors.borderStrong,
    fontSize: fontSizes.md,
  },
});