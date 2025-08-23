<script setup lang="ts">
import type { MarketEntry } from '../types'
import Sparkline from './Sparkline.vue'

interface Row extends MarketEntry {
  pairKey: string
  last: number
  percent: number
  volumePrimary: number
  volumeSecondary: number
  history: number[]
}

interface Props {
  rows: Row[]
  loading?: boolean
  error?: string | null
  sortKey: 'pair' | 'last' | 'percent' | 'volumePrimary' | 'volumeSecondary'
  sortDirection: 'asc' | 'desc'
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'sort', key: Props['sortKey']): void
}>()

// Use props to avoid TypeScript warning
const { loading, error } = props

const headers = [
  { title: 'Pair', key: 'pair', sortable: true, align: 'start' as const },
  { title: 'Last', key: 'last', sortable: true, align: 'end' as const },
  { title: 'Change %', key: 'percent', sortable: true, align: 'end' as const },
  { title: 'Vol (Primary)', key: 'volumePrimary', sortable: true, align: 'end' as const },
  { title: 'Vol (Secondary)', key: 'volumeSecondary', sortable: true, align: 'end' as const },
  { title: 'Trend', key: 'trend', sortable: false, align: 'end' as const }
]

const handleSort = (column: any) => {
  if (column.key && column.key !== 'trend') {
    emit('sort', column.key as Props['sortKey'])
  }
}


</script>

<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="rows"
      :loading="loading"
      :items-per-page="50"
      class="elevation-1"
      @update:options="handleSort"
    >
      <template v-slot:item.pair="{ item }">
        <div class="d-flex align-center">
          <strong>{{ item.pairKey }}</strong>
        </div>
      </template>

      <template v-slot:item.last="{ item }">
        <span class="text-end">
          {{ item.last.toLocaleString(undefined, { maximumFractionDigits: 8 }) }}
        </span>
      </template>

      <template v-slot:item.percent="{ item }">
        <span 
          class="text-end"
          :class="{
            'text-success': item.price.change?.direction === 'Up',
            'text-error': item.price.change?.direction === 'Down'
          }"
        >
          {{ item.percent.toFixed(2) }}%
        </span>
      </template>

      <template v-slot:item.volumePrimary="{ item }">
        <span class="text-end">
          {{ item.volumePrimary.toLocaleString() }}
        </span>
      </template>

      <template v-slot:item.volumeSecondary="{ item }">
        <span class="text-end">
          {{ item.volumeSecondary.toLocaleString() }}
        </span>
      </template>

      <template v-slot:item.trend="{ item }">
        <div class="d-flex justify-end">
          <Sparkline :values="item.history" :width="100" :height="28" />
        </div>
      </template>

      <template v-slot:loading>
        <div class="text-center pa-4">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
          <div class="text-body-1 mt-2">Loading market data…</div>
        </div>
      </template>

      <template v-slot:no-data>
        <div v-if="error" class="text-center pa-4">
          <v-icon size="large" color="error">mdi-alert-circle</v-icon>
          <div class="text-body-1 mt-2 text-error">{{ error }}</div>
        </div>
        <div v-else class="text-center pa-4">
          <v-icon size="large" color="grey">mdi-database-off</v-icon>
          <div class="text-body-1 mt-2">No results</div>
        </div>
      </template>
    </v-data-table>
  </div>
</template> 