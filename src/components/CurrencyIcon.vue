<script setup lang="ts">
import { computed, ref } from 'vue'
import { toDataUriSvg } from '../api/client'

interface Props {
  svg: string | null | undefined
  size?: number
  alt?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 20,
  alt: 'currency'
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

const handleError = () => {
  hasError.value = true
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
    style="object-fit: contain;"
  />
  <v-avatar v-else :size="size" color="grey-lighten-3">
    <v-icon size="small" color="grey">mdi-currency-usd</v-icon>
  </v-avatar>
</template> 