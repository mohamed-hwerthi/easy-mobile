import { NavigatorScreenParams } from "@react-navigation/native";

// Define route parameters
type RootStackParamList = {
  "(tabs)": NavigatorScreenParams<TabParamList>;
  "product/[id]": { id: string };
  "category/[id]": { id: string };
  "offers/[id]": { id: string };
  modal: undefined;
  cart: undefined;
  checkout: undefined;
};

type TabParamList = {
  index: undefined;
  explore: undefined;
  cart: undefined;
  favorites: undefined;
  profile: undefined;
};

// Extend the Expo Router types
declare module "expo-router" {
  // Define the Href type first to avoid circular references
  type Href<T = string> = T | { pathname: string; params?: any };

  // Extend the Router interface
  interface Router {
    push: (route: string | { pathname: string; params?: any }) => void;
    back: () => void;
    canGoBack: () => boolean;
    setParams: (params: any) => void;
  }
}

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

// Export the types for use in your components
export type { RootStackParamList, TabParamList };

export {};
