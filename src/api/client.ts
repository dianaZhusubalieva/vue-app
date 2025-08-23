import { httpClient } from './http-client'
import type { CurrencyConfig, MarketEntry } from '../types'

// API endpoints
const ENDPOINTS = {
    CURRENCIES: '/currency',
    MARKET: '/market',
} as const

/**
 * Fetches currency data from the API
 * @returns Promise<CurrencyConfig[]> Array of currency configurations
 * @throws {ApiError} When the request fails
 */
export async function fetchCurrencies(): Promise<CurrencyConfig[]> {
    try {
        return await httpClient.get<CurrencyConfig[]>(ENDPOINTS.CURRENCIES)
    } catch (error: any) {
        throw new Error(error.message || 'Failed to fetch currencies')
    }
}

/**
 * Fetches market data from the API
 * @returns Promise<MarketEntry[]> Array of market entries
 * @throws {ApiError} When the request fails
 */
export async function fetchMarket(): Promise<MarketEntry[]> {
    try {
        return await httpClient.get<MarketEntry[]>(ENDPOINTS.MARKET)
    } catch (error: any) {
        throw new Error(error.message || 'Failed to fetch market data')
    }
}

/**
 * Converts SVG string to data URI format
 * @param svg - SVG string (can be base64, plain SVG, or already data URI)
 * @returns string - Data URI formatted SVG
 */
export function toDataUriSvg(svg: string): string {
    if (!svg) return ''

    // Check if the SVG is already a data URI
    if (svg.startsWith('data:image/svg+xml;')) {
        return svg
    }

    // Check if it's a base64 string without the data URI prefix
    const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/
    if (base64Regex.test(svg) && svg.length > 20) {
        try {
            // Try to decode to see if it's valid base64
            atob(svg)
            return `data:image/svg+xml;base64,${svg}`
        } catch {
            // Not valid base64, treat as plain SVG
        }
    }

    // Check if it starts with <svg (plain SVG)
    if (svg.trim().startsWith('<svg')) {
        return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
    }

    // Otherwise, treat as plain SVG and encode to data URI
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

/**
 * Formats a number with specified decimal places
 * @param value - Number to format
 * @param decimals - Number of decimal places (default: 2)
 * @returns string - Formatted number string
 */
export function formatNumber(value: number, decimals = 2): string {
    if (!Number.isFinite(value)) return '0'

    return new Intl.NumberFormat(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(value)
}

/**
 * Safely parses a value to a number
 * @param value - Value to parse (string, number, null, or undefined)
 * @returns number - Parsed number or 0 if invalid
 */
export function parseNum(value: string | number | null | undefined): number {
    if (value == null) return 0

    const num = typeof value === 'number' ? value : Number(value)
    return Number.isFinite(num) ? num : 0
}

/**
 * Formats a currency pair key
 * @param primary - Primary currency ticker
 * @param secondary - Secondary currency ticker
 * @returns string - Formatted pair key (e.g., "ETH/AUD")
 */
export function formatPairKey(primary: string, secondary: string): string {
    return `${primary}/${secondary}`.toUpperCase()
}

/**
 * Formats a percentage value
 * @param value - Percentage value
 * @param decimals - Number of decimal places (default: 2)
 * @returns string - Formatted percentage string
 */
export function formatPercentage(value: number, decimals = 2): string {
    return `${formatNumber(value, decimals)}%`
}

/**
 * Formats a timestamp to a readable time string
 * @param timestamp - Unix timestamp in milliseconds
 * @returns string - Formatted time string
 */
export function formatTimestamp(timestamp: number): string {
    return new Date(timestamp).toLocaleTimeString()
} 