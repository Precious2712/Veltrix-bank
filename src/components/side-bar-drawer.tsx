
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/useContext/useContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { NavItem, SideNavProps } from "./data/sidenav-props";

import { RenderNavItem } from "./signin-comp.tsx/render-nav-item";


export function SideNav({
    visible,
    onClose,
    backgroundColor,
    textColor,
    hasProfile,
    userName = "Welcome to Veltrix",
    veltrixId,
    accentColor = "#4A3DE0",
    mutedTextColor = "#888888",
    surfaceColor = "rgba(128,128,128,0.08)",
    borderColor = "rgba(128,128,128,0.15)",
}: SideNavProps) {
    const router = useRouter();

    const { signOut, isSigningOut } = useAuth();

    if (!visible) return null;

    const profileItem: NavItem = hasProfile
        ? {
            label: "My Profile",
            icon: "person-circle-outline",
            route: "/(setting)/profile",
        }
        : {
            label: "Create Profile",
            icon: "person-add-outline",
            route: "/(setting)/create-profile",
        };

    const accountItems: NavItem[] = [
        profileItem,
        {
            label: "Create PIN",
            icon: "keypad-outline",
            route: "/(setting)/create-pin",
        },
    ];

    const activityItems: NavItem[] = [
        {
            label: "Transaction History",
            icon: "receipt-outline",
            route: "/(setting)/transactions",
        },
    ];

    const handleLogout = async () => {
        await signOut();

        router.replace("/(auth)/signin");
    };

    const initials = userName
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join("");



    return (
        <SafeAreaView
            style={[
                styles.overlay,
                { backgroundColor },
            ]}
            edges={["top", "bottom"]}
        >
            <ThemedView
                style={[
                    styles.container,
                    { backgroundColor },
                ]}
            >
                <View style={styles.header}>
                    <View style={styles.brandContainer}>
                        <Text
                            style={[
                                styles.brandName,
                                { color: textColor },
                            ]}
                        >
                            Veltrix
                        </Text>

                        <Text
                            style={[
                                styles.brandSubtitle,
                                { color: mutedTextColor },
                            ]}
                        >
                            Your digital experience
                        </Text>
                    </View>

                    <Pressable
                        onPress={onClose}
                        hitSlop={12}
                        accessibilityRole="button"
                        accessibilityLabel="Close navigation"
                        style={({ pressed }) => [
                            styles.closeButton,
                            {
                                backgroundColor: pressed
                                    ? surfaceColor
                                    : "transparent",
                            },
                        ]}
                    >
                        <Ionicons
                            name="close"
                            size={23}
                            color={textColor}
                        />
                    </Pressable>
                </View>

                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    <View
                        style={[
                            styles.profileCard,
                            {
                                backgroundColor: surfaceColor,
                                borderColor,
                            },
                        ]}
                    >
                        <View
                            style={[
                                styles.avatar,
                                { backgroundColor: accentColor },
                            ]}
                        >
                            <Text style={styles.avatarText}>
                                {initials || "V"}
                            </Text>
                        </View>

                        <View style={styles.profileInfo}>
                            <Text
                                numberOfLines={1}
                                style={[
                                    styles.profileName,
                                    { color: textColor },
                                ]}
                            >
                                {userName}
                            </Text>

                            <Text
                                numberOfLines={1}
                                style={[
                                    styles.profileId,
                                    { color: mutedTextColor },
                                ]}
                            >
                                {hasProfile
                                    ? veltrixId || "Veltrix account"
                                    : "Complete your profile"}
                            </Text>
                        </View>

                        <Ionicons
                            name="shield-checkmark-outline"
                            size={20}
                            color={accentColor}
                        />
                    </View>

                    <View style={styles.section}>
                        <Text
                            style={[
                                styles.sectionTitle,
                                { color: mutedTextColor },
                            ]}
                        >
                            ACCOUNT
                        </Text>

                        {accountItems.map((item) => (
                            <RenderNavItem
                                key={item.label}
                                item={item}
                                onClose={onClose}
                                textColor={textColor}
                                mutedTextColor={mutedTextColor}
                                surfaceColor={surfaceColor}
                                borderColor={borderColor}
                            />
                        ))}
                    </View>

                    <View style={styles.section}>
                        <Text
                            style={[
                                styles.sectionTitle,
                                { color: mutedTextColor },
                            ]}
                        >
                            ACTIVITY
                        </Text>

                        {activityItems.map((item) => (
                            <RenderNavItem
                                key={item.label}
                                item={item}
                                onClose={onClose}
                                textColor={textColor}
                                mutedTextColor={mutedTextColor}
                                surfaceColor={surfaceColor}
                                borderColor={borderColor}
                            />
                        ))}
                    </View>
                </ScrollView>

                <View
                    style={[
                        styles.footer,
                        { borderTopColor: borderColor },
                    ]}
                >
                    <Pressable
                        onPress={handleLogout}
                        accessibilityRole="button"
                        style={({ pressed }) => [
                            styles.logout,
                            {
                                backgroundColor: pressed
                                    ? "rgba(229,72,77,0.10)"
                                    : "transparent",
                            },
                        ]}
                    >
                        <View style={styles.logoutIcon}>
                            <Ionicons
                                name="log-out-outline"
                                size={21}
                                color="#E5484D"
                            />
                        </View>

                        <Text style={styles.logoutLabel}>
                            Log out
                        </Text>

                        <Ionicons
                            name="chevron-forward"
                            size={18}
                            color="#E5484D"
                            style={styles.logoutChevron}
                        />
                    </Pressable>

                    <Text
                        style={[
                            styles.version,
                            { color: mutedTextColor },
                        ]}
                    >
                        VELTRIX • YOUR DIGITAL EXPERIENCE
                    </Text>
                </View>
            </ThemedView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFill,
        zIndex: 999,
        elevation: 10,
    },

    container: {
        flex: 1,
        paddingHorizontal: 22,
        paddingTop: 10,
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 28,
    },

    brandContainer: {
        gap: 3,
    },

    brandName: {
        fontSize: 25,
        fontWeight: "800",
        letterSpacing: -0.8,
    },

    brandSubtitle: {
        fontSize: 12,
        fontWeight: "500",
    },

    closeButton: {
        width: 42,
        height: 42,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
    },

    scrollView: {
        flex: 1,
    },

    scrollContent: {
        paddingBottom: 20,
    },

    profileCard: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        borderRadius: 18,
        borderWidth: 1,
        marginBottom: 32,
        gap: 13,
    },

    avatar: {
        width: 48,
        height: 48,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
    },

    avatarText: {
        color: "#FFFFFF",
        fontSize: 17,
        fontWeight: "800",
    },

    profileInfo: {
        flex: 1,
        gap: 5,
    },

    profileName: {
        fontSize: 15,
        fontWeight: "700",
    },

    profileId: {
        fontSize: 11,
        fontWeight: "500",
    },

    section: {
        marginBottom: 28,
    },

    sectionTitle: {
        fontSize: 10,
        fontWeight: "800",
        letterSpacing: 1.5,
        marginBottom: 12,
        marginLeft: 5,
    },

    menuGroup: {
        gap: 5,
    },

    item: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 11,
        paddingHorizontal: 9,
        borderRadius: 14,
        borderWidth: 1,
        gap: 13,
    },

    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },

    itemLabel: {
        flex: 1,
        fontSize: 14,
        fontWeight: "600",
    },

    footer: {
        borderTopWidth: 1,
        paddingTop: 15,
        paddingBottom: 8,
    },

    logout: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 9,
        borderRadius: 14,
        gap: 13,
    },

    logoutIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: "rgba(229,72,77,0.09)",
        alignItems: "center",
        justifyContent: "center",
    },

    logoutLabel: {
        flex: 1,
        fontSize: 14,
        fontWeight: "700",
        color: "#E5484D",
    },

    logoutChevron: {
        opacity: 0.7,
    },

    version: {
        textAlign: "center",
        fontSize: 9,
        fontWeight: "700",
        letterSpacing: 1.2,
        marginTop: 12,
    },
});
