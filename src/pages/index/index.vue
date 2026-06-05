<template>
  <view class="page-root" :style="themeVars">
    <view class="status-bar">
      <text class="status-time">{{ clock }}</text>
      <view class="status-icons">
        <view class="signal">
          <view class="signal-bar h1" />
          <view class="signal-bar h2" />
          <view class="signal-bar h3" />
          <view class="signal-bar h4 muted" />
        </view>
        <view class="wifi-icon">
          <view class="wifi-arc arc-1" />
          <view class="wifi-arc arc-2" />
          <view class="wifi-dot" />
        </view>
        <view class="battery-wrap">
          <view class="battery">
            <view class="battery-fill" />
          </view>
          <view class="battery-tip" />
        </view>
      </view>
    </view>

    <scroll-view scroll-y class="scroll-page">
      <view class="home-head">
        <text class="eyebrow">好好读书 🌸</text>
        <text class="page-title serif">今日精选</text>
      </view>

      <view class="page-pad">
        <swiper
          class="hero-swiper"
          circular
          autoplay
          :interval="4000"
          :duration="700"
          indicator-dots
          indicator-color="rgba(255,255,255,0.42)"
          indicator-active-color="#FFFFFF"
        >
          <swiper-item v-for="article in hotArticles" :key="article.id">
            <view class="carousel-card" @tap="openArticle(article.id)">
              <image class="fill-img" :src="article.cover" mode="aspectFill" />
              <view class="dark-grad" />
              <view class="hot-badge">🔥 热门精选</view>
              <view class="carousel-copy">
                <view
                  class="cat-badge"
                  :style="{
                    color: categoryMap[article.categoryId]?.accent,
                    background: categoryMap[article.categoryId]?.fromColor,
                  }"
                >
                  {{ categoryMap[article.categoryId]?.icon }} {{ categoryMap[article.categoryId]?.name }}
                </view>
                <text class="carousel-title serif">{{ article.title }}</text>
                <view class="carousel-meta">
                  <image class="avatar-sm" :src="article.authorAvatar" mode="aspectFill" />
                  <text>{{ article.author }}</text>
                  <view class="meta-right">
                    <AppIcon name="eye" :size="11" color="rgba(255,255,255,0.7)" />
                    <text>{{ fmtCompact(article.views) }}</text>
                  </view>
                </view>
              </view>
            </view>
          </swiper-item>
        </swiper>

        <view class="section-row">
          <text class="section-title serif">内容分类</text>
          <text class="section-count">{{ filteredArticles.length }} 篇文章</text>
        </view>

        <view class="search-box" :class="{ focused: articleSearch }">
          <AppIcon name="search" :size="14" :color="articleSearch ? T.accent : T.text4" />
          <input
            v-model="articleSearch"
            class="search-input"
            placeholder="搜索文章、作者.."
            placeholder-class="placeholder"
          />
          <button v-if="articleSearch" class="clear-btn" @tap="articleSearch = ''">
            <AppIcon name="x" :size="14" :color="T.text4" />
          </button>
        </view>

        <view class="cat-grid">
          <button
            v-for="category in articleCategories"
            :key="category.id"
            class="cat-pill"
            :class="{ active: activeArticleCategory === category.id }"
            @tap="activeArticleCategory = category.id"
          >
            {{ category.icon }} {{ category.name }}
          </button>
        </view>

        <view class="sort-row">
          <button
            v-for="option in articleSortOptions"
            :key="option.key"
            class="sort-pill"
            :class="{ active: activeArticleSort === option.key }"
            @tap="activeArticleSort = option.key"
          >
            {{ option.emoji }} {{ option.label }}
          </button>
        </view>

        <view v-if="filteredArticles.length === 0" class="empty">
          <text class="empty-emoji">🌸</text>
          <text class="empty-title">没有找到相关文章</text>
          <text class="empty-desc">试试换个关键词？</text>
        </view>

        <view
          v-for="article in filteredArticles"
          :key="article.id"
          class="article-card"
          @tap="openArticle(article.id)"
        >
          <view class="article-cover">
            <image class="fill-img" :src="article.cover" mode="aspectFill" />
            <view class="card-grad" />
            <view
              class="cat-badge card-cat"
              :style="{
                color: categoryMap[article.categoryId]?.accent,
                background: categoryMap[article.categoryId]?.fromColor,
              }"
            >
              {{ categoryMap[article.categoryId]?.icon }} {{ categoryMap[article.categoryId]?.name }}
            </view>
            <view class="views-badge">
              <AppIcon name="eye" :size="11" :color="T.text3" />
              <text>{{ fmtCompact(article.views) }}</text>
            </view>
          </view>

          <view class="article-body">
            <text class="article-title serif">{{ article.title }}</text>
            <text class="article-excerpt line-2">{{ article.excerpt }}</text>
            <view class="article-meta">
              <image class="avatar-xs" :src="article.authorAvatar" mode="aspectFill" />
              <text>{{ article.author }}</text>
              <text class="dot">·</text>
              <view class="meta-inline">
                <AppIcon name="clock" :size="10" :color="T.text4" />
                <text>{{ article.readTime }} min</text>
              </view>
              <view class="like-meta">
                <AppIcon name="heart" :size="13" :color="T.accentPink" filled />
                <text>{{ fmtCompact(article.likes) }}</text>
              </view>
            </view>
          </view>
        </view>

        <view class="bottom-gap" />
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import AppIcon from '../../components/AppIcon.vue'
import { fmtCompact } from '../../utils/author-profile'
import { T } from '../../utils/theme'
import { articles, categories } from '../../mock/data'

type SortBy = 'newest' | 'hottest' | 'liked'

const clock = ref('09:41')
const articleSearch = ref('')
const activeArticleCategory = ref('all')
const activeArticleSort = ref<SortBy>('newest')

const articleSortOptions = [
  { key: 'newest' as const, label: '最新', emoji: '🕐' },
  { key: 'hottest' as const, label: '最热', emoji: '🔥' },
  { key: 'liked' as const, label: '点赞', emoji: '❤️' },
]

const categoryMap = Object.fromEntries(categories.map((category) => [category.id, category]))
const articleCategories = [{ id: 'all', name: '全部', icon: '✨' }, ...categories.map(({ id, name, icon }) => ({ id, name, icon }))]

const themeVars = computed(() => ({
  '--bg': T.bg,
  '--border': T.border,
  '--text1': T.text1,
  '--text2': T.text2,
  '--text3': T.text3,
  '--text4': T.text4,
  '--accent': T.accent,
  '--accent-pink': T.accentPink,
}))

const hotArticles = computed(() => [...articles].sort((a, b) => b.likes - a.likes).slice(0, 5))

const filteredArticles = computed(() => {
  const query = articleSearch.value.trim()
  return [...articles]
    .filter((article) => activeArticleCategory.value === 'all' || article.categoryId === activeArticleCategory.value)
    .filter((article) => !query || article.title.includes(query) || article.author.includes(query) || article.excerpt.includes(query))
    .sort((left, right) => {
      if (activeArticleSort.value === 'newest') return right.date.localeCompare(left.date)
      if (activeArticleSort.value === 'hottest') return right.views - left.views
      return right.likes - left.likes
    })
})

let clockTimer: ReturnType<typeof setInterval> | null = null

function syncClock() {
  const now = new Date()
  clock.value = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
}

function openArticle(id: string) {
  uni.navigateTo({
    url: `/pages/article/detail?id=${encodeURIComponent(id)}`,
  })
}

onMounted(() => {
  syncClock()
  clockTimer = setInterval(syncClock, 30000)
})

onUnmounted(() => {
  if (clockTimer) clearInterval(clockTimer)
})
</script>

<style scoped>
.page-root {
  min-height: 100vh;
  background: var(--bg);
}

.status-bar {
  height: 44px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--bg);
}

.status-time {
  color: var(--text2);
  font-size: 13px;
  font-weight: 700;
}

.status-icons,
.signal,
.battery-wrap,
.carousel-meta,
.article-meta,
.meta-inline {
  display: flex;
  align-items: center;
}

.status-icons {
  gap: 6px;
}

.signal {
  gap: 2px;
}

.signal-bar {
  width: 3px;
  border-radius: 999px;
  background: var(--text3);
}

.signal-bar.h1 { height: 5px; }
.signal-bar.h2 { height: 7px; }
.signal-bar.h3 { height: 9px; }
.signal-bar.h4 { height: 11px; }
.signal-bar.muted { opacity: 0.4; }

.wifi-icon {
  width: 14px;
  height: 10px;
  position: relative;
}

.wifi-arc {
  position: absolute;
  left: 50%;
  border: 1.6px solid var(--text3);
  border-top-color: transparent;
  border-left-color: transparent;
  transform: translateX(-50%) rotate(45deg);
  border-radius: 50%;
}

.wifi-arc.arc-1 { width: 12px; height: 12px; bottom: -3px; }
.wifi-arc.arc-2 { width: 8px; height: 8px; bottom: -1px; }

.wifi-dot {
  position: absolute;
  left: 50%;
  bottom: 0;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: var(--text3);
  transform: translateX(-50%);
}

.battery-wrap { gap: 2px; }

.battery {
  width: 18px;
  height: 9px;
  border: 1.6px solid var(--text3);
  border-radius: 3px;
  padding: 1px;
}

.battery-fill {
  width: 72%;
  height: 100%;
  border-radius: 1px;
  background: var(--text3);
}

.battery-tip {
  width: 2px;
  height: 5px;
  border-radius: 0 2px 2px 0;
  background: var(--text3);
}

.scroll-page {
  height: calc(100vh - 44px);
}

.home-head {
  padding: 8px 20px 4px;
}

.eyebrow {
  display: block;
  color: var(--text4);
  font-size: 11px;
  letter-spacing: 0.06em;
  margin-bottom: 2px;
}

.page-title {
  color: var(--text1);
  font-size: 26px;
  font-weight: 900;
}

.page-pad {
  padding: 12px 16px 0;
}

.hero-swiper {
  height: 228px;
  margin-bottom: 20px;
}

.carousel-card,
.article-cover {
  position: relative;
  overflow: hidden;
}

.carousel-card {
  height: 228px;
  border-radius: 24px;
}

.fill-img {
  width: 100%;
  height: 100%;
}

.dark-grad,
.card-grad {
  position: absolute;
  inset: 0;
}

.dark-grad,
.card-grad {
  background: linear-gradient(to top, rgba(61, 44, 44, 0.8) 0%, rgba(61, 44, 44, 0.15) 55%, transparent 100%);
}

.hot-badge,
.cat-badge,
.views-badge {
  position: absolute;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 700;
}

.hot-badge {
  top: 14px;
  left: 14px;
  color: #fff;
  background: rgba(255, 92, 77, 0.9);
  padding: 4px 10px;
}

.carousel-copy {
  position: absolute;
  left: 18px;
  right: 18px;
  bottom: 44px;
}

.cat-badge {
  position: static;
  align-self: flex-start;
  padding: 3px 10px;
  max-width: 100%;
}

.carousel-title {
  display: block;
  color: #fff;
  font-size: 17px;
  font-weight: 800;
  line-height: 1.3;
  margin-top: 7px;
}

.carousel-meta {
  gap: 8px;
  color: rgba(255, 255, 255, 0.88);
  font-size: 11px;
  margin-top: 9px;
}

.avatar-sm,
.avatar-xs {
  border-radius: 50%;
}

.avatar-sm {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.5);
}

.meta-right {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 4px;
}

.section-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 0 12px;
}

.section-title {
  color: var(--text1);
  font-size: 16px;
  font-weight: 800;
}

.section-count {
  color: var(--text4);
  font-size: 11px;
}

.search-box {
  min-height: 40px;
  padding: 0 14px;
  border-radius: 13px;
  background: #fff;
  border: 1.5px solid #ede4da;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  box-shadow: 0 2px 16px rgba(180, 120, 100, 0.07), 0 0 0 1px #ede4da;
}

.search-box.focused {
  border-color: rgba(232, 134, 106, 0.25);
  box-shadow: 0 2px 16px rgba(180, 120, 100, 0.07), 0 0 0 1px rgba(232, 134, 106, 0.2);
}

.search-input {
  flex: 1;
  height: 38px;
  color: var(--text1);
  font-size: 13px;
}

.placeholder {
  color: var(--text4);
}

.clear-btn {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cat-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
  margin-bottom: 12px;
}

.cat-pill,
.sort-pill {
  padding: 7px 4px;
  border-radius: 12px;
  color: var(--text3);
  background: #fff;
  border: 1px solid #ede4da;
  font-size: 11px;
  font-weight: 500;
  box-shadow: 0 2px 16px rgba(180, 120, 100, 0.07), 0 0 0 1px #ede4da;
}

.cat-pill.active,
.sort-pill.active {
  color: #fff;
  background: linear-gradient(135deg, #e8866a 0%, #e8a5b4 100%);
  border-color: transparent;
  box-shadow: 0 3px 10px rgba(232, 134, 106, 0.19);
}

.sort-row {
  display: flex;
  gap: 6px;
  margin-bottom: 16px;
}

.sort-pill {
  padding: 5px 14px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 400;
  box-shadow: none;
}

.sort-pill.active {
  color: var(--accent);
  background: var(--accent-light);
  box-shadow: 0 2px 8px rgba(232, 134, 106, 0.13);
}

.empty {
  padding: 42px 20px;
  text-align: center;
}

.empty-emoji,
.empty-title,
.empty-desc {
  display: block;
}

.empty-emoji { font-size: 38px; }

.empty-title {
  color: var(--text2);
  font-size: 15px;
  font-weight: 700;
  margin-top: 12px;
}

.empty-desc {
  color: var(--text4);
  font-size: 12px;
  margin-top: 4px;
}

.article-card {
  overflow: hidden;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 2px 16px rgba(180, 120, 100, 0.07), 0 0 0 1px #ede4da;
  margin-bottom: 16px;
}

.article-cover {
  height: 180px;
}

.card-cat {
  position: absolute;
  top: 12px;
  left: 12px;
}

.views-badge {
  top: 12px;
  right: 12px;
  padding: 4px 10px;
  color: var(--text2);
  background: rgba(255, 255, 255, 0.86);
}

.article-body {
  padding: 14px 16px 16px;
}

.article-title {
  display: block;
  color: var(--text1);
  font-size: 15px;
  font-weight: 700;
  line-height: 1.4;
}

.article-excerpt {
  display: block;
  color: var(--text3);
  font-size: 12px;
  line-height: 1.6;
  margin-top: 6px;
}

.article-meta {
  gap: 8px;
  color: var(--text3);
  font-size: 11px;
  margin-top: 12px;
}

.avatar-xs {
  width: 20px;
  height: 20px;
}

.dot {
  color: var(--text4);
}

.meta-inline {
  gap: 5px;
}

.like-meta {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 4px;
}

.bottom-gap {
  height: 16px;
}

.line-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
</style>
