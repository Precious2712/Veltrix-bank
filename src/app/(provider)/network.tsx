
import { getNetwork, NETWORKS } from "@/components/data/network";
import ChoiceCard from "@/components/network/choose-type";
import { Colors } from "@/constants/theme";

import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    useColorScheme,
    View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

const ACCENT = "#4A3DE0";
const ACCENT_ON_DARK = "#9C96FF";

const AMOUNT_CHIPS = ["₦100", "₦200", "₦500", "₦1,000"];

const DATA_CHIPS = ["1 GB", "2 GB", "5 GB", "10 GB"];

export default function ChooseTypeScreen() {
    const scheme = useColorScheme();

    const isDark = scheme === "dark";

    const colors = Colors[isDark ? "dark" : "light"];

    const accent = isDark ? ACCENT_ON_DARK : ACCENT;

    const { network: networkParam } =
        useLocalSearchParams<{
            network?: string | string[];
        }>();

    
    const networkId =
        typeof networkParam === "string"
            ? networkParam
            : networkParam?.[0];

    
    const network =
        NETWORKS.find((item) => item.id === networkId) ??
        getNetwork("mtn");

    
    const goToDetails = (type: "airtime" | "data") => {
        router.push({
            pathname:
                type === "airtime"
                    ? "/(provider)/buy-airtime"
                    : "/(provider)/buy-data",
            params: {
                network: network.id,
            },
        });
    };

    return (
        <View
            style={[
                styles.container,
                { backgroundColor: colors.background },
            ]}
        >
            
            <View
                pointerEvents="none"
                style={[
                    styles.blob,
                    { backgroundColor: network.bg },
                ]}
            />

            <SafeAreaView style={styles.safeArea}>
                <ScrollView
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                >
                   
                    <View style={styles.topBar}>
                        <Pressable
                            onPress={() => router.back()}
                            accessibilityRole="button"
                            accessibilityLabel="Go back"
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

                        <Text
                            style={[
                                styles.topTitle,
                                { color: colors.text },
                            ]}
                        >
                            Buy airtime or data
                        </Text>

                        <View style={styles.topSpacer} />
                    </View>

                    
                    <View style={styles.progress}>
                        <View style={styles.segments}>
                            <View
                                style={[
                                    styles.segment,
                                    { backgroundColor: accent },
                                ]}
                            />

                            <View
                                style={[
                                    styles.segment,
                                    { backgroundColor: accent },
                                ]}
                            />

                            <View
                                style={[
                                    styles.segment,
                                    {
                                        backgroundColor:
                                            colors.backgroundSelected,
                                    },
                                ]}
                            />
                        </View>

                        <Text
                            style={[
                                styles.stepText,
                                { color: colors.textSecondary },
                            ]}
                        >
                            Step 2 of 3 · Choose what to buy
                        </Text>
                    </View>

                    
                    <View
                        style={[
                            styles.networkCard,
                            {
                                backgroundColor: colors.backgroundElement,
                                borderColor: colors.backgroundSelected,
                            },
                        ]}
                    >
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

                        <View style={styles.networkText}>
                            <Text
                                style={[
                                    styles.networkName,
                                    { color: colors.text },
                                ]}
                            >
                                {network.name}
                            </Text>

                            <Text
                                style={[
                                    styles.networkHint,
                                    { color: colors.textSecondary },
                                ]}
                            >
                                Selected network
                            </Text>
                        </View>

                        <Pressable
                            onPress={() => router.back()}
                            accessibilityRole="button"
                            accessibilityLabel="Change network"
                            style={styles.changeButton}
                        >
                            <Text
                                style={[
                                    styles.changeText,
                                    { color: accent },
                                ]}
                            >
                                Change
                            </Text>
                        </Pressable>
                    </View>

                    
                    <View style={styles.choices}>
                        <Text
                            style={[
                                styles.heading,
                                { color: colors.text },
                            ]}
                        >
                            What do you want to buy?
                        </Text>

                        
                        <ChoiceCard
                            title="Airtime"
                            description="Top up any amount, instantly"
                            chips={AMOUNT_CHIPS}
                            icon="phone-portrait-outline"
                            iconBg={
                                isDark
                                    ? "rgba(156,150,255,0.18)"
                                    : "#F1F0FF"
                            }
                            iconColor={accent}
                            delay={0}
                            colors={colors}
                            onPress={() => goToDetails("airtime")}
                        />

                        
                        <ChoiceCard
                            title="Data bundles"
                            description="Daily, weekly and monthly plans"
                            chips={DATA_CHIPS}
                            icon="wifi-outline"
                            iconBg={
                                isDark
                                    ? "rgba(61,214,163,0.18)"
                                    : "#E3F5EC"
                            }
                            iconColor={
                                isDark ? "#3DD6A3" : "#0A7A5A"
                            }
                            delay={80}
                            colors={colors}
                            onPress={() => goToDetails("data")}
                        />
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}


const styles = StyleSheet.create({
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
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 32,
        gap: 20,
    },

    topBar: {
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

    progress: {
        gap: 8,
    },

    segments: {
        flexDirection: "row",
        gap: 6,
    },

    segment: {
        flex: 1,
        height: 4,
        borderRadius: 2,
    },

    stepText: {
        fontSize: 13,
        fontWeight: "700",
    },

    networkCard: {
        height: 72,
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        paddingLeft: 12,
        paddingRight: 8,
        borderRadius: 20,
        borderWidth: 1,
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

    networkText: {
        flex: 1,
    },

    networkName: {
        fontSize: 18,
        fontWeight: "800",
    },

    networkHint: {
        fontSize: 13,
        fontWeight: "600",
    },

    changeButton: {
        height: 44,
        paddingHorizontal: 12,
        alignItems: "center",
        justifyContent: "center",
    },

    changeText: {
        fontSize: 14,
        fontWeight: "800",
    },

    choices: {
        gap: 14,
    },

    heading: {
        fontSize: 24,
        lineHeight: 30,
        fontWeight: "800",
        letterSpacing: -0.3,
    },

    choiceCard: {
        minHeight: 144,
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        padding: 18,
        borderRadius: 24,
        borderWidth: 1,
    },

});
