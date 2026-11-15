import { StyleSheet, Text, View } from "react-native";

import Animated, {
    FadeInDown,
} from "react-native-reanimated";

import type { AppColors } from "@/constants/theme";

type Props = {
  amount: number;
  walletBalance: number;
  colors: AppColors;
  errorColor: string;
};

const naira2 = (value: number) =>
  `₦${value.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export function PurchaseSummary({
  amount,
  walletBalance,
  colors,
  errorColor,
}: Props) {
  const insufficient = amount > walletBalance;

  return (
    <Animated.View
      entering={FadeInDown.delay(160).springify()}
      style={[
        styles.summary,
        {
          backgroundColor: colors.backgroundElement,
          borderColor: colors.backgroundSelected,
        },
      ]}
    >
      <View style={styles.summaryRow}>
        <Text
          style={[
            styles.summaryLabel,
            { color: colors.textSecondary },
          ]}
        >
          Pay from
        </Text>

        <Text
          style={[
            styles.summaryValue,
            {
              color: insufficient
                ? errorColor
                : colors.text,
            },
          ]}
        >
          Wallet · {naira2(walletBalance)}
        </Text>
      </View>

      <View style={styles.summaryRow}>
        <Text
          style={[
            styles.summaryLabel,
            { color: colors.textSecondary },
          ]}
        >
          Airtime
        </Text>

        <Text
          style={[
            styles.summaryValue,
            { color: colors.text },
          ]}
        >
          {naira2(amount)}
        </Text>
      </View>

      <View
        style={[
          styles.divider,
          { backgroundColor: colors.backgroundSelected },
        ]}
      />

      <View style={styles.summaryRow}>
        <Text
          style={[
            styles.totalLabel,
            { color: colors.text },
          ]}
        >
          Total
        </Text>

        <Text
          style={[
            styles.totalValue,
            { color: colors.text },
          ]}
        >
          {naira2(amount)}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  summary: {
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 20,
    borderWidth: 1,
    gap: 10,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "700",
  },
  divider: {
    height: 1,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: "700",
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "800",
  },
});