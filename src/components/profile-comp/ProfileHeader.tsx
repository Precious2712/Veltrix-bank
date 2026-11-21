import { Pressable, StyleSheet, Text, View } from 'react-native';


type Props = {
    step: number;
    total: number;
    isReview: boolean;
    onBack: () => void;
    textColor: string;
    surfaceColor: string;
};

export default function ProfileHeader({
    step,
    total,
    isReview,
    onBack,
    textColor,
    surfaceColor,
}: Props) {
    return (
        <View style={styles.header}>
            <Pressable
                onPress={onBack}
                disabled={step === 0}
                hitSlop={12}
                style={[
                    styles.backButton,
                    {
                        backgroundColor: surfaceColor,
                        opacity: step === 0 ? 0.35 : 1,
                    },
                ]}
            >
                <Text style={[styles.backIcon, { color: textColor }]}>
                    ‹
                </Text>
            </Pressable>

            <Text style={[styles.stepCount, { color: textColor }]}>
                {isReview ? 'Review' : `${step + 1} of ${total}`}
            </Text>

            <View style={styles.placeholder} />
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 16,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    backIcon: {
        fontSize: 28,
        lineHeight: 30,
        marginTop: -2,
    },
    stepCount: {
        fontSize: 14,
        fontWeight: '600',
        letterSpacing: 0.2,
    },
    placeholder: {
        width: 40,
    },
});
