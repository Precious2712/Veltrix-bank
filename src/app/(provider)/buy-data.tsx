
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    useColorScheme,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { getNetwork, NetworkId } from "@/components/data/network";
import { Colors } from "@/constants/theme";

import { DataPeriod, PLANS, SAVED_NUMBERS } from "@/components/data/data-bundle-plans";

import { getApiNetwork, getDefaultPlanId } from "@/components/data/data-utils";

import { DataPlanCard } from "@/components/data-bundle/data-categoris";
import { DataPeriodTabs } from "@/components/data-bundle/data-period-tab";
import { PurchaseFooter } from "@/components/data-bundle/footer";
import { PhoneNumberInput } from "@/components/data-bundle/phone-input";

type ThemeColors = {
    [Key in keyof typeof Colors.light]: string;
};

const NETWORK_IDS: NetworkId[] = [
    "mtn",
    "glo",
    "airtel",
    "9mobile",
];

function isNetworkId(value: string): value is NetworkId {
    return NETWORK_IDS.includes(value as NetworkId);
}

export default function BuyDataScreen() {
    const params = useLocalSearchParams<{
        network?: string;
        phone?: string;
    }>();

    const scheme = useColorScheme();

    const theme: ThemeColors =
        Colors[scheme === "dark" ? "dark" : "light"];

    const requestedNetwork =
        typeof params.network === "string"
            ? params.network.toLowerCase()
            : "mtn";

    const networkId: NetworkId = isNetworkId(requestedNetwork)
        ? requestedNetwork
        : "mtn";

    const network = getNetwork(networkId);

    const accent = network.bg;

    const [phone, setPhone] = useState(
        typeof params.phone === "string" ? params.phone : "",
    );

    const [selectedPeriod, setSelectedPeriod] =
        useState<DataPeriod>("weekly");

    const plans = PLANS[selectedPeriod];

    const [selectedPlanId, setSelectedPlanId] = useState(
        () => getDefaultPlanId(PLANS.weekly),
    );

    const selectedPlan = useMemo(
        () => plans.find((plan) => plan.id === selectedPlanId) ?? null,
        [plans, selectedPlanId],
    );


    const walletBalance = 12450;

    const handlePeriodChange = (period: DataPeriod) => {
        setSelectedPeriod(period);
        setSelectedPlanId(getDefaultPlanId(PLANS[period]));
    };

    const handleContinue = () => {
        if (!/^0\d{10}$/.test(phone)) {
            Alert.alert(
                "Invalid phone number",
                "Enter a valid 11-digit phone number.",
            );
            return;
        }

        if (!selectedPlan) {
            Alert.alert("Select a plan", "Please select a data plan.");
            return;
        }

        if (selectedPlan.price > walletBalance) {
            Alert.alert(
                "Insufficient wallet balance",
                "Your wallet balance is not enough for this purchase.",
            );
            return;
        }

        const apiNetwork = getApiNetwork(network.id);

        router.push({
            pathname: "/confirm-pin",
            params: {
                network: apiNetwork,
                type: "DATA",
                phone,
                price: String(selectedPlan.price),
                category: selectedPlan.category,
                dataValue: selectedPlan.size,
                planId: selectedPlan.id,
                planLabel: `${selectedPlan.size} - ${selectedPlan.validity}`,
            },
        });

        console.log(params);

    };

    return (
        <SafeAreaView
            style={[
                styles.safeArea,
                { backgroundColor: theme.background },
            ]}
            edges={["top", "bottom"]}
        >
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <Ionicons
                        name="cellular"
                        size={23}
                        color={accent}
                    />

                    <Text style={[styles.headerTitle, { color: theme.text }]}>
                        Buy Data
                    </Text>
                </View>

                <Text
                    style={[
                        styles.headerSubtitle,
                        { color: theme.textSecondary },
                    ]}
                >
                    Choose a data plan and enter the recipient's phone number.
                </Text>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <PhoneNumberInput
                    phone={phone}
                    onChange={setPhone}
                    savedNumbers={SAVED_NUMBERS}
                />

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>
                            Select duration
                        </Text>
                    </View>

                    <DataPeriodTabs
                        selectedPeriod={selectedPeriod}
                        onChange={handlePeriodChange}
                    />
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>
                            Available data plans
                        </Text>

                        <Text
                            style={[
                                styles.planCount,
                                { color: theme.textSecondary },
                            ]}
                        >
                            {plans.length} plans
                        </Text>
                    </View>

                    <View style={styles.planList}>
                        {plans.map((plan) => (
                            <DataPlanCard
                                key={plan.id}
                                plan={plan}
                                selected={selectedPlanId === plan.id}
                                accent={accent}
                                onPress={() => setSelectedPlanId(plan.id)}
                            />
                        ))}
                    </View>
                </View>

                <View style={styles.walletInfo}>
                    <Ionicons
                        name="wallet-outline"
                        size={18}
                        color={theme.textSecondary}
                    />

                    <Text
                        style={[
                            styles.walletText,
                            { color: theme.textSecondary },
                        ]}
                    >
                        Wallet balance: ₦{walletBalance.toLocaleString("en-NG")}
                    </Text>
                </View>
            </ScrollView>

            <PurchaseFooter
                selectedPlan={selectedPlan}
                phone={phone}
                onContinue={handleContinue}
                accent={accent}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 20,
    },
    headerTop: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    headerTitle: {
        fontSize: 23,
        fontWeight: "800",
    },
    headerSubtitle: {
        fontSize: 13,
        lineHeight: 20,
        marginTop: 8,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 24,
        gap: 26,
    },
    section: {
        gap: 14,
    },
    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "700",
    },
    planCount: {
        fontSize: 12,
        fontWeight: "500",
    },
    planList: {
        gap: 12,
    },
    walletInfo: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingVertical: 12,
    },
    walletText: {
        fontSize: 13,
        fontWeight: "500",
    },
});
