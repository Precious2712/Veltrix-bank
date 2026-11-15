
import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import {
    Pressable,
    StyleSheet,
    Text,
    View,
    useColorScheme,
} from "react-native";

import { DataPlan } from "../data/data-bundle-plans";
import { naira } from "../data/data-utils";

type ThemeColors = {
  [Key in keyof typeof Colors.light]: string;
};

type DataPlanCardProps = {
  plan: DataPlan;
  selected: boolean;
  accent: string;
  onPress: () => void;
};

export function DataPlanCard({
  plan,
  selected,
  accent,
  onPress,
}: DataPlanCardProps) {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  const colors: ThemeColors = Colors[isDark ? "dark" : "light"];

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={`${plan.size}, valid for ${plan.validity}, ${naira(plan.price)}`}
      style={[
        styles.planCard,
        {
          backgroundColor: selected
            ? isDark
              ? "rgba(156,150,255,0.14)"
              : "#F1F0FF"
            : colors.backgroundElement,

          borderColor: selected
            ? accent
            : colors.backgroundSelected,

          borderWidth: selected ? 2 : 1,
          paddingHorizontal: selected ? 15 : 16,
        },
      ]}
    >
      <View style={styles.planInfo}>
        <View style={styles.planTitleRow}>
          <Text style={[styles.planSize, { color: colors.text }]}>
            {plan.size}
          </Text>

          {plan.popular && (
            <View style={styles.popularBadge}>
              <Text style={styles.popularText}>
                Popular
              </Text>
            </View>
          )}
        </View>

        <Text
          style={[
            styles.planValidity,
            { color: colors.textSecondary },
          ]}
        >
          Valid for {plan.validity}
        </Text>
      </View>

      <Text style={[styles.planPrice, { color: colors.text }]}>
        {naira(plan.price)}
      </Text>

      <View
        style={[
          styles.radio,
          selected
            ? {
                backgroundColor: accent,
                borderColor: accent,
              }
            : {
                borderColor: colors.backgroundSelected,
              },
        ]}
      >
        {selected && (
          <Ionicons
            name="checkmark"
            size={14}
            color="#FFFFFF"
          />
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  planCard: {
    minHeight: 76,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderRadius: 20,
  },

  planInfo: {
    flex: 1,
    gap: 2,
  },

  planTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },

  planSize: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: "800",
  },

  popularBadge: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: "#FFF1BF",
  },

  popularText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#12142B",
  },

  planValidity: {
    fontSize: 13,
    fontWeight: "600",
  },

  planPrice: {
    fontSize: 16,
    fontWeight: "800",
  },

  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
});
