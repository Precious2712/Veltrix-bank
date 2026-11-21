
import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { REVIEW_LABELS } from '../data/con-stant';
import type { FieldKey, ProfileValues } from '../data/type';

type Props = {
    values: ProfileValues;
    onEdit: (index: number) => void;
    borderColor: string;
    surfaceColor: string;
    textColor: string;
    mutedColor: string;
    placeholderColor: string;
};

const FIELD_KEYS: FieldKey[] = [
    'firstname',
    'lastname',
    'middlename',
    'country',
    'state',
    'occupation',
    'address',
];

export default function ProfileReview({
    values,
    onEdit,
    borderColor,
    surfaceColor,
    textColor,
    mutedColor,
    placeholderColor,
}: Props) {
    return (
        <View>
            <Text style={[styles.title, { color: textColor }]}>
                Check your details
            </Text>

            <Text style={[styles.hint, { color: mutedColor }]}>
                Tap any row to change it.
            </Text>

            <View
                style={[
                    styles.card,
                    {
                        backgroundColor: surfaceColor,
                        borderColor,
                    },
                ]}
            >
                {FIELD_KEYS.map((key, index) => {
                    const value = values[key];

                    return (
                        <Pressable
                            key={key}
                            onPress={() => onEdit(index)}
                            style={({ pressed }) => [
                                styles.row,
                                index > 0 && {
                                    borderTopWidth:
                                        StyleSheet.hairlineWidth,
                                    borderTopColor: borderColor,
                                },
                                pressed && { opacity: 0.6 },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.label,
                                    { color: mutedColor },
                                ]}
                            >
                                {REVIEW_LABELS[key]}
                            </Text>

                            <Text
                                style={[
                                    styles.value,
                                    {
                                        color: value
                                            ? textColor
                                            : placeholderColor,
                                    },
                                ]}
                                numberOfLines={2}
                            >
                                {value || 'Not added'}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 32,
        lineHeight: 38,
        fontWeight: '800',
        letterSpacing: -0.6,
    },
    hint: {
        fontSize: 16,
        lineHeight: 22,
        marginTop: 8,
    },
    card: {
        marginTop: 28,
        borderRadius: 20,
        borderWidth: 1,
        overflow: 'hidden',
    },
    row: {
        paddingHorizontal: 18,
        paddingVertical: 14,
    },
    label: {
        fontSize: 13,
        marginBottom: 2,
    },
    value: {
        fontSize: 17,
        fontWeight: '600',
    },
});
