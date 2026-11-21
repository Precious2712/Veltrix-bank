
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

import { api } from "@/services/api";


type CreateAccountResponse = {
    veltrixId: string;
    profileCompleted: boolean;
};

type SignInResponse = {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
};

type StoredUser = {
    veltrixId: string;
    profileCompleted: boolean;
};

const STORAGE_KEY = "@veltrix/user";
const ACCESS_TOKEN_KEY = "veltrix_access_token";
const REFRESH_TOKEN_KEY = "veltrix_refresh_token";
const TOKEN_EXPIRY_KEY = "veltrix_token_expiry";


type AuthContextType = {
    veltrixId: string | null;
    profileCompleted: boolean;

    isInitializing: boolean;
    isSubmitting: boolean;
    isSigningIn: boolean;

    createAccount: (pin: string) => Promise<CreateAccountResponse>;
    isSigningOut: boolean;
    signIn: (pin: string) => Promise<void>;
    signOut: () => Promise<void>;
    markProfileCompleted: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [veltrixId, setVeltrixId] = useState<string | null>(null);
    const [profileCompleted, setProfileCompleted] = useState(false);

    const [isInitializing, setIsInitializing] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [isSigningOut, setIsSigningOut] = useState(false);


    useEffect(() => {
        const loadUser = async () => {
            try {
                const storedUser = await AsyncStorage.getItem(STORAGE_KEY);

                if (storedUser) {
                    const user: StoredUser = JSON.parse(storedUser);

                    setVeltrixId(user.veltrixId);
                    setProfileCompleted(user.profileCompleted);
                }
            } catch (error) {
                console.error("Failed to restore user information:", error);
            } finally {
                setIsInitializing(false);
            }
        };

        loadUser();
    }, []);


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

            const user: StoredUser = {
                veltrixId: data.veltrixId,
                profileCompleted: data.profileCompleted,
            };


            await AsyncStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(user)
            );

            setVeltrixId(data.veltrixId);
            setProfileCompleted(data.profileCompleted);

            return data;
        } finally {
            setIsSubmitting(false);
        }
    }, []);


    const signIn = useCallback(
        async (pin: string) => {
            try {
                if (!veltrixId) {
                    throw new Error("No saved Veltrix ID found");
                }

                setIsSigningIn(true);

                const response = await api.post<SignInResponse>(
                    "/auth/sign-in",
                    {
                        veltrixId,
                        password: pin,
                    }
                );

                const {
                    accessToken,
                    refreshToken,
                    expiresIn,
                } = response.data;

                await SecureStore.setItemAsync(
                    ACCESS_TOKEN_KEY,
                    accessToken
                );

                await SecureStore.setItemAsync(
                    REFRESH_TOKEN_KEY,
                    refreshToken
                );

                const expiryTime = Date.now() + expiresIn * 1000;

                await SecureStore.setItemAsync(
                    TOKEN_EXPIRY_KEY,
                    String(expiryTime)
                );

            } finally {
                setIsSigningIn(false);
            }
        },
        [veltrixId]
    );

    const signOut = useCallback(async () => {
        if (isSigningOut) return;

        setIsSigningOut(true);

        try {
            try {
                await api.post("/auth/sign-out");
            } catch (error) {
                console.error("Backend sign-out failed:", error);
            }

        } finally {
            await Promise.allSettled([
                SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
                SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
                SecureStore.deleteItemAsync(TOKEN_EXPIRY_KEY),
                AsyncStorage.removeItem(STORAGE_KEY),
            ]);

            setVeltrixId(null);
            setProfileCompleted(false);

            setIsSigningOut(false);
        }
    }, [isSigningOut]);

    const markProfileCompleted = useCallback(async () => {
        setProfileCompleted(true);

        try {
            const storedUser = await AsyncStorage.getItem(STORAGE_KEY);

            if (storedUser) {
                const user: StoredUser = JSON.parse(storedUser);

                await AsyncStorage.setItem(
                    STORAGE_KEY,
                    JSON.stringify({
                        ...user,
                        profileCompleted: true,
                    })
                );
            }
        } catch (error) {
            console.error("Failed to update profile status:", error);
        }
    }, []);


    return (
        <AuthContext.Provider
            value={{
                veltrixId,
                profileCompleted,
                isInitializing,
                isSubmitting,
                isSigningIn,
                isSigningOut,
                createAccount,
                signIn,
                signOut,
                markProfileCompleted
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
