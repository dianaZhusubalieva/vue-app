<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useCurrenciesStore } from '../stores/currencies'
import { useMarketStore } from '../stores/market'
import { formatTimestamp } from '../api/client'
import { POLLING_CONFIG } from '../constants'
import MarketTable from '../components/MarketTable.vue'

const currencies = useCurrenciesStore()
const market = useMarketStore()


const rows = computed(() => market.sorted)
const lastUpdatedFormatted = computed(() => 
  market.lastUpdated ? formatTimestamp(market.lastUpdated) : null
)


onMounted(async () => {
  await currencies.load()
  market.startPolling() 
})

const handleSort = (key: any): void => {
  market.setSort(key)
}

const handleRefresh = async (): Promise<void> => {
  await market.load()
}

const handlePollingIntervalChange = (event: Event): void => {
  const target = event.target as HTMLInputElement
  const value = parseInt(target.value, 10)
  if (!isNaN(value)) {
    market.setPollingInterval(value)
  }
}
</script>

<template>
  <v-container class="py-8">
    <v-card class="pa-6">
      <!-- Header -->
      <v-card-title class="d-flex align-center justify-space-between flex-wrap">
        <h1 class="text-h4 font-weight-bold">Crypto Markets</h1>
        
        <div class="d-flex align-center flex-wrap gap-4">
          <!-- Last Updated -->
          <span 
            v-if="lastUpdatedFormatted" 
            class="text-body-2 text-medium-emphasis"
          >
            Updated: {{ lastUpdatedFormatted }}
          </span>
          
          <!-- Polling Interval -->
          <v-text-field
            v-model.number="market.pollingMs"
            type="number"
            label="Poll (ms)"
            :min="POLLING_CONFIG.MIN_INTERVAL"
            :max="POLLING_CONFIG.MAX_INTERVAL"
            :step="POLLING_CONFIG.STEP"
            density="compact"
            variant="outlined"
            style="max-width: 150px"
            hide-details
            @input="handlePollingIntervalChange"
          />
          
          <!-- Refresh Button -->
          <v-btn
            @click="handleRefresh"
            :disabled="market.loading"
            color="primary"
            variant="outlined"
            :loading="market.loading"
            prepend-icon="mdi-refresh"
          >
            Refresh
          </v-btn>
        </div>
      </v-card-title>

      <!-- Filters -->
      <v-card-text>
        <div class="d-flex flex-wrap gap-4 mb-4">
          <!-- Search Field -->
          <v-text-field
            v-model="market.searchQuery"
            placeholder="Search pair… (e.g., ETH, AUD, ETH/AUD)"
            variant="outlined"
            density="compact"
            prepend-inner-icon="mdi-magnify"
            hide-details
            style="min-width: 300px"
            clearable
            clear-icon="mdi-close-circle"
            @click:clear="market.searchQuery = ''"
          />
          
          <!-- Secondary Filter -->
          <v-select
            v-model="market.secondaryFilter"
            :items="market.uniqueSecondaries"
            label="Filter by Secondary Currency"
            variant="outlined"
            density="compact"
            hide-details
            style="min-width: 200px"
            clearable
            clear-icon="mdi-close-circle"
            @click:clear="market.secondaryFilter = ''"
          />
          
          <!-- Clear Filters -->
          <v-btn
            @click="market.clearFilters"
            variant="text"
            density="compact"
            prepend-icon="mdi-filter-off"
          >
            Clear Filters
          </v-btn>
        </div>

        <!-- Results Summary -->
        <div v-if="rows.length > 0" class="mb-4">
          <v-chip
            color="primary"
            variant="outlined"
            size="small"
          >
            {{ rows.length }} {{ rows.length === 1 ? 'result' : 'results' }}
          </v-chip>
        </div>

        <!-- Market Table -->
        <MarketTable
          :rows="rows"
          :error="market.error"
          @sort="handleSort"
        />
      </v-card-text>
    </v-card>
  </v-container>
</template>

<style scoped>
.gap-4 {
  gap: 1rem;
}

:deep(.v-card) {
  border-radius: 12px;
}

:deep(.v-card-title) {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  padding-bottom: 1rem;
  margin-bottom: 1rem;
}
</style> 