
import type { ApiNetwork } from "./data-bundle-plans";

export const digitsOnly = (value: string): string => {
    return value.replace(/\D/g, "");
};


export const formatPhone = (digits: string): string => {
    return [
        digits.slice(0, 4),
        digits.slice(4, 7),
        digits.slice(7, 11),
    ]
        .filter(Boolean)
        .join(" ");
};

export const naira = (value: number): string => {
    return `₦${value.toLocaleString("en-NG")}`;
};

export const naira2 = (value: number): string => {
    return `₦${value.toLocaleString("en-NG", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
};


export const getApiNetwork = (networkId: string): ApiNetwork => {
    const normalized = networkId.toUpperCase();

    switch (normalized) {
        case "MTN":
            return "MTN";

        case "AIRTEL":
            return "AIRTEL";

        case "GLO":
            return "GLO";

        case "9MOBILE":
        case "NINE_MOBILE":
            return "9MOBILE";

        default:
            throw new Error(`Unsupported network: ${networkId}`);
    }
};


export const getDefaultPlanId = (
    plans: { id: string; popular?: boolean }[],
): string => {
    return (plans.find((plan) => plan.popular) ?? plans[0]).id;
};
