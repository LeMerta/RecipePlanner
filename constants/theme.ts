import { Platform } from 'react-native';

export const fonts = Platform.select({
  ios: {
    serif: 'ui-serif',
    sans: 'system-ui',
    mono: 'ui-monospace',
  },
  default: {
    serif: 'serif',
    sans: 'normal',
    mono: 'monospace',
  },
  web: {
    serif: "Georgia, 'Times New Roman', serif",
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    mono: "Menlo, Monaco, Consolas, 'Courier New', monospace",
  },
});

export const colors = {
  // Backgrounds
  background: '#0a0a0a',
  backgroundElevated: '#0f0f0f',
  surface: '#2f2e2e',
  surfaceElevated: '#1e1e1e',

  // Text
  textPrimary: '#e8e0d0',
  textSecondary: '#a6a3a3',
  textMuted: '#868585',
  textDisabled: '#333',

  // Accent
  accent: '#c8a96e',
  accentDim: '#c8a96e44',

  // Borders
  border: '#1a1a1a',
  borderStrong: '#404040',

  // Semantic
  error: '#ff6b6b',
  errorBackground: '#2a0f0f',
  errorBorder: '#5a1a1a',
} as const;

export const fontSizes = {
  xs: 11,
  sm: 12,
  md: 13,
  body: 14,
  lg: 16,
  xl: 20,
  xxl: 24,
  title: 28,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 4,
  md: 8,
  lg: 12,
  full: 999,
} as const;