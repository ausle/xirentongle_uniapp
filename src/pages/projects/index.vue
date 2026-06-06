<template>
  <view class="page-root" :style="themeVars">
    <view class="fixed-head">
      <text class="eyebrow">CATEGORY</text>
      <text class="page-title serif">分类文章</text>
    </view>

    <scroll-view scroll-y class="scroll-page">
      <view class="project-search-zone">
        <button class="search-box search-trigger" @tap="openArticleSearch">
          <AppIcon name="search" :size="14" :color="T.text4" />
          <text class="search-trigger__text">搜索文章、作者</text>
        </button>

        <scroll-view scroll-x class="filter-scroll">
          <button
            v-for="category in displayCategories"
            :key="category.key"
            class="filter-pill"
            :class="{ active: activeCategoryKey === category.key }"
            @tap="selectCategory(category.key)"
          >
            {{ category.label }}
          </button>
        </scroll-view>

        <view class="project-sort">
          <button :class="{ active: activeProjectSort === 'newest' }" @tap="selectSort('newest')">
            <text>最新</text>
            <view class="project-sort-indicator" />
          </button>
          <button :class="{ active: activeProjectSort === 'hottest' }" @tap="selectSort('hottest')">
            <text>最热</text>
            <view class="project-sort-indicator" />
          </button>
        </view>
      </view>

      <view class="page-pad">
        <view v-if="articleLoading && !articles.length" class="empty">
          <text class="empty-emoji">...</text>
          <text class="empty-title">正在加载文章</text>
          <text class="empty-desc">稍等一下，我们正在读取分类内容。</text>
        </view>

        <view v-else-if="articleError && !articles.length" class="empty">
          <text class="empty-emoji">!</text>
          <text class="empty-title">加载失败</text>
          <text class="empty-desc">{{ articleError }}</text>
        </view>

        <view v-else-if="articles.length === 0" class="empty">
          <text class="empty-emoji">0</text>
          <text class="empty-title">当前分类暂无文章</text>
          <text class="empty-desc">试试切换分类或稍后再试。</text>
        </view>

        <view v-for="article in articles" :key="article.id" class="project-card" @tap="openArticle(article)">
          <view class="project-cover">
            <image class="fill-img" :src="article.cover" mode="aspectFill" />
            <view class="project-grad" />
            <view class="star-badge">
              <AppIcon name="eye" :size="11" color="#6B5757" />
              <text>{{ fmtCompact(article.views) }}</text>
            </view>
            <view class="project-cover-copy">
              <text class="project-name serif">{{ article.title }}</text>
              <text class="project-tagline">{{ article.categoryName }}</text>
            </view>
          </view>

          <view class="project-body">
            <text class="line-2 project-desc">{{ article.summary }}</text>
            <view class="tag-row">
              <text class="hash-tag">#{{ article.categoryName }}</text>
              <text class="hash-tag">#{{ article.date }}</text>
            </view>
            <view class="project-meta">
              <image class="avatar-xs" :src="article.authorAvatar" mode="aspectFill" />
              <text>{{ article.authorName }}</text>
              <view
                class="lang-pill"
                :style="{
                  color: article.accentColor,
                  background: `${article.accentColor}18`,
                  borderColor: `${article.accentColor}30`,
                }"
              >
                <view class="lang-dot" :style="{ background: article.accentColor }" />
                <text>{{ article.readTime }} min</text>
              </view>
              <view class="meta-inline">
                <AppIcon name="heart" :size="10" :color="T.accentPink" filled />
                <text>{{ fmtCompact(article.likes) }}</text>
              </view>
            </view>
          </view>
        </view>

        <view v-if="articleError && articles.length" class="footer-note">
          <text>{{ articleError }}</text>
        </view>

        <view class="bottom-gap" />
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
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

type ProjectSort = 'newest' | 'hottest'

interface CategoryOption {
  key: string
  label: string
  categoryName: string
}

interface DisplayArticle {
  id: string
  title: string
  summary: string
  cover: string
  authorName: string
  authorAvatar: string
  categoryName: string
  date: string
  readTime: number
  views: number
  likes: number
  content: string[]
  accentColor: string
}

const ARTICLE_DETAIL_CACHE_PREFIX = 'chance_article_detail_'
const FALLBACK_COVER = 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&auto=format'
const FALLBACK_AVATAR = 'https://images.unsplash.com/photo-1629740936456-4b990c27e503?w=100&auto=format'
const PAGE_SIZE = 20

const activeCategoryKey = ref('all')
const activeProjectSort = ref<ProjectSort>('newest')
const articleCategories = ref<ArticleCategoryDto[]>([])
const articles = ref<DisplayArticle[]>([])
const articleLoading = ref(false)
const articleError = ref('')
const articleCategoryLoading = ref(false)

let articleRequestId = 0

const mockCategoryPalette = mockCategories.map((category) => ({
  normalizedName: normalize(category.name),
  accentColor: category.accent,
}))

const themeVars = computed(() => ({
  '--bg': T.bg,
  '--border': T.border,
  '--border-light': T.borderLight,
  '--text1': T.text1,
  '--text2': T.text2,
  '--text3': T.text3,
  '--text4': T.text4,
  '--accent': T.accent,
}))

const displayCategories = computed<CategoryOption[]>(() => [
  { key: 'all', label: '全部', categoryName: '' },
  ...articleCategories.value
    .filter((category) => !isTotalCategoryName(category.category))
    .map((category) => ({
      key: `category:${category.categoryId}`,
      label: category.category,
      categoryName: category.category,
    })),
])

const currentCategoryName = computed(() => {
  const matched = displayCategories.value.find((category) => category.key === activeCategoryKey.value)
  return matched?.categoryName ?? ''
})

function normalize(value?: string) {
  return (value || '').trim().toLowerCase()
}

function isTotalCategoryName(value?: string) {
  const normalizedValue = normalize(value)
  return normalizedValue === '' || normalizedValue === 'all' || normalizedValue === '全部'
}

function resolveAccentColor(categoryName?: string) {
  const normalizedName = normalize(categoryName)
  const matchedPalette = mockCategoryPalette.find(
    (category) =>
      category.normalizedName === normalizedName ||
      category.normalizedName.includes(normalizedName) ||
      normalizedName.includes(category.normalizedName),
  )
  return matchedPalette?.accentColor ?? T.accent
}

function formatDate(timestamp?: number) {
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

function estimateReadTime(content?: string, summary?: string) {
  const source = `${content || ''}${summary || ''}`
  return Math.max(1, Math.round(source.length / 320) || 1)
}

function splitContent(content?: string, summary?: string) {
  const list = (content || '')
    .split(/\n+/)
    .map((item) => item.trim())
    .filter(Boolean)

  if (list.length > 0) {
    return list
  }

  if (summary?.trim()) {
    return [summary.trim()]
  }

  return ['暂无内容']
}

function mapArticle(article: ArticleItemDto): DisplayArticle {
  const categoryName = article.category?.category || '未分类'
  return {
    id: String(article.articleId),
    title: article.title?.trim() || '未命名文章',
    summary: article.summary?.trim() || '暂无摘要',
    cover: article.cover?.trim() || FALLBACK_COVER,
    authorName: article.authorName?.trim() || '佚名',
    authorAvatar: article.authorAvatar?.trim() || FALLBACK_AVATAR,
    categoryName,
    date: formatDate(article.createTime || article.lastUpdateTime),
    readTime: estimateReadTime(article.content, article.summary),
    views: article.count?.readCount ?? 0,
    likes: article.count?.praiseCount ?? 0,
    content: splitContent(article.content, article.summary),
    accentColor: resolveAccentColor(categoryName),
  }
}

function cacheArticle(article: DisplayArticle) {
  uni.setStorageSync(`${ARTICLE_DETAIL_CACHE_PREFIX}${article.id}`, {
    id: article.id,
    title: article.title,
    cover: article.cover,
    author: article.authorName,
    authorAvatar: article.authorAvatar,
    date: article.date,
    readTime: article.readTime,
    views: article.views,
    likes: article.likes,
    content: article.content,
  })
}

function openArticle(article: DisplayArticle) {
  cacheArticle(article)
  uni.navigateTo({
    url: `/pages/article/detail?id=${encodeURIComponent(article.id)}`,
  })
}

function openArticleSearch() {
  uni.navigateTo({
    url: '/pages/article/search',
  })
}

async function loadArticleCategories() {
  if (articleCategoryLoading.value) return
  articleCategoryLoading.value = true
  try {
    const data = await fetchIndexData()
    const categories = (data.categories ?? []).filter((category) => !isTotalCategoryName(category.category))
    articleCategories.value = categories
    uni.setStorageSync('chance_article_categories', categories)
    uni.setStorageSync('chance_article_current_category', data.currentCategory ?? '')
    uni.setStorageSync('chance_article_current_category_id', data.categoryId ?? 0)

    if (typeof data.categoryId === 'number' && data.categoryId > 0) {
      const nextKey = `category:${data.categoryId}`
      if (displayCategories.value.some((category) => category.key === nextKey)) {
        activeCategoryKey.value = nextKey
      } else {
        activeCategoryKey.value = 'all'
      }
      return
    }

    const selected = categories.find((category) => category.selected)
    if (selected) {
      activeCategoryKey.value = `category:${selected.categoryId}`
    } else if (!displayCategories.value.some((category) => category.key === activeCategoryKey.value)) {
      activeCategoryKey.value = 'all'
    }
  } catch (error) {
    console.error('Failed to load article categories on projects page', error)
  } finally {
    articleCategoryLoading.value = false
  }
}

async function loadArticles() {
  const requestId = ++articleRequestId
  articleLoading.value = true
  articleError.value = ''

  try {
    const data = await fetchArticlesByCategory({
      category: currentCategoryName.value || undefined,
      page: 1,
      size: PAGE_SIZE,
      sort: activeProjectSort.value === 'newest' ? 'latest' : 'hot',
    })

    if (requestId !== articleRequestId) {
      return
    }

    articles.value = (data.articles?.list ?? []).map(mapArticle)
    articles.value.forEach(cacheArticle)
  } catch (error) {
    console.error('Failed to load category articles on projects page', error)
    if (requestId !== articleRequestId) {
      return
    }

    articles.value = []
    articleError.value = error instanceof Error ? error.message : '文章接口请求失败'
  } finally {
    if (requestId === articleRequestId) {
      articleLoading.value = false
    }
  }
}

async function selectCategory(categoryKey: string) {
  if (activeCategoryKey.value === categoryKey) {
    return
  }

  activeCategoryKey.value = categoryKey
  await loadArticles()
}

async function selectSort(sort: ProjectSort) {
  if (activeProjectSort.value === sort) {
    return
  }

  activeProjectSort.value = sort
  await loadArticles()
}

onShow(async () => {
  await loadArticleCategories()
  await loadArticles()
})
</script>

<style scoped>
.page-root { min-height: 100vh; background: var(--bg); }
.fixed-head { padding: 12px 20px; background: #fff; border-bottom: 1px solid var(--border); }
.eyebrow { display: block; color: var(--text4); font-size: 11px; letter-spacing: 0.06em; margin-bottom: 2px; }
.page-title { color: var(--text1); font-size: 26px; font-weight: 900; }
.scroll-page { height: calc(100vh - 86px); }
.project-search-zone { background: #fff; padding: 14px 20px 18px; border-bottom: 1px solid var(--border); }
.search-box,.filter-pill,.lang-pill,.project-meta,.meta-inline { display: flex; align-items: center; }
.search-box { min-height: 40px; padding: 0 14px; border-radius: 13px; background: var(--bg); border: 1.5px solid var(--border); gap: 8px; box-shadow: 0 2px 8px rgba(180,120,100,0.05); }
.search-trigger { justify-content: flex-start; width: 100%; margin-bottom: 16px; }
.search-trigger__text { color: var(--text4); font-size: 13px; }
.filter-scroll { white-space: nowrap; margin-bottom: 14px; }
.filter-pill { display: inline-flex; margin-right: 8px; padding: 7px 12px; border-radius: 999px; color: var(--text3); background: #fff8f1; border: 1px solid var(--border); font-size: 12px; }
.filter-pill.active { color: #fff; background: linear-gradient(135deg, #e8866a 0%, #e8a5b4 100%); border-color: transparent; }
.project-sort {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 44px;
  margin-top: 2px;
}

.project-sort button {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
  min-width: 44px;
  padding: 4px 0 8px;
  color: var(--text3);
  font-size: 14px;
  line-height: 1;
}

.project-sort-indicator {
  width: 28px;
  height: 3px;
  border-radius: 999px;
  background: var(--accent);
  transform: scaleX(0);
  transform-origin: center;
  transition: transform 0.2s ease;
}

.project-sort button.active {
  color: var(--text1);
  font-weight: 700;
}

.project-sort button.active .project-sort-indicator {
  transform: scaleX(1);
}
.page-pad { padding: 16px; }
.empty { padding: 42px 20px; text-align: center; }
.empty-emoji,.empty-title,.empty-desc,.project-name,.project-tagline,.project-desc { display: block; }
.empty-emoji { font-size: 38px; }
.empty-title { color: var(--text2); font-size: 15px; font-weight: 700; margin-top: 12px; }
.empty-desc { color: var(--text4); font-size: 12px; margin-top: 4px; line-height: 1.6; }
.project-card { overflow: hidden; background: #fff; border-radius: 20px; box-shadow: 0 2px 20px rgba(180,120,100,0.09),0 0 0 1px var(--border); margin-bottom: 16px; }
.project-cover { position: relative; height: 156px; overflow: hidden; }
.fill-img { width: 100%; height: 100%; }
.project-grad { position: absolute; inset: 0; background: linear-gradient(to top, rgba(61,44,44,0.8) 0%, rgba(61,44,44,0.15) 55%, transparent 100%); }
.star-badge { position: absolute; top: 12px; right: 12px; padding: 4px 10px; border-radius: 999px; color: var(--text2); background: rgba(255,255,255,0.86); display: inline-flex; align-items: center; gap: 4px; font-size: 10px; font-weight: 700; }
.project-cover-copy { position: absolute; left: 16px; right: 16px; bottom: 12px; color: rgba(255,255,255,0.85); }
.project-name { color: #fff; font-size: 18px; font-weight: 800; }
.project-tagline { color: rgba(255,255,255,0.8); font-size: 11px; margin-top: 2px; }
.project-body { padding: 12px 16px 16px; }
.project-desc { color: var(--text2); font-size: 13px; line-height: 1.6; margin-bottom: 12px; }
.tag-row { display: flex; flex-wrap: wrap; gap: 8px; }
.hash-tag { color: var(--accent); background: #fff0eb; border: 1px solid rgba(232,134,106,0.15); border-radius: 999px; padding: 3px 9px; font-size: 10px; font-weight: 600; }
.project-meta { gap: 8px; color: var(--text4); font-size: 11px; margin-top: 12px; }
.avatar-xs { width: 20px; height: 20px; border-radius: 50%; }
.lang-pill { margin-left: auto; border: 1px solid; border-radius: 999px; padding: 3px 8px; font-size: 10px; font-weight: 700; }
.lang-dot { width: 8px; height: 8px; border-radius: 50%; margin-right: 5px; }
.meta-inline { gap: 4px; }
.footer-note { margin-top: 8px; text-align: center; color: var(--text4); font-size: 12px; }
.bottom-gap { height: 20px; }
.line-2 { overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; }
</style>
