
import { AuthProvider } from '@/useContext/useContext';
import {
  DarkTheme,
  DefaultTheme,
  Stack,
  ThemeProvider,
} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { FloatingMenu } from '@/components/floating-menu';

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <ThemeProvider
        value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
      >
        <AnimatedSplashOverlay />
        <FloatingMenu/>

        <Stack>
          <Stack.Screen
            name='index'
            options={{
              headerShown: false
            }}
          />

          <Stack.Screen
            name='home-screen'
            options={{
              headerShown: false
            }}
          />

          <Stack.Screen
            name='(auth)'
            options={{
              headerShown: false
            }}
          />

          <Stack.Screen
            name='(provider)'
            options={{
              headerShown: false
            }}
          />
        </Stack>

        <Stack.Screen
          name='(tab-bar)'
          options={{
            headerShown: false
          }}
        />

      </ThemeProvider>
    </AuthProvider>
  );
}
