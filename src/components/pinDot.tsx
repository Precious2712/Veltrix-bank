import { useEffect } from "react";

import { StyleSheet } from "react-native";

import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withSpring,
    withTiming
} from "react-native-reanimated";

import { Colors } from "@/constants/theme";

type ThemeColors = (typeof Colors)[keyof typeof Colors];

type PinDotProps = {
    filled: boolean;
    colors: ThemeColors;
};

export default function PinDot({
    filled,
    colors,
}: PinDotProps) {
    const scale = useSharedValue(1);

    useEffect(() => {
        scale.value = filled
            ? withSequence(
                withSpring(1.3),
                withSpring(1)
            )
            : withTiming(1);
    }, [filled, scale]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <Animated.View
            style={[
                styles.pinDot,
                {
                    backgroundColor: filled
                        ? colors.text
                        : "transparent",

                    borderColor: filled
                        ? colors.text
                        : colors.text + "50",
                },
                animatedStyle,
            ]}
        />
    );
}

const styles = StyleSheet.create({
    pinDot: {
        width: 15,
        height: 15,
        borderRadius: 8,
        borderWidth: 1.5,
    },
});
