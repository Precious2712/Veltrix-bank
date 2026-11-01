

import { Colors } from "@/constants/theme";
import { useEffect } from "react";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withSpring,
    withTiming,
} from "react-native-reanimated";

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

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    useEffect(() => {
        scale.value = filled
            ? withSequence(
                withSpring(1.3),
                withSpring(1)
            )
            : withTiming(1);
    }, [filled, scale]);

    return (
        <Animated.View
            style={[
                {
                    width: 14,
                    height: 14,
                    borderRadius: 7,
                    borderWidth: 1.5,
                    backgroundColor: filled
                        ? colors.text
                        : "transparent",
                    borderColor: filled
                        ? colors.text
                        : colors.backgroundSelected,
                },
                animatedStyle,
            ]}
        />
    );
}
