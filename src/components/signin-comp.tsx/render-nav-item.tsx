
import { Ionicons } from "@expo/vector-icons";
import { useRouter, type Href } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import type { NavItem } from "../data/sidenav-props";

type RenderNavItemProps = {
    item: NavItem;
    onClose: () => void;
    textColor: string;
    mutedTextColor: string;
    surfaceColor: string;
    borderColor: string;
};

export function RenderNavItem({
    item,
    onClose,
    textColor,
    mutedTextColor,
    surfaceColor,
    borderColor,
}: RenderNavItemProps) {
    const router = useRouter();

    const go = (route: Href) => {
        onClose();
        router.push(route);
    };

    return (
        <Pressable
            onPress={() => go(item.route)}
            accessibilityRole="button"
            style={({ pressed }) => [
                styles.item,
                {
                    backgroundColor: pressed
                        ? surfaceColor
                        : "transparent",
                    borderColor: pressed
                        ? borderColor
                        : "transparent",
                },
            ]}
        >
            <View
                style={[
                    styles.iconContainer,
                    { backgroundColor: surfaceColor },
                ]}
            >
                <Ionicons
                    name={item.icon}
                    size={21}
                    color={textColor}
                />
            </View>

            <Text style={[styles.itemLabel, { color: textColor }]}>
                {item.label}
            </Text>

            <Ionicons
                name="chevron-forward"
                size={18}
                color={mutedTextColor}
            />
        </Pressable>
    );
}


const styles = StyleSheet.create({
    item: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 12,
        borderWidth: 1,
        marginBottom: 6,
    },
    iconContainer: {
        width: 38,
        height: 38,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    itemLabel: {
        flex: 1,
        fontSize: 14,
        fontWeight: "500",
    },
});