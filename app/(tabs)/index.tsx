import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Image,
  ListRenderItem,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Types
type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
  isFavorite: boolean;
};

type Category = {
  id: string;
  name: string;
  icon: string;
  isActive: boolean;
};

type Store = {
  id: string;
  name: string;
  description: string;
  image: string;
  rating: number;
  category: string;
  distance: string;
};

// Mock data
const featuredProducts: Product[] = [
  {
    id: "1",
    name: "Wireless Earbuds",
    price: 99.99,
    image: "https://images.unsplash.com/photo-1590658165737-15a047b8b5e3?w=300",
    rating: 4.5,
    reviews: 128,
    isFavorite: false,
  },
  {
    id: "2",
    name: "Smart Watch",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1579586337278-3f426f2e5c98?w=300",
    rating: 4.7,
    reviews: 256,
    isFavorite: true,
  },
  {
    id: "3",
    name: "Bluetooth Speaker",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300",
    rating: 4.3,
    reviews: 89,
    isFavorite: false,
  },
];

const categories: Category[] = [
  { id: "1", name: "All", icon: "grid-outline", isActive: true },
  { id: "2", name: "Headphones", icon: "headset-outline", isActive: false },
  { id: "3", name: "Watches", icon: "watch-outline", isActive: false },
  { id: "4", name: "Phones", icon: "phone-portrait-outline", isActive: false },
  { id: "5", name: "Laptops", icon: "laptop-outline", isActive: false },
];

export default function HomeScreen() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("1");
  const [searchQuery, setSearchQuery] = useState("");
  const [showStoreModal, setShowStoreModal] = useState(false);

  const renderProductItem: ListRenderItem<Product> = ({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => router.push(`/product/${item.id}`)}
      activeOpacity={0.8}
    >
      <TouchableOpacity style={styles.favoriteButton} onPress={() => {}}>
        <Ionicons
          name={item.isFavorite ? "heart" : "heart-outline"}
          size={20}
          color={item.isFavorite ? "#FF3B30" : "#000"}
        />
      </TouchableOpacity>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.ratingContainer}>
        <Ionicons name="star" size={14} color="#FFD700" />
        <Text style={styles.ratingText}>
          {item.rating} ({item.reviews})
        </Text>
      </View>
      <Text style={styles.productName} numberOfLines={1}>
        {item.name}
      </Text>
      <View style={styles.priceContainer}>
        <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
        <TouchableOpacity style={styles.addToCartButton}>
          <Ionicons name="add" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderCategoryItem: ListRenderItem<Category> = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        activeCategory === item.id && styles.categoryItemActive,
      ]}
      onPress={() => setActiveCategory(item.id)}
    >
      <Ionicons
        name={item.icon as any}
        size={20}
        color={activeCategory === item.id ? "#007AFF" : "#666"}
      />
      <Text
        style={[
          styles.categoryName,
          activeCategory === item.id && styles.categoryNameActive,
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const handleStartAnnuler = () => {
    setShowStoreModal(false);
    // Navigate back to store scan screen
    router.push("/");
  };

  const handleChangeStore = () => {
    setShowStoreModal(true);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="options-outline" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <FlatList
            data={categories}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        {/* All Products Grid */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>All Products</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.productsGrid}>
            {[...featuredProducts, ...featuredProducts].map((item, index) => (
              <View key={`${item.id}-${index}`} style={styles.productGridItem}>
                {renderProductItem({ item, index, separators: {} as any })}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  storeSelector: {
    marginBottom: 12,
  },
  storeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  storeButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#007AFF",
    marginHorizontal: 6,
    maxWidth: 200,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: "#000",
  },
  filterButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  welcomeBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    margin: 16,
    padding: 20,
    borderRadius: 16,
  },
  welcomeText: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },

  section: {
    padding: 16,
    backgroundColor: "#fff",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  seeAll: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "600",
  },
  categoriesList: {
    paddingBottom: 8,
  },
  categoryItem: {
    width: 80,
    alignItems: "center",
    marginRight: 12,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
  },
  categoryItemActive: {
    backgroundColor: "#e6f2ff",
  },
  categoryName: {
    fontSize: 12,
    textAlign: "center",
    color: "#666",
    marginTop: 4,
    fontWeight: "500",
  },
  categoryNameActive: {
    color: "#007AFF",
    fontWeight: "600",
  },
  productsList: {
    paddingBottom: 8,
  },
  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  productGridItem: {
    width: "48%",
    marginBottom: 16,
  },
  productCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    marginRight: 12,
    width: 160,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  favoriteButton: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 12,
    padding: 4,
  },
  productImage: {
    width: "100%",
    height: 120,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: "#f5f5f5",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
    fontWeight: "500",
  },
  productName: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  addToCartButton: {
    backgroundColor: "#007AFF",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  closeButton: {
    padding: 4,
  },
  storesList: {
    padding: 16,
  },
  storeItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },
  storeItemActive: {
    borderColor: "#007AFF",
    backgroundColor: "#e6f2ff",
  },
  storeImage: {
    width: 50,
    height: 50,
    borderRadius: 12,
    marginRight: 12,
  },
  storeInfo: {
    flex: 1,
  },
  storeName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4,
  },
  storeDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 6,
  },
  storeDetails: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  storeCategory: {
    fontSize: 12,
    color: "#007AFF",
    backgroundColor: "rgba(0, 122, 255, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    fontWeight: "500",
  },
  storeDistance: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  modalActions: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    gap: 12,
  },
  startAnnulerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#FF3B30",
    backgroundColor: "rgba(255, 59, 48, 0.05)",
  },
  startAnnulerText: {
    color: "#FF3B30",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  confirmButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
