"use client";

import { API_UPLOADS_URL } from "@/config/api.config";
import { ClientProduct } from "@/models/client-product-detail-model";
import { ClientProductOption } from "@/models/ClientProductOption";
import { ClientProductOptionGroup } from "@/models/ClientProductOptionGroup";
import { ClientProductVariants } from "@/models/ClientProductVariants";
import { clientProductService } from "@/services/client-product-service";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
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
import { CartItem, CartOption, useCart } from "../../context/CartContext";

const { width } = Dimensions.get("window");

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<ClientProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<{
    [key: string]: string;
  }>({});
  const [selectedSupplements, setSelectedSupplements] = useState<string[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        setError(null);
        if (id && typeof id === "string") {
          const productData = await clientProductService.getById(id);
          setProduct(productData);

          // Auto-select first variant option for each variant group
          const initialVariants: { [key: string]: string } = {};
          productData.variants?.forEach((variantGroup, index) => {
            if (variantGroup.options && variantGroup.options.length > 0) {
              initialVariants[variantGroup.variantName] =
                variantGroup.options[0].variantId;
            }
          });
          setSelectedVariants(initialVariants);
        }
      } catch (err) {
        console.error("Failed to fetch product:", err);
        setError("Product not found");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const calculateTotal = () => {
    if (!product) return 0;

    let total = product.basePrice || 0;

    // Add variant prices
    Object.entries(selectedVariants).forEach(([groupId, optionId]) => {
      const option = product.variants
        ?.find((g) => g.variantName === groupId)
        ?.options.find((o) => o.variantId === optionId);
      if (option && option.variantPrice) {
        total += option.variantPrice;
      }
    });

    // Add supplement prices
    selectedSupplements.forEach((id) => {
      const group = product.optionGroups?.find((g) =>
        g.options.some((opt: ClientProductOption) => opt.optionId === id)
      );
      const option = group?.options.find(
        (opt: ClientProductOption) => opt.optionId === id
      );
      if (option && option.optionPrice) {
        total += option.optionPrice;
      }
    });

    return total * quantity;
  };

  const handleVariantSelect = (groupId: string, optionId: string) => {
    setSelectedVariants((prev) => ({ ...prev, [groupId]: optionId }));
  };

  const toggleSupplement = (supplementId: string) => {
    setSelectedSupplements((prev) =>
      prev.includes(supplementId)
        ? prev.filter((id) => id !== supplementId)
        : [...prev, supplementId]
    );
  };

  const handleAddToCart = () => {
    if (!product) return;

    const variantOptions: CartOption[] = [];
    Object.entries(selectedVariants).forEach(([groupId, optionId]) => {
      const variantGroup = product.variants?.find(
        (g) => g.variantName === groupId
      );
      const option = variantGroup?.options.find(
        (o) => o.variantId === optionId
      );
      if (option) {
        variantOptions.push({
          optionId: option.variantId,
          optionName: `${variantGroup?.variantName}: ${option.variantValue}`,
          optionPrice: option.variantPrice,
        });
      }
    });

    const supplementOptions: CartOption[] = [];
    selectedSupplements.forEach((supplementId) => {
      const group = product.optionGroups?.find((g) =>
        g.options.some((opt) => opt.optionId === supplementId)
      );
      const option = group?.options.find(
        (opt) => opt.optionId === supplementId
      );
      if (option) {
        supplementOptions.push({
          optionId: option.optionId,
          optionName: `${group?.name}: ${option.optionName}`,
          optionPrice: option.optionPrice,
        });
      }
    });

    const allOptions = [...variantOptions, ...supplementOptions];

    let basePrice = product.basePrice || 0;
    variantOptions.forEach((option) => {
      basePrice += option.optionPrice || 0;
    });

    const cartItem: Omit<CartItem, "itemTotalPrice"> = {
      itemId: `${product.id}-${Object.values(selectedVariants).join(
        "-"
      )}-${selectedSupplements.join(",")}`,
      itemTitle: product.title || "Unnamed Product",
      itemPrice: basePrice,
      itemImage: product.mediasUrls?.[0]
        ? `${API_UPLOADS_URL}${product.mediasUrls[0]}`
        : "/placeholder.jpg",
      itemQuantity: quantity,
      itemOptions: allOptions,
      productId: product.id,
      variants: Object.values(selectedVariants),
      supplements: selectedSupplements,
    };

    addToCart(cartItem);
    router.push("/cart");
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/checkout");
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${product?.title} on our app!`,
        url: `https://yourapp.com/products/${product?.id}`,
        title: product?.title,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const renderStars = (rating: number) => {
    const averageRating = rating || 0;
    return Array.from({ length: 5 }).map((_, index) => (
      <Ionicons
        key={index}
        name={index < Math.floor(averageRating) ? "star" : "star-outline"}
        size={16}
        color="#FFD700"
      />
    ));
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Product Details</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton}>
              <Ionicons name="heart-outline" size={24} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <Ionicons name="share-outline" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.loadingContainer}>
          <Text>Loading product details...</Text>
        </View>
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Product Details</Text>
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#666" />
          <Text style={styles.errorText}>Product not found</Text>
          <Text style={styles.errorSubtext}>
            The product you're looking for doesn't exist or has been removed.
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => router.back()}
          >
            <Text style={styles.retryButtonText}>Back to Store</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const productImages =
    product.mediasUrls && product.mediasUrls.length > 0
      ? product.mediasUrls.map((media: string) => `${API_UPLOADS_URL}${media}`)
      : ["/placeholder.jpg"];

  return (
    <View style={styles.container}>
      {/* Header */}
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
            onPress={() => setIsFavorite(!isFavorite)}
            style={styles.headerButton}
          >
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={24}
              color={isFavorite ? "#FF3B30" : "#000"}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleShare} style={styles.headerButton}>
            <Ionicons name="share-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Product Images */}
        <View style={styles.imageSection}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: productImages[currentImageIndex] }}
              style={styles.productImage}
              resizeMode="cover"
            />

            {/* Discount Badge */}
            {product.discountedPrice &&
              product.discountedPrice > product.basePrice && (
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>
                    {Math.round(
                      (1 - (product.basePrice || 0) / product.discountedPrice) *
                        100
                    )}
                    % OFF
                  </Text>
                </View>
              )}

            {/* Image Pagination */}
            {productImages.length > 1 && (
              <View style={styles.imagePagination}>
                {productImages.map((_: any, index: number) => (
                  <View
                    key={index}
                    style={[
                      styles.paginationDot,
                      index === currentImageIndex && styles.paginationDotActive,
                    ]}
                  />
                ))}
              </View>
            )}
          </View>

          {/* Thumbnail Images */}
          {productImages.length > 1 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.thumbnailContainer}
              contentContainerStyle={styles.thumbnailContent}
            >
              {productImages.map((image: string, index: number) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setCurrentImageIndex(index)}
                  style={[
                    styles.thumbnail,
                    index === currentImageIndex && styles.thumbnailActive,
                  ]}
                >
                  <Image
                    source={{ uri: image }}
                    style={styles.thumbnailImage}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Product Info */}
        <View style={styles.infoSection}>
          {/* Category and Stock */}
          <View style={styles.badgeContainer}>
            <View style={styles.categoryBadge}>
              <Text style={styles.badgeText}>
                {product.categoryName || "Uncategorized"}
              </Text>
            </View>
            <View
              style={[
                styles.stockBadge,
                { backgroundColor: !product.inStock ? "#e8f5e8" : "#ffe8e8" },
              ]}
            >
              <Ionicons
                name={!product.inStock ? "checkmark-circle" : "close-circle"}
                size={16}
                color={!product.inStock ? "#27ae60" : "#e74c3c"}
              />
              <Text
                style={[
                  styles.stockText,
                  { color: !product.inStock ? "#27ae60" : "#e74c3c" },
                ]}
              >
                {!product.inStock ? "In Stock" : "Out of Stock"}
              </Text>
            </View>
          </View>

          {/* Product Name */}
          <Text style={styles.productName}>
            {product.title || "Unnamed Product"}
          </Text>

          {/* Rating */}
          <View style={styles.ratingContainer}>
            <View style={styles.starsContainer}>
              {renderStars(product.averageRating || 0)}
            </View>
            <Text style={styles.ratingText}>
              ({product.reviewCount || 0} reviews)
            </Text>
          </View>

          {/* Price */}
          <View style={styles.priceContainer}>
            <Text style={styles.currentPrice}>
              ${calculateTotal().toFixed(2)}
            </Text>
            {product.discountedPrice &&
              product.discountedPrice > product.basePrice && (
                <Text style={styles.originalPrice}>
                  ${product.discountedPrice.toFixed(2)}
                </Text>
              )}
          </View>

          {/* Description */}
          <Text style={styles.productDescription}>
            {product.description || "No description available."}
          </Text>

          {/* Variants */}
          {product.variants &&
            product.variants.length > 0 &&
            product.variants.map(
              (variantGroup: ClientProductVariants, index: number) => (
                <View
                  key={variantGroup.variantName || `variant-${index}`}
                  style={styles.section}
                >
                  <Text style={styles.sectionTitle}>
                    {variantGroup.variantName}
                  </Text>
                  <View style={styles.variantsContainer}>
                    {variantGroup.options?.map((option) => {
                      const isSelected =
                        selectedVariants[variantGroup.variantName] ===
                        option.variantId;
                      return (
                        <TouchableOpacity
                          key={option.variantId}
                          style={[
                            styles.variantOption,
                            isSelected && styles.variantOptionSelected,
                          ]}
                          onPress={() =>
                            handleVariantSelect(
                              variantGroup.variantName,
                              option.variantId
                            )
                          }
                        >
                          <Text
                            style={[
                              styles.variantText,
                              isSelected && styles.variantTextSelected,
                            ]}
                          >
                            {option.variantValue}
                            {option.variantPrice > 0 &&
                              ` (+$${option.variantPrice.toFixed(2)})`}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              )
            )}

          {/* Supplements */}
          {product.optionGroups &&
            product.optionGroups.length > 0 &&
            product.optionGroups.map(
              (group: ClientProductOptionGroup, index: number) => (
                <View
                  key={group.name || `option-${index}`}
                  style={styles.section}
                >
                  <Text style={styles.sectionTitle}>{group.name}</Text>
                  <View style={styles.supplementsContainer}>
                    {group.options?.map((option: ClientProductOption) => {
                      const isSelected = selectedSupplements.includes(
                        option.optionId
                      );
                      return (
                        <TouchableOpacity
                          key={option.optionId}
                          style={[
                            styles.supplementOption,
                            isSelected && styles.supplementOptionSelected,
                          ]}
                          onPress={() => toggleSupplement(option.optionId)}
                        >
                          <View
                            style={[
                              styles.supplementCheckbox,
                              isSelected && styles.supplementCheckboxSelected,
                            ]}
                          >
                            {isSelected && (
                              <Ionicons
                                name="checkmark"
                                size={16}
                                color="#fff"
                              />
                            )}
                          </View>
                          <Text style={styles.supplementText}>
                            {option.optionName}
                          </Text>
                          <Text style={styles.supplementPrice}>
                            +${option.optionPrice.toFixed(2)}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              )
            )}

          {/* Quantity */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quantity</Text>
            <View style={styles.quantityWrapper}>
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Ionicons
                    name="remove"
                    size={20}
                    color={quantity <= 1 ? "#ccc" : "#666"}
                  />
                </TouchableOpacity>
                <View style={styles.quantityDisplay}>
                  <Text style={styles.quantityText}>{quantity}</Text>
                </View>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => setQuantity(quantity + 1)}
                  disabled={quantity >= (product.quantity || 0)}
                >
                  <Ionicons
                    name="add"
                    size={20}
                    color={
                      quantity >= (product.quantity || 0) ? "#ccc" : "#666"
                    }
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.quantityLabel}>
                {product.quantity || 0} available
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <View style={styles.priceSummary}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalPrice}>${calculateTotal().toFixed(2)}</Text>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.addToCartButton,
              product.inStock && styles.disabledButton,
            ]}
            onPress={handleAddToCart}
            disabled={product.inStock}
          >
            <Ionicons
              name="cart-outline"
              size={20}
              color={product.inStock ? "#ccc" : "#007AFF"}
            />
            <Text
              style={[
                styles.addToCartText,
                product.inStock && styles.disabledText,
              ]}
            >
              {product.inStock ? "Out of Stock" : "Add to Cart"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.buyNowButton,
              product.inStock && styles.disabledButton,
            ]}
            onPress={handleBuyNow}
            disabled={product.inStock}
          >
            <Text
              style={[
                styles.buyNowText,
                product.inStock && styles.disabledText,
              ]}
            >
              Buy Now
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
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
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerButton: {
    padding: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
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
  badgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  categoryBadge: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
  },
  stockBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  stockText: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  productName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
    marginBottom: 8,
    lineHeight: 28,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  starsContainer: {
    flexDirection: "row",
    marginRight: 8,
  },
  ratingText: {
    fontSize: 14,
    color: "#666",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
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
  productDescription: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginBottom: 12,
  },
  variantsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  variantOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  variantOptionSelected: {
    borderColor: "#007AFF",
    backgroundColor: "#007AFF",
  },
  variantText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  variantTextSelected: {
    color: "#fff",
  },
  supplementsContainer: {
    gap: 8,
  },
  supplementOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  supplementOptionSelected: {
    borderColor: "#007AFF",
    backgroundColor: "#f0f8ff",
  },
  supplementCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  supplementCheckboxSelected: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  supplementText: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },
  supplementPrice: {
    fontSize: 14,
    fontWeight: "600",
    color: "#007AFF",
  },
  quantityWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 4,
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
  quantityLabel: {
    fontSize: 14,
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
  disabledButton: {
    opacity: 0.6,
  },
  disabledText: {
    color: "#ccc",
  },
});
