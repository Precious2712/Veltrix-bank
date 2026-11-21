

import { Stack } from "expo-router";

export default function SettingsLayout() {
    return (
        <Stack
            screenOptions={{
                headerTintColor: "#6C4DFF",
            }}
        >
            <Stack.Screen
                name="create-pin"
                options={{
                    headerShown: false,
                }}
            />

            <Stack.Screen
                name="create-profile"
                options={{
                    title: "Create Profile",
                }}
            />

            <Stack.Screen
                name="profile"
                options={{
                    title: "Profile",
                }}
            />

            <Stack.Screen
                name="transactions"
                options={{
                    title: "Transactions",
                }}
            />
        </Stack>
    );
}
