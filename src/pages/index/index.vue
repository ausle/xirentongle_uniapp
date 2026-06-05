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
        <text class="eyebrow">READING NOTE</text>
        <text class="page-title serif">今日精选</text>
      </view>

      <view class="page-pad">
        <swiper
          v-if="hotArticles.length"
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
            <view class="carousel-card" @tap="openArticle(article)">
              <image class="fill-img" :src="article.cover" mode="aspectFill" />
              <view class="dark-grad" />
              <view class="hot-badge">热门文章</view>
              <view class="carousel-copy">
                <view
                  class="cat-badge"
                  :style="{
                    color: article.accentColor,
                    background: article.badgeBackground,
                  }"
                >
                  {{ article.categoryName || '未分类' }}
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
          <text class="section-count">{{ articleTotalLabel }}</text>
        </view>

        <button class="search-box search-trigger" @tap="openArticleSearch">
          <AppIcon name="search" :size="14" :color="T.text4" />
          <text class="search-trigger__text">搜索文章、作者</text>
        </button>

        <view class="cat-grid">
          <button
            v-for="category in displayCategories"
            :key="category.key"
            class="cat-pill"
            :class="{ active: activeArticleCategoryKey === category.key }"
            @tap="handleCategorySelect(category.key)"
          >
            {{ category.name }}
          </button>
        </view>

        <view class="sort-row">
          <button
            v-for="option in articleSortOptions"
            :key="option.key"
            class="sort-pill"
            :class="{ active: activeArticleSort === option.key }"
            @tap="handleSortSelect(option.key)"
          >
            {{ option.label }}
          </button>
        </view>

        <view v-if="articleLoading && !displayArticles.length" class="empty">
          <text class="empty-title">加载文章中</text>
          <text class="empty-desc">正在从后端读取分类文章...</text>
        </view>

        <view v-else-if="articleError && !displayArticles.length" class="empty">
          <text class="empty-title">文章加载失败</text>
          <text class="empty-desc">{{ articleError }}</text>
        </view>

        <view v-else-if="displayArticles.length === 0" class="empty">
          <text class="empty-title">当前分类暂无文章</text>
          <text class="empty-desc">可以切换分类或稍后再试。</text>
        </view>

        <view
          v-for="article in displayArticles"
          :key="article.id"
          class="article-card"
          @tap="openArticle(article)"
        >
          <view class="article-cover">
            <image class="fill-img" :src="article.cover" mode="aspectFill" />
            <view class="card-grad" />
            <view
              class="cat-badge card-cat"
              :style="{
                color: article.accentColor,
                background: article.badgeBackground,
              }"
            >
              {{ article.categoryName || '未分类' }}
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
              <view class="meta-inline">
                <AppIcon name="calendar" :size="10" :color="T.text4" />
                <text>{{ article.date }}</text>
              </view>
              <view class="like-meta">
                <AppIcon name="heart" :size="13" :color="T.accentPink" filled />
                <text>{{ fmtCompact(article.likes) }}</text>
              </view>
            </view>
          </view>
        </view>

        <view v-if="articleError && displayArticles.length" class="footer-note">
          <text>{{ articleError }}</text>
        </view>

        <view class="bottom-gap" />
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import AppIcon from '../../components/AppIcon.vue'
import {
  fetchArticlesByCategory,
  fetchIndexData,
  type ArticleCategoryDto,
  type ArticleItemDto,
} from '../../api/index'
import { fmtCompact } from '../../utils/author-profile'
import { T } from '../../utils/theme'
import { categories as mockCategories } from '../../mock/data'

type SortBy = 'newest' | 'hottest' | 'liked'

interface DisplayCategory {
  key: string
  name: string
}

interface HomeArticleView {
  id: string
  title: string
  excerpt: string
  cover: string
  author: string
  authorAvatar: string
  date: string
  readTime: number
  views: number
  likes: number
  categoryName: string
  accentColor: string
  badgeBackground: string
  content: string[]
}

const PAGE_SIZE = 20
const ARTICLE_DETAIL_CACHE_PREFIX = 'chance_article_detail_'
const FALLBACK_COVER = 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&auto=format'
const FALLBACK_AVATAR = 'https://images.unsplash.com/photo-1629740936456-4b990c27e503?w=100&auto=format'

const clock = ref('09:41')
const activeArticleCategoryKey = ref('all')
const activeArticleSort = ref<SortBy>('newest')
const remoteArticleCategories = ref<ArticleCategoryDto[]>([])
const displayArticles = ref<HomeArticleView[]>([])
const articleTotal = ref(0)
const articleLoading = ref(false)
const articleError = ref('')
const categoryLoading = ref(false)

let clockTimer: ReturnType<typeof setInterval> | null = null
let articleRequestId = 0

const articleSortOptions = [
  { key: 'newest' as const, label: '最新' },
  { key: 'hottest' as const, label: '最热' },
  { key: 'liked' as const, label: '点赞高' },
]

const mockCategoryPalette = mockCategories.map((category) => ({
  normalizedName: normalizeCategoryName(category.name),
  accentColor: category.accent,
  badgeBackground: category.fromColor,
}))

const themeVars = computed(() => ({
  '--bg': T.bg,
  '--border': T.border,
  '--text1': T.text1,
  '--text2': T.text2,
  '--text3': T.text3,
  '--text4': T.text4,
  '--accent': T.accent,
  '--accent-light': T.accentLight,
  '--accent-pink': T.accentPink,
}))

const displayCategories = computed<DisplayCategory[]>(() => {
  if (remoteArticleCategories.value.length > 0) {
    return [
      { key: 'all', name: '全部' },
      ...remoteArticleCategories.value.filter((category) => !isTotalCategoryName(category.category)).map((category) => ({
        key: `category:${category.categoryId}`,
        name: category.category,
      })),
    ]
  }

  return [{ key: 'all', name: '全部' }]
})

const activeCategoryName = computed(() => {
  if (activeArticleCategoryKey.value === 'all') {
    return ''
  }

  const matchedCategory = displayCategories.value.find((category) => category.key === activeArticleCategoryKey.value)
  return matchedCategory?.name ?? ''
})

const hotArticles = computed(() => [...displayArticles.value].sort((left, right) => right.likes - left.likes).slice(0, 5))

const articleTotalLabel = computed(() => `${articleTotal.value || displayArticles.value.length} 篇文章`)

function normalizeCategoryName(value?: string) {
  return (value || '').replace(/\s+/g, '').toLowerCase()
}

function isTotalCategoryName(value?: string) {
  const normalizedValue = normalizeCategoryName(value)
  return normalizedValue === '' || normalizedValue === 'all' || normalizedValue === '鍏ㄩ儴'
}

function resolveCategoryPalette(categoryName?: string) {
  const normalizedName = normalizeCategoryName(categoryName)
  const matchedPalette = mockCategoryPalette.find(
    (category) =>
      category.normalizedName === normalizedName ||
      category.normalizedName.includes(normalizedName) ||
      normalizedName.includes(category.normalizedName),
  )

  return matchedPalette ?? {
    accentColor: T.accent,
    badgeBackground: T.accentLight,
  }
}

function splitArticleContent(content?: string, summary?: string) {
  const normalizedContent = (content || '')
    .split(/\n+/)
    .map((item) => item.trim())
    .filter(Boolean)

  if (normalizedContent.length > 0) {
    return normalizedContent
  }

  const normalizedSummary = (summary || '').trim()
  if (normalizedSummary) {
    return [normalizedSummary]
  }

  return ['暂无内容']
}

function estimateReadTime(content?: string, summary?: string) {
  const source = `${content || ''}${summary || ''}`.trim()
  if (!source) {
    return 1
  }

  return Math.max(1, Math.round(source.length / 320))
}

function formatArticleDate(timestamp?: number) {
  if (!timestamp) {
    return '刚刚'
  }

  const date = new Date(timestamp)
  if (Number.isNaN(date.getTime())) {
    return '刚刚'
  }

  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${month}-${day}`
}

function mapArticleDtoToView(article: ArticleItemDto): HomeArticleView {
  const categoryName = article.category?.category || '未分类'
  const palette = resolveCategoryPalette(categoryName)
  const content = splitArticleContent(article.content, article.summary)

  return {
    id: String(article.articleId),
    title: article.title?.trim() || '未命名文章',
    excerpt: article.summary?.trim() || content[0] || '暂无摘要',
    cover: article.cover?.trim() || FALLBACK_COVER,
    author: article.authorName?.trim() || '佚名',
    authorAvatar: article.authorAvatar?.trim() || FALLBACK_AVATAR,
    date: formatArticleDate(article.createTime || article.lastUpdateTime),
    readTime: estimateReadTime(article.content, article.summary),
    views: article.count?.readCount ?? 0,
    likes: article.count?.praiseCount ?? 0,
    categoryName,
    accentColor: palette.accentColor,
    badgeBackground: palette.badgeBackground,
    content,
  }
}

function cacheArticleDetail(article: HomeArticleView) {
  uni.setStorageSync(`${ARTICLE_DETAIL_CACHE_PREFIX}${article.id}`, article)
}

function restoreCachedCategories() {
  const cachedCategories = uni.getStorageSync('chance_article_categories')
  const cachedCurrentCategoryId = uni.getStorageSync('chance_article_current_category_id')

  if (Array.isArray(cachedCategories)) {
    remoteArticleCategories.value = cachedCategories.filter(
      (category): category is ArticleCategoryDto =>
        typeof category?.categoryId === 'number' && typeof category?.category === 'string',
    )
  }

  if (typeof cachedCurrentCategoryId === 'number' && cachedCurrentCategoryId > 0) {
    activeArticleCategoryKey.value = `category:${cachedCurrentCategoryId}`
  }
}

function syncActiveCategoryFromIndex(data?: {
  categories?: ArticleCategoryDto[]
  currentCategory?: string
  categoryId?: number
}) {
  const selectedCategory =
    data?.categories?.find((category) => category.selected) ??
    remoteArticleCategories.value.find((category) => category.selected)

  if (selectedCategory) {
    activeArticleCategoryKey.value = `category:${selectedCategory.categoryId}`
    return
  }

  if (typeof data?.categoryId === 'number' && data.categoryId > 0) {
    activeArticleCategoryKey.value = `category:${data.categoryId}`
    return
  }

  if (typeof data?.currentCategory === 'string' && data.currentCategory.trim()) {
    const matchedCategory = remoteArticleCategories.value.find((category) => category.category === data.currentCategory)
    if (matchedCategory) {
      activeArticleCategoryKey.value = `category:${matchedCategory.categoryId}`
      return
    }
  }

  if (!displayCategories.value.some((category) => category.key === activeArticleCategoryKey.value)) {
    activeArticleCategoryKey.value = 'all'
  }
}

async function loadCategories() {
  if (categoryLoading.value) {
    return
  }

  categoryLoading.value = true
  try {
    const data = await fetchIndexData()
    remoteArticleCategories.value = data.categories ?? []
    uni.setStorageSync('chance_article_categories', remoteArticleCategories.value)
    uni.setStorageSync('chance_article_current_category', data.currentCategory ?? '')
    uni.setStorageSync('chance_article_current_category_id', data.categoryId ?? 0)
    syncActiveCategoryFromIndex(data)
  } catch (error) {
    console.error('Failed to load article categories on home page', error)
    syncActiveCategoryFromIndex()
  } finally {
    categoryLoading.value = false
  }
}

async function loadArticles() {
  const requestId = ++articleRequestId
  articleLoading.value = true
  articleError.value = ''

  try {
    const response = await fetchArticlesByCategory({
      category: activeCategoryName.value || undefined,
      page: 1,
      size: PAGE_SIZE,
      sort: activeArticleSort.value === 'newest' ? 'latest' : 'hot',
    })

    if (requestId !== articleRequestId) {
      return
    }

    const mappedArticles = (response.articles?.list ?? []).map(mapArticleDtoToView)

    if (activeArticleSort.value === 'liked') {
      mappedArticles.sort((left, right) => right.likes - left.likes)
    }

    mappedArticles.forEach(cacheArticleDetail)
    displayArticles.value = mappedArticles
    articleTotal.value = response.total ?? mappedArticles.length
  } catch (error) {
    console.error('Failed to load category articles on home page', error)
    if (requestId !== articleRequestId) {
      return
    }

    displayArticles.value = []
    articleTotal.value = 0
    articleError.value = error instanceof Error ? error.message : '请求文章接口失败'
  } finally {
    if (requestId === articleRequestId) {
      articleLoading.value = false
    }
  }
}

async function refreshHomePage() {
  await loadCategories()
  await loadArticles()
}

function syncClock() {
  const now = new Date()
  clock.value = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
}

async function handleCategorySelect(categoryKey: string) {
  if (activeArticleCategoryKey.value === categoryKey) {
    return
  }

  activeArticleCategoryKey.value = categoryKey
  await loadArticles()
}

async function handleSortSelect(sortKey: SortBy) {
  if (activeArticleSort.value === sortKey) {
    return
  }

  activeArticleSort.value = sortKey
  await loadArticles()
}

function openArticle(article: HomeArticleView) {
  cacheArticleDetail(article)
  uni.navigateTo({
    url: `/pages/article/detail?id=${encodeURIComponent(article.id)}`,
  })
}

function openArticleSearch() {
  uni.navigateTo({
    url: '/pages/article/search',
  })
}

onMounted(() => {
  restoreCachedCategories()
  syncActiveCategoryFromIndex()
  syncClock()
  clockTimer = setInterval(syncClock, 30000)
})

onUnmounted(() => {
  if (clockTimer) {
    clearInterval(clockTimer)
  }
})

onShow(() => {
  void refreshHomePage()
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

.search-trigger {
  justify-content: flex-start;
  width: 100%;
}

.search-trigger__text {
  color: var(--text4);
  font-size: 13px;
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

.empty-title,
.empty-desc {
  display: block;
}

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
  line-height: 1.6;
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
  flex-wrap: wrap;
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

.footer-note {
  margin-top: 4px;
  text-align: center;
  color: var(--text4);
  font-size: 12px;
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
