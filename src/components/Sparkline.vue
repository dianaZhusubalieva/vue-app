<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  values: number[]
  width?: number
  height?: number
  stroke?: string
  fill?: string
}

const props = withDefaults(defineProps<Props>(), {
  width: 100,
  height: 28,
  stroke: '#3b82f6',
  fill: 'rgba(59, 130, 246, 0.15)'
})

const points = computed(() => {
  const vals = props.values ?? []
  if (!vals.length) return ''
  const min = Math.min(...vals)
  const max = Math.max(...vals)
  const dx = vals.length <= 1 ? props.width : props.width / (vals.length - 1)
  const range = max - min || 1
  return vals
    .map((v, i) => {
      const x = i * dx
      const y = props.height - ((v - min) / range) * props.height
      return `${x},${y}`
    })
    .join(' ')
})

const areaPath = computed(() => {
  const vals = props.values ?? []
  if (!vals.length) return ''
  const pts = points.value
  if (!pts) return ''
  // Close area to bottom of chart
  return `M 0,${props.height} L ${pts} L ${props.width},${props.height} Z`
})
</script>

<template>
  <svg :width="width" :height="height" viewBox="0 0 100 28" preserveAspectRatio="none">
    <path v-if="areaPath" :d="areaPath" :fill="fill" stroke="none" />
    <polyline v-if="points" :points="points" :stroke="stroke" stroke-width="1.5" fill="none" />
  </svg>
</template>

<style scoped>
svg {
  display: block;
}
</style> 