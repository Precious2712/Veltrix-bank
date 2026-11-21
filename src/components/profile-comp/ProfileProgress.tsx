import { Animated, StyleSheet, View } from 'react-native';

type Props = {
    progress: Animated.Value;
    accentColor: string;
    surfaceColor: string;
};

export default function ProfileProgress({
    progress,
    accentColor,
    surfaceColor,
}: Props) {
    const width = progress.interpolate({
        inputRange: [0, 1],
        outputRange: ['6%', '100%'],
    });

    return (
        <View
            style={[
                styles.track,
                { backgroundColor: surfaceColor },
            ]}
        >
            <Animated.View
                style={[
                    styles.fill,
                    {
                        backgroundColor: accentColor,
                        width,
                    },
                ]}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    track: {
        height: 6,
        borderRadius: 3,
        marginHorizontal: 20,
        overflow: 'hidden',
    },
    fill: {
        height: 6,
        borderRadius: 3,
    },
});
