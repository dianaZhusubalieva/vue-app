<script setup lang="ts">
import { computed, ref } from 'vue'
import { toDataUriSvg } from '../api/client'
import { UI_CONFIG } from '../constants'

interface Props {
  svg: string | null | undefined
  size?: number
  alt?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: UI_CONFIG.CURRENCY_ICON.DEFAULT_SIZE,
  alt: 'currency',
})

const hasError = ref(false)

const src = computed(() => {
  if (!props.svg) return ''
  
  try {
    return toDataUriSvg(props.svg)
  } catch (error) {
    console.warn('Failed to process SVG:', error)
    hasError.value = true
    return ''
  }
})

const handleError = (): void => {
  hasError.value = true
}

const handleLoad = (): void => {
  hasError.value = false
}
</script>

<template>
  <img 
    v-if="src && !hasError" 
    :src="src" 
    :alt="alt" 
    :width="size" 
    :height="size"
    @error="handleError"
    @load="handleLoad"
    class="currency-icon"
    :style="{ objectFit: 'contain' }"
  />
  <v-avatar 
    v-else 
    :size="size" 
    color="grey-lighten-3"
    class="currency-fallback"
  >
    <v-icon 
      size="small" 
      color="grey"
      :icon="UI_CONFIG.CURRENCY_ICON.FALLBACK_ICON"
    />
  </v-avatar>
</template>

<style scoped>
.currency-icon {
  display: block;
  border-radius: 4px;
}

.currency-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style> 