
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTintColor: '#6C4DFF',
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen
        name="create-account"
        options={{
          title: 'Create Account',
          headerBackButtonDisplayMode: 'minimal',
        }}
      />

      <Stack.Screen
        name="signin"
        options={{
          title: 'signin',
          headerBackButtonDisplayMode: 'minimal',
        }}
      />
    </Stack>
  );
}
