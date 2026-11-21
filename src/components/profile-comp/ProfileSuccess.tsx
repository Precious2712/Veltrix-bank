import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

type Props = {
    firstname: string;
    accentColor: string;
    onAccentColor: string;
    textColor: string;
    mutedColor: string;
    // surfaceColor: string;
    onContinue: () => void;
};

export default function ProfileSuccess({
    firstname,
    accentColor,
    onAccentColor,
    textColor,
    mutedColor,
    // surfaceColor,
    onContinue,
}: Props) {
    return (
        <View style={styles.container}>
            <View
                style={[
                    styles.iconContainer,
                    { backgroundColor: accentColor },
                ]}
            >
                <Text style={[styles.checkmark, { color: onAccentColor }]}>
                    ✓
                </Text>
            </View>

            <Text style={[styles.title, { color: textColor }]}>
                You're all set, {firstname}.
            </Text>

            <Text style={[styles.description, { color: mutedColor }]}>
                Your profile is ready. You can view it any time from the menu.
            </Text>

            <Pressable
                onPress={onContinue}
                style={({ pressed }) => [
                    styles.button,
                    {
                        backgroundColor: accentColor,
                        opacity: pressed ? 0.85 : 1,
                    },
                ]}
            >
                <Text style={[styles.buttonText, { color: onAccentColor }]}>
                    Go to home
                </Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
    },
    iconContainer: {
        width: 84,
        height: 84,
        borderRadius: 42,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    checkmark: {
        fontSize: 40,
        fontWeight: '800',
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        textAlign: 'center',
    },
    description: {
        fontSize: 15,
        lineHeight: 23,
        textAlign: 'center',
        marginTop: 12,
    },
    button: {
        width: '100%',
        height: 58,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 36,
    },
    buttonText: {
        fontSize: 17,
        fontWeight: '700',
    },
});