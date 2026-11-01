import { Pressable, StyleSheet, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";

import { Colors } from "@/constants/theme";

export type KeypadItem = number | "delete" | "empty";

type ThemeColors = (typeof Colors)[keyof typeof Colors];

type KeypadButtonProps = {
    item: KeypadItem;
    onPress: (item: KeypadItem) => void;
    disabled: boolean;
    colors: ThemeColors;
};

const KEY_SIZE = 72;

export default function KeypadButton({
    item,
    onPress,
    disabled,
    colors,
}: KeypadButtonProps) {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    if (item === "empty") {
        return <View style={styles.keyWrapper} />;
    }

    const isDelete = item === "delete";

    return (
        <View style={styles.keyWrapper}>
            <Animated.View style={[styles.keySize, animatedStyle]}>
                <Pressable
                    onPress={() => onPress(item)}
                    disabled={disabled}
                    onPressIn={() => {
                        scale.value = withSpring(0.92);
                    }}
                    onPressOut={() => {
                        scale.value = withSpring(1);
                    }}
                    accessibilityRole="button"
                    accessibilityLabel={
                        isDelete ? "Delete last digit" : `Digit ${item}`
                    }
                    style={({ pressed }) => [
                        styles.key,
                        {
                            borderColor: colors.backgroundElement,
                            backgroundColor: pressed
                                ? colors.backgroundElement
                                : "transparent",
                            opacity: disabled ? 0.45 : 1,
                        },
                    ]}
                >
                    {isDelete ? (
                        <Ionicons
                            name="backspace-outline"
                            size={25}
                            color={colors.text}
                        />
                    ) : (
                        <Text style={[styles.keyText, { color: colors.text }]}>
                            {item}
                        </Text>
                    )}
                </Pressable>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    keyWrapper: {
        width: KEY_SIZE,
        height: KEY_SIZE,
        alignItems: "center",
        justifyContent: "center",
    },

    keySize: {
        width: KEY_SIZE,
        height: KEY_SIZE,
    },

    key: {
        flex: 1,
        borderRadius: 22,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
    },

    keyText: {
        fontSize: 24,
        fontWeight: "500",
    },
});
