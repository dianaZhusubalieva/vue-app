<script setup lang="ts">
import { computed } from 'vue'
import { UI_CONFIG } from '../constants'

interface Props {
  values: number[]
  width?: number
  height?: number
  stroke?: string
  fill?: string
}

const props = withDefaults(defineProps<Props>(), {
  width: UI_CONFIG.SPARKLINE.DEFAULT_WIDTH,
  height: UI_CONFIG.SPARKLINE.DEFAULT_HEIGHT,
  stroke: UI_CONFIG.SPARKLINE.STROKE_COLOR,
  fill: UI_CONFIG.SPARKLINE.FILL_COLOR,
})

const points = computed(() => {
  const values = props.values ?? []
  if (!values.length) return ''
  
  const min = Math.min(...values)
  const max = Math.max(...values)
  const dx = values.length <= 1 ? props.width : props.width / (values.length - 1)
  const range = max - min || 1
  
  return values
    .map((value, index) => {
      const x = index * dx
      const y = props.height - ((value - min) / range) * props.height
      return `${x},${y}`
    })
    .join(' ')
})

const areaPath = computed(() => {
  const values = props.values ?? []
  if (!values.length) return ''
  
  const pointsValue = points.value
  if (!pointsValue) return ''
  
  // Close area to bottom of chart
  return `M 0,${props.height} L ${pointsValue} L ${props.width},${props.height} Z`
})

const hasData = computed(() => props.values && props.values.length > 0)
</script>

<template>
  <svg 
    v-if="hasData"
    :width="width" 
    :height="height" 
    viewBox="0 0 100 28" 
    preserveAspectRatio="none"
    class="sparkline"
    role="img"
    :aria-label="`Price trend chart with ${values.length} data points`"
  >
    <path 
      v-if="areaPath" 
      :d="areaPath" 
      :fill="fill" 
      stroke="none" 
      class="sparkline-area"
    />
    <polyline 
      v-if="points" 
      :points="points" 
      :stroke="stroke" 
      stroke-width="1.5" 
      fill="none"
      class="sparkline-line"
    />
  </svg>
  <div 
    v-else 
    class="sparkline-empty"
    :style="{ width: `${width}px`, height: `${height}px` }"
  >
    <v-icon size="small" color="grey">mdi-chart-line</v-icon>
  </div>
</template>

<style scoped>
.sparkline {
  display: block;
  max-width: 100%;
}

.sparkline-area {
  opacity: 0.3;
}

.sparkline-line {
  stroke-linecap: round;
  stroke-linejoin: round;
}

.sparkline-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
}
</style> 