
import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import {
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
    useColorScheme,
} from "react-native";

import { useState } from "react";
import { SavedNumber } from "../data/data-bundle-plans";
import { digitsOnly, formatPhone } from "../data/data-utils";

type ThemeColors = {
  [Key in keyof typeof Colors.light]: string;
};

type PhoneNumberInputProps = {
  phone: string;
  onChange: (phone: string) => void;
  savedNumbers: SavedNumber[];
  onPickContacts?: () => void;
};

export function PhoneNumberInput({
  phone,
  onChange,
  savedNumbers,
  onPickContacts,
}: PhoneNumberInputProps) {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  const colors: ThemeColors = Colors[isDark ? "dark" : "light"];

  const [focused, setFocused] = useState(false);
  const [touched, setTouched] = useState(false);

  const phoneValid = /^0\d{10}$/.test(phone);

  const showError =
    touched && phone.length > 0 && !phoneValid;

  const errorColor = isDark ? "#FF7A80" : "#D92D34";

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>
        Phone number
      </Text>

      <View
        style={[
          styles.phoneField,
          {
            backgroundColor: colors.backgroundElement,
            borderColor: showError
              ? errorColor
              : focused
                ? "#4A3DE0"
                : colors.backgroundSelected,
          },
        ]}
      >
        <TextInput
          value={formatPhone(phone)}
          onChangeText={(value) => {
            onChange(digitsOnly(value).slice(0, 11));
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            setTouched(true);
          }}
          placeholder="0801 234 5678"
          placeholderTextColor={colors.textSecondary}
          keyboardType="phone-pad"
          maxLength={13}
          accessibilityLabel="Phone number"
          style={[
            styles.phoneInput,
            { color: colors.text },
          ]}
        />

        <Pressable
          onPress={onPickContacts}
          disabled={!onPickContacts}
          accessibilityRole="button"
          accessibilityLabel="Pick from contacts"
          style={[
            styles.contactsButton,
            { backgroundColor: colors.backgroundSelected },
          ]}
        >
          <Ionicons
            name="person-outline"
            size={20}
            color={colors.text}
          />
        </Pressable>
      </View>

      {showError && (
        <Text style={[styles.errorText, { color: errorColor }]}>
          Enter an 11-digit number starting with 0
        </Text>
      )}

      <View style={styles.savedRow}>
        {savedNumbers.map((saved) => {
          const selected = phone === saved.number;

          return (
            <Pressable
              key={saved.label}
              onPress={() => onChange(saved.number)}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              style={[
                styles.savedChip,
                {
                  backgroundColor: selected
                    ? colors.text
                    : colors.backgroundElement,
                  borderColor: selected
                    ? colors.text
                    : colors.backgroundSelected,
                },
              ]}
            >
              <Text
                style={[
                  styles.savedChipText,
                  {
                    color: selected
                      ? colors.background
                      : colors.text,
                  },
                ]}
              >
                {saved.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },

  label: {
    fontSize: 13,
    fontWeight: "700",
  },

  phoneField: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingLeft: 16,
    paddingRight: 6,
    borderRadius: 16,
    borderWidth: 1.5,
  },

  phoneInput: {
    flex: 1,
    height: "100%",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.3,
  },

  contactsButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  errorText: {
    fontSize: 12,
    fontWeight: "600",
  },

  savedRow: {
    flexDirection: "row",
    gap: 8,
  },

  savedChip: {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  savedChipText: {
    fontSize: 13,
    fontWeight: "700",
  },
});
