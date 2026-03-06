import { colors, fonts, fontSizes, radius, spacing } from '@/constants/theme';
import translations, { type Language } from '@/constants/translations';
import type { Message } from '@/types/types';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

type Props = {
  t: typeof translations[Language];
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  onSend: (text: string) => void;
};

function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === 'user';
  return (
    <View style={[styles.messageRow, isUser && styles.messageRowUser]}>
      {!isUser && <View style={styles.avatar}><Text style={styles.avatarText}>R</Text></View>}
      <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAssistant]}>
        <Text style={[styles.bubbleText, isUser && styles.bubbleTextUser]}>
          {message.content}
        </Text>
      </View>
    </View>
  );
}

/** Shows chat history for current recipe */
export function ChatPanel({ messages, isLoading, error, t,  onSend }: Props) {
  const [input, setInput] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  // Scroll to bottom on new messages — setTimeout lets React finish
  // rendering the new message before we measure the scroll position
  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }, [messages, isLoading]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || isLoading) return;
    setInput('');
    onSend(text);
  };

  return (
    <View style={styles.container}>
      {/* Chat history */}
      <ScrollView
        ref={scrollRef}
        style={styles.messages}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome screen for empty conversation */}
        {messages.length === 0 && (
          <View style={styles.welcome}>
            <Text style={styles.welcomeTitle}>{t.welcomeTitle}</Text>
            <Text style={styles.welcomeSubtitle}>{t.welcomeSubtitle}</Text>
          </View>
        )}

        {/* conversatiion history */}
        {messages.map(m => <ChatMessage key={m.id} message={m} />)}

        {/* Loading indicator while waiting for assistant response */}
        {isLoading && (
          <View style={styles.messageRow}>
            <View style={styles.avatar}><Text style={styles.avatarText}>R</Text></View>
            <View style={[styles.bubble, styles.bubbleAssistant, styles.loadingBubble]}>
              <ActivityIndicator size="small" color={colors.accent} />
            </View>
          </View>
        )}

        {error && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
      </ScrollView>

      {/* Input */}
      <View style={styles.inputArea}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder={t.messagePlaceholder}
          placeholderTextColor={colors.textMuted}
          multiline
          maxLength={1000}
          onSubmitEditing={handleSend}
          blurOnSubmit
        />
        <Pressable
          style={[styles.sendButton, (!input.trim() || isLoading) && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!input.trim() || isLoading}
        >
          <Text style={[styles.sendButtonText, (!input.trim() || isLoading) && styles.sendButtonTextDisabled]}>↑</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    borderLeftWidth: 1,
    borderLeftColor: colors.border,
  },
  messages: {
    flex: 1,
  },
  messagesContent: {
    padding: spacing.xl,
    gap: spacing.lg,
    flexGrow: 1,
  },
  welcome: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    gap: spacing.sm,
  },
  welcomeTitle: {
    color: colors.textPrimary,
    fontSize: fontSizes.xl,
    fontWeight: '700',
    fontFamily: fonts?.serif,
  },
  welcomeSubtitle: {
    color: colors.textMuted,
    fontSize: fontSizes.md,
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 20,
    fontFamily: fonts?.sans,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  messageRowUser: {
    justifyContent: 'flex-end',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.accentDim,
  },
  avatarText: {
    color: colors.accent,
    fontSize: fontSizes.xs,
    fontWeight: '700',
    fontFamily: fonts?.sans,
  },
  bubble: {
    maxWidth: '78%',
    paddingHorizontal: 14,
    paddingVertical: spacing.md,
    borderRadius: 16,
  },
  bubbleUser: {
    backgroundColor: colors.accent,
    borderBottomRightRadius: radius.sm,
  },
  bubbleAssistant: {
    backgroundColor: colors.surface,
    borderBottomLeftRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.surfaceElevated,
  },
  bubbleText: {
    color: colors.textSecondary,
    fontSize: fontSizes.body,
    lineHeight: 21,
    fontFamily: fonts?.sans,
  },
  bubbleTextUser: {
    color: colors.backgroundElevated,
    fontWeight: '500',
  },
  loadingBubble: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  errorBanner: {
    backgroundColor: colors.errorBackground,
    borderWidth: 1,
    borderColor: colors.errorBorder,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  errorText: {
    color: colors.error,
    fontSize: fontSizes.md,
    fontFamily: fonts?.sans,
  },
  inputArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: spacing.lg,
    gap: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  input: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.surfaceElevated,
    borderRadius: radius.lg,
    paddingHorizontal: 14,
    paddingVertical: spacing.md,
    color: colors.textPrimary,
    fontSize: fontSizes.body,
    maxHeight: 120,
    lineHeight: 21,
    fontFamily: fonts?.sans,
  },
  sendButton: {
    width: 38,
    height: 38,
    borderRadius: radius.md,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: colors.surface,
  },
  sendButtonTextDisabled: {
    color: colors.textMuted,
  },
  sendButtonText: {
    color: colors.backgroundElevated,
    fontSize: fontSizes.lg,
    fontWeight: '700',
  },
});