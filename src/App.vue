<script setup lang="ts">
import { ref } from 'vue'
import MarketView from './views/MarketView.vue'
import CurrenciesView from './views/CurrenciesView.vue'

const currentPage = ref('markets')
const drawer = ref(false)

const pages = [
  { title: 'Markets', value: 'markets', icon: 'mdi-chart-line' },
  { title: 'Currencies', value: 'currencies', icon: 'mdi-currency-usd' }
]
</script>

<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app>
      <v-list>
        <v-list-item
          v-for="page in pages"
          :key="page.value"
          :value="page.value"
          @click="currentPage = page.value"
          :active="currentPage === page.value"
        >
          <template v-slot:prepend>
            <v-icon :icon="page.icon"></v-icon>
          </template>
          <v-list-item-title>{{ page.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-app-bar-title>Crypto Dashboard</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn-toggle
        v-model="currentPage"
        mandatory
        variant="outlined"
        density="compact"
      >
        <v-btn value="markets" prepend-icon="mdi-chart-line">Markets</v-btn>
        <v-btn value="currencies" prepend-icon="mdi-currency-usd">Currencies</v-btn>
      </v-btn-toggle>
    </v-app-bar>

    <v-main>
      <MarketView v-if="currentPage === 'markets'" />
      <CurrenciesView v-else-if="currentPage === 'currencies'" />
    </v-main>
  </v-app>
</template>
