

import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";

import { Colors } from "@/constants/theme";

type ThemeColors = (typeof Colors)[keyof typeof Colors];

export type KeypadItem = number | "delete" | "empty";

type KeypadButtonProps = {
    item: KeypadItem;
    size: number;
    onPress: (item: KeypadItem) => void;
    disabled: boolean;
    colors: ThemeColors;
};

export default function KeyPadButton({
    item,
    size,
    onPress,
    disabled,
    colors,
}: KeypadButtonProps) {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    if (item === "empty") {
        return (
            <View
                style={{
                    width: size,
                    height: size,
                }}
            />
        );
    }

    const isDelete = item === "delete";

    return (
        <Animated.View
            style={[
                {
                    width: size,
                    height: size,
                },
                animatedStyle,
            ]}
        >
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
                    isDelete
                        ? "Delete last digit"
                        : `Digit ${item}`
                }
                style={({ pressed }) => [
                    styles.key,
                    {
                        borderRadius: size / 2,
                        backgroundColor: pressed
                            ? colors.backgroundSelected
                            : isDelete
                                ? "transparent"
                                : colors.backgroundElement,
                        opacity: disabled ? 0.4 : 1,
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
                    <Text
                        style={[
                            styles.keyText,
                            { color: colors.text },
                        ]}
                    >
                        {item}
                    </Text>
                )}
            </Pressable>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    key: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },

    keyText: {
        fontSize: 26,
        fontWeight: "500",
    },
});
