
import { useEffect, useMemo, useRef, useState } from "react";

import {
    Animated,
    PanResponder,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
    useColorScheme,
    useWindowDimensions,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { router, type Href } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Colors } from "@/constants/theme";
import { MENU_ITEMS } from "./data/nav";

type Props = {
    isAdmin?: boolean;
};


export function FloatingMenu({ isAdmin = false }: Props) {
    const scheme = useColorScheme();
    const colors = Colors[scheme === "dark" ? "dark" : "light"];

    const insets = useSafeAreaInsets();
    const { height: screenHeight, width: screenWidth } =
        useWindowDimensions();

    const [visible, setVisible] = useState(false);

    const bottomOffset = insets.bottom + 92;

    const expandedTop = insets.top + 12;

    const compactTop = Math.max(
        expandedTop,
        screenHeight - bottomOffset - 360,
    );

    const topPosition = useRef(
        new Animated.Value(compactTop),
    ).current;

    const topRef = useRef(compactTop);
    const dragStartTop = useRef(compactTop);

    useEffect(() => {
        topRef.current = compactTop;
        topPosition.setValue(compactTop);
    }, [compactTop, topPosition]);

    const panResponder = useMemo(
        () =>
            PanResponder.create({
                onStartShouldSetPanResponder: () => false,

                onMoveShouldSetPanResponder: (_, gesture) =>
                    Math.abs(gesture.dy) > 4,

                onPanResponderGrant: () => {
                    dragStartTop.current = topRef.current;
                },

                onPanResponderMove: (_, gesture) => {
                    const nextTop = Math.min(
                        compactTop,
                        Math.max(
                            expandedTop,
                            dragStartTop.current + gesture.dy,
                        ),
                    );

                    topRef.current = nextTop;
                    topPosition.setValue(nextTop);
                },

                onPanResponderRelease: (_, gesture) => {
                    const midpoint = (expandedTop + compactTop) / 2;

                    const snapTo =
                        topRef.current < midpoint || gesture.vy < -0.6
                            ? expandedTop
                            : compactTop;

                    topRef.current = snapTo;

                    Animated.spring(topPosition, {
                        toValue: snapTo,
                        damping: 22,
                        stiffness: 180,
                        useNativeDriver: false,
                    }).start();
                },

                onPanResponderTerminate: () => {
                    const snapTo =
                        topRef.current < (expandedTop + compactTop) / 2
                            ? expandedTop
                            : compactTop;

                    topRef.current = snapTo;

                    Animated.spring(topPosition, {
                        toValue: snapTo,
                        damping: 22,
                        stiffness: 180,
                        useNativeDriver: false,
                    }).start();
                },
            }),
        [compactTop, expandedTop, topPosition],
    );

    const handleNavigate = (route: Href) => {
        setVisible(false);
        router.push(route);
    };

    const menuItems = isAdmin
        ? MENU_ITEMS
        : MENU_ITEMS.filter((item) => item.id !== "admin");

    return (
        <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
            {visible && (
                <View style={styles.overlay}>
                    <Pressable
                        style={styles.backdrop}
                        onPress={() => setVisible(false)}
                    />

                    <Animated.View
                        style={[
                            styles.popup,
                            {
                                top: topPosition,
                                bottom: bottomOffset,
                                width: Math.min(screenWidth - 32, 360),
                                backgroundColor: colors.background,
                                borderColor: colors.backgroundSelected,
                            },
                        ]}
                    >
                        {/* Draggable header */}
                        <View
                            style={styles.dragArea}
                            {...panResponder.panHandlers}
                        >
                            <View style={styles.grabber} />

                            <View style={styles.header}>
                                <View style={styles.headerText}>
                                    <Text
                                        style={[
                                            styles.heading,
                                            { color: colors.text },
                                        ]}
                                    >
                                        Veltrix Menu
                                    </Text>

                                    <Text
                                        style={[
                                            styles.subheading,
                                            { color: colors.textSecondary },
                                        ]}
                                    >
                                        Your account and services
                                    </Text>
                                </View>

                                <Pressable
                                    onPress={() => setVisible(false)}
                                    hitSlop={10}
                                    style={styles.closeButton}
                                >
                                    <Ionicons
                                        name="close"
                                        size={23}
                                        color={colors.text}
                                    />
                                </Pressable>
                            </View>
                        </View>

                        
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.menuContent}
                        >
                            {menuItems.map((item) => (
                                <Pressable
                                    key={item.id}
                                    onPress={() => handleNavigate(item.route)}
                                    style={({ pressed }) => [
                                        styles.menuItem,
                                        {
                                            backgroundColor: pressed
                                                ? colors.backgroundSelected
                                                : colors.backgroundElement,
                                        },
                                    ]}
                                >
                                    <View
                                        style={[
                                            styles.iconContainer,
                                            {
                                                backgroundColor: colors.backgroundSelected,
                                            },
                                        ]}
                                    >
                                        <Ionicons
                                            name={item.icon}
                                            size={22}
                                            color={colors.text}
                                        />
                                    </View>

                                    <View style={styles.itemText}>
                                        <Text
                                            style={[
                                                styles.itemTitle,
                                                { color: colors.text },
                                            ]}
                                        >
                                            {item.title}
                                        </Text>

                                        <Text
                                            style={[
                                                styles.itemDescription,
                                                { color: colors.textSecondary },
                                            ]}
                                        >
                                            {item.description}
                                        </Text>
                                    </View>

                                    <Ionicons
                                        name="chevron-forward"
                                        size={18}
                                        color={colors.textSecondary}
                                    />
                                </Pressable>
                            ))}
                        </ScrollView>
                    </Animated.View>
                </View>
            )}

            
            {!visible && (
                <Pressable
                    onPress={() => setVisible(true)}
                    style={[
                        styles.floatingButton,
                        {
                            bottom: insets.bottom + 20,
                            backgroundColor: "#4A3DE0",
                        },
                    ]}
                >
                    <Ionicons
                        name="grid-outline"
                        size={25}
                        color="#FFFFFF"
                    />
                </Pressable>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFill,
        zIndex: 999,
    },

    backdrop: {
        ...StyleSheet.absoluteFill,
        backgroundColor: "rgba(0,0,0,0.28)",
    },

    popup: {
        position: "absolute",
        right: 16,
        borderRadius: 25,
        borderWidth: 1,
        overflow: "hidden",
        elevation: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.2,
        shadowRadius: 16,
    },

    dragArea: {
        paddingHorizontal: 18,
        paddingTop: 10,
    },

    grabber: {
        width: 42,
        height: 5,
        borderRadius: 10,
        backgroundColor: "#929292",
        alignSelf: "center",
        marginBottom: 17,
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingBottom: 17,
    },

    headerText: {
        gap: 4,
    },

    heading: {
        fontSize: 19,
        fontWeight: "700",
    },

    subheading: {
        fontSize: 12,
    },

    closeButton: {
        padding: 5,
    },

    menuContent: {
        paddingHorizontal: 14,
        paddingBottom: 20,
        gap: 10,
    },

    menuItem: {
        minHeight: 72,
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 10,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },

    iconContainer: {
        width: 42,
        height: 42,
        borderRadius: 13,
        alignItems: "center",
        justifyContent: "center",
    },

    itemText: {
        flex: 1,
        gap: 4,
    },

    itemTitle: {
        fontSize: 14,
        fontWeight: "600",
    },

    itemDescription: {
        fontSize: 11,
    },

    floatingButton: {
        position: "absolute",
        right: 20,
        width: 58,
        height: 58,
        borderRadius: 29,
        alignItems: "center",
        justifyContent: "center",
        elevation: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 8,
    },
});
