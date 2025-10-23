import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Mock user data - in real app, this would come from your auth context
type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  joinDate: string;
  orders: number;
  reviews: number;
  phone?: string;
};

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate checking if user is logged in
  useEffect(() => {
    checkUserStatus();
  }, []);

  const checkUserStatus = () => {
    setIsLoading(true);
    // Simulate API call to check auth status
    setTimeout(() => {
      // For demo: Set to null to see guest view, or uncomment below to see logged-in view
      setUser(null);

      // Uncomment this to see logged-in user view:
      // setUser({
      //   id: "1",
      //   name: "John Doe",
      //   email: "john.doe@example.com",
      //   phone: "+1 (555) 123-4567",
      //   avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
      //   joinDate: "January 2024",
      //   orders: 12,
      //   reviews: 8,
      // });

      setIsLoading(false);
    }, 1000);
  };

  const handleLogin = () => {
    router.push("/login" as any);
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          setUser(null);
          Alert.alert("Success", "You have been logged out successfully");
        },
      },
    ]);
  };

  const handleEditProfile = () => {
    router.push("/edit-profile" as any);
  };

  // Menu items for logged-in users
  const menuItems = [
    {
      id: "1",
      title: "My Orders",
      icon: "bag-outline",
      count: user?.orders || 0,
    },
    {
      id: "2",
      title: "My Reviews",
      icon: "star-outline",
      count: user?.reviews || 0,
    },
    {
      id: "3",
      title: "Shipping Address",
      icon: "location-outline",
    },
    {
      id: "4",
      title: "Payment Methods",
      icon: "card-outline",
    },
    {
      id: "5",
      title: "My Favorites",
      icon: "heart-outline",
      count: 5,
    },
  ];

  const settingsItems = [
    {
      id: "1",
      title: "Notifications",
      icon: "notifications-outline",
    },
    {
      id: "2",
      title: "Privacy & Security",
      icon: "shield-checkmark-outline",
    },
    {
      id: "3",
      title: "Help & Support",
      icon: "help-circle-outline",
    },
    {
      id: "4",
      title: "About",
      icon: "information-circle-outline",
    },
  ];

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={["#667eea", "#764ba2", "#667eea"]}
          style={styles.background}
        />
        <View style={styles.loadingContainer}>
          <Ionicons name="person-circle-outline" size={64} color="#fff" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Purple Gradient Background - Same as login */}
      <LinearGradient
        colors={["#667eea", "#764ba2", "#667eea"]}
        style={styles.background}
      />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        {user && (
          <TouchableOpacity style={styles.settingsButton}>
            <Ionicons name="settings-outline" size={24} color="#fff" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {user ? (
          // Logged-in User View
          <>
            {/* Profile Header */}
            <View style={styles.profileHeader}>
              <View style={styles.avatarContainer}>
                <Image source={{ uri: user.avatar }} style={styles.avatar} />
                <TouchableOpacity style={styles.editAvatarButton}>
                  <Ionicons name="camera" size={16} color="#764ba2" />
                </TouchableOpacity>
              </View>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
              {user.phone && <Text style={styles.userPhone}>{user.phone}</Text>}
              <Text style={styles.joinDate}>Member since {user.joinDate}</Text>

              <TouchableOpacity
                style={styles.editButton}
                onPress={handleEditProfile}
              >
                <Text style={styles.editButtonText}>Edit Profile</Text>
              </TouchableOpacity>
            </View>

            {/* Stats */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{user.orders}</Text>
                <Text style={styles.statLabel}>Orders</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{user.reviews}</Text>
                <Text style={styles.statLabel}>Reviews</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>4.8</Text>
                <Text style={styles.statLabel}>Rating</Text>
              </View>
            </View>

            {/* Account Menu */}
            <View style={styles.menuSection}>
              <Text style={styles.sectionTitle}>Account</Text>
              <View style={styles.menuList}>
                {menuItems.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.menuItem}
                    onPress={item.onPress}
                  >
                    <View style={styles.menuItemLeft}>
                      <Ionicons
                        name={item.icon as any}
                        size={22}
                        color="#fff"
                      />
                      <Text style={styles.menuItemText}>{item.title}</Text>
                    </View>
                    <View style={styles.menuItemRight}>
                      {item.count !== undefined && (
                        <View style={styles.countBadge}>
                          <Text style={styles.countText}>{item.count}</Text>
                        </View>
                      )}
                      <Ionicons name="chevron-forward" size={18} color="#fff" />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Settings */}
            <View style={styles.menuSection}>
              <Text style={styles.sectionTitle}>Settings</Text>
              <View style={styles.menuList}>
                {settingsItems.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.menuItem}
                    onPress={item.onPress}
                  >
                    <View style={styles.menuItemLeft}>
                      <Ionicons
                        name={item.icon as any}
                        size={22}
                        color="#fff"
                      />
                      <Text style={styles.menuItemText}>{item.title}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="#fff" />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Logout Button */}
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Ionicons name="log-out-outline" size={22} color="#fff" />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </>
        ) : (
          // Guest User View
          <View style={styles.guestContainer}>
            {/* Guest Illustration */}
            <View style={styles.guestIllustration}>
              <Ionicons name="person-circle-outline" size={120} color="#fff" />
              <Text style={styles.guestTitle}>Welcome to ShopConnect!</Text>
              <Text style={styles.guestSubtitle}>
                Sign in to access your profile, track orders, save favorites,
                and enjoy personalized shopping experience.
              </Text>
            </View>

            {/* Benefits */}
            <View style={styles.benefitsContainer}>
              <Text style={styles.benefitsTitle}>
                Benefits of creating an account:
              </Text>

              <View style={styles.benefitItem}>
                <Ionicons name="checkmark-circle" size={20} color="#fff" />
                <Text style={styles.benefitText}>
                  Track your orders and delivery
                </Text>
              </View>

              <View style={styles.benefitItem}>
                <Ionicons name="checkmark-circle" size={20} color="#fff" />
                <Text style={styles.benefitText}>
                  Save your favorite products
                </Text>
              </View>

              <View style={styles.benefitItem}>
                <Ionicons name="checkmark-circle" size={20} color="#fff" />
                <Text style={styles.benefitText}>
                  Fast checkout with saved details
                </Text>
              </View>

              <View style={styles.benefitItem}>
                <Ionicons name="checkmark-circle" size={20} color="#fff" />
                <Text style={styles.benefitText}>
                  Exclusive deals and promotions
                </Text>
              </View>
            </View>

            {/* Login Button */}
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <LinearGradient
                colors={["#fff", "#f8f9fa"]}
                style={styles.loginButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Ionicons name="log-in-outline" size={24} color="#764ba2" />
                <Text style={styles.loginButtonText}>
                  Sign In to Your Account
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Sign Up Option */}
            <View style={styles.signUpContainer}>
              <Text style={styles.signUpText}>Don't have an account? </Text>
              <TouchableOpacity onPress={handleLogin}>
                <Text style={styles.signUpLink}>Create one now</Text>
              </TouchableOpacity>
            </View>

            {/* Continue as Guest */}
            <TouchableOpacity style={styles.guestContinueButton}>
              <Text style={styles.guestContinueText}>Continue as Guest</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#764ba2",
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "transparent",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  settingsButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  // Logged-in User Styles
  profileHeader: {
    alignItems: "center",
    padding: 24,
    backgroundColor: "transparent",
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  editAvatarButton: {
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#764ba2",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 2,
  },
  userPhone: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 2,
  },
  joinDate: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.6)",
    marginBottom: 16,
  },
  editButton: {
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  editButtonText: {
    color: "#764ba2",
    fontWeight: "600",
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingVertical: 20,
    marginBottom: 8,
    marginHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  statDivider: {
    width: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  menuSection: {
    backgroundColor: "transparent",
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginVertical: 16,
  },
  menuList: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemText: {
    fontSize: 16,
    color: "#fff",
    marginLeft: 12,
  },
  menuItemRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  countBadge: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 8,
  },
  countText: {
    color: "#764ba2",
    fontSize: 12,
    fontWeight: "600",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    margin: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  // Guest User Styles
  guestContainer: {
    flex: 1,
    padding: 24,
    alignItems: "center",
  },
  guestIllustration: {
    alignItems: "center",
    marginBottom: 40,
  },
  guestTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 20,
    marginBottom: 12,
    textAlign: "center",
  },
  guestSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    lineHeight: 22,
  },
  benefitsContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 20,
    borderRadius: 16,
    marginBottom: 32,
    width: "100%",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 16,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  benefitText: {
    fontSize: 14,
    color: "#fff",
    marginLeft: 12,
    flex: 1,
  },
  loginButton: {
    borderRadius: 16,
    marginBottom: 16,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  loginButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 16,
  },
  loginButtonText: {
    color: "#764ba2",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
  signUpContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  signUpText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
  },
  signUpLink: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  guestContinueButton: {
    paddingVertical: 12,
  },
  guestContinueText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
    textDecorationLine: "underline",
  },
});
