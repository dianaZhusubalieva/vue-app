<script setup lang="ts">
import type { SortKey } from '../types'
import { UI_CONFIG, TABLE_HEADERS, ICONS, STYLES, LABELS } from '../constants'
import Sparkline from './Sparkline.vue'
import CurrencyIcon from './CurrencyIcon.vue'
import { useCurrenciesStore } from '../stores/currencies'

interface TableHeader {
  title: string
  key: string
  sortable: boolean
  align: 'start' | 'center' | 'end'
}

interface ProcessedMarketEntry {
  pairKey: string
  last: number
  percent: number
  volumePrimary: number
  volumeSecondary: number
  history: number[]
  pair: {
    primary: string
    secondary: string
  }
  price: {
    change?: {
      direction: string
    }
  }
}

interface Props {
  rows: ProcessedMarketEntry[]
  error?: string | null
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'sort', key: SortKey): void
}>()

// Get currencies store for icons
const currencies = useCurrenciesStore()


const headers: TableHeader[] = [...TABLE_HEADERS.MARKETS]

const handleSort = (column: any): void => {
  if (column.key && column.key !== 'trend') {
    emit('sort', column.key as SortKey)
  }
}

const getCurrencyIcon = (ticker: string): string | null => {
  const currency = currencies.tickerToCurrency[ticker.toLowerCase()]
  return currency?.icon || null
}


const formatNumber = (value: number, decimals = 8): string => {
  return value.toLocaleString(undefined, { 
    maximumFractionDigits: decimals,
    minimumFractionDigits: 2,
  })
}

// get change color class
const getChangeColorClass = (direction: string | undefined): string => {
  switch (direction) {
    case 'Up':
      return STYLES.COLORS.SUCCESS
    case 'Down':
      return STYLES.COLORS.ERROR
    default:
      return STYLES.COLORS.GREY
  }
}
</script>

<template>
  <div class="market-table">
    <v-data-table
      :headers="headers"
      :items="rows"
      :loading="false"
      :items-per-page="UI_CONFIG.ITEMS_PER_PAGE"
      class="elevation-1"
      @update:options="handleSort"
    >
        <!-- Pair Column -->
        <template v-slot:item.pair="{ item }">
          <div class="d-flex align-center">
            <div class="d-flex align-center mr-2">
              <CurrencyIcon 
                :svg="getCurrencyIcon(item.pair.primary)" 
                :size="UI_CONFIG.CURRENCY_ICON.DEFAULT_SIZE" 
                :alt="item.pair.primary"
              />
              <v-icon size="small" color="grey" class="mx-1">{{ ICONS.ARROW_RIGHT }}</v-icon>
              <CurrencyIcon 
                :svg="getCurrencyIcon(item.pair.secondary)" 
                :size="UI_CONFIG.CURRENCY_ICON.DEFAULT_SIZE" 
                :alt="item.pair.secondary"
              />
            </div>
            <strong>{{ item.pairKey }}</strong>
          </div>
        </template>

        <!-- Last Price Column -->
        <template v-slot:item.last="{ item }">
          <span class="text-end font-weight-medium">
            {{ formatNumber(item.last) }}
          </span>
        </template>

        <!-- Change % Column -->
        <template v-slot:item.percent="{ item }">
          <span 
            class="text-end font-weight-medium"
            :class="getChangeColorClass(item.price.change?.direction)"
          >
            {{ item.percent.toFixed(2) }}%
          </span>
        </template>

        <!-- Volume Primary Column -->
        <template v-slot:item.volumePrimary="{ item }">
          <span class="text-end">
            {{ formatNumber(item.volumePrimary, 2) }}
          </span>
        </template>

        <!-- Volume Secondary Column -->
        <template v-slot:item.volumeSecondary="{ item }">
          <span class="text-end">
            {{ formatNumber(item.volumeSecondary, 2) }}
          </span>
        </template>

        <!-- Trend Column -->
        <template v-slot:item.trend="{ item }">
          <div class="d-flex justify-end">
            <Sparkline 
              :values="item.history" 
              :width="UI_CONFIG.SPARKLINE.DEFAULT_WIDTH" 
              :height="UI_CONFIG.SPARKLINE.DEFAULT_HEIGHT" 
            />
          </div>
        </template>

        <!-- No Data State -->
        <template v-slot:no-data>
          <div v-if="$props.error" class="text-center pa-4">
            <v-icon size="large" :color="STYLES.COLORS.ERROR">{{ ICONS.ALERT }}</v-icon>
            <div class="text-body-1 mt-2 text-error">{{ $props.error }}</div>
          </div>
          <div v-else class="text-center pa-4">
            <v-icon size="large" color="grey">{{ ICONS.DATABASE_OFF }}</v-icon>
            <div class="text-body-1 mt-2">{{ LABELS.COMMON.NO_DATA }}</div>
          </div>
        </template>
      </v-data-table>
    </div>
  </template>

<style scoped>
.market-table {
  width: 100%;
}

:deep(.v-data-table) {
  border-radius: 8px;
  overflow: hidden;
}

:deep(.v-data-table__wrapper) {
  border-radius: 8px;
}

:deep(.v-data-table-header) {
  background-color: rgba(0, 0, 0, 0.02);
}

:deep(.v-data-table-header th) {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
}
</style>
