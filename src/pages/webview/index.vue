<template>
  <web-view :src="url" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const url = ref('https://github.com')

onLoad((query) => {
  if (typeof query?.url === 'string' && query.url) {
    url.value = decodeURIComponent(query.url)
  }
})
</script>
