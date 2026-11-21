
export type FieldKey =
    | 'firstname'
    | 'lastname'
    | 'middlename'
    | 'country'
    | 'state'
    | 'occupation'
    | 'address';

export type Field = {
    key: FieldKey;
    title: string;
    hint: string;
    placeholder: string;
    optional?: boolean;
    multiline?: boolean;
    autoCapitalize?: 'words' | 'sentences' | 'none';
    validate: (value: string) => string | null;
};

export type ProfileValues = Record<FieldKey, string>;

export type ProfilePayload = {
    firstname: string;
    lastname: string;
    middlename?: string;
    country: string;
    state: string;
    occupation: string;
    address: string;
};
