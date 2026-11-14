
import { Ionicons } from "@expo/vector-icons";

import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

import Animated, {
    FadeInDown,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";

type ChoiceCardProps = {
  title: string;
  description: string;
  chips: string[];
  icon: keyof typeof Ionicons.glyphMap;
  iconBg: string;
  iconColor: string;
  delay?: number;
  colors: {
    backgroundElement: string;
    backgroundSelected: string;
    text: string;
    textSecondary: string;
  };
  onPress: () => void;
};

export default function ChoiceCard({
  title,
  description,
  chips,
  icon,
  iconBg,
  iconColor,
  delay = 0,
  colors,
  onPress,
}: ChoiceCardProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View entering={FadeInDown.delay(delay).springify()}>
      <Animated.View style={animatedStyle}>
        <Pressable
          onPress={onPress}
          onPressIn={() => {
            scale.value = withSpring(0.98);
          }}
          onPressOut={() => {
            scale.value = withSpring(1);
          }}
          accessibilityRole="button"
          accessibilityLabel={`${title}. ${description}`}
          style={[
            styles.choiceCard,
            {
              backgroundColor: colors.backgroundElement,
              borderColor: colors.backgroundSelected,
            },
          ]}
        >
          
          <View
            style={[
              styles.choiceIcon,
              { backgroundColor: iconBg },
            ]}
          >
            <Ionicons
              name={icon}
              size={26}
              color={iconColor}
            />
          </View>

          
          <View style={styles.choiceBody}>
            <View style={styles.choiceTitleRow}>
              <Text
                style={[
                  styles.choiceTitle,
                  { color: colors.text },
                ]}
              >
                {title}
              </Text>

              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.textSecondary}
              />
            </View>

            <Text
              style={[
                styles.choiceDescription,
                { color: colors.textSecondary },
              ]}
            >
              {description}
            </Text>

           
            <View style={styles.chipRow}>
              {chips.map((chip) => (
                <View
                  key={chip}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: colors.backgroundSelected,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      { color: colors.text },
                    ]}
                  >
                    {chip}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  choiceCard: {
    minHeight: 144,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 18,
    borderRadius: 24,
    borderWidth: 1,
  },

  choiceIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  choiceBody: {
    flex: 1,
    gap: 6,
  },

  choiceTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  choiceTitle: {
    fontSize: 20,
    fontWeight: "800",
  },

  choiceDescription: {
    fontSize: 14,
    fontWeight: "600",
  },

  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },

  chip: {
    paddingVertical: 5,
    paddingHorizontal: 9,
    borderRadius: 10,
  },

  chipText: {
    fontSize: 12,
    fontWeight: "700",
  },
});
