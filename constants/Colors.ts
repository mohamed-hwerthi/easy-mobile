import { Platform } from 'react-native';

export const lightColors = {
  primary: '#007AFF',
  background: '#FFFFFF',
  card: '#FFFFFF',
  text: '#000000',
  border: '#E5E5EA',
  notification: '#FF3B30',
  success: '#34C759',
  warning: '#FF9500',
  info: '#5AC8FA',
  disabled: '#D1D1D6',
  placeholder: '#8E8E93',
  backgroundSecondary: '#F2F2F7',
  textSecondary: '#8E8E93',
  white: '#FFFFFF',
  black: '#000000',  
};

export const darkColors = {
  primary: '#0A84FF',
  background: '#000000',
  card: '#1C1C1E',
  text: '#FFFFFF',
  border: '#2C2C2E',
  notification: '#FF453A',
  success: '#30D158',
  warning: '#FF9F0A',
  info: '#64D2FF',
  disabled: '#3A3A3C',
  placeholder: '#8E8E93',
  backgroundSecondary: '#1C1C1E',
  textSecondary: '#8E8E93',
  white: '#FFFFFF',
  black: '#000000',
};

const Colors = {
  light: lightColors,
  dark: darkColors,
  // Default to light theme
  ...lightColors,
};

export default Colors;
