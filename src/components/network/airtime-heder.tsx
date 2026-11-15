import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

import type { AppColors } from "@/constants/theme";
import { Network } from "../data/network";

type Props = {
    network: Network;
    colors: AppColors;
};

export function AirtimeHeader({ network, colors }: Props) {
    return (
        <View style={styles.container}>
            <Pressable
                onPress={() => router.back()}
                accessibilityRole="button"
                accessibilityLabel="Back"
                style={[
                    styles.backButton,
                    {
                        backgroundColor: colors.backgroundElement,
                        borderColor: colors.backgroundSelected,
                    },
                ]}
            >
                <Ionicons
                    name="arrow-back"
                    size={20}
                    color={colors.text}
                />
            </Pressable>

            <View style={styles.titleRow}>
                <View
                    style={[
                        styles.networkDot,
                        { backgroundColor: network.bg },
                    ]}
                />

                <Text style={[styles.title, { color: colors.text }]}>
                    {network.name} airtime
                </Text>
            </View>

            <View style={styles.spacer} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 44,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    titleRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    networkDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    title: {
        fontSize: 16,
        fontWeight: "800",
    },
    spacer: {
        width: 44,
    },
});