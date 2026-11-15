import { Ionicons } from "@expo/vector-icons";
import { type Href } from "expo-router";

type MenuItem = {
    id: string;
    title: string;
    description: string;
    icon: keyof typeof Ionicons.glyphMap;
    route: Href;
};

export const MENU_ITEMS: MenuItem[] = [
    {
        id: "profile",
        title: "My Profile",
        description: "Create or update your profile",
        icon: "person-outline",
        route: "/(tab-bar)/profile",
    },
    {
        id: "transactions",
        title: "Transaction History",
        description: "View airtime and data purchases",
        icon: "receipt-outline",
        route: "/(tab-bar)/transactions",
    },
    {
        id: "pin",
        title: "Transaction PIN",
        description: "Create or manage your PIN",
        icon: "shield-checkmark-outline",
        route: "/(tab-bar)/transaction-pin",
    },
    {
        id: "admin",
        title: "Admin Dashboard",
        description: "Manage users, wallet and profits",
        icon: "grid-outline",
        route: "/(tab-bar)/admin",
    },
];
