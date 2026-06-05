<template>
  <image
    class="app-icon"
    :src="src"
    :style="{ width: `${size}px`, height: `${size}px` }"
    mode="aspectFit"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { buildIconDataUri, type IconName } from '../utils/icons'

const props = withDefaults(
  defineProps<{
    name: IconName
    color?: string
    size?: number
    strokeWidth?: number
    filled?: boolean
  }>(),
  {
    color: '#6B5757',
    size: 16,
    strokeWidth: 2,
    filled: false,
  },
)

const src = computed(() =>
  buildIconDataUri(props.name, {
    color: props.color,
    size: props.size,
    strokeWidth: props.strokeWidth,
    filled: props.filled,
  }),
)
</script>

<style scoped>
.app-icon {
  display: block;
  flex-shrink: 0;
}
</style>
