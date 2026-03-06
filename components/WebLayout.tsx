import { ChatPanel } from '@/components/ChatPanel';
import { ConversationSidebar } from '@/components/ConversationSidebar';
import { RecipePanel } from '@/components/RecipePanel';
import { colors, fonts, fontSizes, spacing } from '@/constants/theme';
import translations, { type Language } from '@/constants/translations';
import type { Message, Recipe, SavedConversation } from '@/types/types';
import { Pressable, StyleSheet, Text, View } from 'react-native';

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

/** Side by side layout for web — recipe panel on the left, chat on the right */
export function WebLayout({
  messages, recipe, isLoading, error,
  savedConversations, currentConversationId,
  onSend, onNewChat, onSelectConversation, onDeleteConversation,
  sidebarOpen, onToggleSidebar, onCloseSidebar,
  t, language, onSetLanguage,
}: Props) {
  return (
    <View style={styles.root}>
      <ConversationSidebar
        t={t}
        visible={sidebarOpen}
        conversations={savedConversations}
        activeId={currentConversationId}
        onSelect={onSelectConversation}
        onDelete={onDeleteConversation}
        onNewChat={onNewChat}
      />

      {/* Closes sidebar when tapping outside */}
      {sidebarOpen && (
        <Pressable style={styles.overlay} onPress={onCloseSidebar} />
      )}

      <View style={styles.main}>
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

        <View style={styles.content}>
          <View style={styles.recipePane}>
            <RecipePanel t={t} recipe={recipe} />
          </View>
          <View style={styles.chatPane}>
            <ChatPanel
              messages={messages}
              isLoading={isLoading}
              error={error}
              onSend={onSend}
              t={t}
              submitOnEnter={true}
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