export type NetworkId = "mtn" | "glo" | "airtel" | "9mobile";

export type Network = {
    id: NetworkId;
    name: string;
    wordmark: string;
    bg: string;
    fg: string;
    ringColor: string;
    arrowBg: string;
    arrowFg: string;
};

export const NETWORKS: Network[] = [
    {
        id: "mtn",
        name: "MTN",
        wordmark: "MTN",
        bg: "#FFCC00",
        fg: "#12142B",
        ringColor: "rgba(255,255,255,0.35)",
        arrowBg: "#12142B",
        arrowFg: "#FFFFFF",
    },
    {
        id: "glo",
        name: "Glo",
        wordmark: "glo",
        bg: "#50B651",
        fg: "#12142B",
        ringColor: "rgba(255,255,255,0.30)",
        arrowBg: "#12142B",
        arrowFg: "#FFFFFF",
    },
    {
        id: "airtel",
        name: "Airtel",
        wordmark: "airtel",
        bg: "#E40000",
        fg: "#FFFFFF",
        ringColor: "rgba(255,255,255,0.18)",
        arrowBg: "rgba(255,255,255,0.24)",
        arrowFg: "#FFFFFF",
    },
    {
        id: "9mobile",
        name: "9mobile",
        wordmark: "9mobile",
        bg: "#0B6B3A",
        fg: "#FFFFFF",
        ringColor: "rgba(255,255,255,0.14)",
        arrowBg: "rgba(255,255,255,0.24)",
        arrowFg: "#FFFFFF",
    },
];

export const getNetwork = (id: NetworkId) =>
    NETWORKS.find((network) => network.id === id)!;