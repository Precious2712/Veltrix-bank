

import {
  NETWORKS,
  type NetworkId,
} from "@/components/data/network";
import { Colors } from "@/constants/theme";

import { NetworkTile } from "@/components/network/network-title";
import { Ionicons } from "@expo/vector-icons";

import {
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  useWindowDimensions,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

const ACCENT = "#4A3DE0";
const SCREEN_PADDING = 20;
const TILE_GAP = 12;

type ThemeColors = (typeof Colors)[keyof typeof Colors];

export default function HomeScreen() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  const colors: ThemeColors = Colors[isDark ? "dark" : "light"];

  const { width } = useWindowDimensions();

  const availableWidth =
    width - SCREEN_PADDING * 2 - TILE_GAP;

  const tileWidth = Math.min(
    240,
    Math.max(0, availableWidth / 2),
  );

  const handleSelectNetwork = (id: NetworkId) => {
    // router.push({
    //   pathname: "/choose-type",
    //   params: { network: id },
    // });
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      <View
        pointerEvents="none"
        style={[
          styles.blob,
          {
            backgroundColor: isDark
              ? "rgba(99,102,241,0.12)"
              : "rgba(74,61,224,0.08)",
          },
        ]}
      />

      <SafeAreaView
        style={styles.safeArea}
        edges={["top"]}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >

          <View style={styles.header}>
            <View style={styles.brandContainer}>
              <View style={styles.brandIcon}>
                <Ionicons
                  name="flash"
                  size={21}
                  color="#FFFFFF"
                />
              </View>

              <View>
                <Text
                  style={[
                    styles.brandName,
                    { color: colors.text },
                  ]}
                >
                  Veltrix
                </Text>

                <Text
                  style={[
                    styles.brandSubtitle,
                    { color: colors.text, opacity: 0.6 },
                  ]}
                >
                  Your digital experience
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.statusIcon,
                {
                  backgroundColor: isDark
                    ? "#24243A"
                    : "#F0EEFF",
                },
              ]}
            >
              <Ionicons
                name="notifications-outline"
                size={21}
                color={ACCENT}
              />
            </View>
          </View>


          <View style={styles.welcomeSection}>
            <Text
              style={[
                styles.eyebrow,
                { color: ACCENT },
              ]}
            >
              QUICK SERVICES
            </Text>

            <Text
              style={[
                styles.title,
                { color: colors.text },
              ]}
            >
              Which network are{"\n"}you topping up?
            </Text>

            <Text
              style={[
                styles.subtitle,
                { color: colors.text, opacity: 0.65 },
              ]}
            >
              Select your network to get started with
              airtime or data purchases.
            </Text>
          </View>


          <View style={styles.grid}>
            {NETWORKS.map((network, index) => (
              <NetworkTile
                key={network.id}
                network={network}
                width={tileWidth}
                index={index}
                onPress={() =>
                  handleSelectNetwork(network.id)
                }
              />
            ))}
          </View>


          <View style={styles.activitySection}>
            <View style={styles.activityHeader}>
              <Text
                style={[
                  styles.sectionTitle,
                  { color: colors.text },
                ]}
              >
                Recent activity
              </Text>

              <Text
                style={[
                  styles.activityLabel,
                  { color: ACCENT },
                ]}
              >
                History
              </Text>
            </View>

            <View
              style={[
                styles.emptyActivity,
                {
                  backgroundColor: isDark
                    ? "#1C1C2A"
                    : "#F7F7FC",
                  borderColor: isDark
                    ? "#303044"
                    : "#EEEEF5",
                },
              ]}
            >
              <View
                style={[
                  styles.activityIcon,
                  {
                    backgroundColor: isDark
                      ? "#292940"
                      : "#EBE9FF",
                  },
                ]}
              >
                <Ionicons
                  name="receipt-outline"
                  size={23}
                  color={ACCENT}
                />
              </View>

              <Text
                style={[
                  styles.emptyTitle,
                  { color: colors.text },
                ]}
              >
                No transactions yet
              </Text>

              <Text
                style={[
                  styles.emptySubtitle,
                  { color: colors.text, opacity: 0.6 },
                ]}
              >
                Your airtime and data purchases will
                appear here.
              </Text>
            </View>
          </View>


          <View style={styles.footer}>
            <Ionicons
              name="shield-checkmark-outline"
              size={15}
              color={colors.text}
            />

            <Text
              style={[
                styles.footerText,
                { color: colors.text, opacity: 0.55 },
              ]}
            >
              Secure and reliable transactions
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
  },

  safeArea: {
    flex: 1,
  },

  blob: {
    position: "absolute",
    right: -80,
    top: -90,
    width: 250,
    height: 250,
    borderRadius: 125,
  },

  content: {
    paddingHorizontal: SCREEN_PADDING,
    paddingTop: 12,
    paddingBottom: 36,
    gap: 28,
  },

  

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  brandContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
  },

  brandIcon: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: ACCENT,
    alignItems: "center",
    justifyContent: "center",
  },

  brandName: {
    fontSize: 19,
    fontWeight: "800",
    letterSpacing: -0.5,
  },

  brandSubtitle: {
    fontSize: 11,
    fontWeight: "500",
    marginTop: 2,
  },

  statusIcon: {
    width: 43,
    height: 43,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },

  welcomeSection: {
    gap: 9,
  },

  eyebrow: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.5,
  },

  title: {
    fontSize: 29,
    lineHeight: 36,
    fontWeight: "800",
    letterSpacing: -0.8,
  },

  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "500",
    maxWidth: 310,
  },

 

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: TILE_GAP,
  },

  // tile: {
  //   height: 132,
  //   padding: 16,
  //   borderRadius: 23,
  //   overflow: "hidden",
  //   justifyContent: "space-between",
  // },

  // tileRing: {
  //   position: "absolute",
  //   right: -26,
  //   top: -26,
  //   width: 90,
  //   height: 90,
  //   borderRadius: 45,
  //   borderWidth: 16,
  // },

  // wordmark: {
  //   fontSize: 30,
  //   lineHeight: 36,
  //   fontWeight: "800",
  //   letterSpacing: -0.5,
  // },

  // tileFooter: {
  //   flexDirection: "row",
  //   alignItems: "center",
  //   justifyContent: "space-between",
  // },

  // tileLabel: {
  //   fontSize: 12,
  //   fontWeight: "700",
  // },

  // tileArrow: {
  //   width: 31,
  //   height: 31,
  //   borderRadius: 16,
  //   alignItems: "center",
  //   justifyContent: "center",
  // },



  activitySection: {
    gap: 14,
  },

  activityHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
  },

  activityLabel: {
    fontSize: 13,
    fontWeight: "700",
  },

  emptyActivity: {
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    gap: 9,
  },

  activityIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 3,
  },

  emptyTitle: {
    fontSize: 15,
    fontWeight: "800",
  },

  emptySubtitle: {
    fontSize: 12,
    lineHeight: 19,
    textAlign: "center",
    maxWidth: 250,
  },

  

  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    marginTop: 2,
  },

  footerText: {
    fontSize: 11,
    fontWeight: "500",
  },
});
