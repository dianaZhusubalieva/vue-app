import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { fetchMarket, parseNum } from '../api/client'
import type { MarketEntry, SortDirection, SortKey } from '../types'
import { useIntervalFn } from '@vueuse/core'

function toPairKey(e: MarketEntry): string {
    return `${e.pair.primary}/${e.pair.secondary}`.toUpperCase()
}

export const useMarketStore = defineStore('market', () => {
    const raw = ref<MarketEntry[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)
    const lastUpdated = ref<number | null>(null)

    const searchQuery = ref('')
    const secondaryFilter = ref('')
    const sortKey = ref<SortKey>('pair')
    const sortDirection = ref<SortDirection>('asc')

    const pollingMs = ref(5000)

    async function load(): Promise<void> {
        if (loading.value) return
        loading.value = true
        error.value = null
        try {
            raw.value = await fetchMarket()
            lastUpdated.value = Date.now()
        } catch (err: any) {
            error.value = err?.message ?? 'Failed to load market data'
        } finally {
            loading.value = false
        }
    }

    function setSort(key: SortKey) {
        if (sortKey.value === key) {
            sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
        } else {
            sortKey.value = key
            sortDirection.value = 'asc'
        }
    }

    const processed = computed(() => {
        return raw.value.map((e) => {
            const pair = toPairKey(e)
            const last = parseNum(e.price.last)
            const percent = parseNum(e.price.change?.percent)
            const volumePrimary = parseNum(e.volume.primary)
            const volumeSecondary = parseNum(e.volume.secondary)
            const history = (e.priceHistory ?? []).map(parseNum)
            return { ...e, pairKey: pair, last, percent, volumePrimary, volumeSecondary, history }
        })
    })

    const filtered = computed(() => {
        const q = searchQuery.value.trim().toUpperCase()
        const sec = secondaryFilter.value.trim().toUpperCase()
        return processed.value.filter((r: any) => {
            const matchesQ = q ? (r.pairKey.includes(q) || r.pair.primary.toUpperCase().includes(q) || r.pair.secondary.toUpperCase().includes(q)) : true
            const matchesSec = sec ? r.pair.secondary.toUpperCase() === sec : true
            return matchesQ && matchesSec
        })
    })

    const sorted = computed(() => {
        const key = sortKey.value
        const dir = sortDirection.value === 'asc' ? 1 : -1
        return [...filtered.value].sort((a: any, b: any) => {
            let av: any
            let bv: any
            switch (key) {
                case 'pair':
                    av = a.pairKey
                    bv = b.pairKey
                    break
                case 'last':
                    av = a.last
                    bv = b.last
                    break
                case 'percent':
                    av = a.percent
                    bv = b.percent
                    break
                case 'volumePrimary':
                    av = a.volumePrimary
                    bv = b.volumePrimary
                    break
                case 'volumeSecondary':
                    av = a.volumeSecondary
                    bv = b.volumeSecondary
                    break
                default:
                    av = 0
                    bv = 0
            }
            if (av < bv) return -1 * dir
            if (av > bv) return 1 * dir
            return 0
        })
    })

    const uniqueSecondaries = computed(() => {
        const set = new Set<string>()
        for (const e of raw.value) set.add(e.pair.secondary)
        return Array.from(set).sort((a, b) => a.localeCompare(b))
    })

    const { pause, resume, isActive } = useIntervalFn(() => {
        load()
    }, pollingMs, { immediate: false })

    function startPolling() {
        resume()
        // also load immediately on start
        load()
    }

    function stopPolling() {
        pause()
    }

    // auto-reload if polling interval changes
    watch(pollingMs, () => {
        if (isActive.value) {
            pause()
            resume()
        }
    })

    return {
        raw,
        loading,
        error,
        lastUpdated,
        searchQuery,
        secondaryFilter,
        sortKey,
        sortDirection,
        pollingMs,
        processed,
        filtered,
        sorted,
        uniqueSecondaries,
        load,
        setSort,
        startPolling,
        stopPolling,
    }
}) 