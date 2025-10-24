import { API_UPLOADS_URL } from "@/config/api.config";
import { ClientCategory } from "@/models/client-category-model";
import { ClientProduct } from "@/models/client-product-detail-model";
import { clientCategoryService } from "@/services/client-category-service";
import { clientProductService } from "@/services/client-product-service";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ListRenderItem,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const CATEGORY_ICONS: { [key: string]: string } = {
  electronics: "phone-portrait-outline",
  clothing: "shirt-outline",
  food: "fast-food-outline",
  books: "book-outline",
  sports: "basketball-outline",
  beauty: "sparkles-outline",
  home: "home-outline",
  default: "grid-outline",
};

export default function HomeScreen() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<ClientProduct[]>([]);
  const [categories, setCategories] = useState<ClientCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, [activeCategory, searchQuery]);

  useEffect(() => {
    loadData();
  }, [activeCategory, searchQuery]);

  const loadData = async () => {
    try {
      setLoading(true);
      const categoriesData = await clientCategoryService.getAll();
      console.log(categoriesData);
      const categoriesWithIcons = categoriesData.map((cat) => ({
        ...cat,
        icon:
          cat.icon ||
          CATEGORY_ICONS[cat.name.toLowerCase()] ||
          CATEGORY_ICONS.default,
      }));

      const allCategories: ClientCategory[] = [
        { id: "all", name: "All", icon: "grid-outline" },
        ...categoriesWithIcons,
      ];

      setCategories(allCategories);
      const params: any = {
        page: 0,
        limit: 20,
      };

      if (searchQuery) {
        params.query = searchQuery;
      }

      if (activeCategory !== "all") {
        params.categoryFilter = activeCategory;
      }

      const productsResponse = await clientProductService.getAll(params);
      console.log(productsResponse);
      setProducts(productsResponse.items || productsResponse.items || []);
    } catch (error) {
      debugger;
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  const toggleFavorite = async (productId: string) => {
    console.log("Toggle favorite for product:", productId);
  };

  const renderProductItem: ListRenderItem<ClientProduct> = ({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => router.push(`/product/${item.id}`)}
      activeOpacity={0.8}
    >
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={() => toggleFavorite(item.id)}
      >
        <Ionicons name={"heart-outline"} size={20} color={"#000"} />
      </TouchableOpacity>

      {item.mediasUrls && item.mediasUrls.length > 0 ? (
        <Image
          source={{ uri: API_UPLOADS_URL + item.mediasUrls[0] }}
          style={styles.productImage}
        />
      ) : (
        <View style={[styles.productImage, styles.placeholderImage]}>
          <Ionicons name="image-outline" size={32} color="#ccc" />
        </View>
      )}

      <View style={styles.ratingContainer}>
        <Ionicons name="star" size={14} color="#FFD700" />
        <Text style={styles.ratingText}>
          {item.averageRating || 0} ({item.reviewCount || 0})
        </Text>
      </View>

      <Text style={styles.productName} numberOfLines={2}>
        {item.title}
      </Text>

      <View style={styles.priceContainer}>
        <View>
          {item.discountedPrice ? (
            <>
              <Text style={styles.discountedPrice}>
                ${item.discountedPrice.toFixed(2)}
              </Text>
              <Text style={styles.originalPrice}>
                ${item.basePrice.toFixed(2)}
              </Text>
            </>
          ) : (
            <Text style={styles.productPrice}>
              ${item.basePrice.toFixed(2)}
            </Text>
          )}
        </View>
        <TouchableOpacity style={styles.addToCartButton}>
          <Ionicons name="add" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {!item.inStock && (
        <View style={styles.outOfStockBadge}>
          <Text style={styles.outOfStockText}>Out of Stock</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderCategoryItem: ListRenderItem<ClientCategory> = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        activeCategory === item.id && styles.categoryItemActive,
      ]}
      onPress={() => handleCategoryChange(item.id)}
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
        numberOfLines={1}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading products...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={handleSearch}
            placeholderTextColor="#999"
            returnKeyType="search"
          />
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="options-outline" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
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

        {/* Products Grid */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {activeCategory === "all"
                ? "All Products"
                : categories.find((cat) => cat.id === activeCategory)?.name +
                  " Products"}
            </Text>
            <Text style={styles.productCount}>{products.length} products</Text>
          </View>

          {products.length === 0 ? (
            <View style={styles.noProductsContainer}>
              <Ionicons name="search-outline" size={48} color="#ccc" />
              <Text style={styles.noProductsText}>No products found</Text>
              <Text style={styles.noProductsSubtext}>
                {searchQuery
                  ? "Try adjusting your search"
                  : "No products available in this category"}
              </Text>
            </View>
          ) : (
            <View style={styles.productsGrid}>
              {products.map((item, index) => (
                <View
                  key={`${item.id}-${index}`}
                  style={styles.productGridItem}
                >
                  {renderProductItem({ item, index, separators: {} as any })}
                </View>
              ))}
            </View>
          )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  noStoreContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 32,
  },
  noStoreText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginTop: 16,
  },
  noStoreSubtext: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 24,
  },
  scanStoreButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  scanStoreButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  placeholderImage: {
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  discountedPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  originalPrice: {
    fontSize: 12,
    color: "#666",
    textDecorationLine: "line-through",
  },
  outOfStockBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "rgba(255, 59, 48, 0.9)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  outOfStockText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },
  productCount: {
    fontSize: 14,
    color: "#666",
  },
  noProductsContainer: {
    alignItems: "center",
    paddingVertical: 48,
  },
  noProductsText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
    marginTop: 16,
  },
  noProductsSubtext: {
    fontSize: 14,
    color: "#999",
    marginTop: 8,
    textAlign: "center",
  },
});
