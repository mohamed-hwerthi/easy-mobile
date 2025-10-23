/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

const lightTheme = {
  // Base colors
  primary: "#0a7ea4",
  secondary: "#6c757d",
  success: "#28a745",
  danger: "#dc3545",
  warning: "#ffc107",
  info: "#17a2b8",
  lightColor: "#f8f9fa",
  darkColor: "#343a40",
  white: "#ffffff",
  black: "#000000",
  gray: "#6c757d",

  // Theme colors
  text: "#11181C",
  background: "#fff",
  tint: tintColorLight,
  icon: "#687076",
  tabIconDefault: "#687076",
  tabIconSelected: tintColorLight,

  // Additional UI colors
  border: "#dee2e6",
  card: "#ffffff",
  notification: "#dc3545",
};

const darkTheme = {
  // Base colors (dark theme variants)
  primary: "#1e90ff",
  secondary: "#6c757d",
  success: "#28a745",
  danger: "#ff6b6b",
  warning: "#ffc107",
  info: "#17a2b8",
  lightColor: "#343a40",
  darkColor: "#f8f9fa",
  white: "#212529",
  black: "#f8f9fa",
  gray: "#adb5bd",

  // Theme colors
  text: "#ECEDEE",
  background: "#151718",
  tint: tintColorDark,
  icon: "#9BA1A6",
  tabIconDefault: "#9BA1A6",
  tabIconSelected: tintColorDark,

  // Additional UI colors
  border: "#495057",
  card: "#212529",
  notification: "#ff6b6b",
};

export const Colors = {
  light: lightTheme,
  dark: darkTheme,
  // Default to light theme
  ...lightTheme,
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
