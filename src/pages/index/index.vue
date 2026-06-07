<template>
  <view class="page-root">
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
        <swiper-item v-for="(article, index) in hotArticles" :key="article.id">
          <view
            class="carousel-card"
            :class="{ 'carousel-card--fallback': isDefaultArticleCover(article.cover) }"
            @tap="openArticle(article.id)"
          >
            <image
              :class="['fill-img', { 'fill-img--fallback': isDefaultArticleCover(article.cover) }]"
              :src="article.cover || DEFAULT_ARTICLE_COVER"
              :mode="isDefaultArticleCover(article.cover) ? 'widthFix' : 'aspectFill'"
              @error="handleHotArticleCoverError(index)"
            />
            <view class="dark-grad" :class="{ 'dark-grad--fallback': isDefaultArticleCover(article.cover) }" />
            <view class="hot-badge">热门文章</view>
            <view class="carousel-copy">
              <view class="category-badge">
                {{ article.categoryName }}
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
    </view>
  </view>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import AppIcon from '../../components/AppIcon.vue'
import { fetchArticlesByCategory, type ArticleItemDto } from '../../api/index'

interface CarouselArticle {
  id: string
  title: string
  cover: string
  author: string
  authorAvatar: string
  categoryName: string
  views: number
}

const FALLBACK_AVATAR = 'https://images.unsplash.com/photo-1629740936456-4b990c27e503?w=100&auto=format'
const DEFAULT_ARTICLE_COVER = '/static/article-default.png'

const hotArticles = ref<CarouselArticle[]>([])

function mapArticleDtoToCarousel(article: ArticleItemDto): CarouselArticle {
  return {
    id: String(article.articleId),
    title: article.title?.trim() || '未命名文章',
    cover: article.cover?.trim() || DEFAULT_ARTICLE_COVER,
    author: article.authorName?.trim() || '佚名',
    authorAvatar: article.authorAvatar?.trim() || FALLBACK_AVATAR,
    categoryName: article.category?.category?.trim() || '未分类',
    views: article.count?.readCount ?? 0,
  }
}

function fmtCompact(value: number) {
  if (value >= 10000) {
    return `${(value / 10000).toFixed(value >= 100000 ? 0 : 1)}w`
  }

  if (value >= 1000) {
    return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k`
  }

  return String(value)
}

async function loadHotArticles() {
  try {
    const response = await fetchArticlesByCategory({
      page: 1,
      size: 5,
      sort: 'hot',
    })

    hotArticles.value = (response.articles?.list ?? []).map(mapArticleDtoToCarousel).slice(0, 5)
  } catch (error) {
    console.error('Failed to load home carousel articles', error)
    hotArticles.value = []
  }
}

function openArticle(articleId: string) {
  uni.navigateTo({
    url: `/pages/article/detail?id=${encodeURIComponent(articleId)}`,
  })
}

function handleHotArticleCoverError(index: number) {
  const target = hotArticles.value[index]
  if (!target || target.cover === DEFAULT_ARTICLE_COVER) {
    return
  }

  hotArticles.value[index] = {
    ...target,
    cover: DEFAULT_ARTICLE_COVER,
  }
}

function isDefaultArticleCover(cover?: string) {
  return (cover || '').trim() === DEFAULT_ARTICLE_COVER
}

onMounted(() => {
  void loadHotArticles()
})
</script>

<style scoped>
.page-root {
  min-height: 100vh;
  background: #fffdf7;
}

.page-pad {
  padding: calc(env(safe-area-inset-top) + 16px) 16px 16px;
}

.hero-swiper {
  height: 228px;
}

.carousel-card {
  position: relative;
  height: 228px;
  overflow: hidden;
  border-radius: 24px;
}

.carousel-card--fallback {
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

.dark-grad {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(61, 44, 44, 0.8) 0%, rgba(61, 44, 44, 0.15) 55%, transparent 100%);
}

.dark-grad--fallback {
  background: linear-gradient(to top, rgba(61, 44, 44, 0.38) 0%, rgba(61, 44, 44, 0.06) 55%, transparent 100%);
}

.hot-badge,
.category-badge {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 700;
}

.hot-badge {
  position: absolute;
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

.category-badge {
  max-width: 100%;
  color: #fff;
  background: rgba(255, 255, 255, 0.18);
  padding: 3px 10px;
  backdrop-filter: blur(6px);
}

.carousel-title {
  display: block;
  margin-top: 7px;
  color: #fff;
  font-size: 17px;
  font-weight: 800;
  line-height: 1.3;
}

.carousel-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 9px;
  color: rgba(255, 255, 255, 0.88);
  font-size: 11px;
}

.avatar-sm {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 50%;
}

.meta-right {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: auto;
}
</style>
