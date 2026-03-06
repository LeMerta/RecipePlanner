export type Language = 'en' | 'de';

const translations = {
  en: {
    // App
    appTitle: 'Recipemaker',

    // Sidebar
    sidebarTitle: 'Recipes',
    sidebarNew: '+ New',
    sidebarEmpty: 'No saved recipes yet.',
    sidebarUntitled: 'Untitled conversation',

    // Recipe panel — empty state
    noRecipeTitle: 'No recipe yet',
    noRecipeSubtitle: 'Start chatting to generate a recipe',

    // Recipe panel — recipe meta
    servings: 'servings',
    prep: 'prep',
    cook: 'cook',
    total: 'total',
    ingredients: 'Ingredients',
    method: 'Method',

    // Chat panel — welcome state
    welcomeTitle: 'What are we cooking?',
    welcomeSubtitle: "Describe a dish, dietary preference, or just say what's in your fridge.",

    // Chat panel — input
    messagePlaceholder: 'Message...',

    // Mobile tab bar
    tabChat: 'Chat',
    tabRecipe: 'Recipe',

    // Date formatting
    dateLocale: 'en-US',
  },
  de: {
    // App
    appTitle: 'Rezepthelfer',

    // Sidebar
    sidebarTitle: 'Rezepte',
    sidebarNew: '+ Neu',
    sidebarEmpty: 'Noch keine Rezepte gespeichert.',
    sidebarUntitled: 'Unbenanntes Gespräch',

    // Recipe panel — empty state
    noRecipeTitle: 'Noch kein Rezept',
    noRecipeSubtitle: 'Schreib etwas um ein Rezept zu erstellen',

    // Recipe panel — recipe meta
    servings: 'Portionen',
    prep: 'Vorbereitung',
    cook: 'Kochen',
    total: 'Gesamt',
    ingredients: 'Zutaten',
    method: 'Zubereitung',

    // Chat panel — welcome state
    welcomeTitle: 'Was kochen wir?',
    welcomeSubtitle: 'Beschreibe ein Gericht, deine Ernährungsweise, oder sag einfach was du im Kühlschrank hast.',

    // Chat panel — input
    messagePlaceholder: 'Nachricht...',

    // Mobile tab bar
    tabChat: 'Chat',
    tabRecipe: 'Rezept',

    // Date formatting
    dateLocale: 'de-DE',
  },
} as const;

export type Translations = typeof translations.en;
export default translations;