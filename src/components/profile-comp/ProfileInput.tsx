import type { ComponentRef } from 'react';

import {
    Platform,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

import type { Field } from '../data/type';

type Props = {
    field: Field;
    value: string;
    error: string | null;
    inputRef?: React.Ref<ComponentRef<typeof TextInput>>;
    onChange: (value: string) => void;
    onSubmit: () => void;
    colors: {
        text: string;
        muted: string;
        surface: string;
        border: string;
        placeholder: string;
        danger: string;
        accent: string;
    };
};

export default function ProfileInput({
    field,
    value,
    error,
    inputRef,
    onChange,
    onSubmit,
    colors,
}: Props) {
    const showCounter =
        field.key === 'firstname' ||
        field.key === 'lastname' ||
        field.key === 'middlename';

    return (
        <View>
            <Text style={[styles.title, { color: colors.text }]}>
                {field.title}
            </Text>

            <Text style={[styles.hint, { color: colors.muted }]}>
                {field.hint}
            </Text>

            <View
                style={[
                    styles.inputWrap,
                    {
                        backgroundColor: colors.surface,
                        borderColor: error
                            ? colors.danger
                            : colors.border,
                    },
                ]}
            >
                <TextInput
                    key={field.key}
                    ref={inputRef}
                    value={value}
                    onChangeText={onChange}
                    placeholder={field.placeholder}
                    placeholderTextColor={colors.placeholder}
                    autoCapitalize={field.autoCapitalize ?? 'sentences'}
                    autoCorrect={false}
                    multiline={field.multiline}
                    returnKeyType={field.multiline ? 'done' : 'next'}
                    blurOnSubmit={Boolean(field.multiline)}
                    onSubmitEditing={onSubmit}
                    selectionColor={colors.accent}
                    style={[
                        styles.input,
                        { color: colors.text },
                        field.multiline && styles.multiline,
                    ]}
                />
            </View>

            <View style={styles.metaRow}>
                <Text style={[styles.error, { color: colors.danger }]}>
                    {error ?? ' '}
                </Text>

                {showCounter && (
                    <Text style={[styles.counter, { color: colors.muted }]}>
                        {value.length}/50
                    </Text>
                )}
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
    inputWrap: {
        marginTop: 32,
        borderRadius: 18,
        borderWidth: 1.5,
        paddingHorizontal: 18,
        paddingVertical: Platform.OS === 'ios' ? 18 : 6,
    },
    input: {
        fontSize: 22,
        fontWeight: '600',
        padding: 0,
    },
    multiline: {
        minHeight: 88,
        textAlignVertical: 'top',
    },
    metaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        minHeight: 20,
    },
    error: {
        fontSize: 14,
        flex: 1,
        paddingRight: 12,
    },
    counter: {
        fontSize: 13,
        fontVariant: ['tabular-nums'],
    },
});