
import { Colors } from "@/constants/theme";
import {
    Pressable,
    StyleSheet,
    Text,
    View,
    useColorScheme,
} from "react-native";

import { DataPeriod, PERIODS } from "../data/data-bundle-plans";

type ThemeColors = {
  [Key in keyof typeof Colors.light]: string;
};

type DataPeriodTabsProps = {
  selectedPeriod: DataPeriod;
  onChange: (period: DataPeriod) => void;
};

export function DataPeriodTabs({
  selectedPeriod,
  onChange,
}: DataPeriodTabsProps) {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  const colors: ThemeColors = Colors[isDark ? "dark" : "light"];

  return (
    <View
      style={[
        styles.tabs,
        { backgroundColor: colors.backgroundElement },
      ]}
    >
      {PERIODS.map((item) => {
        const active = item.id === selectedPeriod;

        return (
          <Pressable
            key={item.id}
            onPress={() => onChange(item.id)}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            style={[
              styles.tab,
              active && {
                backgroundColor: isDark
                  ? colors.backgroundSelected
                  : colors.background,
              },
            ]}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color: active
                    ? colors.text
                    : colors.textSecondary,
                  fontWeight: active ? "800" : "700",
                },
              ]}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabs: {
    minHeight: 44,
    flexDirection: "row",
    padding: 4,
    borderRadius: 14,
  },

  tab: {
    flex: 1,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },

  tabText: {
    fontSize: 13,
  },
});
