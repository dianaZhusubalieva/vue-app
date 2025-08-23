import axios from 'axios'
import type { CurrencyConfig, MarketEntry } from '../types'

const currencyUrl = 'https://requestly.tech/api/mockv2/test/api/currency?username=user26614'
const marketUrl = 'https://requestly.tech/api/mockv2/test/api/market?username=user26614'

export async function fetchCurrencies(): Promise<CurrencyConfig[]> {
    const { data } = await axios.get<CurrencyConfig[]>(currencyUrl, { withCredentials: false })
    return data
}

export async function fetchMarket(): Promise<MarketEntry[]> {
    const { data } = await axios.get<MarketEntry[]>(marketUrl, { withCredentials: false })
    return data
}

export function toDataUriSvg(svg: string): string {
    // Check if the SVG is already base64 encoded
    if (svg.startsWith('data:image/svg+xml;base64,')) {
        return svg
    }

    // Check if it's a base64 string without the data URI prefix
    // More robust base64 detection
    const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/
    if (base64Regex.test(svg) && svg.length > 20) {
        try {
            // Try to decode to see if it's valid base64
            atob(svg)
            return `data:image/svg+xml;base64,${svg}`
        } catch (e) {
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

export function formatNumber(value: number, decimals = 2): string {
    return new Intl.NumberFormat(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(value)
}

export function parseNum(v: string | number | null | undefined): number {
    if (v == null) return 0
    const n = typeof v === 'number' ? v : Number(v)
    return Number.isFinite(n) ? n : 0
} 