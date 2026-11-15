
import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRef } from "react";
import {
    Animated,
    Pressable,
    StyleSheet,
    Text,
    View,
    useColorScheme,
} from "react-native";

import { DataPlan } from "../data/data-bundle-plans";
import { naira, naira2 } from "../data/data-utils";

type ThemeColors = {
  [Key in keyof typeof Colors.light]: string;
};

type PurchaseFooterProps = {
  selectedPlan: DataPlan | null;
  phone: string;
  onContinue: () => void;
  accent: string;
};

export function PurchaseFooter({
  selectedPlan,
  phone,
  onContinue,
  accent,
}: PurchaseFooterProps) {
  const scheme = useColorScheme();
  const theme: ThemeColors =
    Colors[scheme === "dark" ? "dark" : "light"];

  const payScale = useRef(new Animated.Value(1)).current;

  const canContinue =
    selectedPlan !== null && /^0\d{10}$/.test(phone);

  const animateButton = (toValue: number) => {
    Animated.spring(payScale, {
      toValue,
      useNativeDriver: true,
      speed: 30,
      bounciness: 0,
    }).start();
  };

  const handleContinue = () => {
    if (!canContinue) return;
    onContinue();
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.background,
          borderTopColor: theme.backgroundElement,
        },
      ]}
    >
      <View style={styles.summary}>
        <View style={styles.summaryLeft}>
          <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>
            You are paying
          </Text>

          <Text style={[styles.summaryPrice, { color: theme.text }]}>
            {selectedPlan ? naira2(selectedPlan.price) : naira(0)}
          </Text>
        </View>

        {selectedPlan && (
          <View
            style={[
              styles.planBadge,
              { backgroundColor: theme.backgroundElement },
            ]}
          >
            <Text style={[styles.planBadgeText, { color: theme.text }]}>
              {selectedPlan.size}
            </Text>
          </View>
        )}
      </View>

      <Animated.View
        style={[
          styles.buttonWrapper,
          { transform: [{ scale: payScale }] },
        ]}
      >
        <Pressable
          onPress={handleContinue}
          onPressIn={() => animateButton(0.98)}
          onPressOut={() => animateButton(1)}
          disabled={!canContinue}
          style={[
            styles.button,
            {
              backgroundColor: canContinue ? accent : theme.backgroundElement,
            },
          ]}
        >
          <Text
            style={[
              styles.buttonText,
              { color: canContinue ? "#FFFFFF" : theme.textSecondary },
            ]}
          >
            Continue
          </Text>

          <Ionicons
            name="arrow-forward"
            size={19}
            color={canContinue ? "#FFFFFF" : theme.textSecondary}
          />
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  summary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  summaryLeft: {
    gap: 4,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
  summaryPrice: {
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  planBadge: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },
  planBadgeText: {
    fontSize: 12,
    fontWeight: "700",
  },
  buttonWrapper: {
    width: "100%",
  },
  button: {
    minHeight: 54,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "700",
  },
});
