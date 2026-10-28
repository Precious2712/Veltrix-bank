
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

type Pair = readonly [string, string];

export const palette = {
  ink: '#14163A',
  muted: '#6B6F93',
  indigo: ['#7B73FF', '#4A3DE0'] as Pair,
  mint: ['#3BE3B7', '#12B58C'] as Pair,
  gold: ['#FFE08A', '#FFB733'] as Pair,
};


function useLoop(
  duration: number,
  delay = 0,
  reverse = true,
  easing = Easing.inOut(Easing.sin),
) {
  const t = useSharedValue(0);

  useEffect(() => {
    t.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, { duration, easing }),
        -1,
        reverse,
      ),
    );
  }, [delay, duration, easing, reverse, t]);

  return t;
}


export function Float({
  children,
  amplitude = 10,
  duration = 2400,
  delay = 0,
  style,
}: {
  children?: React.ReactNode;
  amplitude?: number;
  duration?: number;
  delay?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const t = useLoop(duration, delay);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: (t.value - 0.5) * 2 * amplitude,
      },
      {
        rotate: `${(t.value - 0.5) * 5}deg`,
      },
    ],
  }));

  return (
    <Animated.View style={[style, animatedStyle]}>
      {children}
    </Animated.View>
  );
}


function CoinFace({
  size,
  back,
}: {
  size: number;
  back?: boolean;
}) {
  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        {
          backfaceVisibility: 'hidden',
          transform: back ? [{ rotateY: '180deg' }] : [],
        },
      ]}
    >
      <LinearGradient
        colors={palette.gold}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          flex: 1,
          borderRadius: size / 2,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View
          style={{
            width: size * 0.72,
            height: size * 0.72,
            borderRadius: size * 0.36,
            borderWidth: Math.max(2, size * 0.04),
            borderColor: 'rgba(255,255,255,0.75)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              fontSize: size * 0.4,
              fontWeight: '800',
              color: '#B97800',
            }}
          >
            $
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
}

export function Coin({
  size = 60,
  delay = 0,
}: {
  size?: number;
  delay?: number;
}) {
  const t = useLoop(3200, delay, false, Easing.linear);

  const spin = useAnimatedStyle(() => ({
    transform: [
      { perspective: 700 },
      { rotateY: `${t.value * 360}deg` },
    ],
  }));

  return (
    <Animated.View
      style={[
        {
          width: size,
          height: size,
        },
        spin,
      ]}
    >
      <CoinFace size={size} />
      <CoinFace size={size} back />
    </Animated.View>
  );
}


export function Card3D({
  width = 260,
  tint = palette.indigo,
  label = '•••• 4821',
  amount = '$12,480.50',
  delay = 0,
}: {
  width?: number;
  tint?: Pair;
  label?: string;
  amount?: string;
  delay?: number;
}) {
  const height = width * 0.62;

  const t = useLoop(
    3600,
    delay,
    true,
    Easing.inOut(Easing.quad),
  );

  const wrap = useAnimatedStyle(() => ({
    transform: [
      { perspective: 900 },
      {
        rotateX: `${interpolate(t.value, [0, 1], [16, 4])}deg`,
      },
      {
        rotateY: `${interpolate(t.value, [0, 1], [-24, 12])}deg`,
      },
      { rotateZ: '-5deg' },
    ],
  }));

  const gloss = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(
          t.value,
          [0, 1],
          [-width * 0.5, width * 1.1],
        ),
      },
      { rotate: '18deg' },
    ],
  }));

  return (
    <Animated.View style={[{ width, height }, wrap]}>
      <View
        style={[
          s.layer,
          {
            width,
            height,
            top: 26,
            opacity: 0.25,
            backgroundColor: tint[1],
            transform: [{ scale: 0.86 }],
          },
        ]}
      />

      <View
        style={[
          s.layer,
          {
            width,
            height,
            top: 13,
            opacity: 0.5,
            backgroundColor: tint[1],
            transform: [{ scale: 0.93 }],
          },
        ]}
      />

      <View
        style={[
          s.cardShadow,
          {
            width,
            height,
            backgroundColor: tint[1],
          },
        ]}
      >
        <LinearGradient
          colors={tint}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            StyleSheet.absoluteFill,
            s.clip,
          ]}
        >
          <View style={s.cardInner}>
            <View style={s.row}>
              <Text style={s.brand}>Veltrix</Text>
              <View style={s.chip} />
            </View>

            <View>
              <Text style={s.balanceLabel}>
                Total balance
              </Text>

              <Text
                style={[
                  s.amount,
                  { fontSize: width * 0.105 },
                ]}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {amount}
              </Text>

              <Text style={s.number}>{label}</Text>
            </View>
          </View>

          <Animated.View
            pointerEvents="none"
            style={[
              s.gloss,
              {
                height: height * 1.8,
              },
              gloss,
            ]}
          >
            <LinearGradient
              colors={[
                'rgba(255,255,255,0)',
                'rgba(255,255,255,0.38)',
                'rgba(255,255,255,0)',
              ]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
        </LinearGradient>
      </View>
    </Animated.View>
  );
}


function Ring({
  delay,
  size,
}: {
  delay: number;
  size: number;
}) {
  const t = useLoop(
    2600,
    delay,
    false,
    Easing.out(Easing.quad),
  );

  const st = useAnimatedStyle(() => ({
    opacity: interpolate(t.value, [0, 1], [0.45, 0]),
    transform: [
      {
        scale: interpolate(t.value, [0, 1], [0.6, 2]),
      },
    ],
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: 2,
          borderColor: palette.mint[0],
        },
        st,
      ]}
    />
  );
}

export function Lock3D({
  size = 130,
}: {
  size?: number;
}) {
  const t = useLoop(3200);

  const tilt = useAnimatedStyle(() => ({
    transform: [
      { perspective: 800 },
      {
        rotateY: `${interpolate(t.value, [0, 1], [-28, 28])}deg`,
      },
      { rotateX: '8deg' },
    ],
  }));

  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Ring size={size * 1.3} delay={0} />
      <Ring size={size * 1.3} delay={1300} />

      <Animated.View
        style={[
          { alignItems: 'center' },
          tilt,
        ]}
      >
        <View
          style={{
            width: size * 0.54,
            height: size * 0.5,
            borderWidth: size * 0.1,
            borderBottomWidth: 0,
            borderTopLeftRadius: size * 0.27,
            borderTopRightRadius: size * 0.27,
            borderColor: '#C9CCFF',
            marginBottom: -2,
          }}
        />

        <LinearGradient
          colors={palette.mint}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            {
              width: size,
              height: size * 0.8,
              borderRadius: size * 0.22,
              alignItems: 'center',
              justifyContent: 'center',
            },
            s.lockShadow,
          ]}
        >
          <View
            style={{
              width: size * 0.18,
              height: size * 0.18,
              borderRadius: size * 0.09,
              backgroundColor: '#0B6B54',
            }}
          />

          <View
            style={{
              width: size * 0.06,
              height: size * 0.16,
              borderRadius: size * 0.03,
              backgroundColor: '#0B6B54',
              marginTop: -2,
            }}
          />
        </LinearGradient>
      </Animated.View>
    </View>
  );
}

export function Pill({
  text,
  color,
}: {
  text: string;
  color: string;
}) {
  return (
    <View style={s.pill}>
      <View
        style={[
          s.pillDot,
          { backgroundColor: color },
        ]}
      />

      <Text style={s.pillText}>{text}</Text>
    </View>
  );
}


const s = StyleSheet.create({
  layer: {
    position: 'absolute',
    borderRadius: 24,
    left: 0,
  },
  cardShadow: {
    borderRadius: 24,
    shadowColor: '#2B2A7A',
    shadowOpacity: 0.3,
    shadowRadius: 24,
    shadowOffset: {
      width: 0,
      height: 16,
    },
    elevation: 12,
  },
  clip: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  cardInner: {
    flex: 1,
    padding: 18,
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brand: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  chip: {
    width: 34,
    height: 26,
    borderRadius: 7,
    backgroundColor: 'rgba(255,224,138,0.95)',
  },
  balanceLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
  },
  amount: {
    color: '#FFFFFF',
    fontWeight: '800',
    marginTop: 2,
  },
  number: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 13,
    marginTop: 6,
    letterSpacing: 1.5,
  },
  gloss: {
    position: 'absolute',
    top: -40,
    left: 0,
    width: 70,
  },
  lockShadow: {
    shadowColor: '#0B6B54',
    shadowOpacity: 0.35,
    shadowRadius: 20,
    shadowOffset: {
      width: 0,
      height: 14,
    },
    elevation: 10,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    shadowColor: '#2B2A7A',
    shadowOpacity: 0.16,
    shadowRadius: 14,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 6,
  },
  pillDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  pillText: {
    color: palette.ink,
    fontSize: 13,
    fontWeight: '600',
  },
});
