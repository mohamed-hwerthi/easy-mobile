import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { StyleSheet, useColorScheme } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

type TabBarIconProps = {
  name: keyof typeof Ionicons.glyphMap;
  color: string;
  size: number;
};

const TabBarIcon = ({ name, color, size }: TabBarIconProps) => (
  <Ionicons name={name} size={size} color={color} />
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
      paddingBottom: insets.bottom + 2,
      height: 20,
    },
    tabBarLabelStyle: {
      fontSize: 12,
      marginTop: 4,
      color: colors.text,
    },
  };

  return (
    <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top / 8 }]}>
      <Tabs screenOptions={screenOptions}>
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => (
              <TabBarIcon name="home-outline" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="categories"
          options={{
            title: "Categories",
            tabBarIcon: ({ color, size }) => (
              <TabBarIcon name="grid-outline" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: "Search",
            tabBarIcon: ({ color, size }) => (
              <TabBarIcon name="search-outline" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="cart"
          options={{
            title: "Cart",
            tabBarIcon: ({ color, size }) => (
              <TabBarIcon name="cart-outline" color={color} size={size} />
            ),
            tabBarBadge: 3,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, size }) => (
              <TabBarIcon name="person-outline" color={color} size={size} />
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
