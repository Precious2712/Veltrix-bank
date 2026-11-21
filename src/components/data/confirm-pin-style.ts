import { Colors } from "@/constants/theme";
import { StyleSheet } from "react-native";

export type ThemeColors = (typeof Colors)[keyof typeof Colors];

export const KEY_GAP = 16;

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        overflow: "hidden",
    },

    blob: {
        position: "absolute",
        right: -80,
        top: -90,
        width: 260,
        height: 260,
        borderRadius: 130,
        opacity: 0.28,
    },

    safeArea: {
        flex: 1,
    },

    content: {
        flexGrow: 1,
        alignItems: "center",
        justifyContent: "space-between",
        gap: 20,
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 16,
    },

    topBar: {
        width: "100%",
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

    topTitle: {
        fontSize: 16,
        fontWeight: "800",
    },

    topSpacer: {
        width: 44,
    },

    summary: {
        width: "100%",
        padding: 16,
        borderRadius: 24,
        borderWidth: 1,
        gap: 12,
    },

    summaryTop: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },

    networkBadge: {
        width: 48,
        height: 48,
        borderRadius: 24,
        paddingHorizontal: 4,
        alignItems: "center",
        justifyContent: "center",
    },

    networkBadgeText: {
        fontSize: 14,
        fontWeight: "800",
    },

    summaryText: {
        flex: 1,
    },

    productTitle: {
        fontSize: 16,
        fontWeight: "800",
        textTransform: "capitalize",
    },

    productDetail: {
        fontSize: 13,
        fontWeight: "600",
    },

    amount: {
        fontSize: 22,
        fontWeight: "800",
    },

    divider: {
        height: 1,
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

    pinSection: {
        alignItems: "center",
        gap: 16,
    },

    pinPrompt: {
        fontSize: 16,
        fontWeight: "700",
    },

    pinDisplay: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 14,
        height: 24,
    },

    pinDot: {
        width: 14,
        height: 14,
        borderRadius: 7,
        borderWidth: 1.5,
    },

    statusLine: {
        minHeight: 20,
        alignItems: "center",
        justifyContent: "center",
    },

    processing: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },

    statusText: {
        fontSize: 13,
        fontWeight: "600",
        textAlign: "center",
    },

    keypad: {
        flexDirection: "row",
        flexWrap: "wrap",
        columnGap: KEY_GAP,
        rowGap: 12,
    },

    key: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },

    keyText: {
        fontSize: 26,
        fontWeight: "500",
    },

    forgotButton: {
        padding: 8,
    },

    forgotText: {
        fontSize: 14,
        fontWeight: "600",
    },
});