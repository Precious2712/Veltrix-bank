import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

type Props = {
    isReview: boolean;
    isLastStep: boolean;
    skipping: boolean;
    submitting: boolean;
    onNext: () => void;
    onSubmit: () => void;
    accentColor: string;
    onAccentColor: string;
    textColor: string;
    surfaceColor: string;
    borderColor: string;
};

export default function ProfileFooter({
    isReview,
    isLastStep,
    skipping,
    submitting,
    onNext,
    onSubmit,
    accentColor,
    onAccentColor,
    textColor,
    surfaceColor,
    borderColor,
}: Props) {
    const buttonLabel = skipping
        ? 'Skip'
        : isLastStep
            ? 'Review'
            : 'Continue';

    return (
        <View style={styles.container}>
            <Pressable
                onPress={isReview ? onSubmit : onNext}
                disabled={submitting}
                style={({ pressed }) => [
                    styles.button,
                    {
                        backgroundColor: skipping
                            ? surfaceColor
                            : accentColor,
                        borderWidth: skipping ? 1 : 0,
                        borderColor,
                        opacity: pressed || submitting ? 0.85 : 1,
                    },
                ]}
            >
                {submitting ? (
                    <ActivityIndicator color={onAccentColor} />
                ) : (
                    <Text
                        style={[
                            styles.buttonText,
                            {
                                color: skipping
                                    ? textColor
                                    : onAccentColor,
                            },
                        ]}
                    >
                        {isReview ? 'Create profile' : buttonLabel}
                    </Text>
                )}
            </Pressable>

            {!isReview && (
                <Text style={[styles.helper, { color: textColor }]}>
                    You can go back and edit your details anytime.
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 24,
        paddingTop: 8,
        paddingBottom: 20,
    },
    button: {
        height: 58,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 17,
        fontWeight: '700',
    },
    helper: {
        fontSize: 12,
        textAlign: 'center',
        marginTop: 14,
        opacity: 0.65,
    },
});