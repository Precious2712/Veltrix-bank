
import {
  Card3D,
  Coin,
  Float,
  Lock3D,
  Pill,
  palette,
} from '@/components/onboarding/ui3d';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';

const abs = (style: object) => [
  { position: 'absolute' as const },
  style,
];

function SceneWallet() {
  return (
    <View style={s.scene}>
      <Card3D width={270} />

      <Float style={abs({ top: 4, right: 12 })}>
        <Coin size={60} />
      </Float>

      <Float
        delay={500}
        amplitude={8}
        style={abs({ bottom: 14, left: 6 })}
      >
        <Coin size={42} delay={900} />
      </Float>

      <Float delay={250} style={abs({ top: 44, left: 24 })}>
        <Coin size={26} delay={400} />
      </Float>
    </View>
  );
}

function SceneSend() {
  return (
    <View style={s.scene}>
      <View style={abs({ top: 14, left: 4 })}>
        <Card3D
          width={230}
          tint={palette.mint}
          label="•••• 9027"
          amount="$3,215.00"
          delay={700}
        />
      </View>

      <View style={abs({ top: 96, right: 4 })}>
        <Card3D width={230} />
      </View>

      <Float style={abs({ top: 0, right: 0 })}>
        <Pill text="Sent $250" color="#FF6B8B" />
      </Float>

      <Float delay={600} style={abs({ bottom: 6, left: 0 })}>
        <Pill text="Received $1,200" color="#12B58C" />
      </Float>
    </View>
  );
}

function SceneSecure() {
  return (
    <View
      style={[
        s.scene,
        {
          alignItems: 'center',
          justifyContent: 'center',
        },
      ]}
    >
      <Lock3D size={130} />

      <Float style={abs({ top: 26, left: 0 })}>
        <Pill text="Biometric login" color="#7B73FF" />
      </Float>

      <Float delay={500} style={abs({ bottom: 30, right: 0 })}>
        <Pill text="Security protection" color="#12B58C" />
      </Float>
    </View>
  );
}

export const slides = [
  {
    title: 'Your money,\nbeautifully simple',
    body: 'Cards, savings and everyday payments together in one calm wallet.',
    Scene: SceneWallet,
  },
  {
    title: 'Send and receive\nin seconds',
    body: 'Pay friends, split bills and get paid instantly, with no hidden fees.',
    Scene: SceneSend,
  },
  {
    title: 'Protected at\nevery step',
    body: 'Biometric sign-in and encryption help protect your account.',
    Scene: SceneSecure,
  },
];

type SlideThemeColors = {
  title: string;
  body: string;
};

export function Slide({
  index,
  width,
  scrollX,
  title,
  body,
  Scene,
  themeColors,
}: {
  index: number;
  width: number;
  scrollX: SharedValue<number>;
  title: string;
  body: string;
  Scene: React.ComponentType;
  themeColors: SlideThemeColors;
}) {
  const input = [
    (index - 1) * width,
    index * width,
    (index + 1) * width,
  ];


  const sceneStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollX.value,
      input,
      [0, 1, 0],
      Extrapolation.CLAMP,
    ),
    transform: [
      {
        translateX: interpolate(
          scrollX.value,
          input,
          [width * 0.2, 0, -width * 0.2],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }));
  

  const textStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollX.value,
      input,
      [0, 1, 0],
      Extrapolation.CLAMP,
    ),
    transform: [
      {
        translateY: interpolate(
          scrollX.value,
          input,
          [36, 0, 36],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }));

  return (
    <View style={[s.slide, { width }]}>
      <Animated.View style={[s.sceneWrap, sceneStyle]}>
        <Scene />
      </Animated.View>

      <Animated.View style={[s.textWrap, textStyle]}>
        <Text style={[s.title, { color: themeColors.title }]}>
          {title}
        </Text>

        <Text style={[s.body, { color: themeColors.body }]}>
          {body}
        </Text>
      </Animated.View>
    </View>
  );
}

const s = StyleSheet.create({
  scene: {
    width: 320,
    height: 300,
  },
  slide: {
    paddingHorizontal: 28,
    justifyContent: 'center',
  },
  sceneWrap: {
    height: 320,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrap: {
    marginTop: 19,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '800',
    textAlign: 'center',
  },
  body: {
    fontSize: 10,
    lineHeight: 24,
    textAlign: 'center',
    marginTop: 12,
    maxWidth: 320,
  },
});
