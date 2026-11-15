
export type DataPeriod = "daily" | "weekly" | "monthly" | "yearly";

export type ApiNetwork = "MTN" | "AIRTEL" | "GLO" | "9MOBILE";

export type ApiCategory = "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";

export type DataPlan = {
  id: string;
  size: string;
  validity: string;
  price: number;
  category: ApiCategory;
  popular?: boolean;
};

export type SavedNumber = {
  label: string;
  number: string;
};

export type PurchaseDetails = {
  network: ApiNetwork;
  type: "DATA";
  phone: string;
  category: ApiCategory;
  dataValue: string;
  price: number;
};

export const PLANS: Record<DataPeriod, DataPlan[]> = {
  daily: [
    {
      id: "d1",
      size: "100 MB",
      validity: "1 day",
      price: 100,
      category: "DAILY",
    },
    {
      id: "d2",
      size: "350 MB",
      validity: "1 day",
      price: 200,
      category: "DAILY",
      popular: true,
    },
    {
      id: "d3",
      size: "1 GB",
      validity: "1 day",
      price: 350,
      category: "DAILY",
    },
    {
      id: "d4",
      size: "2 GB",
      validity: "2 days",
      price: 500,
      category: "DAILY",
    },
  ],

  weekly: [
    {
      id: "w1",
      size: "500 MB",
      validity: "7 days",
      price: 500,
      category: "WEEKLY",
    },
    {
      id: "w2",
      size: "1.5 GB",
      validity: "7 days",
      price: 1000,
      category: "WEEKLY",
      popular: true,
    },
    {
      id: "w3",
      size: "3 GB",
      validity: "7 days",
      price: 1500,
      category: "WEEKLY",
    },
    {
      id: "w4",
      size: "6 GB",
      validity: "7 days",
      price: 2500,
      category: "WEEKLY",
    },
  ],

  monthly: [
    {
      id: "m1",
      size: "2 GB",
      validity: "30 days",
      price: 1200,
      category: "MONTHLY",
    },
    {
      id: "m2",
      size: "5 GB",
      validity: "30 days",
      price: 2000,
      category: "MONTHLY",
      popular: true,
    },
    {
      id: "m3",
      size: "10 GB",
      validity: "30 days",
      price: 3500,
      category: "MONTHLY",
    },
    {
      id: "m4",
      size: "20 GB",
      validity: "30 days",
      price: 5500,
      category: "MONTHLY",
    },
  ],

  yearly: [
    {
      id: "y1",
      size: "50 GB",
      validity: "365 days",
      price: 15000,
      category: "YEARLY",
    },
    {
      id: "y2",
      size: "100 GB",
      validity: "365 days",
      price: 25000,
      category: "YEARLY",
      popular: true,
    },
  ],
};

export const PERIODS: { id: DataPeriod; label: string }[] = [
  { id: "daily", label: "Daily" },
  { id: "weekly", label: "Weekly" },
  { id: "monthly", label: "Monthly" },
  { id: "yearly", label: "Yearly" },
];

export const SAVED_NUMBERS: SavedNumber[] = [
  { label: "My number", number: "07055550120" },
  { label: "Mum", number: "08031234567" },
];
