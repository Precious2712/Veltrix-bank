import { View } from "react-native";

import { KEY_GAP, styles, type ThemeColors } from "../data/confirm-pin-style";

import { KeypadButton, type KeypadItem } from "./keypad-pin-button";

const BUTTONS: KeypadItem[] = [
  1, 2, 3,
  4, 5, 6,
  7, 8, 9,
  "empty", 0, "delete",
];

type PinKeypadProps = {
  size: number;
  pinLength: number;
  pin: string;
  isSubmitting: boolean;
  colors: ThemeColors;
  onPress: (item: KeypadItem) => void;
};

export function PinKeypad({
  size,
  pinLength,
  pin,
  isSubmitting,
  colors,
  onPress,
}: PinKeypadProps) {
  return (
    <View
      style={[
        styles.keypad,
        { width: size * 3 + KEY_GAP * 2 },
      ]}
    >
      {BUTTONS.map((item, index) => (
        <KeypadButton
          key={`${item}-${index}`}
          item={item}
          size={size}
          onPress={onPress}
          colors={colors}
          disabled={
            isSubmitting ||
            (typeof item === "number" &&
              pin.length >= pinLength)
          }
        />
      ))}
    </View>
  );
}