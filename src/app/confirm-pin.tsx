import { useEffect, useState } from "react";

import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  useColorScheme,
  useWindowDimensions,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { router, useLocalSearchParams } from "expo-router";

import { getNetwork, Network, NETWORKS } from "@/components/data/network";
import { Colors } from "@/constants/theme";

import { api } from "@/services/api";
import axios from "axios";

import { styles, ThemeColors } from "@/components/data/confirm-pin-style";

import { PinDot } from "@/components/confirm-pin/pin-dot";
import { PinKeypad } from "@/components/confirm-pin/pin-keypard";
import { PurchaseSummary } from "@/components/confirm-pin/purchase-summary";

import type { KeypadItem } from "@/components/keppadButton";

const PIN_LENGTH = 4;

type PurchaseParams = {
  network?: string;
  type?: string;
  phone?: string;
  amount?: string;
  price?: string;
  category?: string;
  dataValue?: string;
  planId?: string;
  planLabel?: string;
};

type PurchaseErrorResponse = {
  message?: string | string[];
};

export default function ConfirmPinScreen() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  const colors: ThemeColors = Colors[
    isDark ? "dark" : "light"
  ];

  const errorColor = isDark ? "#FF7A80" : "#D92D34";

  const params = useLocalSearchParams<PurchaseParams>();

  const requestedNetwork = (params.network ?? "mtn").toLowerCase();

  const networkId =
    NETWORKS.find((item) => item.id === requestedNetwork)?.id ??
    "mtn";

  const network: Network = getNetwork(networkId);

  const type =
    params.type?.toUpperCase() === "DATA"
      ? "DATA"
      : "AIRTIME";

  const phone = params.phone ?? "";

  const amount =
    type === "DATA"
      ? Number(params.price) || 0
      : Number(params.amount) || 0;

  const productTitle =
    `${network.name} ${type.toLowerCase()}`;

  const productDetail =
    type === "DATA"
      ? params.planLabel ?? params.dataValue ?? "Data bundle"
      : "Airtime top-up";

  const { height } = useWindowDimensions();

  const keySize = height < 720 ? 60 : 72;

  const [pin, setPin] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const shake = useSharedValue(0);

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shake.value }],
  }));

  useEffect(() => {
    if (!params.network || !params.phone) {
      setErrorMessage("Purchase information is missing.");
    }
  }, [params.network, params.phone]);

  const fail = (message: string) => {
    shake.value = withSequence(
      withTiming(-9, { duration: 50 }),
      withTiming(9, { duration: 80 }),
      withTiming(-7, { duration: 80 }),
      withTiming(0, { duration: 50 }),
    );

    setPin("");
    setErrorMessage(message);
  };

  const submit = async (enteredPin: string) => {
    if (isSubmitting) return;

    if (!phone || !params.network || amount <= 0) {
      fail("Some purchase information is missing.");
      return;
    }

    if (type === "DATA" && (!params.category || !params.dataValue)) {
      fail("The selected data plan is incomplete.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      
      const purchaseBody =
        type === "DATA"
          ? {
              network: network.id.toUpperCase(),
              type: "DATA",
              phone,
              category: params.category,
              dataValue: params.dataValue,
              price: amount,
              pin: enteredPin,
            }
          : {
              network: network.id.toUpperCase(),
              type: "AIRTIME",
              phone,
              amount,
              price: amount,
              pin: enteredPin,
            };

      const response = await api.post(
        "/vtuagent/purchase",
        purchaseBody,
      );

      router.replace({
        pathname: "/",
        params: {
          network: network.id,
          type: type.toLowerCase(),
          phone,
          amount: String(amount),
          planLabel: params.planLabel ?? "",
          message:
            response.data?.message ??
            "Purchase request recorded successfully",
        },
      });
    } catch (error) {
      if (__DEV__) {
        console.warn(
          "Purchase failed:",
          axios.isAxiosError(error)
            ? error.message
            : "unknown error",
        );
      }

      if (axios.isAxiosError<PurchaseErrorResponse>(error)) {
        const message = error.response?.data?.message;

        fail(
          Array.isArray(message)
            ? message.join("\n")
            : typeof message === "string"
              ? message
              : error.code === "ERR_NETWORK"
                ? "Unable to connect. Check your internet connection."
                : "Something went wrong. Please try again.",
        );
      } else {
        fail("An unexpected error occurred. Please try again.");
      }

      setIsSubmitting(false);
    }
  };

  const handleKey = (item: KeypadItem) => {
    if (isSubmitting || item === "empty") return;

    if (item === "delete") {
      setErrorMessage("");
      setPin((previous) => previous.slice(0, -1));
      return;
    }

    if (pin.length >= PIN_LENGTH) return;

    const next = pin + String(item);

    setErrorMessage("");
    setPin(next);

    if (next.length === PIN_LENGTH) {
      void submit(next);
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      <View
        pointerEvents="none"
        style={[
          styles.blob,
          { backgroundColor: network.bg },
        ]}
      />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          
          <View style={styles.topBar}>
            <Pressable
              onPress={() => router.back()}
              disabled={isSubmitting}
              accessibilityRole="button"
              accessibilityLabel="Back"
              style={[
                styles.backButton,
                {
                  backgroundColor: colors.backgroundElement,
                  borderColor: colors.backgroundSelected,
                  opacity: isSubmitting ? 0.4 : 1,
                },
              ]}
            >
              <Ionicons
                name="arrow-back"
                size={20}
                color={colors.text}
              />
            </Pressable>

            <Text
              style={[styles.topTitle, { color: colors.text }]}
            >
              Confirm purchase
            </Text>

            <View style={styles.topSpacer} />
          </View>

          <PurchaseSummary
            network={network}
            productTitle={productTitle}
            productDetail={productDetail}
            amount={amount}
            phone={phone}
            colors={colors}
          />

          <View style={styles.pinSection}>
            <Text
              style={[styles.pinPrompt, { color: colors.text }]}
            >
              Enter your PIN to confirm
            </Text>

            <Animated.View
              style={[styles.pinDisplay, shakeStyle]}
            >
              {Array.from(
                { length: PIN_LENGTH },
                (_, index) => (
                  <PinDot
                    key={index}
                    filled={index < pin.length}
                    colors={colors}
                  />
                ),
              )}
            </Animated.View>

            <View style={styles.statusLine}>
              {isSubmitting ? (
                <View style={styles.processing}>
                  <ActivityIndicator
                    size="small"
                    color={colors.textSecondary}
                  />

                  <Text
                    style={[
                      styles.statusText,
                      { color: colors.textSecondary },
                    ]}
                  >
                    Processing your purchase...
                  </Text>
                </View>
              ) : errorMessage ? (
                <Text
                  accessibilityLiveRegion="polite"
                  style={[
                    styles.statusText,
                    { color: errorColor },
                  ]}
                >
                  {errorMessage}
                </Text>
              ) : null}
            </View>
          </View>

          
          <PinKeypad
            size={keySize}
            pinLength={PIN_LENGTH}
            pin={pin}
            isSubmitting={isSubmitting}
            colors={colors}
            onPress={handleKey}
          />

          <Pressable
            hitSlop={12}
            disabled={isSubmitting}
            accessibilityRole="button"
            onPress={() => {
              // Connect your forgot-PIN flow here later.
            }}
            style={styles.forgotButton}
          >
            <Text
              style={[styles.forgotText, { color: colors.text }]}
            >
              Forgot PIN?
            </Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}