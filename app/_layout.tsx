// app/_layout.tsx
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import React from "react";
import { useColorScheme } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { CartProvider } from "../context/CartContext";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <CartProvider>
          <SafeAreaView style={{ flex: 1 }}>
            <Stack
              screenOptions={{
                headerShown: false,
                headerShadowVisible: false,
              }}
            >
              <Stack.Screen />
              <Stack.Screen
                name="modal"
                options={{ presentation: "modal", title: "Modal" }}
              />
            </Stack>
          </SafeAreaView>
        </CartProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
