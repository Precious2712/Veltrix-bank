
import { Float, palette } from '@/components/onboarding/ui3d';
import { Colors } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  Extrapolation,
  FadeInDown,
  interpolate,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  type SharedValue,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Slide, slides } from './onboarding/arrycomp';

function Dot({
  index,
  width,
  scrollX,
  color,
}: {
  index: number;
  width: number;
  scrollX: SharedValue<number>;
  color: string;
}) {
  const animatedStyle = useAnimatedStyle(() => {
    const input = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];

    return {
      width: interpolate(
        scrollX.value,
        input,
        [8, 28, 8],
        Extrapolation.CLAMP,
      ),
      opacity: interpolate(
        scrollX.value,
        input,
        [0.3, 1, 0.3],
        Extrapolation.CLAMP,
      ),
    };
  });

  return (
    <Animated.View
      style={[
        s.dot,
        { backgroundColor: color },
        animatedStyle,
      ]}
    />
  );
}

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const colors = Colors[isDark ? 'dark' : 'light'];

  const onboardingColors = isDark
    ? {
      backgroundStart: '#0B0D18',
      backgroundEnd: '#14182A',
      title: '#F5F6FF',
      body: '#B8BED6',
      muted: '#C1C5DE',
      indigoBlob: 'rgba(123, 115, 255, 0.18)',
      mintBlob: 'rgba(59, 227, 183, 0.10)',
      dot: '#A39BFF',
    }
    : {
      backgroundStart: '#EEF1FF',
      backgroundEnd: '#FFFFFF',
      title: '#14163A',
      body: '#6B6F93',
      muted: '#6B6F93',
      indigoBlob: 'rgba(123, 115, 255, 0.14)',
      mintBlob: 'rgba(59, 227, 183, 0.16)',
      dot: '#4A3DE0',
    };

  const scrollX = useSharedValue(0);
  const press = useSharedValue(1);
  const ref = useAnimatedRef<Animated.ScrollView>();
  const [index, setIndex] = useState(0);

  const onScroll = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x;
  });

  const last = index === slides.length - 1;

  const finish = () => router.replace('/(auth)/create-account');

  const next = () => {
    if (last) {
      finish();
      return;
    }

    ref.current?.scrollTo({
      x: (index + 1) * width,
      animated: true,
    });
  };

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: press.value }],
  }));

  return (
    <View
      style={[
        s.root,
        { backgroundColor: colors.background },
      ]}
    >
      <LinearGradient
        colors={[
          onboardingColors.backgroundStart,
          onboardingColors.backgroundEnd,
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      <Float
        amplitude={18}
        duration={4200}
        style={[
          s.blob,
          {
            top: -70,
            right: -80,
            backgroundColor: onboardingColors.indigoBlob,
          },
        ]}
      />

      <Float
        amplitude={14}
        duration={5000}
        delay={600}
        style={[
          s.blob,
          {
            bottom: 120,
            left: -110,
            backgroundColor: onboardingColors.mintBlob,
          },
        ]}
      />

      <SafeAreaView style={s.safeArea}>
        <View style={s.topBar}>
          <Pressable
            onPress={finish}
            hitSlop={12}
            style={{ opacity: last ? 0 : 1 }}
            disabled={last}
            accessibilityRole="button"
            accessibilityLabel="Skip onboarding and sign in"
          >
            <Text
              style={[
                s.skip,
                { color: onboardingColors.muted },
              ]}
            >
              Skip
            </Text>
          </Pressable>
        </View>


        <Animated.ScrollView
          ref={ref}
          horizontal
          pagingEnabled
          bounces={false}
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          decelerationRate="fast"
          // disableIntervalMomentum
          overScrollMode="never"
          onScroll={onScroll}
          onMomentumScrollEnd={(event) => {
            setIndex(
              Math.round(
                event.nativeEvent.contentOffset.x / width,
              ),
            );
          }}
          style={s.scrollView}
        >
          {slides.map((slide, i) => (
            <Slide
              key={i}
              index={i}
              width={width}
              scrollX={scrollX}
              title={slide.title}
              body={slide.body}
              Scene={slide.Scene}
              themeColors={{
                title: onboardingColors.title,
                body: onboardingColors.body,
              }}
            />
          ))}
        </Animated.ScrollView>

        <Animated.View
          entering={FadeInDown.delay(300).springify()}
          style={s.footer}
        >
          <View style={s.dots}>
            {slides.map((_, i) => (
              <Dot
                key={i}
                index={i}
                width={width}
                scrollX={scrollX}
                color={onboardingColors.dot}
              />
            ))}
          </View>

          <Animated.View style={buttonAnimatedStyle}>
            <Pressable
              onPress={next}
              onPressIn={() => {
                press.value = withSpring(0.96);
              }}
              onPressOut={() => {
                press.value = withSpring(1);
              }}
              accessibilityRole="button"
              accessibilityLabel={
                last ? 'Get started' : 'Continue onboarding'
              }
            >
              <LinearGradient
                colors={palette.indigo}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={s.cta}
              >
                <Text style={s.ctaText}>
                  {last ? 'Get started' : 'Continue'}
                </Text>
              </LinearGradient>
            </Pressable>
          </Animated.View>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  blob: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
  },
  topBar: {
    height: 44,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  skip: {
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 12,
    gap: 22,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  cta: {
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
});
