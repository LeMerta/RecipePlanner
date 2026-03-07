import { ChatPanel } from '@/components/ChatPanel';
import { ConversationSidebar } from '@/components/ConversationSidebar';
import { RecipePanel } from '@/components/RecipePanel';
import { colors, fonts, fontSizes, radius, spacing } from '@/constants/theme';
import translations, { type Language } from '@/constants/translations';
import type { Message, Recipe, SavedConversation } from '@/types/types';
import { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Tab = 'chat' | 'recipe';

type Props = {
  // Chat state
  messages: Message[];
  recipe: Recipe | null;
  isLoading: boolean;
  error: string | null;

  // Conversation management
  savedConversations: SavedConversation[];
  currentConversationId: string | null;
  onSend: (text: string) => void;
  onNewChat: () => void;
  onSelectConversation: (conversation: SavedConversation) => void;
  onDeleteConversation: (id: string) => void;

  // UI state
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  onCloseSidebar: () => void;

  // Language
  t: typeof translations[Language];
  language: string;
  onSetLanguage: (lang: 'en' | 'de') => void;
};

/** Stacked single-panel layout for mobile with tab switching between chat and recipe */
export function MobileLayout({
  messages, recipe, isLoading, error,
  savedConversations, currentConversationId,
  onSend, onNewChat, onSelectConversation, onDeleteConversation,
  sidebarOpen, onToggleSidebar, onCloseSidebar,
  t, language, onSetLanguage,
}: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('chat');
  const [recipeUnread, setRecipeUnread] = useState(false);        // to show dot if user has seen latest recipe
  const skipNextRecipeRef = useRef(false);      // to prevent loading an old recipe setting dot on recipe tab

  // Mark recipe as unread when it changes and we're not on the recipe tab
  useEffect(() => {
    if (skipNextRecipeRef.current) {
      skipNextRecipeRef.current = false;
      return;
    }
    if (recipe && activeTab === 'chat') {
      setRecipeUnread(true);
    }
  }, [recipe]);

  return (
    <KeyboardAvoidingView 
      style={styles.root} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView style={styles.safeArea}>
        <ConversationSidebar
          t={t}
          visible={sidebarOpen}
          conversations={savedConversations}
          activeId={currentConversationId}
          onSelect={(conversation) => {       
            setRecipeUnread(false);       // remove dot from unread recipe
            skipNextRecipeRef.current = true; // skip the recipe change from loading
            onSelectConversation(conversation);
          }}
          onDelete={onDeleteConversation}
          onNewChat={onNewChat}
        />

        {/* Closes sidebar when tapping outside */}
        {sidebarOpen && (
          <Pressable style={styles.overlay} onPress={onCloseSidebar} />
        )}

        {/* Header */}
        <View style={styles.topBar}>
          {/* Opens sidebar */}
          <Pressable style={styles.menuButton} onPress={onToggleSidebar}>
            <Text style={styles.menuIcon}>☰</Text>
          </Pressable>

          {/* Site title */}
          <Text style={styles.appTitle}>{t.appTitle}</Text>

          {/* Toggle for choosing language */}
          <View style={styles.langToggle}>
            <Pressable onPress={() => onSetLanguage('en')}>
              <Text style={[styles.langOption, language === 'en' && styles.langActive]}>EN</Text>
            </Pressable>
            <Text style={styles.langDivider}>|</Text>
            <Pressable onPress={() => onSetLanguage('de')}>
              <Text style={[styles.langOption, language === 'de' && styles.langActive]}>DE</Text>
            </Pressable>
          </View>
        </View>

        {/* Tab bar */}
        <View style={styles.tabBar}>
          <Pressable
            style={[styles.tab, activeTab === 'chat' && styles.tabActive]}
            onPress={() => setActiveTab('chat')}
          >
            <Text style={[styles.tabText, activeTab === 'chat' && styles.tabTextActive]}>
              {t.tabChat}
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tab, activeTab === 'recipe' && styles.tabActive]}
            onPress={() => {
              setActiveTab('recipe');
              setRecipeUnread(false);
            }}
          >
            <Text style={[styles.tabText, activeTab === 'recipe' && styles.tabTextActive]}>
              {t.tabRecipe}
            </Text>
            {recipeUnread && <View style={styles.recipeDot} />}
          </Pressable>
        </View>

        {/* Active panel */}
        <View style={styles.content}>
          {activeTab === 'chat' ? (
            <ChatPanel
              messages={messages}
              isLoading={isLoading}
              error={error}
              onSend={onSend}
              t={t}
              submitOnEnter={false}
            />
          ) : (
            <RecipePanel recipe={recipe} t={t} />
          )}
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  overlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: '#00000066',
    zIndex: 99,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
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
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    gap: spacing.xs,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: colors.accent,
  },
  tabText: {
    color: colors.textMuted,
    fontSize: fontSizes.md,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontFamily: fonts?.sans,
  },
  tabTextActive: {
    color: colors.textPrimary,
  },
  recipeDot: {
    width: 5,
    height: 5,
    borderRadius: radius.full,
    backgroundColor: colors.accent,
    marginBottom: 6,
  },
  content: {
    flex: 1,
  },
});