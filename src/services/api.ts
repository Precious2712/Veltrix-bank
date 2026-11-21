
import axios, {
    type AxiosError,
    type InternalAxiosRequestConfig,
} from "axios";

import * as SecureStore from "expo-secure-store";

const API_BASE_URL = "http://192.168.97.155:3000";

const ACCESS_TOKEN_KEY = "veltrix_access_token";
const REFRESH_TOKEN_KEY = "veltrix_refresh_token";
const TOKEN_EXPIRY_KEY = "veltrix_token_expiry";

type RefreshTokenResponse = {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
};

type RetryableRequestConfig = InternalAxiosRequestConfig & {
    _retry?: boolean;
};

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
    timeout: 15000,
});

// Refresh token only once when multiple requests fail together
let refreshPromise: Promise<string> | null = null;

// Remove authentication credentials
async function clearAuthTokens() {
    await Promise.all([
        SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
        SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
        SecureStore.deleteItemAsync(TOKEN_EXPIRY_KEY),
    ]);
}

// Request a new access token
async function refreshAccessToken(): Promise<string> {
    const refreshToken = await SecureStore.getItemAsync(
        REFRESH_TOKEN_KEY
    );

    if (!refreshToken) {
        await clearAuthTokens();
        throw new Error("Refresh token not found");
    }

    const response = await axios.post<RefreshTokenResponse>(
        `${API_BASE_URL}/auth/refresh`,
        {
            refreshToken,
        },
        {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            timeout: 15000,
        }
    );

    const {
        accessToken,
        refreshToken: newRefreshToken,
        expiresIn,
    } = response.data;

    if (!accessToken || !newRefreshToken || !expiresIn) {
        throw new Error("Invalid token refresh response");
    }

    // Save newly issued credentials
    await Promise.all([
        SecureStore.setItemAsync(
            ACCESS_TOKEN_KEY,
            accessToken
        ),

        SecureStore.setItemAsync(
            REFRESH_TOKEN_KEY,
            newRefreshToken
        ),

        SecureStore.setItemAsync(
            TOKEN_EXPIRY_KEY,
            String(Date.now() + expiresIn * 1000)
        ),
    ]);

    return accessToken;
}

// Attach access token to outgoing requests
api.interceptors.request.use(
    async (config) => {
        const accessToken = await SecureStore.getItemAsync(
            ACCESS_TOKEN_KEY
        );

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Handle expired access tokens
api.interceptors.response.use(
    (response) => response,

    async (error: AxiosError) => {
        const originalRequest = error.config as
            | RetryableRequestConfig
            | undefined;

        if (
            error.response?.status !== 401 ||
            !originalRequest ||
            originalRequest._retry ||
            originalRequest.url?.includes("/auth/sign-in") ||
            originalRequest.url?.includes("/auth/refresh")
        ) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
            // Reuse an ongoing refresh request if one exists
            if (!refreshPromise) {
                refreshPromise = refreshAccessToken().finally(() => {
                    refreshPromise = null;
                });
            }

            const newAccessToken = await refreshPromise;

            // Retry the original request with the new token
            originalRequest.headers.Authorization =
                `Bearer ${newAccessToken}`;

            return api(originalRequest);

        } catch (refreshError) {
            const refreshStatus = (
                refreshError as AxiosError
            ).response?.status;

            // Clear credentials if the refresh token is rejected
            if (
                refreshStatus === 401 ||
                refreshStatus === 403
            ) {
                await clearAuthTokens();
            }

            return Promise.reject(refreshError);
        }
    }
);
