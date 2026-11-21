import {
    useState,
} from "react";

import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { ThemedView } from "@/components/themed-view";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from 'react-native-safe-area-context';

import { api } from "@/services/api";

export default function CreatePinScreen() {
    const router = useRouter();

    const [pin, setPin] = useState("");
    const [confirmPin, setConfirmPin] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCreatePin = async () => {
        if (pin.length !== 4 || confirmPin.length !== 4) {
            Alert.alert(
                "Incomplete PIN",
                "Please enter and confirm your four-digit PIN."
            );
            return;
        }

        if (pin !== confirmPin) {
            Alert.alert(
                "PIN Mismatch",
                "The PINs you entered do not match."
            );
            return;
        }

        try {
            setIsSubmitting(true);

            await api.post("/pin/transaction-pin", {
                pin,
            });

            Alert.alert(
                "PIN Created",
                "Your transaction PIN has been created successfully.",
                [
                    {
                        text: "Continue",
                        onPress: () => router.back(),
                    },
                ]
            );
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Unable to create your transaction PIN.";

            Alert.alert("Something went wrong", message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ThemedView style={styles.container}>

            <SafeAreaView style={styles.keyboardContainer} edges={['top', 'bottom']}>
                <KeyboardAvoidingView
                    style={styles.keyboardContainer}
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                >
                    <View style={styles.content}>
                        <Pressable
                            style={styles.backButton}
                            onPress={() => router.back()}
                        >
                            <Ionicons
                                name="arrow-back"
                                size={22}
                                color="#17172B"
                            />
                        </Pressable>

                        <View style={styles.iconContainer}>
                            <Ionicons
                                name="lock-closed-outline"
                                size={32}
                                color="#4A3DE0"
                            />
                        </View>

                        <Text style={styles.title}>
                            Create Transaction PIN
                        </Text>

                        <Text style={styles.description}>
                            Create a secure four-digit PIN to authorize
                            your transactions on Veltrix.
                        </Text>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>New PIN</Text>

                            <TextInput
                                style={styles.input}
                                value={pin}
                                onChangeText={(value) =>
                                    setPin(value.replace(/\D/g, "").slice(0, 4))
                                }
                                placeholder="Enter 4-digit PIN"
                                placeholderTextColor="#9999A8"
                                keyboardType="number-pad"
                                secureTextEntry
                                maxLength={4}
                                editable={!isSubmitting}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Confirm PIN</Text>

                            <TextInput
                                style={styles.input}
                                value={confirmPin}
                                onChangeText={(value) =>
                                    setConfirmPin(
                                        value.replace(/\D/g, "").slice(0, 4)
                                    )
                                }
                                placeholder="Re-enter your PIN"
                                placeholderTextColor="#9999A8"
                                keyboardType="number-pad"
                                secureTextEntry
                                maxLength={4}
                                editable={!isSubmitting}
                            />
                        </View>

                        <Pressable
                            style={[
                                styles.submitButton,
                                isSubmitting && styles.disabledButton,
                            ]}
                            onPress={handleCreatePin}
                            disabled={isSubmitting}
                        >
                            <Text style={styles.submitButtonText}>
                                {isSubmitting ? "Creating PIN..." : "Create PIN"}
                            </Text>
                        </Pressable>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    keyboardContainer: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 16,
    },
    backButton: {
        width: 42,
        height: 42,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F4F3FA",
    },
    iconContainer: {
        width: 68,
        height: 68,
        borderRadius: 22,
        backgroundColor: "#EFEDFF",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 40,
        marginBottom: 24,
    },
    title: {
        fontSize: 25,
        fontWeight: "700",
        color: "#17172B",
    },
    description: {
        fontSize: 14,
        lineHeight: 22,
        color: "#77778A",
        marginTop: 10,
        marginBottom: 35,
    },
    inputGroup: {
        marginBottom: 22,
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        color: "#24243A",
        marginBottom: 10,
    },
    input: {
        height: 56,
        borderWidth: 1,
        borderColor: "#E5E4EE",
        borderRadius: 14,
        paddingHorizontal: 16,
        fontSize: 16,
        color: "#17172B",
        backgroundColor: "#FAFAFC",
        letterSpacing: 5,
    },
    submitButton: {
        height: 56,
        borderRadius: 14,
        backgroundColor: "#4A3DE0",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 12,
    },
    disabledButton: {
        opacity: 0.6,
    },
    submitButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
    },
});