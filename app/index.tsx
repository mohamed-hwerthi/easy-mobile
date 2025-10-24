import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CameraView, useCameraPermissions } from "expo-camera";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

export default function StoreScanScreen() {
  const router = useRouter();
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress] = useState(new Animated.Value(0));
  const [pulseAnim] = useState(new Animated.Value(1));
  const [scanned, setScanned] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraActive, setCameraActive] = useState(true);

  const saveStoreSlugToStorage = async (storeSlug: string) => {
    try {
      await AsyncStorage.setItem("storeSlug", storeSlug);
    } catch (error) {}
  };

  useEffect(() => {
    if (permission && !permission.granted) {
      requestPermission();
    }
  }, [permission]);

  React.useEffect(() => {
    if (!isScanning) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isScanning]);

  const handleBarCodeScanned = (scanningResult: any) => {
    if (!scanned) {
      setScanned(true);
      setIsScanning(false);
      setCameraActive(false);
      Alert.alert(
        "🎉 Store Connected!",
        `Store: ${scanningResult.data}\n\nYou can now browse their amazing products.`,
        [
          {
            text: "Scan Again",
            onPress: () => {
              setScanned(false);
              setCameraActive(true);
            },
          },
          {
            text: "Start Shopping",
            onPress: () => {
              saveStoreSlugToStorage(scanningResult.data);
              router.push("/(tabs)");
            },
          },
        ]
      );
    }
  };

  const handleScanQR = () => {
    if (!permission?.granted) {
      Alert.alert(
        "Camera Permission Required",
        "Please allow camera access to scan QR codes",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Allow Camera",
            onPress: requestPermission,
          },
        ]
      );
      return;
    }

    setIsScanning(true);
    setScanned(false);
    setCameraActive(true);

    // Simulate scanning animation (fallback if camera not available)
    Animated.timing(scanProgress, {
      toValue: 1,
      duration: 2000,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start(() => {
      if (!permission?.granted || !cameraActive) {
        // Fallback to simulated scan if camera not available
        setIsScanning(false);
        simulateQRScan();
      }
    });
  };

  const simulateQRScan = () => {
    const simulatedData = "store://techgadget-12345";

    Alert.alert(
      "🎉 Store Connected!",
      "Welcome to TechGadget Store. You can now browse their amazing products.",
      [
        {
          text: "Start Shopping",
          onPress: () => {
            router.push("/(tabs)");
          },
        },
      ]
    );
  };

  const handleManualEntry = () => {
    Alert.prompt(
      "Enter Store Code",
      "Please enter the 6-digit store code provided by the store:",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Connect Store",
          onPress: (code: any) => {
            if (code && code.length === 6) {
              Alert.alert(
                "🎉 Store Connected!",
                "Welcome to TechGadget Store. You can now browse their amazing products.",
                [
                  {
                    text: "Start Shopping",
                    onPress: () => {
                      router.push("/(tabs)");
                    },
                  },
                ]
              );
            } else {
              Alert.alert(
                "Invalid Code",
                "Please enter a valid 6-digit store code."
              );
            }
          },
        },
      ],
      "plain-text"
    );
  };

  const progressWidth = scanProgress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  const scannerScale = scanProgress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.02, 1],
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Background Gradient */}
      <LinearGradient
        colors={["#f8fafc", "#ffffff", "#f1f5f9"]}
        style={styles.background}
      />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Ionicons name="storefront" size={32} color="#007AFF" />
          <Text style={styles.logoText}>Easy Mobile</Text>
        </View>
        <Text style={styles.title}>Discover Local Stores</Text>
        <Text style={styles.subtitle}>
          Scan a store's QR code to unlock their digital catalog and start
          shopping instantly
        </Text>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* QR Scanner Area */}
        <View style={styles.scannerSection}>
          <Animated.View
            style={[
              styles.scannerContainer,
              { transform: [{ scale: scannerScale }] },
            ]}
          >
            <LinearGradient
              colors={["#007AFF", "#0056CC"]}
              style={styles.scannerGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.scannerFrame}>
                {/* Real Camera View */}
                {permission?.granted && cameraActive ? (
                  <CameraView
                    style={styles.camera}
                    facing="back"
                    onBarcodeScanned={
                      scanned ? undefined : handleBarCodeScanned
                    }
                    barcodeScannerSettings={{
                      barcodeTypes: ["qr", "pdf417"],
                    }}
                  >
                    <View style={styles.cameraOverlay}>
                      {/* Animated Scanning Line */}
                      {isScanning && (
                        <Animated.View
                          style={[styles.scanningLine, { top: progressWidth }]}
                        />
                      )}

                      {/* Animated Dots */}
                      <View style={styles.dotsContainer}>
                        {[0, 1, 2, 3].map((dot) => (
                          <Animated.View
                            key={dot}
                            style={[
                              styles.animatedDot,
                              {
                                transform: [
                                  {
                                    scale: scanProgress.interpolate({
                                      inputRange: [0, 0.25 * dot, 1],
                                      outputRange: [1, 1.5, 1],
                                    }),
                                  },
                                ],
                                opacity: scanProgress.interpolate({
                                  inputRange: [0, 0.25 * dot, 1],
                                  outputRange: [0.3, 1, 0.3],
                                }),
                              },
                            ]}
                          />
                        ))}
                      </View>

                      {/* Corner Borders */}
                      <View style={[styles.corner, styles.cornerTopLeft]} />
                      <View style={[styles.corner, styles.cornerTopRight]} />
                      <View style={[styles.corner, styles.cornerBottomLeft]} />
                      <View style={[styles.corner, styles.cornerBottomRight]} />
                    </View>
                  </CameraView>
                ) : (
                  // Fallback view when camera is not available
                  <View style={styles.cameraFallback}>
                    <Ionicons name="camera-outline" size={50} color="#007AFF" />
                    <Text style={styles.cameraFallbackText}>
                      {permission?.granted
                        ? "Camera Ready"
                        : "Camera Access Required"}
                    </Text>

                    {/* Animated Scanning Line */}
                    {isScanning && (
                      <Animated.View
                        style={[styles.scanningLine, { top: progressWidth }]}
                      />
                    )}

                    {/* Corner Borders */}
                    <View style={[styles.corner, styles.cornerTopLeft]} />
                    <View style={[styles.corner, styles.cornerTopRight]} />
                    <View style={[styles.corner, styles.cornerBottomLeft]} />
                    <View style={[styles.corner, styles.cornerBottomRight]} />
                  </View>
                )}
              </View>
            </LinearGradient>
          </Animated.View>

          <Text style={styles.scannerText}>
            {isScanning
              ? "🔍 Scanning store code..."
              : permission?.granted
              ? "📱 Position QR code within frame"
              : "📱 Allow camera access to scan"}
          </Text>
        </View>

        {/* Manual Entry Option */}
        <TouchableOpacity
          style={styles.manualButton}
          onPress={handleManualEntry}
        >
          <Ionicons name="keypad" size={20} color="#007AFF" />
          <Text style={styles.manualButtonText}>Enter Store Code Manually</Text>
        </TouchableOpacity>

        {/* Demo Option */}
        <View style={styles.demoSection}>
          <Text style={styles.demoText}>Don't have a QR code?</Text>
          <TouchableOpacity style={styles.demoButton} onPress={simulateQRScan}>
            <Ionicons name="play-circle" size={16} color="#666" />
            <Text style={styles.demoButtonText}>Try demo scan</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Actions */}
      <View style={styles.bottomSection}>
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <TouchableOpacity
            style={[styles.scanButton, isScanning && styles.scanButtonDisabled]}
            onPress={handleScanQR}
            disabled={isScanning}
          >
            <LinearGradient
              colors={isScanning ? ["#666", "#888"] : ["#007AFF", "#0056CC"]}
              style={styles.scanButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <View style={styles.scanButtonContent}>
                {isScanning ? (
                  <Ionicons name="scan-circle" size={24} color="#fff" />
                ) : (
                  <Ionicons name="qr-code" size={24} color="#fff" />
                )}
                <Text style={styles.scanButtonText}>
                  {isScanning ? "Scanning Store..." : "Scan Store QR Code"}
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 10,
    alignItems: "center",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  logoText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007AFF",
    marginLeft: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1a1a1a",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
    maxWidth: 300,
    marginBottom: 120,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  scannerSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  scannerContainer: {
    shadowColor: "#007AFF",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  scannerGradient: {
    borderRadius: 24,
    padding: 4,
  },
  scannerFrame: {
    width: width * 0.65,
    height: width * 0.65,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    position: "relative",
  },
  camera: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
  },
  cameraOverlay: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  cameraFallback: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 122, 255, 0.1)",
    borderRadius: 20,
    position: "relative",
  },
  cameraFallbackText: {
    marginTop: 12,
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "500",
    textAlign: "center",
  },
  scanningLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: "#007AFF",
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 4,
  },
  dotsContainer: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
  },
  animatedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#007AFF",
  },
  corner: {
    position: "absolute",
    width: 24,
    height: 24,
    borderColor: "#007AFF",
  },
  cornerTopLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 12,
  },
  cornerTopRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 12,
  },
  cornerBottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 12,
  },
  cornerBottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 12,
  },
  scannerText: {
    marginTop: 20,
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    fontWeight: "500",
  },
  manualButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#007AFF",
    marginBottom: 20,
    backgroundColor: "rgba(0, 122, 255, 0.05)",
  },
  manualButtonText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  demoSection: {
    alignItems: "center",
  },
  demoText: {
    color: "#666",
    fontSize: 14,
    marginBottom: 8,
  },
  demoButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  demoButtonText: {
    color: "#666",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 4,
    textDecorationLine: "underline",
  },
  bottomSection: {
    padding: 24,
    paddingBottom: 40,
  },
  scanButton: {
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#007AFF",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  scanButtonGradient: {
    paddingVertical: 18,
    borderRadius: 16,
  },
  scanButtonDisabled: {
    opacity: 0.8,
  },
  scanButtonContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  scanButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 8,
  },
});
