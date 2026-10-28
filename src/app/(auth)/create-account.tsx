
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { router } from 'expo-router';
import { useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type KeypadItem = number | "delete" | "empty";

export default function SiginScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === "dark" ? "dark" : "light"];

  const [pin, setPin] = useState("");

  const buttonPress: KeypadItem[] = [
    1, 2, 3,
    4, 5, 6,
    7, 8, 9,
    "delete", 0, "empty",
  ];

  const PIN_LENGTH = 4;

  const handlePress = (item: KeypadItem) => {
    console.log('item', item);

    if (item === "empty") return;

    if (item === "delete") {
      setPin((previousPin) => previousPin.slice(0, -1));
      return;
    }

    if (pin.length < PIN_LENGTH) {
      setPin((previousPin) => previousPin + String(item));
    }
  };

  const handleSignIn = () => {
    if (pin.length !== PIN_LENGTH) return;

    console.log("PIN entered", pin);

    router.replace('/(auth)/signin');
  };

  return (
    <ThemedView
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            Create your PIN
          </Text>

          <Text style={[styles.subtitle, { color: colors.text }]}>
            Set up a secure PIN for your Veltrix account
          </Text>
        </View>

        <View style={styles.pinSection}>
          <View style={styles.pinDisplay}>
            {Array.from({ length: PIN_LENGTH }, (_, index) => (
              <View
                key={index}
                style={[
                  styles.pinDot,
                  {
                    backgroundColor:
                      index < pin.length
                        ? colors.text
                        : "transparent",
                    borderColor:
                      index < pin.length
                        ? colors.text
                        : colors.text + "50",
                  },
                ]}
              />
            ))}
          </View>

          <Text style={[styles.hint, { color: colors.text }]}>
            Enter your 4-digit PIN
          </Text>
        </View>

        <View style={styles.keypadContainer}>
          <FlatList
            data={buttonPress}
            numColumns={3}
            keyExtractor={(item) => String(item)}
            scrollEnabled={false}
            renderItem={({ item }) => {
              if (item === "empty") {
                return <View style={styles.keyWrapper} />;
              }

              return (
                <View style={styles.keyWrapper}>
                  <Pressable
                    onPress={() => handlePress(item)}
                    disabled={
                      typeof item === "number" &&
                      pin.length >= PIN_LENGTH
                    }
                    accessibilityRole="button"
                    accessibilityLabel={
                      item === "delete"
                        ? "Delete last digit"
                        : `Digit ${item}`
                    }

                    style={({ pressed }) => [
                      styles.key,
                      {
                        borderColor: colors.text + "35",
                        backgroundColor: pressed
                          ? colors.text + "12"
                          : "transparent",
                        opacity: pressed ? 0.8 : 1,
                      },
                    ]}

                  >
                    <Text
                      style={[
                        styles.keyText,
                        { color: colors.text },
                      ]}
                    >
                      {item === "delete" ? "⌫" : item}
                    </Text>
                  </Pressable>
                </View>
              );
            }}
          />
        </View>

        <Pressable
          onPress={handleSignIn}
          disabled={pin.length !== PIN_LENGTH}
          style={({ pressed }) => [
            styles.signInButton,
            {
              backgroundColor:
                pin.length === PIN_LENGTH
                  ? colors.textSecondary
                  : colors.text + "25",
              opacity: pressed ? 0.8 : 1,
            },
          ]}
        >
          <Text style={styles.signInText}>Sign in</Text>
        </Pressable>
      </SafeAreaView>

    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  safeArea: {
    flex: 1,
    paddingHorizontal: 0,
    justifyContent: "space-between",
    paddingBottom: 15,
  },

  header: {
    alignItems: "center",
    marginTop: 16,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 15,
    opacity: 0.7,
    textAlign: "center",
  },

  pinSection: {
    alignItems: "center",
    marginVertical: 20,
  },

  pinDisplay: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 22,
    marginBottom: 20,
  },

  pinDot: {
    width: 15,
    height: 15,
    borderRadius: 8,
    borderWidth: 1.5,
  },

  hint: {
    fontSize: 14,
    opacity: 0.65,
  },

  keypadContainer: {
    width: "100%",
    maxWidth: 330,
    alignSelf: "center",
  },

  keyWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 7,
    // borderRadius: 20
  },


  key: {
    width: 72,
    height: 62,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#80808050",
  },


  keyText: {
    fontSize: 24,
    fontWeight: "500",
    borderRadius: 20
  },

  signInButton: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 17,
    borderRadius: 16,
    marginTop: 18,
  },

  signInText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
