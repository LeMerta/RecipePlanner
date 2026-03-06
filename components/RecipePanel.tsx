import { colors, fonts, fontSizes, radius, spacing } from '@/constants/theme';
import translations, { type Language } from '@/constants/translations';
import type { Recipe } from '@/types/types';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

type Props = {
  recipe: Recipe | null;
  t: typeof translations[Language];
};

/** Displays current recipe or default message if not existent */
export function RecipePanel({ recipe, t }: Props) {
  if (!recipe) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyIcon}>◎</Text>
        <Text style={styles.emptyTitle}>{t.noRecipeTitle}</Text>
        <Text style={styles.emptySubtitle}>{t.noRecipeSubtitle}</Text>
      </View>
    );
  }

  const totalTime = recipe.prepTimeMinutes + recipe.cookTimeMinutes;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.inner}>

        {/* Title */}
        <Text style={styles.title}>{recipe.title}</Text>
        <Text style={styles.description}>{recipe.description}</Text>

        {/* Meta row */}
        <View style={styles.meta}>
          <View style={styles.metaItem}>
            <Text style={styles.metaValue}>{recipe.servings}</Text>
            <Text style={styles.metaLabel}>{t.servings}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaValue}>{recipe.prepTimeMinutes}m</Text>
            <Text style={styles.metaLabel}>{t.prep}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaValue}>{recipe.cookTimeMinutes}m</Text>
            <Text style={styles.metaLabel}>{t.cook}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaValue}>{totalTime}m</Text>
            <Text style={styles.metaLabel}>{t.total}</Text>
          </View>
        </View>

        {/* Ingredients */}
        <Text style={styles.sectionTitle}>{t.ingredients}</Text>
        <View style={styles.ingredientsList}>
          {recipe.ingredients.map((ing, i) => (
            <View key={i} style={styles.ingredientRow}>
              <View style={styles.ingredientDot} />
              <Text style={styles.ingredientText}>
                <Text style={styles.ingredientAmount}>
                  {ing.amount}{ing.unit ? ` ${ing.unit}` : ''}{' '}
                </Text>
                {ing.name}
              </Text>
            </View>
          ))}
        </View>

        {/* Steps */}
        <Text style={styles.sectionTitle}>{t.method}</Text>
        {recipe.steps.map((step, i) => (
          <View key={i} style={styles.stepRow}>
            <Text style={styles.stepNumber}>{String(i + 1).padStart(2, '0')}</Text>
            <Text style={styles.stepText}>{step}</Text>
          </View>
        ))}

        <View style={styles.bottomPad} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  inner: {
    padding: spacing.xxl,
    maxWidth: 520,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    gap: spacing.sm,
  },
  emptyIcon: {
    fontSize: 32,
    color: colors.borderStrong,
    marginBottom: spacing.sm,
  },
  emptyTitle: {
    color: colors.textMuted,
    fontSize: fontSizes.lg,
    fontWeight: '600',
    fontFamily: fonts?.sans,
  },
  emptySubtitle: {
    color: colors.textDisabled,
    fontSize: fontSizes.md,
    fontFamily: fonts?.sans,
  },
  title: {
    color: colors.textPrimary,
    fontSize: fontSizes.title,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: spacing.md,
    lineHeight: 34,
    fontFamily: fonts?.serif,
  },
  description: {
    color: colors.textSecondary,
    fontSize: fontSizes.body,
    lineHeight: 22,
    marginBottom: spacing.xl,
    fontFamily: fonts?.sans,
  },
  meta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: colors.backgroundElevated,
    borderRadius: radius.md,
    paddingVertical: spacing.lg,
    marginBottom: spacing.xxl,
  },
  metaItem: {
    width: '50%',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    gap: spacing.xs,
  },
  metaValue: {
    color: colors.accent,
    fontSize: fontSizes.lg,
    fontWeight: '700',
    fontFamily: fonts?.sans,
  },
  metaLabel: {
    color: colors.textMuted,
    fontSize: fontSizes.xs,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontFamily: fonts?.sans,
  },
  sectionTitle: {
    color: colors.accent,
    fontSize: fontSizes.xs,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: spacing.lg,
    fontFamily: fonts?.sans,
  },
  ingredientsList: {
    marginBottom: spacing.xxl,
    gap: spacing.md,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  ingredientDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.accent,
    marginTop: 7,
  },
  ingredientAmount: {
    color: colors.textPrimary,
    fontWeight: '600',
    fontFamily: fonts?.sans,
  },
  ingredientText: {
    color: colors.textSecondary,
    fontSize: fontSizes.body,
    lineHeight: 20,
    flex: 1,
    fontFamily: fonts?.sans,
  },
  stepRow: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginBottom: 20,
  },
  stepNumber: {
    color: colors.borderStrong,
    fontSize: fontSizes.xl,
    fontWeight: '800',
    lineHeight: 22,
    minWidth: 28,
    fontFamily: fonts?.sans,
  },
  stepText: {
    color: colors.textSecondary,
    fontSize: fontSizes.body,
    lineHeight: 22,
    flex: 1,
    fontFamily: fonts?.sans,
  },
  bottomPad: {
    height: 48,
  },
});