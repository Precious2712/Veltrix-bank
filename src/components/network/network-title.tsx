
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

import type { Network } from "@/components/data/network";

type NetworkTileProps = {
  network: Network;
  width: number;
  index: number;
  onPress: () => void;
};

export function NetworkTile({
  network,
  width,
  index,
  onPress,
}: NetworkTileProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.97, {
      damping: 15,
      stiffness: 200,
    });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 200,
    });
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 70).springify()}
      style={{ width }}
    >
      <Animated.View style={animatedStyle}>
        <Pressable
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          accessibilityRole="button"
          accessibilityLabel={`${network.name}. Select for airtime or data`}
          style={[
            styles.tile,
            {
              backgroundColor: network.bg,
            },
          ]}
        >
          <View
            pointerEvents="none"
            style={[
              styles.tileRing,
              {
                borderColor: network.ringColor,
              },
            ]}
          />

          <Text
            style={[
              styles.wordmark,
              {
                color: network.fg,
              },
            ]}
          >
            {network.wordmark}
          </Text>

          <View style={styles.tileFooter}>
            <Text
              style={[
                styles.tileLabel,
                {
                  color: network.fg,
                },
              ]}
            >
              Airtime & data
            </Text>

            <View
              style={[
                styles.tileArrow,
                {
                  backgroundColor: network.arrowBg,
                },
              ]}
            >
              <Ionicons
                name="arrow-forward"
                size={16}
                color={network.arrowFg}
              />
            </View>
          </View>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  tile: {
    height: 132,
    padding: 16,
    borderRadius: 23,
    overflow: "hidden",
    justifyContent: "space-between",
  },

  tileRing: {
    position: "absolute",
    right: -26,
    top: -26,
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 16,
  },

  wordmark: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "800",
    letterSpacing: -0.5,
  },

  tileFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  tileLabel: {
    fontSize: 12,
    fontWeight: "700",
  },

  tileArrow: {
    width: 31,
    height: 31,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});
