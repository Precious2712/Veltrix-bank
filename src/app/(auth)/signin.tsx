
import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";

import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const PIN_LENGTH = 4;
const KEY_SIZE = 72;
const KEY_GAP = 16;

type KeypadItem = number | "delete" | "empty";

type ThemeColors = (typeof Colors)[keyof typeof Colors];

const BUTTONS: KeypadItem[] = [
  1, 2, 3,
  4, 5, 6,
  7, 8, 9,
  "empty", 0, "delete",
];

function PinDot({
  filled,
  colors,
}: {
  filled: boolean;
  colors: ThemeColors;
}) {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = filled
      ? withSequence(
        withSpring(1.3),
        withSpring(1)
      )
      : withTiming(1);
  }, [filled, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.pinDot,
        {
          backgroundColor: filled
            ? colors.text
            : "transparent",
          borderColor: filled
            ? colors.text
            : colors.text + "50",
        },
        animatedStyle,
      ]}
    />
  );
}

function KeypadButton({
  item,
  onPress,
  disabled,
  colors,
}: {
  item: KeypadItem;
  onPress: (item: KeypadItem) => void;
  disabled: boolean;
  colors: ThemeColors;
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (item === "empty") {
    return <View style={styles.keyWrapper} />;
  }

  const isDelete = item === "delete";

  return (
    <View style={styles.keyWrapper}>
      <Animated.View style={[styles.keySize, animatedStyle]}>
        <Pressable
          onPress={() => onPress(item)}
          disabled={disabled}
          onPressIn={() => {
            scale.value = withSpring(0.92);
          }}
          onPressOut={() => {
            scale.value = withSpring(1);
          }}
          accessibilityRole="button"
          accessibilityLabel={
            isDelete
              ? "Delete last digit"
              : `Digit ${item}`
          }
          style={({ pressed }) => [
            styles.key,
            {
              borderColor: colors.backgroundElement,
              backgroundColor: pressed
                ? colors.backgroundElement
                : "transparent",
              opacity: disabled ? 0.45 : 1,
            },
          ]}
        >
          {isDelete ? (
            <Ionicons
              name="backspace-outline"
              size={25}
              color={colors.text}
            />
          ) : (
            <Text
              style={[
                styles.keyText,
                { color: colors.text },
              ]}
            >
              {item}
            </Text>
          )}
        </Pressable>
      </Animated.View>
    </View>
  );
}

export default function SigninScreen() {
  const scheme = useColorScheme();

  const colors =
    Colors[scheme === "dark" ? "dark" : "light"];

  const [pin, setPin] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const shake = useSharedValue(0);

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shake.value }],
  }));

  const fail = useCallback(() => {
    shake.value = withSequence(
      withTiming(-9, { duration: 50 }),
      withTiming(9, { duration: 80 }),
      withTiming(-7, { duration: 80 }),
      withTiming(0, { duration: 50 })
    );

    setPin("");
  }, [shake]);

  const verifyPin = useCallback(
    async (_enteredPin: string): Promise<boolean> => {
      return false;
    },
    []
  );

  useEffect(() => {
    if (pin.length !== PIN_LENGTH) return;

    let active = true;

    const verify = async () => {
      setIsVerifying(true);

      try {
        const isValid = await verifyPin(pin);

        if (!active) return;

        if (isValid) {
          router.replace("/home-screen");
        } else {
          fail();
        }
      } catch {
        if (active) {
          fail();
        }
      } finally {
        if (active) {
          setIsVerifying(false);
        }
      }
    };

    void verify();

    return () => {
      active = false;
    };
  }, [pin, verifyPin, fail]);

  const handlePress = useCallback(
    (item: KeypadItem) => {
      if (isVerifying) return;

      if (item === "empty") return;

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
    [isVerifying]
  );

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
            Welcome back
          </Text>

          <Text
            style={[
              styles.subtitle,
              { color: colors.textSecondary },
            ]}
          >
            Enter your PIN to open Veltrix
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
            Enter your 4-digit PIN
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
                  isVerifying ||
                  (typeof item === "number" &&
                    pin.length >= PIN_LENGTH)
                }
              />
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <Pressable
            hitSlop={12}
            accessibilityRole="button"
            onPress={() => {
              // TODO: Navigate to your forgot-PIN flow.
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

          {isVerifying && (
            <Text
              style={[
                styles.verifyingText,
                { color: colors.textSecondary },
              ]}
            >
              Verifying PIN...
            </Text>
          )}
        </View>
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

  pinDot: {
    width: 15,
    height: 15,
    borderRadius: 8,
    borderWidth: 1.5,
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

  keyWrapper: {
    width: KEY_SIZE,
    height: KEY_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },

  keySize: {
    width: KEY_SIZE,
    height: KEY_SIZE,
  },

  key: {
    flex: 1,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },

  keyText: {
    fontSize: 24,
    fontWeight: "500",
  },

  footer: {
    alignItems: "center",
    minHeight: 44,
    justifyContent: "center",
    gap: 8,
  },

  forgotText: {
    fontSize: 15,
    fontWeight: "600",
  },

  verifyingText: {
    fontSize: 12,
    opacity: 0.7,
  },
});
