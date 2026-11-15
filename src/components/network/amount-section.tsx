import { useState } from "react";

import {
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
    useWindowDimensions,
} from "react-native";

import Animated, {
    FadeInDown,
} from "react-native-reanimated";

import type { AppColors } from "@/constants/theme";

type Props = {
    amountDigits: string;
    onAmountChange: (value: string) => void;
    colors: AppColors;
    accent: string;
    errorColor: string;
    minAmount: number;
    maxAmount: number;
    quickAmounts: number[];
};

const digitsOnly = (value: string) =>
    value.replace(/\D/g, "");

const naira = (value: number) =>
    `₦${value.toLocaleString("en-NG")}`;

export function AmountSection({
    amountDigits,
    onAmountChange,
    colors,
    accent,
    errorColor,
    minAmount,
    maxAmount,
    quickAmounts,
}: Props) {
    const [focused, setFocused] = useState(false);

    const { width } = useWindowDimensions();

    const chipWidth = (width - 40 - 16) / 3;

    const amount = amountDigits ? Number(amountDigits) : 0;

    const amountTooLow =
        amountDigits !== "" && amount < minAmount;

    const amountTooHigh = amount > maxAmount;

    const hasError = amountTooLow || amountTooHigh;

    return (
        <Animated.View
            entering={FadeInDown.delay(80).springify()}
            style={styles.section}
        >
            <View
                style={[
                    styles.amountCard,
                    {
                        backgroundColor: colors.backgroundElement,
                        borderColor: hasError
                            ? errorColor
                            : focused
                                ? accent
                                : colors.backgroundSelected,
                    },
                ]}
            >
                <Text
                    style={[
                        styles.label,
                        { color: colors.textSecondary },
                    ]}
                >
                    Type your own amount
                </Text>

                <View style={styles.amountRow}>
                    <Text
                        style={[
                            styles.currency,
                            { color: colors.textSecondary },
                        ]}
                    >
                        ₦
                    </Text>

                    <TextInput
                        value={
                            amountDigits
                                ? amount.toLocaleString("en-NG")
                                : ""
                        }
                        onChangeText={(text) =>
                            onAmountChange(digitsOnly(text).slice(0, 6))
                        }
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                        placeholder="0"
                        placeholderTextColor={colors.textSecondary}
                        keyboardType="number-pad"
                        accessibilityLabel="Amount in naira"
                        style={[
                            styles.amountInput,
                            { color: colors.text },
                        ]}
                    />
                </View>

                <Text
                    style={[
                        styles.helper,
                        {
                            color: hasError
                                ? errorColor
                                : colors.textSecondary,
                        },
                    ]}
                >
                    Min {naira(minAmount)} · Max {naira(maxAmount)}
                </Text>
            </View>

            <Text
                style={[
                    styles.orText,
                    { color: colors.textSecondary },
                ]}
            >
                or pick a quick amount
            </Text>

            <View style={styles.quickGrid}>
                {quickAmounts.map((value) => {
                    const selected = amount === value;

                    return (
                        <Pressable
                            key={value}
                            onPress={() => onAmountChange(String(value))}
                            accessibilityRole="button"
                            accessibilityState={{ selected }}
                            style={[
                                styles.quickChip,
                                {
                                    width: chipWidth,
                                    backgroundColor: selected
                                        ? colors.text
                                        : colors.backgroundElement,
                                    borderColor: selected
                                        ? colors.text
                                        : colors.backgroundSelected,
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.quickChipText,
                                    {
                                        color: selected
                                            ? colors.background
                                            : colors.text,
                                        fontWeight: selected ? "800" : "700",
                                    },
                                ]}
                            >
                                {naira(value)}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    section: {
        gap: 8,
    },
    label: {
        fontSize: 13,
        fontWeight: "700",
    },
    amountCard: {
        padding: 17,
        borderRadius: 24,
        borderWidth: 2,
        alignItems: "center",
        gap: 4,
    },
    amountRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
    },
    currency: {
        fontSize: 30,
        fontWeight: "700",
    },
    amountInput: {
        width: 170,
        height: 58,
        padding: 0,
        fontSize: 46,
        fontWeight: "800",
        letterSpacing: -0.5,
        textAlign: "center",
    },
    helper: {
        fontSize: 12,
        fontWeight: "600",
    },
    orText: {
        textAlign: "center",
        fontSize: 12,
        fontWeight: "700",
        marginTop: 4,
    },
    quickGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    quickChip: {
        height: 44,
        borderRadius: 14,
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    quickChipText: {
        fontSize: 14,
    },
});