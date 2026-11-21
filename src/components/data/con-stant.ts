
import type { Field, FieldKey } from "../data/type";

const required =
    (label: string, min?: number, max?: number) =>
    (value: string): string | null => {
        const trimmed = value.trim();

        if (!trimmed) {
            return `${label} is required`;
        }

        if (min && trimmed.length < min) {
            return `${label} must be at least ${min} characters`;
        }

        if (max && trimmed.length > max) {
            return `${label} must be at most ${max} characters`;
        }

        return null;
    };

export const ADDRESS_REGEX =
    /^\d+\s+[a-zA-Z][a-zA-Z\s.'-]*(,\s*[a-zA-Z][a-zA-Z\s.'-]*)+$/;

export const PROFILE_FIELDS: Field[] = [
    {
        key: 'firstname',
        title: 'What’s your first name?',
        hint: 'Use the name on your ID.',
        placeholder: 'Ada',
        autoCapitalize: 'words',
        validate: required('First name', 2, 50),
    },
    {
        key: 'lastname',
        title: 'And your last name?',
        hint: 'Your family name or surname.',
        placeholder: 'Okafor',
        autoCapitalize: 'words',
        validate: required('Last name', 2, 50),
    },
    {
        key: 'middlename',
        title: 'Got a middle name?',
        hint: 'Optional. Skip it if you don’t.',
        placeholder: 'Chinwe',
        optional: true,
        autoCapitalize: 'words',
        validate: (value) =>
            value.trim().length > 50
                ? 'Middle name must be at most 50 characters'
                : null,
    },
    {
        key: 'country',
        title: 'Which country do you live in?',
        hint: 'Where you’re based right now.',
        placeholder: 'Nigeria',
        autoCapitalize: 'words',
        validate: required('Country'),
    },
    {
        key: 'state',
        title: 'Which state?',
        hint: 'The state you live in.',
        placeholder: 'Lagos',
        autoCapitalize: 'words',
        validate: required('State'),
    },
    {
        key: 'occupation',
        title: 'What do you do?',
        hint: 'Your job or what you spend your days on.',
        placeholder: 'Software developer',
        autoCapitalize: 'words',
        validate: required('Occupation'),
    },
    {
        key: 'address',
        title: 'Where do you stay?',
        hint: 'House number, street, area, state.',
        placeholder: '12 Allen Avenue, Ikeja, Lagos',
        multiline: true,
        autoCapitalize: 'words',
        validate: (value) => {
            const trimmed = value.trim();

            if (!trimmed) {
                return 'Address is required';
            }

            return ADDRESS_REGEX.test(trimmed)
                ? null
                : 'Use this format: 12 Allen Avenue, Ikeja, Lagos';
        },
    },
];

export const REVIEW_LABELS: Record<FieldKey, string> = {
    firstname: 'First name',
    lastname: 'Last name',
    middlename: 'Middle name',
    country: 'Country',
    state: 'State',
    occupation: 'Occupation',
    address: 'Address',
};
