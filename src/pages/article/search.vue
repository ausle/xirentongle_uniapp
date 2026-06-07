<template>
  <view class="page-root" :style="themeVars">
    <view class="top-bar" :style="{ paddingTop: `${statusBarHeight}px` }">
      <view class="top-bar__inner">
        <button class="icon-btn" @tap="goBack">
          <AppIcon name="arrow-left" :size="20" :color="T.text2" />
        </button>
        <text class="top-title serif">文章搜索</text>
        <view class="top-slot" />
      </view>
    </view>

    <scroll-view scroll-y class="scroll-page">
      <view class="page-pad">
        <view class="search-box">
          <AppIcon name="search" :size="15" :color="trimmedQuery ? T.accent : T.text4" />
          <input
            v-model="query"
            class="search-input"
            placeholder="搜索文章、作者"
            placeholder-class="placeholder"
            confirm-type="search"
            focus
            @confirm="handleSearchConfirm"
            @blur="handleSearchConfirm"
          />
          <button v-if="query" class="clear-btn" @tap="clearQuery">
            <AppIcon name="x" :size="14" :color="T.text4" />
          </button>
        </view>

        <view v-if="!trimmedQuery && recentSearches.length" class="section">
          <view class="section-row">
            <text class="section-title">最近搜索</text>
            <button class="ghost-btn" @tap="clearRecentSearches">清除</button>
          </view>
          <view class="chip-grid">
            <button
              v-for="item in recentSearches"
              :key="`recent-${item}`"
              class="chip"
              @tap="applyKeyword(item)"
            >
              {{ item }}
            </button>
          </view>
        </view>

        <view v-if="!trimmedQuery" class="section">
          <view class="section-row">
            <text class="section-title">搜索发现</text>
            <button class="ghost-btn" @tap="discoveryHidden = !discoveryHidden">
              {{ discoveryHidden ? '显示' : '隐藏' }}
            </button>
          </view>
          <view v-if="!discoveryHidden" class="chip-grid">
            <button
              v-for="item in discoveryKeywords"
              :key="`discover-${item}`"
              class="chip chip--soft"
              @tap="applyKeyword(item)"
            >
              {{ item }}
            </button>
          </view>
        </view>

        <template v-if="trimmedQuery">
          <view class="section-row result-row">
            <view>
              <text class="section-title serif">搜索结果</text>
              <text class="section-subtitle">“{{ trimmedQuery }}” · {{ filteredArticles.length }} 篇文章</text>
            </view>
          </view>

          <view v-if="filteredArticles.length === 0" class="empty">
            <text class="empty-emoji">🔎</text>
            <text class="empty-title">没有找到相关文章</text>
            <text class="empty-desc">试试更短的关键词，或者换一个作者名看看。</text>
          </view>

          <view
            v-for="article in filteredArticles"
            :key="article.id"
            class="article-card"
            @tap="openArticle(article.id)"
          >
            <view class="article-cover" :class="{ 'article-cover--fallback': isDefaultArticleCover(article.cover) }">
              <image
                :class="['fill-img', { 'fill-img--fallback': isDefaultArticleCover(article.cover) }]"
                :src="article.cover || DEFAULT_ARTICLE_COVER"
                :mode="isDefaultArticleCover(article.cover) ? 'widthFix' : 'aspectFill'"
                @error="handleSearchArticleCoverError(article)"
              />
              <view class="card-grad" :class="{ 'card-grad--fallback': isDefaultArticleCover(article.cover) }" />
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
        </template>

        <view class="bottom-gap" />
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import AppIcon from '../../components/AppIcon.vue'
import { fmtCompact } from '../../utils/author-profile'
import { articles, categories, type Article } from '../../mock/data'
import { T } from '../../utils/theme'

const STORAGE_KEY = 'chance_article_search_recent'
const DEFAULT_ARTICLE_COVER = '/static/article-default.png'
const statusBarHeight = uni.getSystemInfoSync().statusBarHeight ?? 0

const query = ref('')
const recentSearches = ref<string[]>([])
const discoveryHidden = ref(false)

const discoveryKeywords = ['React 18', 'TypeScript', 'Redis', 'RAG', 'Vite', 'Go', 'CSS Grid', 'GPT-4']
const categoryMap = Object.fromEntries(categories.map((category) => [category.id, category]))

const themeVars = computed(() => ({
  '--bg': T.bg,
  '--surface': T.surface,
  '--surface2': T.surface2,
  '--border': T.border,
  '--text1': T.text1,
  '--text2': T.text2,
  '--text3': T.text3,
  '--text4': T.text4,
  '--accent': T.accent,
  '--accent-light': T.accentLight,
  '--accent-pink': T.accentPink,
}))

const trimmedQuery = computed(() => query.value.trim())
const normalizedQuery = computed(() => trimmedQuery.value.toLowerCase())

const filteredArticles = computed(() => {
  if (!normalizedQuery.value) return []
  return [...articles]
    .map((article) => ({
      article,
      score: getArticleScore(article, normalizedQuery.value),
    }))
    .filter((item) => item.score > 0)
    .sort((left, right) => right.score - left.score || right.article.views - left.article.views)
    .map((item) => item.article)
})

function getArticleScore(article: Article, keyword: string) {
  const categoryName = categoryMap[article.categoryId]?.name ?? ''
  const title = article.title.toLowerCase()
  const author = article.author.toLowerCase()
  const excerpt = article.excerpt.toLowerCase()
  const category = categoryName.toLowerCase()

  let score = 0
  if (title.includes(keyword)) score += 8
  if (author.includes(keyword)) score += 5
  if (excerpt.includes(keyword)) score += 3
  if (category.includes(keyword)) score += 2
  return score
}

function loadRecentSearches() {
  const stored = uni.getStorageSync(STORAGE_KEY)
  recentSearches.value = Array.isArray(stored) ? stored.filter((item): item is string => typeof item === 'string') : []
}

function saveRecentSearches() {
  uni.setStorageSync(STORAGE_KEY, recentSearches.value)
}

function commitSearch(rawValue = query.value) {
  const nextValue = rawValue.trim()
  if (!nextValue) return
  recentSearches.value = [nextValue, ...recentSearches.value.filter((item) => item !== nextValue)].slice(0, 8)
  saveRecentSearches()
}

function handleSearchConfirm() {
  commitSearch()
}

function applyKeyword(keyword: string) {
  query.value = keyword
  commitSearch(keyword)
}

function clearQuery() {
  query.value = ''
}

function clearRecentSearches() {
  recentSearches.value = []
  saveRecentSearches()
}

function handleSearchArticleCoverError(article: Article) {
  if (article.cover === DEFAULT_ARTICLE_COVER) {
    return
  }

  article.cover = DEFAULT_ARTICLE_COVER
}

function isDefaultArticleCover(cover?: string) {
  return (cover || '').trim() === DEFAULT_ARTICLE_COVER
}

function openArticle(id: string) {
  commitSearch()
  uni.navigateTo({
    url: `/pages/article/detail?id=${encodeURIComponent(id)}`,
  })
}

function goBack() {
  uni.navigateBack()
}

onLoad((options) => {
  loadRecentSearches()
  if (typeof options?.q === 'string' && options.q.trim()) {
    query.value = options.q.trim()
    commitSearch(options.q)
  }
})
</script>

<style scoped>
.page-root {
  min-height: 100vh;
  background: linear-gradient(180deg, #fffdf7 0%, #fff8f1 100%);
  display: flex;
  flex-direction: column;
}

.top-bar {
  background: rgba(255, 253, 247, 0.94);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(237, 228, 218, 0.8);
}

.top-bar__inner {
  height: 48px;
  padding: 0 14px;
  display: grid;
  grid-template-columns: 40px 1fr 40px;
  align-items: center;
}

.icon-btn,
.top-slot {
  width: 40px;
  height: 40px;
}

.icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}

.top-title {
  text-align: center;
  color: var(--text1);
  font-size: 18px;
  font-weight: 800;
}

.scroll-page {
  flex: 1;
}

.page-pad {
  padding: 14px 16px 0;
}

.search-box {
  min-height: 44px;
  padding: 0 14px;
  border-radius: 15px;
  background: rgba(255, 255, 255, 0.92);
  border: 1.5px solid var(--border);
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 6px 22px rgba(180, 120, 100, 0.08);
}

.search-input {
  flex: 1;
  height: 42px;
  color: var(--text1);
  font-size: 14px;
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

.section {
  margin-top: 22px;
}

.section-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.section-title {
  color: var(--text2);
  font-size: 14px;
  font-weight: 700;
}

.section-subtitle {
  display: block;
  margin-top: 4px;
  color: var(--text4);
  font-size: 11px;
}

.ghost-btn {
  color: var(--accent);
  font-size: 13px;
}

.chip-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.chip {
  padding: 8px 14px;
  border-radius: 12px;
  background: #fff;
  color: var(--text1);
  border: 1px solid var(--border);
  box-shadow: 0 2px 10px rgba(180, 120, 100, 0.05);
  font-size: 13px;
}

.chip--soft {
  background: var(--surface2);
}

.result-row {
  margin-top: 22px;
}

.empty {
  padding: 44px 20px;
  text-align: center;
}

.empty-emoji,
.empty-title,
.empty-desc,
.article-title,
.article-excerpt {
  display: block;
}

.empty-emoji {
  font-size: 38px;
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
  line-height: 1.6;
  margin-top: 4px;
}

.article-card {
  overflow: hidden;
  margin-top: 16px;
  background: #fff;
  border-radius: 22px;
  box-shadow: 0 4px 20px rgba(180, 120, 100, 0.08), 0 0 0 1px rgba(237, 228, 218, 0.95);
}

.article-cover {
  position: relative;
  height: 180px;
  overflow: hidden;
}

.article-cover--fallback {
  height: auto;
  background: linear-gradient(135deg, #fff6ee 0%, #f7ede5 100%);
}

.fill-img {
  width: 100%;
  height: 100%;
}

.fill-img--fallback {
  display: block;
  height: auto;
}

.card-grad {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(61, 44, 44, 0.8) 0%, rgba(61, 44, 44, 0.15) 55%, transparent 100%);
}

.card-grad--fallback {
  background: linear-gradient(to top, rgba(61, 44, 44, 0.34) 0%, rgba(61, 44, 44, 0.05) 55%, transparent 100%);
}

.cat-badge,
.views-badge,
.article-meta,
.meta-inline,
.like-meta {
  display: flex;
  align-items: center;
}

.cat-badge,
.views-badge {
  position: absolute;
  gap: 4px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 700;
}

.card-cat {
  top: 12px;
  left: 12px;
  padding: 3px 10px;
  max-width: calc(100% - 72px);
}

.views-badge {
  top: 12px;
  right: 12px;
  padding: 4px 10px;
  color: var(--text2);
  background: rgba(255, 255, 255, 0.88);
}

.article-body {
  padding: 14px 16px 16px;
}

.article-title {
  color: var(--text1);
  font-size: 15px;
  font-weight: 700;
  line-height: 1.4;
}

.article-excerpt {
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
  border-radius: 50%;
}

.dot {
  color: var(--text4);
}

.meta-inline {
  gap: 5px;
}

.like-meta {
  gap: 4px;
  margin-left: auto;
}

.bottom-gap {
  height: 24px;
}

.line-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
</style>
