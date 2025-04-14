import { DefaultTheme, configureFonts } from 'react-native-paper';
import { DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native';
import { COLORS } from './colors';

const fontConfig = {
  default: {
    regular: {
      fontFamily: 'Poppins-Regular',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'Poppins-Medium',
      fontWeight: 'normal',
    },
    light: {
      fontFamily: 'Poppins-Light',
      fontWeight: 'normal',
    },
    thin: {
      fontFamily: 'Poppins-Thin',
      fontWeight: 'normal',
    },
    bold: {
      fontFamily: 'Poppins-Bold',
      fontWeight: 'normal',
    },
  },
};

// Custom theme for React Native Paper
const paperTheme = {
  ...DefaultTheme,
  fonts: configureFonts({ config: fontConfig }),
  roundness: 10,
  colors: {
    ...DefaultTheme.colors,
    primary: COLORS.primary,
    accent: COLORS.secondary,
    background: COLORS.background,
    surface: COLORS.white,
    text: COLORS.text,
    error: COLORS.error,
    placeholder: COLORS.gray,
    backdrop: COLORS.backdrop,
    notification: COLORS.notification,
  },
};

// Custom theme for React Navigation
const navigationTheme = {
  ...NavigationDefaultTheme,
  colors: {
    ...NavigationDefaultTheme.colors,
    primary: COLORS.primary,
    background: COLORS.background,
    card: COLORS.white,
    text: COLORS.text,
    border: COLORS.border,
    notification: COLORS.notification,
  },
};

// Combined theme
export const theme = {
  ...paperTheme,
  ...navigationTheme,
  colors: {
    ...paperTheme.colors,
    ...navigationTheme.colors,
  },
};

// Typography styles
export const TYPOGRAPHY = {
  h1: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    lineHeight: 32,
    color: COLORS.text,
  },
  h2: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    lineHeight: 28,
    color: COLORS.text,
  },
  h3: {
    fontFamily: 'Poppins-Medium',
    fontSize: 18,
    lineHeight: 26,
    color: COLORS.text,
  },
  subtitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.text,
  },
  body: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    lineHeight: 22,
    color: COLORS.text,
  },
  caption: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.gray,
  },
  button: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    lineHeight: 22,
    color: COLORS.white,
  },
};

// Spacing constants
export const SPACING = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 40,
};

// Shadow styles
export const SHADOWS = {
  small: {
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  medium: {
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 4,
  },
  large: {
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 6,
  },
};