import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

import {
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import Animated, {
    FadeInDown,
} from "react-native-reanimated";

import type { AppColors } from "@/constants/theme";

type SavedNumber = {
    label: string;
    number: string;
};

type Props = {
    phone: string;
    onPhoneChange: (value: string) => void;
    colors: AppColors;
    accent: string;
    errorColor: string;
    savedNumbers: SavedNumber[];
};

const digitsOnly = (value: string) =>
    value.replace(/\D/g, "");

const formatPhone = (digits: string) =>
    [
        digits.slice(0, 4),
        digits.slice(4, 7),
        digits.slice(7, 11),
    ]
        .filter(Boolean)
        .join(" ");

export function PhoneNumberSection({
    phone,
    onPhoneChange,
    colors,
    accent,
    errorColor,
    savedNumbers,
}: Props) {
    const [focused, setFocused] = useState(false);
    const [touched, setTouched] = useState(false);

    const phoneValid = /^0\d{10}$/.test(phone);

    const showError =
        touched && phone.length > 0 && !phoneValid;

    return (
        <Animated.View
            entering={FadeInDown.springify()}
            style={styles.section}
        >
            <Text
                style={[
                    styles.label,
                    { color: colors.textSecondary },
                ]}
            >
                Phone number
            </Text>

            <View
                style={[
                    styles.phoneField,
                    {
                        backgroundColor: colors.backgroundElement,
                        borderColor: showError
                            ? errorColor
                            : focused
                                ? accent
                                : colors.backgroundSelected,
                    },
                ]}
            >
                <TextInput
                    value={formatPhone(phone)}
                    onChangeText={(text) =>
                        onPhoneChange(digitsOnly(text).slice(0, 11))
                    }
                    onFocus={() => setFocused(true)}
                    onBlur={() => {
                        setFocused(false);
                        setTouched(true);
                    }}
                    placeholder="0801 234 5678"
                    placeholderTextColor={colors.textSecondary}
                    keyboardType="phone-pad"
                    maxLength={13}
                    accessibilityLabel="Phone number"
                    style={[
                        styles.phoneInput,
                        { color: colors.text },
                    ]}
                />

                <Pressable
                    onPress={() => {
                        // Contact picker can be implemented here later.
                    }}
                    accessibilityRole="button"
                    accessibilityLabel="Pick from contacts"
                    style={[
                        styles.contactsButton,
                        { backgroundColor: colors.backgroundSelected },
                    ]}
                >
                    <Ionicons
                        name="person-outline"
                        size={20}
                        color={colors.text}
                    />
                </Pressable>
            </View>

            {showError && (
                <Text
                    style={[
                        styles.errorText,
                        { color: errorColor },
                    ]}
                >
                    Enter an 11-digit number starting with 0
                </Text>
            )}

            <View style={styles.savedRow}>
                {savedNumbers.map((saved) => {
                    const selected = phone === saved.number;

                    return (
                        <Pressable
                            key={saved.label}
                            onPress={() => onPhoneChange(saved.number)}
                            accessibilityRole="button"
                            accessibilityState={{ selected }}
                            style={[
                                styles.savedChip,
                                {
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
                                    styles.savedChipText,
                                    {
                                        color: selected
                                            ? colors.background
                                            : colors.text,
                                    },
                                ]}
                            >
                                {saved.label}
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
    phoneField: {
        height: 56,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingLeft: 16,
        paddingRight: 6,
        borderRadius: 16,
        borderWidth: 1.5,
    },
    phoneInput: {
        flex: 1,
        height: "100%",
        fontSize: 17,
        fontWeight: "700",
        letterSpacing: 0.3,
    },
    contactsButton: {
        width: 44,
        height: 44,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
    },
    errorText: {
        fontSize: 12,
        fontWeight: "600",
    },
    savedRow: {
        flexDirection: "row",
        gap: 8,
    },
    savedChip: {
        height: 36,
        paddingHorizontal: 14,
        borderRadius: 18,
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    savedChipText: {
        fontSize: 13,
        fontWeight: "700",
    },
});