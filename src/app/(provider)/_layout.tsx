
import { Stack } from "expo-router";

export default function SelectLayout() {
    return (
        <Stack
            screenOptions={{
                headerTintColor: "#6C4DFF",
            }}
        >
            <Stack.Screen
                name="network"
                options={{
                    headerShown: false,
                }}
            />

            <Stack.Screen
                name="buy-airtime"
                options={{
                    title: "Buy Airtime",
                }}
            />

            <Stack.Screen
                name="buy-data"
                options={{
                    title: "Buy Data",
                }}
            />
        </Stack>
    );
}
