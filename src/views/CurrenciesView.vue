<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useCurrenciesStore } from '../stores/currencies'
import { formatTimestamp } from '../api/client'
import CurrencyIcon from '../components/CurrencyIcon.vue'

const currencies = useCurrenciesStore()

// Local state
const searchQuery = ref('')
const typeFilter = ref('')

// Computed properties
const filteredCurrencies = computed(() => {
  let filtered = currencies.items
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase().trim()
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

const lastUpdatedFormatted = computed(() => 
  currencies.state.lastUpdated ? formatTimestamp(currencies.state.lastUpdated) : null
)

// Lifecycle
onMounted(async () => {
  await currencies.load()
})

// Event handlers
const handleRefresh = async (): Promise<void> => {
  await currencies.refresh()
}

const handleClearFilters = (): void => {
  searchQuery.value = ''
  typeFilter.value = ''
}

const handleClearError = (): void => {
  currencies.clearError()
}

const getTypeColor = (type: string): string => {
  return type === 'Primary' ? 'primary' : 'secondary'
}
</script>

<template>
  <v-container class="py-8">
    <v-card class="pa-6">
      <!-- Header -->
      <v-card-title class="d-flex align-center justify-space-between flex-wrap">
        <h1 class="text-h4 font-weight-bold">Currencies</h1>
        
        <div class="d-flex align-center flex-wrap gap-4">
          <!-- Last Updated -->
          <span 
            v-if="lastUpdatedFormatted" 
            class="text-body-2 text-medium-emphasis"
          >
            Updated: {{ lastUpdatedFormatted }}
          </span>
          
          <!-- Refresh Button -->
          <v-btn
            @click="handleRefresh"
            :disabled="currencies.state.loading"
            color="primary"
            variant="outlined"
            :loading="currencies.state.loading"
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
            v-model="searchQuery"
            placeholder="Search currencies…"
            variant="outlined"
            density="compact"
            prepend-inner-icon="mdi-magnify"
            hide-details
            style="min-width: 300px"
            clearable
          />
          
          <!-- Type Filter -->
          <v-select
            v-model="typeFilter"
            :items="uniqueTypes"
            label="Filter by Type"
            variant="outlined"
            density="compact"
            hide-details
            style="min-width: 200px"
            clearable
          />
          
          <!-- Clear Filters -->
          <v-btn
            @click="handleClearFilters"
            variant="text"
            density="compact"
            prepend-icon="mdi-filter-off"
          >
            Clear Filters
          </v-btn>
        </div>

        <!-- Results Summary -->
        <div v-if="filteredCurrencies.length > 0" class="mb-4">
          <v-chip
            color="primary"
            variant="outlined"
            size="small"
          >
            {{ filteredCurrencies.length }} {{ filteredCurrencies.length === 1 ? 'currency' : 'currencies' }}
          </v-chip>
        </div>

        <!-- Error State -->
        <div v-if="currencies.state.error" class="text-center pa-8">
          <v-icon size="large" color="error">mdi-alert-circle</v-icon>
          <div class="text-body-1 mt-2 text-error">{{ currencies.state.error }}</div>
          <v-btn
            @click="handleClearError"
            color="error"
            variant="outlined"
            class="mt-4"
            prepend-icon="mdi-close"
          >
            Dismiss
          </v-btn>
        </div>

        <!-- Loading State -->
        <div v-else-if="currencies.state.loading" class="text-center pa-8">
          <v-progress-circular indeterminate color="primary" />
          <div class="text-body-1 mt-2">Loading currencies…</div>
        </div>

        <!-- Empty State -->
        <div v-else-if="!filteredCurrencies.length" class="text-center pa-8">
          <v-icon size="large" color="grey">mdi-currency-usd-off</v-icon>
          <div class="text-body-1 mt-2">
            {{ searchQuery || typeFilter ? 'No currencies match your filters' : 'No currencies found' }}
          </div>
        </div>

        <!-- Currency Grid -->
        <v-row v-else>
          <v-col
            v-for="currency in filteredCurrencies"
            :key="currency.ticker"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <v-card class="h-100 currency-card" variant="outlined">
              <v-card-text class="text-center pa-4">
                <!-- Currency Icon -->
                <div class="d-flex justify-center mb-3">
                  <CurrencyIcon 
                    :svg="currency.icon" 
                    :size="48" 
                    :alt="currency.ticker" 
                  />
                </div>
                
                <!-- Currency Info -->
                <h3 class="text-h6 font-weight-bold mb-1">{{ currency.ticker }}</h3>
                <p class="text-body-2 text-medium-emphasis mb-2">{{ currency.code }}</p>
                
                <!-- Type Badge -->
                <v-chip
                  :color="getTypeColor(currency.type)"
                  size="small"
                  variant="outlined"
                  class="mb-3"
                >
                  {{ currency.type }}
                </v-chip>
                
                <!-- Additional Info -->
                <div class="text-caption text-medium-emphasis">
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

<style scoped>
.gap-4 {
  gap: 1rem;
}

.currency-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border-radius: 12px;
}

.currency-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
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