import { Ionicons } from "@expo/vector-icons";

import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";

import type { AppColors } from "@/constants/theme";

type Props = {
  canContinue: boolean;
  label: string;
  onPress: () => void;
  colors: AppColors;
  accent: string;
};

export function ContinueButton({
  canContinue,
  label,
  onPress,
  colors,
  accent,
}: Props) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.footer}>
      <Animated.View style={animatedStyle}>
        <Pressable
          onPress={onPress}
          onPressIn={() => {
            if (canContinue) {
              scale.value = withSpring(0.98);
            }
          }}
          onPressOut={() => {
            scale.value = withSpring(1);
          }}
          disabled={!canContinue}
          accessibilityRole="button"
          accessibilityState={{ disabled: !canContinue }}
          style={[
            styles.button,
            {
              backgroundColor: canContinue
                ? accent
                : colors.backgroundSelected,
            },
          ]}
        >
          {canContinue && (
            <Ionicons
              name="arrow-forward"
              size={18}
              color="#FFFFFF"
            />
          )}

          <Text
            style={[
              styles.buttonText,
              {
                color: canContinue
                  ? "#FFFFFF"
                  : colors.textSecondary,
              },
            ]}
          >
            {label}
          </Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
  },
  button: {
    height: 56,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: "800",
  },
});