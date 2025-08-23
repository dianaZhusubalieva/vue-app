export interface CurrencyConfig {
    code: string;
    sort_order: number;
    ticker: string;
    type: 'Primary' | 'Secondary' | string;
    decimals_places: number;
    icon: string; // raw SVG string
}

export interface MarketPair {
    primary: string; // e.g., 'Eth'
    secondary: string; // e.g., 'Aud'
}

export interface MarketChange {
    direction: 'Up' | 'Down' | 'Flat' | string;
    percent: string; // e.g., '5.15'
    amount: string; // e.g., '289.3'
}

export interface MarketPrice {
    last: string;
    bestBid: string;
    bestOffer: string;
    change: MarketChange;
}

export interface MarketVolume {
    primary: string; // amount of primary
    secondary: string; // amount of secondary
}

export interface MarketEntry {
    pair: MarketPair;
    price: MarketPrice;
    volume: MarketVolume;
    priceHistory: string[]; // last N prices as strings
}

export type CurrencyMap = Record<string, CurrencyConfig>; // keyed by lowercase ticker

export interface FetchState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
    lastUpdated: number | null;
}

export type SortKey = 'pair' | 'last' | 'percent' | 'volumePrimary' | 'volumeSecondary';
export type SortDirection = 'asc' | 'desc'; 