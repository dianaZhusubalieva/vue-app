import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { fetchMarket, parseNum, formatPairKey } from '../api/client'
import type { MarketEntry, SortKey, SortDirection } from '../types'
import { useIntervalFn } from '@vueuse/core'
import { POLLING_CONFIG, ERROR_MESSAGES, SORT_CONFIG } from '../constants'


interface ProcessedMarketEntry extends MarketEntry {
    pairKey: string
    last: number
    percent: number
    volumePrimary: number
    volumeSecondary: number
    history: number[]
}

export const useMarketStore = defineStore('market', () => {
    const raw = ref<MarketEntry[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)
    const lastUpdated = ref<number | null>(null)

    // Filter and sort state
    const searchQuery = ref('')
    const secondaryFilter = ref('')
    const sortKey = ref<SortKey>(SORT_CONFIG.DEFAULT_KEY)
    const sortDirection = ref<SortDirection>(SORT_CONFIG.DEFAULT_DIRECTION)


    const pollingMs = ref(POLLING_CONFIG.DEFAULT_INTERVAL)

    const processed = computed<ProcessedMarketEntry[]>(() => {
        return raw.value.map((entry) => {
            const pairKey = formatPairKey(entry.pair.primary, entry.pair.secondary)
            const last = parseNum(entry.price.last)
            const percent = parseNum(entry.price.change?.percent)
            const volumePrimary = parseNum(entry.volume.primary)
            const volumeSecondary = parseNum(entry.volume.secondary)
            const history = (entry.priceHistory ?? []).map(parseNum)

            return {
                ...entry,
                pairKey,
                last,
                percent,
                volumePrimary,
                volumeSecondary,
                history,
            }
        })
    })

    const filtered = computed(() => {
        const query = searchQuery.value.trim().toUpperCase()
        const secondary = secondaryFilter.value.trim().toUpperCase()

        return processed.value.filter((entry) => {
            const matchesQuery = query
                ? entry.pairKey.includes(query) ||
                entry.pair.primary.toUpperCase().includes(query) ||
                entry.pair.secondary.toUpperCase().includes(query)
                : true

            const matchesSecondary = secondary
                ? entry.pair.secondary.toUpperCase() === secondary
                : true

            return matchesQuery && matchesSecondary
        })
    })

    const sorted = computed(() => {
        const key = sortKey.value
        const direction = sortDirection.value === 'asc' ? 1 : -1

        return [...filtered.value].sort((a, b) => {
            let valueA: number | string
            let valueB: number | string

            switch (key) {
                case 'pair':
                    valueA = a.pairKey
                    valueB = b.pairKey
                    break
                case 'last':
                    valueA = a.last
                    valueB = b.last
                    break
                case 'percent':
                    valueA = a.percent
                    valueB = b.percent
                    break
                case 'volumePrimary':
                    valueA = a.volumePrimary
                    valueB = b.volumePrimary
                    break
                case 'volumeSecondary':
                    valueA = a.volumeSecondary
                    valueB = b.volumeSecondary
                    break
                default:
                    valueA = 0
                    valueB = 0
            }

            if (valueA < valueB) return -1 * direction
            if (valueA > valueB) return 1 * direction
            return 0
        })
    })

    const uniqueSecondaries = computed(() => {
        const secondaries = new Set<string>()
        for (const entry of raw.value) {
            secondaries.add(entry.pair.secondary)
        }
        return Array.from(secondaries).sort((a, b) => a.localeCompare(b))
    })

    const uniquePrimaries = computed(() => {
        const primaries = new Set<string>()
        for (const entry of raw.value) {
            primaries.add(entry.pair.primary)
        }
        return Array.from(primaries).sort((a, b) => a.localeCompare(b))
    })

    // Polling setup
    const { pause, resume, isActive } = useIntervalFn(() => {
        load()
    }, pollingMs, { immediate: false })

    // Actions
    const load = async (): Promise<void> => {
        if (loading.value) return

        loading.value = true

        error.value = null

        try {
            const data = await fetchMarket()
            raw.value = data
            lastUpdated.value = Date.now()
        } catch (err: any) {
            error.value = err?.message ?? ERROR_MESSAGES.FETCH_MARKET
        } finally {
            loading.value = false
        }
    }

    const setSort = (key: SortKey): void => {
        if (sortKey.value === key) {
            sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
        } else {
            sortKey.value = key
            sortDirection.value = 'asc'
        }
    }

    const setSearchQuery = (query: string): void => {
        searchQuery.value = query
    }

    const setSecondaryFilter = (filter: string): void => {
        secondaryFilter.value = filter
    }

    const setPollingInterval = (interval: number): void => {
        pollingMs.value = Math.max(
            POLLING_CONFIG.MIN_INTERVAL,
            Math.min(POLLING_CONFIG.MAX_INTERVAL, interval)
        ) as typeof POLLING_CONFIG.DEFAULT_INTERVAL
    }

    const startPolling = (): void => {
        resume()
        load()
    }

    const stopPolling = (): void => {
        pause()
    }

    const clearError = (): void => {
        error.value = null
    }

    const clearFilters = (): void => {
        searchQuery.value = ''
        secondaryFilter.value = ''
    }

    // Auto-reload if polling interval changes
    watch(pollingMs, () => {
        if (isActive.value) {
            pause()
            resume()
        }
    })

    return {
        // State
        raw,
        loading,
        error,
        lastUpdated,
        searchQuery,
        secondaryFilter,
        sortKey,
        sortDirection,
        pollingMs,
        isActive,

        // Computed
        processed,
        filtered,
        sorted,
        uniqueSecondaries,
        uniquePrimaries,

        // Actions
        load,
        setSort,
        setSearchQuery,
        setSecondaryFilter,
        setPollingInterval,
        startPolling,
        stopPolling,
        clearError,
        clearFilters,
    }
}) 