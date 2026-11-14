
import { Stack } from 'expo-router';

export default function AuthLayout() {

  return (
    <Stack
      screenOptions={{
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
        }}
      />

      <Stack.Screen
        name="signin"
        options={{
          title: 'signin',
        }}
      />
    </Stack>
  );
}
