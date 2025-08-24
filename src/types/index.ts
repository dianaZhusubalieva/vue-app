import { SORT_CONFIG } from '../constants'

// Type aliases
export type SortKey = typeof SORT_CONFIG.KEYS[number]
export type SortDirectionType = typeof SORT_CONFIG.DIRECTIONS[number]
export type CurrencyType = 'Primary' | 'Secondary'
export type MarketChangeDirection = 'Up' | 'Down' | 'Flat'


export interface CurrencyConfig {
    code: string
    sort_order: number
    ticker: string
    type: CurrencyType
    decimals_places: number
    icon: string // raw SVG string
}

export interface MarketPair {
    primary: string // e.g., 'Eth'
    secondary: string // e.g., 'Aud'
}

export interface MarketChange {
    direction: MarketChangeDirection
    percent: string
    amount: string
}

export interface MarketPrice {
    last: string
    bestBid: string
    bestOffer: string
    change: MarketChange
}

export interface MarketVolume {
    primary: string
    secondary: string
}

export interface MarketEntry {
    pair: MarketPair
    price: MarketPrice
    volume: MarketVolume
    priceHistory: string[] // last N prices as strings
}


export interface ProcessedMarketEntry extends MarketEntry {
    pairKey: string
    last: number
    percent: number
    volumePrimary: number
    volumeSecondary: number
    history: number[]
}


export interface FetchState<T> {
    data: T | null
    loading: boolean
    error: string | null
    lastUpdated: number | null
}

export interface SortState {
    key: SortKey
    direction: SortDirectionType
}

export interface FilterState {
    searchQuery: string
    secondaryFilter: string
    typeFilter: string
}

// API Response interfaces
export interface ApiResponse<T> {
    data: T
    status: number
    statusText: string
}

export interface ApiError {
    message: string
    status?: number
    code?: string
}

// Component prop interfaces
export interface TableHeader {
    title: string
    key: string
    sortable: boolean
    align: 'start' | 'center' | 'end'
}

export interface CurrencyIconProps {
    svg: string | null | undefined
    size?: number
    alt?: string
}

export interface SparklineProps {
    values: number[]
    width?: number
    height?: number
    stroke?: string
    fill?: string
}

// Utility types
export type CurrencyMap = Record<string, CurrencyConfig> // keyed by lowercase ticker

export type NavigationPage = {
    title: string
    value: string
    icon: string
}

// Event interfaces
export interface SortEvent {
    key: SortKey
    direction: SortDirectionType
}

export interface FilterEvent {
    searchQuery: string
    secondaryFilter: string
    typeFilter: string
} 