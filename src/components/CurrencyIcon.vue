<script setup lang="ts">
import { computed } from 'vue'
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

const src = computed(() => (props.svg ? toDataUriSvg(props.svg) : ''))
</script>

<template>
  <img v-if="src" :src="src" :alt="alt" :width="size" :height="size" />
  <v-avatar v-else :size="size" color="grey-lighten-3">
    <v-icon size="small" color="grey">mdi-currency-usd</v-icon>
  </v-avatar>
</template> 