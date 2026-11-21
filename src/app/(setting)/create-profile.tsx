
import React, {
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';

import {
    Alert,
    Animated,
    Easing,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
} from 'react-native';

import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';

import { PROFILE_FIELDS } from '@/components/data/con-stant';

import type { ProfilePayload, ProfileValues } from '@/components/data/type';

import ProfileFooter from '@/components/profile-comp/ProfileFooter';
import ProfileHeader from '@/components/profile-comp/ProfileHeader';
import ProfileInput from '@/components/profile-comp/ProfileInput';
import ProfileProgress from '@/components/profile-comp/ProfileProgress';
import ProfileReview from '@/components/profile-comp/ProfileReview';
import ProfileSuccess from '@/components/profile-comp/ProfileSuccess';

import { api } from '@/services/api';
import { useAuth } from '@/useContext/useContext';

type ThemeColors = {
    tint?: string;
    background?: string;
    text?: string;
};

type ScreenColors = {
    bg: string;
    text: string;
    muted: string;
    placeholder: string;
    surface: string;
    border: string;
    accent: string;
    onAccent: string;
    danger: string;
};

const INITIAL_VALUES: ProfileValues = {
    firstname: '',
    lastname: '',
    middlename: '',
    country: '',
    state: '',
    occupation: '',
    address: '',
};

function palette(
    theme: ThemeColors,
    scheme: 'light' | 'dark',
): ScreenColors {
    const dark = scheme === 'dark';

    const accent = theme.tint ?? '#4F46E5';

    return {
        bg: theme.background ?? (dark ? '#0E0F13' : '#FFFFFF'),
        text: theme.text ?? (dark ? '#F4F5F7' : '#12131A'),
        muted: dark
            ? 'rgba(255,255,255,0.55)'
            : 'rgba(18,19,26,0.55)',
        placeholder: dark
            ? 'rgba(255,255,255,0.28)'
            : 'rgba(18,19,26,0.28)',
        surface: dark
            ? 'rgba(255,255,255,0.06)'
            : 'rgba(18,19,26,0.045)',
        border: dark
            ? 'rgba(255,255,255,0.12)'
            : 'rgba(18,19,26,0.1)',
        accent,
        onAccent: dark ? '#0E0F13' : '#FFFFFF',
        danger: dark ? '#FF8A80' : '#D92D20',
    };
}

export default function CreateProfileScreen() {
    const router = useRouter();

    const { markProfileCompleted } = useAuth();

    const scheme = useColorScheme() ?? 'light';
    const theme = Colors[scheme];

    const c = useMemo(
        () => palette(theme, scheme),
        [theme, scheme],
    );

    const total = PROFILE_FIELDS.length;

    const [index, setIndex] = useState(0);

    const [values, setValues] = useState<ProfileValues>(
        INITIAL_VALUES,
    );

    const [error, setError] = useState<string | null>(null);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const [submitting, setSubmitting] = useState(false);
    const [done, setDone] = useState(false);

    const inputRef = useRef<React.ComponentRef<typeof TextInput>>(null);

    const isReview = index === total;
    const field = PROFILE_FIELDS[index];


    const slide = useRef(new Animated.Value(0)).current;
    const direction = useRef<1 | -1>(1);

    const progress = useRef(new Animated.Value(0)).current;


    const animateIn = (dir: 1 | -1) => {
        direction.current = dir;

        slide.setValue(1);

        Animated.timing(slide, {
            toValue: 0,
            duration: 320,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
        }).start();
    };


    useEffect(() => {
        Animated.timing(progress, {
            toValue: index / total,
            duration: 380,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: false,
        }).start();

        const timeout = setTimeout(() => {
            if (!isReview) {
                inputRef.current?.focus();
            }
        }, 340);

        return () => clearTimeout(timeout);
    }, [index, total, progress, isReview]);


    const next = () => {
        if (isReview || !field) return;

        const message = field.validate(values[field.key]);

        if (message && !(field.optional && !values[field.key].trim())) {
            setError(message);
            return;
        }

        setError(null);

        setValues((previous) => ({
            ...previous,
            [field.key]: previous[field.key].trim(),
        }));

        animateIn(1);
        setIndex((previous) => previous + 1);
    };


    const back = () => {
        if (index === 0 || submitting) return;

        setError(null);
        setSubmitError(null);

        animateIn(-1);
        setIndex((previous) => previous - 1);
    };


    const edit = (fieldIndex: number) => {
        if (submitting) return;

        setError(null);
        setSubmitError(null);

        animateIn(-1);
        setIndex(fieldIndex);
    };


    const updateValue = (value: string) => {
        if (!field) return;

        setError(null);

        setValues((previous) => ({
            ...previous,
            [field.key]: value,
        }));
    };


    const submit = async () => {
        if (submitting) return;

        setSubmitting(true);
        setSubmitError(null);

        try {
            const payload: ProfilePayload = {
                firstname: values.firstname.trim(),
                lastname: values.lastname.trim(),
                middlename: values.middlename.trim() || undefined,
                country: values.country.trim(),
                state: values.state.trim(),
                occupation: values.occupation.trim(),
                address: values.address.trim(),
            };

            await api.post('/profile/create', payload);

            await markProfileCompleted();

            Alert.alert(
                'Profile Created',
                'Your Veltrix profile has been created successfully.',
                [
                    {
                        text: 'Continue',
                        onPress: () => {
                            setDone(true);
                        },
                    },
                ],
                { cancelable: false }
            );
        } catch (error: unknown) {
            const message =
                error instanceof Error
                    ? error.message
                    : 'Something went wrong. Please try again.';

            setSubmitError(message);

            Alert.alert(
                'Profile Creation Failed',
                message,
                [{ text: 'Try Again' }]
            );
        } finally {
            setSubmitting(false);
        }
    };

    const value = field ? values[field.key] : '';

    const skipping = Boolean(
        field?.optional && !value.trim(),
    );

    const translateX = slide.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 36 * direction.current],
    });

    const opacity = slide.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0],
    });


    if (done) {
        return (
            <SafeAreaView
                style={[
                    styles.root,
                    { backgroundColor: c.bg },
                ]}
            >
                <ProfileSuccess
                    firstname={values.firstname}
                    accentColor={c.accent}
                    onAccentColor={c.onAccent}
                    textColor={c.text}
                    mutedColor={c.muted}
                    // surfaceColor={c.surface}
                    onContinue={() => router.replace('/home-screen')}
                />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView
            style={[
                styles.root,
                { backgroundColor: c.bg },
            ]}
        >
            <KeyboardAvoidingView
                style={styles.keyboard}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ProfileHeader
                    step={index}
                    total={total}
                    isReview={isReview}
                    onBack={back}
                    textColor={c.text}
                    surfaceColor={c.surface}
                />

                <ProfileProgress
                    progress={progress}
                    accentColor={c.accent}
                    surfaceColor={c.surface}
                />

                <Animated.View
                    style={[
                        styles.body,
                        {
                            opacity,
                            transform: [{ translateX }],
                        },
                    ]}
                >
                    <ScrollView
                        style={styles.scroll}
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        {!isReview && field ? (
                            <ProfileInput
                                field={field}
                                value={value}
                                error={error}
                                inputRef={inputRef}
                                onChange={updateValue}
                                onSubmit={next}
                                colors={{
                                    text: c.text,
                                    muted: c.muted,
                                    surface: c.surface,
                                    border: c.border,
                                    placeholder: c.placeholder,
                                    danger: c.danger,
                                    accent: c.accent,
                                }}
                            />
                        ) : (
                            <>
                                <ProfileReview
                                    values={values}
                                    onEdit={edit}
                                    borderColor={c.border}
                                    surfaceColor={c.surface}
                                    textColor={c.text}
                                    mutedColor={c.muted}
                                    placeholderColor={c.placeholder}
                                />

                                {submitError && (
                                    <Text
                                        style={[
                                            styles.submitError,
                                            { color: c.danger },
                                        ]}
                                    >
                                        {submitError}
                                    </Text>
                                )}
                            </>
                        )}
                    </ScrollView>
                </Animated.View>

                <ProfileFooter
                    isReview={isReview}
                    isLastStep={index === total - 1}
                    skipping={skipping}
                    submitting={submitting}
                    onNext={next}
                    onSubmit={submit}
                    accentColor={c.accent}
                    onAccentColor={c.onAccent}
                    textColor={c.text}
                    surfaceColor={c.surface}
                    borderColor={c.border}
                />
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    keyboard: {
        flex: 1,
    },
    body: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 40,
    },
    submitError: {
        fontSize: 14,
        marginTop: 12,
        paddingHorizontal: 4,
    },

    scroll: {
        flex: 1,
    },

    scrollContent: {
        flexGrow: 1,
        paddingBottom: 24,
    },
});
