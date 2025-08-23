import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { fetchCurrencies } from '../api/client'
import type { CurrencyConfig, CurrencyMap, FetchState } from '../types'
import { ERROR_MESSAGES } from '../constants'

export const useCurrenciesStore = defineStore('currencies', () => {

    const state = ref<FetchState<CurrencyConfig[]>>({
        data: null,
        loading: false,
        error: null,
        lastUpdated: null,
    })

    // Computed properties
    const items = computed(() => state.value.data ?? [])

    const tickerToCurrency = computed<CurrencyMap>(() => {
        const map: CurrencyMap = {}
        for (const currency of items.value) {
            map[currency.ticker.toLowerCase()] = currency
        }
        return map
    })

    const uniqueTypes = computed(() => {
        const types = [...new Set(items.value.map(c => c.type))]
        return types.sort()
    })

    const primaryCurrencies = computed(() =>
        items.value.filter(c => c.type === 'Primary')
    )

    const secondaryCurrencies = computed(() =>
        items.value.filter(c => c.type === 'Secondary')
    )

    // Actions
    const load = async (): Promise<void> => {
        if (state.value.loading) return

        state.value.loading = true
        state.value.error = null

        try {
            const data = await fetchCurrencies()
            state.value.data = data
            state.value.lastUpdated = Date.now()
        } catch (error: any) {
            state.value.error = error?.message ?? ERROR_MESSAGES.FETCH_CURRENCIES
        } finally {
            state.value.loading = false
        }
    }

    const refresh = async (): Promise<void> => {
        state.value.lastUpdated = null
        await load()
    }

    const clearError = (): void => {
        state.value.error = null
    }

    const getCurrencyByTicker = (ticker: string): CurrencyConfig | null => {
        return tickerToCurrency.value[ticker.toLowerCase()] || null
    }

    const filterByType = (type: string): CurrencyConfig[] => {
        return items.value.filter(currency => currency.type === type)
    }

    const searchCurrencies = (query: string): CurrencyConfig[] => {
        const searchTerm = query.toLowerCase().trim()
        if (!searchTerm) return items.value

        return items.value.filter(currency =>
            currency.ticker.toLowerCase().includes(searchTerm) ||
            currency.code.toLowerCase().includes(searchTerm)
        )
    }

    return {
        // State
        state,

        // Computed
        items,
        tickerToCurrency,
        uniqueTypes,
        primaryCurrencies,
        secondaryCurrencies,

        // Actions
        load,
        refresh,
        clearError,
        getCurrencyByTicker,
        filterByType,
        searchCurrencies,
    }
}) 