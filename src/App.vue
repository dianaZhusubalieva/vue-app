<script setup lang="ts">
import { ref, computed } from 'vue'
import { NAVIGATION } from './constants'
import MarketView from './views/MarketView.vue'
import CurrenciesView from './views/CurrenciesView.vue'

// State
const currentPage = ref('markets')
const drawer = ref(false)

// Computed properties
const currentPageTitle = computed(() => {
  const page = NAVIGATION.PAGES.find(p => p.value === currentPage.value)
  return page?.title || 'Dashboard'
})

const currentPageIcon = computed(() => {
  const page = NAVIGATION.PAGES.find(p => p.value === currentPage.value)
  return page?.icon || 'mdi-view-dashboard'
})

// Event handlers
const handlePageChange = (page: string): void => {
  currentPage.value = page
  // Close drawer on mobile after navigation
  if (window.innerWidth < 960) {
    drawer.value = false
  }
}

const toggleDrawer = (): void => {
  drawer.value = !drawer.value
}
</script>

<template>
  <v-app>
    <!-- Navigation Drawer -->
    <v-navigation-drawer 
      v-model="drawer" 
      app
      class="navigation-drawer"
    >
      <v-list>
        <v-list-item
          v-for="page in NAVIGATION.PAGES"
          :key="page.value"
          :value="page.value"
          @click="handlePageChange(page.value)"
          :active="currentPage === page.value"
          :prepend-icon="page.icon"
          :title="page.title"
          class="navigation-item"
        />
      </v-list>
    </v-navigation-drawer>

    <!-- App Bar -->
    <v-app-bar app class="app-bar">
      <v-app-bar-nav-icon @click="toggleDrawer" />
      
      <v-app-bar-title class="d-flex align-center">
        <v-icon :icon="currentPageIcon" class="mr-2" />
        {{ currentPageTitle }}
      </v-app-bar-title>
      
      <v-spacer />
      
      <!-- Desktop Navigation -->
      <v-btn-toggle
        v-model="currentPage"
        mandatory
        variant="outlined"
        density="compact"
        class="d-none d-md-flex"
      >
        <v-btn 
          v-for="page in NAVIGATION.PAGES"
          :key="page.value"
          :value="page.value"
          :prepend-icon="page.icon"
          @click="handlePageChange(page.value)"
        >
          {{ page.title }}
        </v-btn>
      </v-btn-toggle>
    </v-app-bar>

    <!-- Main Content -->
    <v-main class="main-content">
      <MarketView v-if="currentPage === 'markets'" />
      <CurrenciesView v-else-if="currentPage === 'currencies'" />
      
      <!-- Fallback for unknown pages -->
      <v-container v-else class="py-8">
        <v-card class="pa-6 text-center">
          <v-icon size="large" color="grey" class="mb-4">mdi-alert-circle</v-icon>
          <h2 class="text-h5 mb-2">Page Not Found</h2>
          <p class="text-body-1 text-medium-emphasis">
            The requested page "{{ currentPage }}" could not be found.
          </p>
          <v-btn
            @click="handlePageChange('markets')"
            color="primary"
            class="mt-4"
            prepend-icon="mdi-home"
          >
            Go to Markets
          </v-btn>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.navigation-drawer {
  border-right: 1px solid rgba(0, 0, 0, 0.12);
}

.navigation-item {
  margin: 4px 8px;
  border-radius: 8px;
}

.navigation-item:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

.app-bar {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.main-content {
  background-color: #040608;
}

:deep(.v-navigation-drawer) {
  border-right: 1px solid rgba(0, 0, 0, 0.12);
}

:deep(.v-list-item--active) {
  background-color: rgba(var(--v-theme-primary), 0.1);
  color: rgb(var(--v-theme-primary));
}

:deep(.v-btn-toggle) {
  border-radius: 8px;
}

:deep(.v-btn-toggle .v-btn) {
  border-radius: 6px;
  margin: 2px;
}
</style>
