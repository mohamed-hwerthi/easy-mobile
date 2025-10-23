import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { Platform, StyleSheet, useColorScheme, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type TabBarIconProps = {
  name: keyof typeof Ionicons.glyphMap;
  color: string;
  size: number;
  focused: boolean;
};

const TabBarIcon = ({ name, color, size, focused }: TabBarIconProps) => (
  <View style={[styles.iconContainer, focused && styles.iconContainerFocused]}>
    <Ionicons name={name} size={focused ? size + 2 : size} color={color} />
  </View>
);

export default function TabLayout() {
  const colorScheme = useColorScheme() || "light";
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();

  const screenOptions = {
    tabBarActiveTintColor: colors.primary,
    tabBarInactiveTintColor: colors.gray,
    headerShown: false,
    tabBarStyle: {
      backgroundColor: colors.background,
      borderTopColor: colors.border,
      borderTopWidth: 1,
      height: Platform.OS === "ios" ? 85 : 65,
      paddingBottom: Platform.OS === "ios" ? 25 : 8,
      paddingTop: 8,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: -2,
      },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 8,
    },
    tabBarLabelStyle: {
      fontSize: 11,
      fontWeight: "600" as const,
      marginTop: 4,
    },
    tabBarHideOnKeyboard: true,
  };

  const tabScreens = [
    {
      name: "index" as const,
      title: "Home",
      icon: {
        outline: "home-outline" as keyof typeof Ionicons.glyphMap,
        filled: "home" as keyof typeof Ionicons.glyphMap,
      },
    },
    {
      name: "categories" as const,
      title: "Categories",
      icon: {
        outline: "grid-outline" as keyof typeof Ionicons.glyphMap,
        filled: "grid" as keyof typeof Ionicons.glyphMap,
      },
    },
    {
      name: "search" as const,
      title: "Search",
      icon: {
        outline: "search-outline" as keyof typeof Ionicons.glyphMap,
        filled: "search" as keyof typeof Ionicons.glyphMap,
      },
    },
    {
      name: "cart" as const,
      title: "Cart",
      icon: {
        outline: "cart-outline" as keyof typeof Ionicons.glyphMap,
        filled: "cart" as keyof typeof Ionicons.glyphMap,
      },
      badge: 3,
    },
    {
      name: "profile" as const,
      title: "Profile",
      icon: {
        outline: "person-outline" as keyof typeof Ionicons.glyphMap,
        filled: "person" as keyof typeof Ionicons.glyphMap,
      },
    },
  ];

  return (
    <Tabs screenOptions={screenOptions}>
      {tabScreens.map((screen) => (
        <Tabs.Screen
          key={screen.name}
          name={screen.name}
          options={{
            title: screen.title,
            tabBarIcon: ({ color, size, focused }) => (
              <TabBarIcon
                name={focused ? screen.icon.filled : screen.icon.outline}
                color={color}
                size={size}
                focused={focused}
              />
            ),
            tabBarBadge: screen.badge,
          }}
        />
      ))}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    padding: 4,
    borderRadius: 12,
  },
  iconContainerFocused: {
    backgroundColor: "rgba(0, 122, 255, 0.1)",
  },
});
