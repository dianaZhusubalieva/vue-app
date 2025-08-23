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
    // Encode to safe data URI for <img>
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