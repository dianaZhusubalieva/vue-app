<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useCurrenciesStore } from '../stores/currencies'
import CurrencyIcon from '../components/CurrencyIcon.vue'

const currencies = useCurrenciesStore()

onMounted(async () => {
  await currencies.load()
})

const searchQuery = ref('')
const typeFilter = ref('')

const filteredCurrencies = computed(() => {
  let filtered = currencies.items
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(currency => 
      currency.ticker.toLowerCase().includes(query) ||
      currency.code.toLowerCase().includes(query)
    )
  }
  
  if (typeFilter.value) {
    filtered = filtered.filter(currency => currency.type === typeFilter.value)
  }
  
  return filtered
})

const uniqueTypes = computed(() => {
  const types = [...new Set(currencies.items.map(c => c.type))]
  return types.sort()
})
</script>

<template>
  <v-container class="py-8">
    <v-card class="pa-6">
      <v-card-title class="d-flex align-center justify-space-between flex-wrap">
        <h1 class="text-h4 font-weight-bold">Currencies</h1>
        <div class="d-flex align-center flex-wrap">
          <span v-if="currencies.state.lastUpdated" class="text-body-2 text-medium-emphasis mr-4">
            Updated: {{ new Date(currencies.state.lastUpdated).toLocaleTimeString() }}
          </span>
          <v-btn
            @click="currencies.load"
            :disabled="currencies.state.loading"
            color="primary"
            variant="outlined"
            :loading="currencies.state.loading"
          >
            Refresh
          </v-btn>
        </div>
      </v-card-title>

      <v-card-text>
        <div class="d-flex flex-wrap mb-4">
          <v-text-field
            v-model="searchQuery"
            placeholder="Search currencies…"
            variant="outlined"
            density="compact"
            prepend-inner-icon="mdi-magnify"
            hide-details
            style="min-width: 300px"
            class="mr-4"
          />
          <v-select
            v-model="typeFilter"
            :items="uniqueTypes"
            label="All types"
            variant="outlined"
            density="compact"
            hide-details
            style="min-width: 200px"
          />
        </div>

        <div v-if="currencies.state.error" class="text-center pa-8">
          <v-icon size="large" color="error">mdi-alert-circle</v-icon>
          <div class="text-body-1 mt-2 text-error">{{ currencies.state.error }}</div>
        </div>

        <div v-else-if="currencies.state.loading" class="text-center pa-8">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
          <div class="text-body-1 mt-2">Loading currencies…</div>
        </div>

        <div v-else-if="!filteredCurrencies.length" class="text-center pa-8">
          <v-icon size="large" color="grey">mdi-currency-usd-off</v-icon>
          <div class="text-body-1 mt-2">No currencies found</div>
        </div>

        <v-row v-else>
          <v-col
            v-for="currency in filteredCurrencies"
            :key="currency.ticker"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <v-card class="h-100" variant="outlined">
              <v-card-text class="text-center pa-4">
                <div class="d-flex justify-center mb-3">
                  <CurrencyIcon :svg="currency.icon" :size="48" :alt="currency.ticker" />
                </div>
                <h3 class="text-h6 font-weight-bold mb-1">{{ currency.ticker }}</h3>
                <p class="text-body-2 text-medium-emphasis mb-2">{{ currency.code }}</p>
                <v-chip
                  :color="currency.type === 'Primary' ? 'primary' : 'secondary'"
                  size="small"
                  variant="outlined"
                >
                  {{ currency.type }}
                </v-chip>
                <div class="mt-3 text-caption text-medium-emphasis">
                  Decimals: {{ currency.decimals_places }}
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template> 