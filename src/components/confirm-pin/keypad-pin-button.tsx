import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";

import { styles, type ThemeColors } from "../data/confirm-pin-style";

export type KeypadItem = number | "delete" | "empty";

type KeypadButtonProps = {
  item: KeypadItem;
  size: number;
  onPress: (item: KeypadItem) => void;
  disabled: boolean;
  colors: ThemeColors;
};

export function KeypadButton({
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
    return <View style={{ width: size, height: size }} />;
  }

  const isDelete = item === "delete";

  return (
    <Animated.View
      style={[{ width: size, height: size }, animatedStyle]}
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
          isDelete ? "Delete last digit" : `Digit ${item}`
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
          <Text style={[styles.keyText, { color: colors.text }]}>
            {item}
          </Text>
        )}
      </Pressable>
    </Animated.View>
  );
}