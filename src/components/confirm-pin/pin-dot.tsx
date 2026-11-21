import { useEffect } from "react";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withSpring,
    withTiming,
} from "react-native-reanimated";

import { styles, type ThemeColors } from "../data/confirm-pin-style";

type PinDotProps = {
  filled: boolean;
  colors: ThemeColors;
};

export function PinDot({ filled, colors }: PinDotProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  useEffect(() => {
    scale.value = filled
      ? withSequence(withSpring(1.3), withSpring(1))
      : withTiming(1);
  }, [filled, scale]);

  return (
    <Animated.View
      style={[
        styles.pinDot,
        {
          backgroundColor: filled ? colors.text : "transparent",
          borderColor: filled
            ? colors.text
            : colors.textSecondary,
        },
        animatedStyle,
      ]}
    />
  );
}