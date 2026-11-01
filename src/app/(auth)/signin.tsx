
import { useCallback, useState } from "react";

import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  useWindowDimensions,
  View,
} from "react-native";

import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import PinDot from "@/components/signin-comp.tsx/PinDot";

import KeypadButton, {
  type KeypadItem,
} from "@/components/signin-comp.tsx/keyPadButton";

import { useAuth } from "@/useContext/useContext";

const PIN_LENGTH = 7;
const KEY_GAP = 16;

const BUTTONS: KeypadItem[] = [
  1, 2, 3,
  4, 5, 6,
  7, 8, 9,
  "empty", 0, "delete",
];

export default function SigninScreen() {
  const scheme = useColorScheme();

  const colors = Colors[
    scheme === "dark" ? "dark" : "light"
  ];

  const { height } = useWindowDimensions();

  const keySize = height < 720 ? 60 : 72;

  
  const { signIn, isSigningIn, veltrixId } = useAuth();

  const [pin, setPin] = useState("");

  const shake = useSharedValue(0);

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shake.value }],
  }));

  
  const fail = useCallback(
    (message: string) => {
      shake.value = withSequence(
        withTiming(-9, { duration: 50 }),
        withTiming(9, { duration: 80 }),
        withTiming(-7, { duration: 80 }),
        withTiming(0, { duration: 50 })
      );

      setPin("");

      Alert.alert("Sign in failed", message);
    },
    [shake]
  );

  
  const handlePress = useCallback(
    (item: KeypadItem) => {
      if (isSigningIn || item === "empty") {
        return;
      }

      Keyboard.dismiss();

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
    [isSigningIn]
  );

  
  const canSubmit =
    pin.length === PIN_LENGTH &&
    Boolean(veltrixId?.trim());

 
  const handleSignIn = async () => {
    const formattedId = veltrixId?.trim() ?? "";

    if (!formattedId) {
      Alert.alert(
        "Veltrix ID required",
        "Your Veltrix ID is unavailable. Please create an account or restore your account details."
      );

      return;
    }

    if (pin.length !== PIN_LENGTH) {
      Alert.alert(
        "Incomplete PIN",
        `Please enter your ${PIN_LENGTH}-digit PIN.`
      );

      return;
    }

    if (isSigningIn) {
      return;
    }

    try {
      await signIn(formattedId, pin);

      router.replace("/home-screen");
    } catch (error) {
      if (__DEV__) {
        console.warn(
          "Sign in failed:",
          axios.isAxiosError(error)
            ? error.message
            : "unknown error"
        );
      }

      if (
        axios.isAxiosError<{
          message?: string | string[];
        }>(error)
      ) {
        const message = error.response?.data?.message;

        fail(
          Array.isArray(message)
            ? message.join("\n")
            : typeof message === "string"
              ? message
              : error.code === "ERR_NETWORK"
                ? "Unable to connect to Veltrix. Check your internet connection and API address."
                : "Unable to sign in. Please try again."
        );
      } else {
        fail(
          "An unexpected error occurred. Please try again."
        );
      }
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={
            Platform.OS === "ios"
              ? "padding"
              : undefined
          }
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            
            <View style={styles.header}>
              <View
                style={[
                  styles.logoContainer,
                  {
                    backgroundColor:
                      colors.backgroundElement,
                  },
                ]}
              >
                <Ionicons
                  name="shield-checkmark-outline"
                  size={28}
                  color={colors.text}
                />
              </View>

              <Text
                style={[
                  styles.title,
                  { color: colors.text },
                ]}
              >
                Sign in to Veltrix
              </Text>

              <Text
                style={[
                  styles.subtitle,
                  {
                    color: colors.textSecondary,
                  },
                ]}
              >
                Enter your account details to continue
              </Text>
            </View>

            
            <View style={styles.formSection}>
              <Text
                style={[
                  styles.inputLabel,
                  { color: colors.text },
                ]}
              >
                Veltrix ID
              </Text>

              
              <View
                style={[
                  styles.inputContainer,
                  {
                    backgroundColor:
                      colors.backgroundElement,
                    borderColor:
                      colors.backgroundSelected,
                  },
                ]}
              >
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={colors.textSecondary}
                />

                <TextInput
                  value={veltrixId ?? ""}
                  editable={false}
                  placeholder="Your Veltrix ID"
                  placeholderTextColor={
                    colors.textSecondary
                  }
                  autoCapitalize="characters"
                  autoCorrect={false}
                  selectTextOnFocus={false}
                  style={[
                    styles.idInput,
                    { color: colors.text },
                  ]}
                />
              </View>

              
              <Text
                style={[
                  styles.inputLabel,
                  styles.pinLabel,
                  { color: colors.text },
                ]}
              >
                {PIN_LENGTH}-digit PIN
              </Text>

              
              <Animated.View
                style={[
                  styles.pinDisplay,
                  shakeStyle,
                ]}
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
            </View>

            
            <View style={styles.keypadContainer}>
              <View
                style={[
                  styles.keypad,
                  {
                    width:
                      keySize * 3 +
                      KEY_GAP * 2,
                  },
                ]}
              >
                {BUTTONS.map((item, index) => (
                  <KeypadButton
                    key={`${item}-${index}`}
                    item={item}
                    size={keySize}
                    onPress={handlePress}
                    colors={colors}
                    disabled={
                      isSigningIn ||
                      (
                        typeof item === "number" &&
                        pin.length >= PIN_LENGTH
                      )
                    }
                  />
                ))}
              </View>
            </View>
          </ScrollView>

          
          <View style={styles.footer}>
            <Pressable
              onPress={handleSignIn}
              disabled={isSigningIn || !canSubmit}
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.signInButton,
                {
                  backgroundColor: canSubmit
                    ? colors.text
                    : colors.backgroundSelected,
                  opacity:
                    pressed || isSigningIn
                      ? 0.75
                      : 1,
                },
              ]}
            >
              <Text
                style={[
                  styles.signInText,
                  {
                    color: canSubmit
                      ? colors.background
                      : colors.textSecondary,
                  },
                ]}
              >
                {isSigningIn
                  ? "Authenticating..."
                  : "Sign In"}
              </Text>
            </Pressable>

            <Pressable
              hitSlop={12}
              accessibilityRole="button"
              onPress={() => {
                // Connect your forgot-PIN flow here.
              }}
            >
              <Text
                style={[
                  styles.forgotText,
                  { color: colors.text },
                ]}
              >
                Forgot PIN?
              </Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
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
    paddingBottom: 12,
  },

  keyboardView: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: "space-between",
    gap: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },

  header: {
    alignItems: "center",
  },

  logoContainer: {
    width: 54,
    height: 54,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },

  title: {
    fontSize: 27,
    fontWeight: "700",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 14,
    textAlign: "center",
  },

  formSection: {
    width: "100%",
  },

  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
  },

  pinLabel: {
    marginTop: 22,
  },

  inputContainer: {
    height: 54,
    borderRadius: 15,
    borderWidth: 1.5,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  idInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
    height: "100%",
  },

  pinDisplay: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 17,
    height: 28,
  },

  keypadContainer: {
    width: "100%",
    alignItems: "center",
  },

  keypad: {
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: KEY_GAP,
    rowGap: 12,
  },

  footer: {
    alignItems: "center",
    gap: 14,
    paddingTop: 8,
  },

  signInButton: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 17,
    borderRadius: 16,
  },

  signInText: {
    fontSize: 16,
    fontWeight: "700",
  },

  forgotText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
