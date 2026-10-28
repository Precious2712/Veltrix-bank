
import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const PIN_LENGTH = 4;
const KEY_SIZE = 76;
const KEY_GAP = 20;

const COLORS = {
  background: "#F4F3FF",
  white: "#FFFFFF",
  ink: "#202044",
  muted: "#777895",
  border: "#C9C9F5",
  indigo: ["#7778FF", "#5145D9"] as const,
  accent: "#6258ED",
  blob: "rgba(123, 115, 255, 0.14)",
};

type KeyType = number | "delete" | null;

const ROWS: KeyType[][] = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  [null, 0, "delete"],
];

// Animated PIN dot
function Dot({ filled }: { filled: boolean }) {
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
        styles.dot,
        filled && styles.dotFilled,
        animatedStyle,
      ]}
    />
  );
}

// Animated keypad key
function Key({
  value,
  onPress,
  disabled,
}: {
  value: KeyType;
  onPress: (value: KeyType) => void;
  disabled: boolean;
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (value === null) {
    return <View style={styles.keySize} />;
  }

  const isDelete = value === "delete";

  return (
    <Animated.View style={[styles.keySize, animatedStyle]}>
      <Pressable
        disabled={disabled}
        onPress={() => onPress(value)}
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
            : `Digit ${value}`
        }
        style={({ pressed }) => [
          styles.key,
          {
            borderColor: COLORS.border,
            backgroundColor: pressed
              ? "rgba(98, 88, 237, 0.09)"
              : "rgba(255, 255, 255, 0.20)",
            opacity: disabled ? 0.45 : 1,
          },
        ]}
      >
        {isDelete ? (
          <Ionicons
            name="backspace-outline"
            size={25}
            color={COLORS.muted}
          />
        ) : (
          <Text style={styles.keyText}>{value}</Text>
        )}
      </Pressable>
    </Animated.View>
  );
}

export default function SigninScreen() {
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

  // IMPORTANT:
  // Replace this placeholder with your real authentication API.
  // It deliberately returns false instead of accepting every PIN.
  const verifyPin = useCallback(
    async (_enteredPin: string): Promise<boolean> => {
      // TODO: Verify the PIN securely with your authentication service.
      return false;
    },
    []
  );

  // Automatically verify when the fourth digit is entered.
  useEffect(() => {
    if (pin.length !== PIN_LENGTH) return;

    let active = true;

    const verify = async () => {
      setIsVerifying(true);

      try {
        const isValid = await verifyPin(pin);

        if (!active) return;

        if (isValid) {
          // TODO: Navigate to the authenticated home screen.
          // Example: router.replace("/(tabs)");
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

  const handleKey = (value: KeyType) => {
    if (isVerifying) return;

    if (value === null) return;

    if (value === "delete") {
      setPin((previous) => previous.slice(0, -1));
      return;
    }

    setPin((previous) =>
      previous.length < PIN_LENGTH
        ? previous + String(value)
        : previous
    );
  };

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={["#EEF0FF", "#FFFFFF", "#F4F3FF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Decorative background shapes */}
      <View style={styles.topBlob} />
      <View style={styles.bottomBlob} />

      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <LinearGradient
            colors={[...COLORS.indigo]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.mark}
          >
            <Text style={styles.markText}>V</Text>
          </LinearGradient>

          <Text style={styles.title}>Welcome back</Text>

          <Text style={styles.subtitle}>
            Enter your PIN to open Veltrix
          </Text>
        </View>

        <Animated.View style={[styles.dots, shakeStyle]}>
          {Array.from(
            { length: PIN_LENGTH },
            (_, index) => (
              <Dot
                key={index}
                filled={index < pin.length}
              />
            )
          )}
        </Animated.View>

        <View style={styles.keypad}>
          {ROWS.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
              {row.map((value, columnIndex) => (
                <Key
                  key={`${rowIndex}-${columnIndex}`}
                  value={value}
                  onPress={handleKey}
                  disabled={
                    isVerifying ||
                    (typeof value === "number" &&
                      pin.length >= PIN_LENGTH)
                  }
                />
              ))}
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Pressable
            hitSlop={12}
            accessibilityRole="button"
            onPress={() => {
              // TODO: Navigate to your forgot-PIN flow.
            }}
          >
            <Text style={styles.forgotText}>
              Forgot PIN?
            </Text>
          </Pressable>

          {isVerifying && (
            <Text style={styles.verifyingText}>
              Verifying PIN...
            </Text>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

const KEYPAD_WIDTH =
  3 * KEY_SIZE + 2 * KEY_GAP;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
    overflow: "hidden",
  },

  topBlob: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    top: -100,
    right: -100,
    backgroundColor: COLORS.blob,
  },

  bottomBlob: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    bottom: -130,
    left: -100,
    backgroundColor: COLORS.blob,
  },

  safe: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 20,
  },

  header: {
    alignItems: "center",
    paddingHorizontal: 12,
  },

  mark: {
    width: 60,
    height: 60,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },

  markText: {
    color: COLORS.white,
    fontSize: 28,
    fontWeight: "800",
  },

  title: {
    color: COLORS.ink,
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
  },

  subtitle: {
    color: COLORS.muted,
    fontSize: 15,
    marginTop: 8,
    textAlign: "center",
  },

  dots: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    height: 28,
  },

  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: COLORS.border,
    backgroundColor: "transparent",
  },

  dotFilled: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },

  keypad: {
    width: KEYPAD_WIDTH,
    maxWidth: "100%",
    gap: 16,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: KEY_GAP,
  },

  keySize: {
    width: KEY_SIZE,
    height: KEY_SIZE,
    borderRadius: KEY_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
  },

  key: {
    width: "100%",
    height: "100%",
    borderRadius: KEY_SIZE / 2,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },

  keyText: {
    color: COLORS.ink,
    fontSize: 27,
    fontWeight: "600",
  },

  footer: {
    alignItems: "center",
    minHeight: 44,
    justifyContent: "center",
    gap: 8,
  },

  forgotText: {
    color: COLORS.accent,
    fontSize: 15,
    fontWeight: "600",
  },

  verifyingText: {
    color: COLORS.muted,
    fontSize: 12,
  },
});
