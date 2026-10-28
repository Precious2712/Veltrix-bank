import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Onboarding from '@/components/onbooading';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';


export default function HomeScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safeArea}>

        <Onboarding />

      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // flexDirection: 'row',
  },
  safeArea: {
    paddingTop: 3,
    flex: 1,
    // paddingHorizontal: Spacing.four,
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    // gap: Spacing.three,
    paddingBottom: 10
    // maxWidth: MaxContentWidth,
  },

});
