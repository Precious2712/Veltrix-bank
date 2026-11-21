
import { Ionicons } from "@expo/vector-icons";
import { type Href } from "expo-router";

export type SideNavProps = {
    visible: boolean;
    onClose: () => void;
    backgroundColor: string;
    textColor: string;
    hasProfile: boolean;

    userName?: string;
    veltrixId?: string;

    accentColor?: string;
    mutedTextColor?: string;
    surfaceColor?: string;
    borderColor?: string;
};


export type NavItem = {
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
    route: Href;
};