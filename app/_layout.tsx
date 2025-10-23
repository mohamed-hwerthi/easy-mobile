// app/_layout.tsx
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import React from "react";
import { useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CartProvider } from "../context/CartContext";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <CartProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <Stack screenOptions={{ headerShown: false }}>
            {/* Store Scan Screen - First Screen */}
            <Stack.Screen name="index" />

            {/* Main Tabs */}
            <Stack.Screen name="(tabs)" />

            {/* Product Details */}
            <Stack.Screen name="product/[id]" />

            {/* Checkout Screen */}
            <Stack.Screen name="checkout" />

            {/* Modal */}
            <Stack.Screen
              name="modal"
              options={{
                presentation: "modal",
                title: "Modal",
                headerShown: true, // Show header for modal if needed
              }}
            />
          </Stack>
        </SafeAreaView>
      </CartProvider>
    </ThemeProvider>
  );
}
