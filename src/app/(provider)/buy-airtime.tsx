import { NETWORKS, Network, getNetwork } from "@/components/data/network";
import { Colors } from "@/constants/theme";

import { AirtimeHeader } from "@/components/network/airtime-heder";
import { AmountSection } from "@/components/network/amount-section";
import { ContinueButton } from "@/components/network/continue-button";
import { PhoneNumberSection } from "@/components/network/phone-number";
import { PurchaseSummary } from "@/components/network/purchase-summary";

import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";

import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    View,
    useColorScheme,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

const ACCENT = "#4A3DE0";
const ACCENT_ON_DARK = "#9C96FF";

const MIN_AMOUNT = 50;
const MAX_AMOUNT = 50000;

const QUICK_AMOUNTS = [100, 200, 500, 1000, 2000, 5000];

const WALLET_BALANCE = 12450;

const SAVED_NUMBERS = [
    { label: "My number", number: "07055550120" },
    { label: "Mum", number: "08031234567" },
];

const API_NETWORK: Record<string, string> = {
    mtn: "MTN",
    airtel: "AIRTEL",
    glo: "GLO",
    "9mobile": "9MOBILE",
};

const naira = (value: number) =>
    `₦${value.toLocaleString("en-NG")}`;

const digitsOnly = (value: string) =>
    value.replace(/\D/g, "");

export default function BuyAirtimeScreen() {
    const scheme = useColorScheme();

    const colors =
        Colors[scheme === "dark" ? "dark" : "light"];

    const isDark = scheme === "dark";

    const accent = isDark ? ACCENT_ON_DARK : ACCENT;

    const errorColor = isDark ? "#FF7A80" : "#D92D34";

    const params = useLocalSearchParams<{
        network?: string;
        phone?: string;
        amount?: string;
    }>();

    const network: Network =
        NETWORKS.find((item) => item.id === params.network) ??
        getNetwork("mtn");

    const [phone, setPhone] = useState(
        digitsOnly(params.phone ?? "").slice(0, 11)
    );

    const [amountDigits, setAmountDigits] = useState(
        digitsOnly(params.amount ?? "").slice(0, 6)
    );


    const amount = amountDigits ? Number(amountDigits) : 0;

    const phoneValid = /^0\d{10}$/.test(phone);

    const amountValid =
        amount >= MIN_AMOUNT && amount <= MAX_AMOUNT;

    const insufficient =
        amountValid && amount > WALLET_BALANCE;

    const canContinue =
        phoneValid && amountValid && !insufficient;

    const buttonLabel = !phoneValid
        ? "Enter a valid phone number"
        : !amountDigits
            ? "Enter an amount"
            : !amountValid
                ? `Amount must be ${naira(MIN_AMOUNT)} to ${naira(MAX_AMOUNT)}`
                : insufficient
                    ? "Insufficient balance"
                    : `Continue · ${naira(amount)}`;


    const handleContinue = () => {
        if (!canContinue) return;

        const apiNetwork = API_NETWORK[network.id];

        if (!apiNetwork) {
            console.error("Unsupported network:", network.id);
            return;
        }

        router.push({
            pathname: "/",
            params: {
                network: apiNetwork,
                type: "AIRTIME",
                phone,
                amount: String(amount),
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
                <KeyboardAvoidingView
                    style={styles.flex}
                    behavior={
                        Platform.OS === "ios" ? "padding" : undefined
                    }
                >
                    <ScrollView
                        contentContainerStyle={styles.content}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        

                        <AirtimeHeader
                            network={network}
                            colors={colors}
                        />


                        <View style={styles.progress}>
                            <View style={styles.segments}>
                                {[0, 1, 2].map((index) => (
                                    <View
                                        key={index}
                                        style={[
                                            styles.segment,
                                            { backgroundColor: accent },
                                        ]}
                                    />
                                ))}
                            </View>

                            <Text
                                style={[
                                    styles.stepText,
                                    { color: colors.textSecondary },
                                ]}
                            >
                                Add airtime details
                            </Text>
                        </View>

                        

                        <PhoneNumberSection
                            phone={phone}
                            onPhoneChange={setPhone}
                            colors={colors}
                            accent={accent}
                            errorColor={errorColor}
                            savedNumbers={SAVED_NUMBERS}
                        />


                        <AmountSection
                            amountDigits={amountDigits}
                            onAmountChange={setAmountDigits}
                            colors={colors}
                            accent={accent}
                            errorColor={errorColor}
                            minAmount={MIN_AMOUNT}
                            maxAmount={MAX_AMOUNT}
                            quickAmounts={QUICK_AMOUNTS}
                        />


                        <PurchaseSummary
                            amount={amount}
                            walletBalance={WALLET_BALANCE}
                            colors={colors}
                            errorColor={errorColor}
                        />
                    </ScrollView>


                    <ContinueButton
                        canContinue={canContinue}
                        label={buttonLabel}
                        onPress={handleContinue}
                        colors={colors}
                        accent={ACCENT}
                    />
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },

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
        paddingBottom: 16,
        gap: 20,
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
});