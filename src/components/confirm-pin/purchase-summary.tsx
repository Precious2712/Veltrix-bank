import { Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { Network } from "../data/network";

import { styles } from "../data/confirm-pin-style";

type PurchaseSummaryProps = {
  network: Network;
  productTitle: string;
  productDetail: string;
  amount: number;
  phone: string;
  colors: {
    backgroundElement: string;
    backgroundSelected: string;
    text: string;
    textSecondary: string;
  };
};

const formatPhone = (digits: string) =>
  [
    digits.slice(0, 4),
    digits.slice(4, 7),
    digits.slice(7, 11),
  ]
    .filter(Boolean)
    .join(" ");

const naira = (value: number) =>
  `₦${value.toLocaleString("en-NG")}`;

export function PurchaseSummary({
  network,
  productTitle,
  productDetail,
  amount,
  phone,
  colors,
}: PurchaseSummaryProps) {
  return (
    <Animated.View
      entering={FadeInDown.springify()}
      style={[
        styles.summary,
        {
          backgroundColor: colors.backgroundElement,
          borderColor: colors.backgroundSelected,
        },
      ]}
    >
      <View style={styles.summaryTop}>
        <View
          style={[
            styles.networkBadge,
            { backgroundColor: network.bg },
          ]}
        >
          <Text
            style={[
              styles.networkBadgeText,
              { color: network.fg },
            ]}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.6}
          >
            {network.name}
          </Text>
        </View>

        <View style={styles.summaryText}>
          <Text
            style={[styles.productTitle, { color: colors.text }]}
          >
            {productTitle}
          </Text>

          <Text
            style={[
              styles.productDetail,
              { color: colors.textSecondary },
            ]}
          >
            {productDetail}
          </Text>
        </View>

        <Text style={[styles.amount, { color: colors.text }]}>
          {naira(amount)}
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
            styles.summaryLabel,
            { color: colors.textSecondary },
          ]}
        >
          Phone number
        </Text>

        <Text
          style={[styles.summaryValue, { color: colors.text }]}
        >
          {formatPhone(phone)}
        </Text>
      </View>

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
          style={[styles.summaryValue, { color: colors.text }]}
        >
          Wallet
        </Text>
      </View>
    </Animated.View>
  );
}