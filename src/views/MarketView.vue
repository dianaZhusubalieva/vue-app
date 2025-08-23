<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useCurrenciesStore } from '../stores/currencies'
import { useMarketStore } from '../stores/market'
import MarketTable from '../components/MarketTable.vue'

const currencies = useCurrenciesStore()
const market = useMarketStore()

onMounted(async () => {
  await currencies.load()
  // market.startPolling(); todo: uncomment this
})

const rows = computed(() => market.sorted as any)
</script>

<template>
  <v-container class="py-8">
    <v-card class="pa-6">
      <v-card-title class="d-flex align-center justify-space-between flex-wrap">
        <h1 class="text-h4 font-weight-bold">Crypto Markets</h1>
        <div class="d-flex align-center gap-4 flex-wrap">
          <span v-if="market.lastUpdated" class="text-body-2 text-medium-emphasis">
            Updated: {{ new Date(market.lastUpdated!).toLocaleTimeString() }}
          </span>
          <v-text-field
            v-model.number="market.pollingMs"
            type="number"
            label="Poll (ms)"
            min="1000"
            step="500"
            density="compact"
            variant="outlined"
            style="max-width: 150px"
            hide-details
          />
          <v-btn
            @click="market.load"
            :disabled="market.loading"
            color="primary"
            variant="outlined"
            :loading="market.loading"
          >
            Refresh
          </v-btn>
        </div>
      </v-card-title>

      <v-card-text>
        <div class="d-flex flex-wrap gap-4 mb-4">
          <v-text-field
            v-model="market.searchQuery"
            placeholder="Search pair… (e.g., ETH, AUD, ETH/AUD)"
            variant="outlined"
            density="compact"
            prepend-inner-icon="mdi-magnify"
            hide-details
            style="min-width: 300px"
          />
          <v-select
            v-model="market.secondaryFilter"
            :items="market.uniqueSecondaries"
            label="All secondaries"
            variant="outlined"
            density="compact"
            hide-details
            style="min-width: 200px"
          />
        </div>

        <MarketTable
          :rows="rows"
          :loading="market.loading"
          :error="market.error"
          :sort-key="market.sortKey"
          :sort-direction="market.sortDirection"
          @sort="market.setSort"
        />
      </v-card-text>
    </v-card>
  </v-container>
</template> 