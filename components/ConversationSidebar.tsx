import { colors, fonts, fontSizes, radius, spacing } from '@/constants/theme';
import translations, { type Language } from '@/constants/translations';
import type { SavedConversation } from '@/types/types';
import { useEffect, useRef } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';


type Props = {
  t: typeof translations[Language];     // for texts in current language
  visible: boolean;
  conversations: SavedConversation[];   // list of conversations to show
  activeId: string | null;              // highlights the currently open conversation
  onSelect: (conversation: SavedConversation) => void;
  onDelete: (id: string) => void;
  onNewChat: () => void;
};

/** Single row in the sidebar list showing a saved conversation. */
function ConversationItem({ item, isActive, t, onSelect, onDelete}: {
  item: SavedConversation;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
  t: typeof translations[Language];
}) {
  const date = new Date(item.updatedAt);
  const formatted = date.toLocaleDateString(t.dateLocale, { month: 'short', day: 'numeric' })

  return (
    <Pressable
      style={[styles.item, isActive && styles.itemActive]}
      onPress={onSelect}
    >
      <View style={styles.itemContent}>
        <Text style={[styles.itemTitle, isActive && styles.itemTitleActive]} numberOfLines={1}>
          {item.recipe?.title ?? t.sidebarUntitled}
        </Text>
        <Text style={styles.itemDate}>{formatted}</Text>
      </View>
      <Pressable onPress={onDelete} style={styles.deleteButton} hitSlop={8}>
        <Text style={styles.deleteText}>×</Text>
      </Pressable>
    </Pressable>
  );
}

/** Slide-out sidebar showing saved conversations, ordered by recency. */
export function ConversationSidebar({ t, visible, conversations, activeId, onSelect, onDelete, onNewChat }: Props) {
  const slideAnim = useRef(new Animated.Value(-280)).current;

  // Slide in from left when visible, slide out when hidden
  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: visible ? 0 : -280,
      useNativeDriver: true,
      tension: 80,
      friction: 12,
    }).start();
  }, [visible]);

  return (
    <Animated.View style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t.sidebarTitle}</Text>
        <Pressable style={styles.newButton} onPress={onNewChat}>
          <Text style={styles.newButtonText}>{t.sidebarNew}</Text>
        </Pressable>
      </View>

      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {conversations.length === 0 ? (
          <Text style={styles.empty}>{t.sidebarEmpty}</Text>
        ) : (
          conversations.map(c => (
            <ConversationItem
              key={c.id}
              item={c}
              isActive={c.id === activeId}
              onSelect={() => onSelect(c)}
              onDelete={() => onDelete(c.id)}
              t={t}
            />
          ))
        )}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 260,
    backgroundColor: colors.backgroundElevated,
    borderRightWidth: 1,
    borderRightColor: colors.surfaceElevated,
    zIndex: 100,
    paddingTop: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceElevated,
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: fontSizes.md,
    fontWeight: '600',
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontFamily: fonts?.sans,
  },
  newButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
  },
  newButtonText: {
    color: colors.backgroundElevated,
    fontSize: fontSizes.sm,
    fontWeight: '700',
    fontFamily: fonts?.sans,
  },
  list: {
    flex: 1,
    paddingTop: spacing.sm,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginHorizontal: spacing.sm,
    marginVertical: 2,
    borderRadius: radius.md,
  },
  itemActive: {
    backgroundColor: colors.surfaceElevated,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    color: colors.textSecondary,
    fontSize: fontSizes.md,
    fontWeight: '500',
    marginBottom: 2,
    fontFamily: fonts?.sans,
  },
  itemTitleActive: {
    color: colors.textPrimary,
  },
  itemDate: {
    color: colors.textMuted,
    fontSize: fontSizes.xs,
    fontFamily: fonts?.sans,
  },
  deleteButton: {
    paddingLeft: spacing.sm,
  },
  deleteText: {
    color: colors.textMuted,
    fontSize: 18,
    lineHeight: 18,
  },
  empty: {
    color: colors.textMuted,
    fontSize: fontSizes.md,
    textAlign: 'center',
    marginTop: spacing.xxl,
    fontFamily: fonts?.sans,
  },
});