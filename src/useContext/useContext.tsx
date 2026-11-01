import {
    createContext,
    useCallback,
    useContext,
    useState,
    type ReactNode,
} from "react";

import { api } from "@/services/api";

type CreateAccountResponse = {
    veltrixId: string;
    profileCompleted: boolean;
};

type AuthContextType = {
    veltrixId: string | null;
    profileCompleted: boolean;
    isSubmitting: boolean;
    isSigningIn: boolean;

    createAccount: (pin: string) => Promise<CreateAccountResponse>;

    signIn: (veltrixId: string, pin: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [veltrixId, setVeltrixId] = useState<string | null>(null);
    const [profileCompleted, setProfileCompleted] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSigningIn, setIsSigningIn] = useState(false);

    // CREATE ACCOUNT
    const createAccount = useCallback(async (pin: string) => {
        try {
            setIsSubmitting(true);

            const response = await api.post<CreateAccountResponse>(
                "/users/create",
                {
                    password: pin,
                }
            );

            const data = response.data;

            setVeltrixId(data.veltrixId);
            setProfileCompleted(data.profileCompleted);

            return data;
        } finally {
            setIsSubmitting(false);
        }
    }, []);

    // SIGN IN
    const signIn = useCallback(
        async (userVeltrixId: string, pin: string) => {
            try {
                setIsSigningIn(true);

                await api.post("/auth/sign-in", {
                    veltrixId: userVeltrixId,
                    password: pin,
                });

                setVeltrixId(userVeltrixId);
            } finally {
                setIsSigningIn(false);
            }
        },
        []
    );

    return (
        <AuthContext.Provider
            value={{
                veltrixId,
                profileCompleted,
                isSubmitting,
                isSigningIn,
                createAccount,
                signIn,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
}