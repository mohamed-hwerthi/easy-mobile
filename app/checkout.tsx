import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

type ShippingMethod = {
  id: string;
  name: string;
  price: number;
  duration: string;
};

type PaymentMethod = {
  id: string;
  name: string;
  icon: string;
};

export default function CheckoutScreen() {
  const router = useRouter();
  const [activeShipping, setActiveShipping] = useState("1");
  const [activePayment, setActivePayment] = useState("1");
  const [promoCode, setPromoCode] = useState("");
  const [saveShippingInfo, setSaveShippingInfo] = useState(true);
  const [saveCardInfo, setSaveCardInfo] = useState(true);

  // Mock data
  const cartItems: CartItem[] = [
    {
      id: "1",
      name: "Wireless Earbuds",
      price: 99.99,
      quantity: 1,
      image: "https://via.placeholder.com/60",
    },
    {
      id: "2",
      name: "Smart Watch",
      price: 199.99,
      quantity: 1,
      image: "https://via.placeholder.com/60",
    },
  ];

  const shippingMethods: ShippingMethod[] = [
    {
      id: "1",
      name: "Standard Shipping",
      price: 4.99,
      duration: "5-7 business days",
    },
    {
      id: "2",
      name: "Express Shipping",
      price: 9.99,
      duration: "2-3 business days",
    },
    {
      id: "3",
      name: "Next Day Delivery",
      price: 19.99,
      duration: "Next business day",
    },
  ];

  const paymentMethods: PaymentMethod[] = [
    { id: "1", name: "Credit Card", icon: "card-outline" },
    { id: "2", name: "PayPal", icon: "logo-paypal" },
    { id: "3", name: "Apple Pay", icon: "logo-apple" },
  ];

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingCost =
    shippingMethods.find((method) => method.id === activeShipping)?.price || 0;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shippingCost + tax;

  const handlePlaceOrder = () => {
    Alert.alert(
      "Confirm Order",
      `Are you sure you want to place this order for $${total.toFixed(2)}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Place Order",
          style: "default",
          onPress: () => {
            Alert.alert(
              "Order Placed",
              "Your order has been placed successfully!"
            );
          },
        },
      ]
    );
  };

  const renderCartItem = (item: CartItem) => (
    <View key={item.id} style={styles.cartItem}>
      <View style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
      </View>
      <View style={styles.quantityContainer}>
        <Text style={styles.quantityText}>Qty: {item.quantity}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Checkout</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Shipping Address */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Shipping Address</Text>
            <TouchableOpacity>
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.addressCard}>
            <View style={styles.addressHeader}>
              <Text style={styles.addressName}>John Doe</Text>
              <View style={styles.defaultBadge}>
                <Text style={styles.defaultBadgeText}>Default</Text>
              </View>
            </View>
            <Text style={styles.addressText}>123 Main Street</Text>
            <Text style={styles.addressText}>New York, NY 10001</Text>
            <Text style={styles.addressText}>United States</Text>
            <Text style={styles.addressText}>+1 (555) 123-4567</Text>
          </View>
        </View>

        {/* Shipping Method */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Shipping Method</Text>
          </View>
          <View style={styles.shippingMethods}>
            {shippingMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.shippingMethod,
                  activeShipping === method.id && styles.shippingMethodActive,
                ]}
                onPress={() => setActiveShipping(method.id)}
              >
                <View style={styles.radioContainer}>
                  <View
                    style={[
                      styles.radio,
                      activeShipping === method.id && styles.radioActive,
                    ]}
                  >
                    {activeShipping === method.id && (
                      <View style={styles.radioDot} />
                    )}
                  </View>
                </View>
                <View style={styles.shippingInfo}>
                  <Text style={styles.shippingName}>{method.name}</Text>
                  <Text style={styles.shippingDuration}>{method.duration}</Text>
                </View>
                <Text style={styles.shippingPrice}>
                  ${method.price.toFixed(2)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            <TouchableOpacity>
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.paymentMethods}>
            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.paymentMethod,
                  activePayment === method.id && styles.paymentMethodActive,
                ]}
                onPress={() => setActivePayment(method.id)}
              >
                <View style={styles.radioContainer}>
                  <View
                    style={[
                      styles.radio,
                      activePayment === method.id && styles.radioActive,
                    ]}
                  >
                    {activePayment === method.id && (
                      <View style={styles.radioDot} />
                    )}
                  </View>
                </View>
                <Ionicons
                  name={method.icon as any}
                  size={20}
                  color={activePayment === method.id ? "#007AFF" : "#666"}
                />
                <Text
                  style={[
                    styles.paymentName,
                    activePayment === method.id && styles.paymentNameActive,
                  ]}
                >
                  {method.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Order Items */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Order Items ({cartItems.length})
            </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.orderItems}>{cartItems.map(renderCartItem)}</View>
        </View>

        {/* Promo Code */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Promo Code</Text>
          <View style={styles.promoContainer}>
            <TextInput
              style={styles.promoInput}
              placeholder="Enter promo code"
              value={promoCode}
              onChangeText={setPromoCode}
              placeholderTextColor="#999"
            />
            <TouchableOpacity style={styles.applyButton}>
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping</Text>
            <Text style={styles.summaryValue}>${shippingCost.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax</Text>
            <Text style={styles.summaryValue}>${tax.toFixed(2)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerTotal}>
          <Text style={styles.footerTotalLabel}>Total</Text>
          <Text style={styles.footerTotalValue}>${total.toFixed(2)}</Text>
        </View>
        <TouchableOpacity
          style={styles.placeOrderButton}
          onPress={handlePlaceOrder}
        >
          <Text style={styles.placeOrderText}>Place Order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  editText: {
    color: "#007AFF",
    fontSize: 14,
  },
  addressCard: {
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 8,
  },
  addressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  addressName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  defaultBadge: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  defaultBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },
  addressText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  shippingMethods: {
    gap: 8,
  },
  shippingMethod: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
  },
  shippingMethodActive: {
    borderColor: "#007AFF",
    backgroundColor: "#f0f8ff",
  },
  radioContainer: {
    marginRight: 12,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  radioActive: {
    borderColor: "#007AFF",
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#007AFF",
  },
  shippingInfo: {
    flex: 1,
  },
  shippingName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
    marginBottom: 2,
  },
  shippingDuration: {
    fontSize: 12,
    color: "#666",
  },
  shippingPrice: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },
  paymentMethods: {
    gap: 8,
  },
  paymentMethod: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
  },
  paymentMethodActive: {
    borderColor: "#007AFF",
    backgroundColor: "#f0f8ff",
  },
  paymentName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
    marginLeft: 12,
  },
  paymentNameActive: {
    color: "#007AFF",
  },
  orderItems: {
    gap: 12,
  },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemImage: {
    width: 60,
    height: 60,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "600",
    color: "#007AFF",
  },
  quantityContainer: {
    alignItems: "flex-end",
  },
  quantityText: {
    fontSize: 12,
    color: "#666",
  },
  promoContainer: {
    flexDirection: "row",
    gap: 12,
  },
  promoInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: "#000",
  },
  applyButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: "center",
  },
  applyButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#666",
  },
  summaryValue: {
    fontSize: 14,
    color: "#000",
  },
  divider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007AFF",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    backgroundColor: "#fff",
  },
  footerTotal: {
    flex: 1,
  },
  footerTotalLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  footerTotalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007AFF",
  },
  placeOrderButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 16,
  },
  placeOrderText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
