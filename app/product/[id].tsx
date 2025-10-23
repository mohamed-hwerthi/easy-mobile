import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useCart } from "../../context/CartContext";

const { width } = Dimensions.get("window");

type Product = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  description: string;
  images: string[];
  colors: string[];
  sizes: string[];
  isFavorite: boolean;
  inStock: boolean;
  features: string[];
};

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product>({
    id: id as string,
    name: "Wireless Earbuds Pro",
    price: 99.99,
    originalPrice: 129.99,
    rating: 4.7,
    reviews: 128,
    description:
      "Experience crystal clear sound with our premium wireless earbuds. Featuring active noise cancellation, 20-hour battery life, and water resistance.",
    images: [
      "https://images.unsplash.com/photo-1590658165737-15a047b8b5e3?w=500",
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500",
      "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=500",
    ],
    colors: ["#1a1a1a", "#2D9CDB", "#EB5757", "#27ae60"],
    sizes: ["S", "M", "L", "XL"],
    isFavorite: false,
    inStock: true,
    features: [
      "Active Noise Cancellation",
      "20-hour battery life",
      "Water & Sweat Resistant",
      "Wireless Charging Case",
      "Bluetooth 5.2",
    ],
  });

  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[1]);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const toggleFavorite = () => {
    setProduct({ ...product, isFavorite: !product.isFavorite });
  };

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity,
      color: selectedColor,
      size: selectedSize,
    });
    router.push("/cart");
  };

  const handleBuyNow = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity,
      color: selectedColor,
      size: selectedSize,
    });
    router.push("/checkout");
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${product.name} on our app!`,
        url: `https://yourapp.com/products/${product.id}`,
        title: product.name,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Ionicons
        key={index}
        name={index < Math.floor(rating) ? "star" : "star-outline"}
        size={16}
        color="#FFD700"
      />
    ));
  };

  return (
    <View style={styles.container}>
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Details</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={toggleFavorite}
            style={styles.headerButton}
          >
            <Ionicons
              name={product.isFavorite ? "heart" : "heart-outline"}
              size={24}
              color={product.isFavorite ? "#FF3B30" : "#000"}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleShare} style={styles.headerButton}>
            <Ionicons name="share-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Product Images */}
        <View style={styles.imageSection}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: product.images[currentImageIndex] }}
              style={styles.productImage}
              resizeMode="cover"
            />

            {/* Floating Discount Badge */}
            {product.originalPrice && (
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>
                  {Math.round(
                    (1 - product.price / product.originalPrice) * 100
                  )}
                  % OFF
                </Text>
              </View>
            )}

            {/* Image Pagination */}
            <View style={styles.imagePagination}>
              {product.images.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.paginationDot,
                    index === currentImageIndex && styles.paginationDotActive,
                  ]}
                />
              ))}
            </View>
          </View>

          {/* Thumbnail Images */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.thumbnailContainer}
            contentContainerStyle={styles.thumbnailContent}
          >
            {product.images.map((image, index) => (
              <TouchableOpacity
                key={image}
                onPress={() => setCurrentImageIndex(index)}
                style={[
                  styles.thumbnail,
                  index === currentImageIndex && styles.thumbnailActive,
                ]}
              >
                <Image source={{ uri: image }} style={styles.thumbnailImage} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Product Info */}
        <View style={styles.infoSection}>
          {/* Price and Rating */}
          <View style={styles.priceRatingContainer}>
            <View>
              <View style={styles.priceContainer}>
                <Text style={styles.currentPrice}>
                  ${product.price.toFixed(2)}
                </Text>
                {product.originalPrice && (
                  <Text style={styles.originalPrice}>
                    ${product.originalPrice.toFixed(2)}
                  </Text>
                )}
              </View>
              <View style={styles.ratingContainer}>
                <View style={styles.starsContainer}>
                  {renderStars(product.rating)}
                </View>
                <Text style={styles.ratingText}>
                  ({product.reviews} reviews)
                </Text>
              </View>
            </View>
            <View style={styles.stockBadge}>
              <Ionicons
                name={product.inStock ? "checkmark-circle" : "close-circle"}
                size={20}
                color={product.inStock ? "#27ae60" : "#e74c3c"}
              />
              <Text style={styles.stockText}>
                {product.inStock ? "In Stock" : "Out of Stock"}
              </Text>
            </View>
          </View>

          {/* Product Name */}
          <Text style={styles.productName}>{product.name}</Text>

          {/* Description */}
          <Text style={styles.productDescription}>{product.description}</Text>

          {/* Color Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Color</Text>
            <View style={styles.colorsContainer}>
              /** * Maps each color in the product's colors array to a color
              option * button. The button is styled according to whether it is
              selected * or not, and when pressed, it updates the selectedColor
              state * variable. */
              {product.colors.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    selectedColor === color && styles.colorOptionSelected,
                    { backgroundColor: color },
                  ]}
                  onPress={() => setSelectedColor(color)}
                >
                  {selectedColor === color && (
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Size Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Size</Text>
            <View style={styles.sizesContainer}>
              {product.sizes.map((size) => (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.sizeOption,
                    selectedSize === size && styles.sizeOptionSelected,
                  ]}
                  onPress={() => setSelectedSize(size)}
                >
                  <Text
                    style={[
                      styles.sizeText,
                      selectedSize === size && styles.sizeTextSelected,
                    ]}
                  >
                    {size}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Quantity Selector */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quantity</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Ionicons name="remove" size={20} color="#666" />
              </TouchableOpacity>
              <View style={styles.quantityDisplay}>
                <Text style={styles.quantityText}>{quantity}</Text>
              </View>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity(quantity + 1)}
              >
                <Ionicons name="add" size={20} color="#666" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <View style={styles.priceSummary}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalPrice}>
            ${(product.price * quantity).toFixed(2)}
          </Text>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.addToCartButton]}
            onPress={handleAddToCart}
          >
            <Ionicons name="cart-outline" size={20} color="#007AFF" />
            <Text style={styles.addToCartText}>Add to Cart</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.buyNowButton]}
            onPress={handleBuyNow}
          >
            <Text style={styles.buyNowText}>Buy Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  // Header styles matching Cart Scree
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    backgroundColor: "#fff",
  },
  imageSection: {
    backgroundColor: "#f8f9fa",
  },
  imageContainer: {
    height: width * 0.8,
    position: "relative",
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  discountBadge: {
    position: "absolute",
    top: 20,
    left: 20,
    backgroundColor: "#ff4444",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  discountText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  imagePagination: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.6)",
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: "#007AFF",
    width: 20,
  },
  thumbnailContainer: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  thumbnailContent: {
    paddingRight: 20,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 12,
    borderWidth: 2,
    borderColor: "transparent",
    overflow: "hidden",
  },
  thumbnailActive: {
    borderColor: "#007AFF",
  },
  thumbnailImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  infoSection: {
    padding: 20,
  },
  priceRatingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  currentPrice: {
    fontSize: 28,
    fontWeight: "700",
    color: "#000",
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 18,
    color: "#999",
    textDecorationLine: "line-through",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  starsContainer: {
    flexDirection: "row",
    marginRight: 8,
  },
  ratingText: {
    fontSize: 14,
    color: "#666",
  },
  stockBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  stockText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
    marginLeft: 4,
  },
  productName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
    marginBottom: 12,
    lineHeight: 28,
  },
  productDescription: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
    marginBottom: 24,
  },
  featuresSection: {
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: "#555",
    marginLeft: 8,
  },
  colorsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  colorOption: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  colorOptionSelected: {
    borderColor: "#007AFF",
    transform: [{ scale: 1.1 }],
  },
  sizesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  sizeOption: {
    minWidth: 60,
    height: 44,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },
  sizeOptionSelected: {
    borderColor: "#007AFF",
    backgroundColor: "#007AFF",
  },
  sizeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  sizeTextSelected: {
    color: "#fff",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 4,
    alignSelf: "flex-start",
  },
  quantityButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  quantityDisplay: {
    marginHorizontal: 16,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
  },
  infoCards: {
    gap: 12,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 16,
    padding: 16,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    marginBottom: 2,
  },
  infoSubtitle: {
    fontSize: 12,
    color: "#666",
  },
  bottomActions: {
    backgroundColor: "#fff",
    padding: 20,
    paddingBottom: 34,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  priceSummary: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 16,
    color: "#666",
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    borderRadius: 14,
  },
  addToCartButton: {
    backgroundColor: "#f8f9fa",
    borderWidth: 2,
    borderColor: "#007AFF",
  },
  addToCartText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  buyNowButton: {
    backgroundColor: "#007AFF",
  },
  buyNowText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
