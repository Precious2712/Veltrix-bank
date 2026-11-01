
import { useCallback, useState } from "react";

import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";

import axios from "axios";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

import KeypadButton, {
  type KeypadItem,
} from "@/components/keppadButton";

import PinDot from "@/components/pinDot";

import { Colors } from "@/constants/theme";
import { useAuth } from "@/useContext/useContext";

const PIN_LENGTH = 7;
const KEY_GAP = 16;

const BUTTONS: KeypadItem[] = [
  1, 2, 3,
  4, 5, 6,
  7, 8, 9,
  "empty", 0, "delete",
];

export default function CreatePinScreen() {
  const scheme = useColorScheme();

  const colors =
    Colors[scheme === "dark" ? "dark" : "light"];

  const [pin, setPin] = useState("");

  const { createAccount, isSubmitting } = useAuth();

  const shake = useSharedValue(0);

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shake.value }],
  }));

  // Handle keypad input
  const handlePress = useCallback(
    (item: KeypadItem) => {
      if (isSubmitting || item === "empty") return;

      if (item === "delete") {
        setPin((previousPin) =>
          previousPin.slice(0, -1)
        );
        return;
      }

      setPin((previousPin) =>
        previousPin.length < PIN_LENGTH
          ? previousPin + String(item)
          : previousPin
      );
    },
    [isSubmitting]
  );

  const handleSignIn = async () => {
    if (pin.length !== PIN_LENGTH || isSubmitting) {
      return;
    }

    try {
      const data = await createAccount(pin);

      console.log("Account created:", data);

      Alert.alert(
        "Account created successfully",
        `Your Veltrix ID is ${data.veltrixId}`,
        [
          {
            text: "Continue",
            onPress: () => {
              router.replace({
                pathname: "/(auth)/signin",
                params: {
                  veltrixId: data.veltrixId,
                },
              });
            },
          },
        ]
      );
    } catch (error) {
      console.error("Registration error:", error);

      if (axios.isAxiosError<{ message?: string | string[] }>(error)) {
        const message = error.response?.data?.message;

        Alert.alert(
          "Registration failed",
          Array.isArray(message)
            ? message.join("\n")
            : message ??
            (error.code === "ERR_NETWORK"
              ? "Unable to connect to the server. Check your API address and network."
              : "Something went wrong. Please try again.")
        );
      } else {
        Alert.alert(
          "Registration failed",
          "An unexpected error occurred."
        );
      }
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      <SafeAreaView style={styles.safeArea}>

        <View style={styles.header}>
          <Text
            style={[
              styles.title,
              { color: colors.text },
            ]}
          >
            Create your PIN
          </Text>

          <Text
            style={[
              styles.subtitle,
              { color: colors.textSecondary },
            ]}
          >
            Set up a secure PIN for your Veltrix account
          </Text>
        </View>

        
        <View style={styles.pinSection}>
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
              )
            )}
          </Animated.View>

          <Text
            style={[
              styles.hint,
              { color: colors.textSecondary },
            ]}
          >
            Enter your 7-digit PIN
          </Text>
        </View>

        
        <View style={styles.keypadContainer}>
          <View style={styles.keypad}>
            {BUTTONS.map((item, index) => (
              <KeypadButton
                key={`${item}-${index}`}
                item={item}
                onPress={handlePress}
                colors={colors}
                disabled={
                  isSubmitting ||
                  (typeof item === "number" &&
                    pin.length >= PIN_LENGTH)
                }
              />
            ))}
          </View>
        </View>

        
        <Pressable
          onPress={handleSignIn}
          disabled={
            pin.length !== PIN_LENGTH || isSubmitting
          }
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.signInButton,
            {
              backgroundColor:
                pin.length === PIN_LENGTH
                  ? colors.backgroundElement
                  : colors.backgroundSelected,
              opacity: pressed ? 0.8 : 1,
            },
          ]}
        >
          <Text style={styles.signInText}>
            {isSubmitting ? "Please wait..." : "Continue"}
          </Text>
        </Pressable>

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  safeArea: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "space-between",
    paddingBottom: 15,
  },

  header: {
    alignItems: "center",
    marginTop: 16,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 15,
    opacity: 0.7,
    textAlign: "center",
  },

  pinSection: {
    alignItems: "center",
    marginVertical: 20,
  },

  pinDisplay: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 22,
    marginBottom: 20,
  },

  hint: {
    fontSize: 14,
    opacity: 0.65,
  },

  keypadContainer: {
    width: "100%",
    maxWidth: 330,
    alignSelf: "center",
  },

  keypad: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    columnGap: KEY_GAP,
    rowGap: 14,
  },

  signInButton: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 17,
    borderRadius: 16,
    marginTop: 18,
    borderColor: "transparent",
  },

  signInText: {
    color: "#424242",
    fontSize: 16,
    fontWeight: "700",
  },
});
