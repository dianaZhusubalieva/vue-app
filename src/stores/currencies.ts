import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { fetchCurrencies } from '../api/client'
import type { CurrencyConfig, FetchState, CurrencyMap } from '../types'

export const useCurrenciesStore = defineStore('currencies', () => {
    const state = ref<FetchState<CurrencyConfig[]>>({
        data: null,
        loading: false,
        error: null,
        lastUpdated: null,
    })

    const items = computed(() => state.value.data ?? [])

    const tickerToCurrency = computed<CurrencyMap>(() => {
        const map: CurrencyMap = {}
        for (const c of items.value) {
            map[c.ticker.toLowerCase()] = c
        }
        return map
    })

    async function load(): Promise<void> {
        if (state.value.loading) return
        state.value.loading = true
        state.value.error = null
        try {
            const data = await fetchCurrencies()
            state.value.data = data
            state.value.lastUpdated = Date.now()
        } catch (err: any) {
            state.value.error = err?.message ?? 'Failed to load currencies'
        } finally {
            state.value.loading = false
        }
    }

    return {
        state,
        items,
        tickerToCurrency,
        load,
    }
}) 