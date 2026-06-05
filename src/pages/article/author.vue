<template>
  <view class="page-root" :style="themeVars">
    <AuthorProfileView
      :profile="profile"
      :active-tab="activeTab"
      :following-tab="followingTab"
      :is-followed="isFollowed"
      @back="goBack"
      @toggle-follow="isFollowed = !isFollowed"
      @change-tab="activeTab = $event"
      @change-following-tab="followingTab = $event"
      @open-article="openArticle"
    />
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import AuthorProfileView from '../../components/AuthorProfileView.vue'
import { buildAuthorProfile, type AuthorProfileData } from '../../utils/author-profile'
import { T } from '../../utils/theme'
import type { Article } from '../../mock/data'

const profile = ref<AuthorProfileData>(buildAuthorProfile('林晓峰', 'https://images.unsplash.com/photo-1629740936456-4b990c27e503?w=200&auto=format'))
const activeTab = ref<'articles' | 'following' | 'favorites'>('articles')
const followingTab = ref<'following' | 'fans'>('following')
const isFollowed = ref(false)

const themeVars = computed(() => ({
  '--bg': T.bg,
  '--surface': T.surface,
  '--surface2': T.surface2,
  '--border': T.border,
  '--border-light': T.borderLight,
  '--text1': T.text1,
  '--text2': T.text2,
  '--text3': T.text3,
  '--text4': T.text4,
  '--accent': T.accent,
  '--accent-pink': T.accentPink,
  '--accent-light': T.accentLight,
  '--accent-grad': T.accentGrad,
}))

onLoad((options) => {
  const name = typeof options?.name === 'string' ? decodeURIComponent(options.name) : '林晓峰'
  const avatar =
    typeof options?.avatar === 'string'
      ? decodeURIComponent(options.avatar)
      : 'https://images.unsplash.com/photo-1629740936456-4b990c27e503?w=200&auto=format'
  profile.value = buildAuthorProfile(name, avatar)
})

function goBack() {
  uni.navigateBack()
}

function openArticle(article: Article) {
  uni.navigateTo({
    url: `/pages/article/detail?id=${encodeURIComponent(article.id)}`,
  })
}
</script>

<style scoped>
.page-root {
  min-height: 100vh;
  position: relative;
  background: var(--bg);
}
</style>
