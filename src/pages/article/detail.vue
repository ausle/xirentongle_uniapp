<template>
  <view class="page-root" :style="themeVars">
    <view class="top-bar">
      <button class="icon-btn" @tap="goBack">
        <AppIcon name="arrow-left" :size="22" :color="T.text3" />
      </button>
      <text class="top-title serif line-1">{{ article.title }}</text>
      <button class="icon-btn right">
        <AppIcon name="share-2" :size="20" :color="T.text4" />
      </button>
    </view>

    <scroll-view
      scroll-y
      class="scroll-page"
      :scroll-top="articleScrollTop"
      :scroll-into-view="articleScrollIntoView"
    >
      <view class="detail-cover" :class="{ 'detail-cover--fallback': isDefaultArticleCover(article.cover) }">
        <image
          :class="['fill-img', { 'fill-img--fallback': isDefaultArticleCover(article.cover) }]"
          :src="article.cover || DEFAULT_ARTICLE_COVER"
          :mode="isDefaultArticleCover(article.cover) ? 'widthFix' : 'aspectFill'"
          @error="handleArticleCoverError"
        />
        <view class="fade-light" />
      </view>

      <view class="detail-body">
        <text class="detail-title serif">{{ article.title }}</text>

        <view class="author-card">
          <button @tap="openArticleAuthor">
            <image
              v-if="!authorAvatarFailed"
              class="avatar-md"
              :src="article.authorAvatar || FALLBACK_AVATAR"
              mode="aspectFill"
              @error="handleAuthorAvatarError"
            />
            <view v-else class="avatar-md avatar-md--fallback">
              <AppIcon name="user" :size="24" :color="T.text3" />
            </view>
          </button>

          <view class="author-info" @tap="openArticleAuthor">
            <text class="author-name">{{ article.author }}</text>
            <text class="author-sub">{{ article.date }} · {{ article.readTime }} min 阅读</text>
          </view>

          <button
            class="follow-btn"
            :class="{ followed: articleAuthorFollowed }"
            @tap="articleAuthorFollowed = !articleAuthorFollowed"
          >
            {{ articleAuthorFollowed ? '已关注' : '+ 关注' }}
          </button>
        </view>

        <view class="stat-row">
          <view class="meta-inline">
            <AppIcon name="eye" :size="13" :color="T.text4" />
            <text>{{ fmtCompact(article.views) }} 阅读</text>
          </view>
          <button class="stat-like-btn" :class="{ active: articleLiked }" @tap="toggleArticleLike">
            <AppIcon
              name="heart"
              :size="13"
              :color="articleLiked ? T.accentPink : T.text4"
              :filled="articleLiked"
            />
            <text>{{ fmtCompact(articleLikes) }} 喜欢</text>
          </button>
        </view>

        <view class="article-content">
          <text v-if="articleDetailLoading && !articleContentHtml.length && !article.content.length" class="detail-state">
            正在加载文章内容...
          </text>

          <mp-html
            v-else-if="articleContentHtml.length"
            ref="articleContentRef"
            class="article-rich"
            :content="articleContentHtml"
            :container-style="articleContentContainerStyle"
            :tag-style="articleContentTagStyle"
            selectable
            scroll-table
            :use-anchor="1"
            @linktap="handleArticleLinkTap"
          />

          <view v-else-if="false" class="article-native">
            <block v-for="(block, index) in articleBlocks" :key="`${article.id}-block-${index}`">
              <text
                v-if="block.type === 'heading'"
                :id="block.anchorId"
                :class="['article-heading', `article-heading--${block.level}`]"
              >
                {{ block.text }}
              </text>

              <text v-else-if="block.type === 'quote'" class="article-quote" user-select>
                {{ block.text }}
              </text>

              <image
                v-else-if="block.type === 'image'"
                class="article-image"
                :src="resolveBodyImageSrc(block.src, index)"
                mode="widthFix"
                @error="handleBodyImageError(index)"
              />

              <view v-else-if="block.type === 'list'" class="article-list">
                <view
                  v-for="(item, itemIndex) in block.items"
                  :key="`${article.id}-list-${index}-${itemIndex}`"
                  class="article-list__item"
                >
                  <text class="article-list__marker">{{ block.ordered ? `${itemIndex + 1}.` : '•' }}</text>
                  <text class="article-list__text" user-select>{{ item }}</text>
                </view>
              </view>

              <text v-else class="para" user-select>
                {{ block.text }}
              </text>
            </block>
          </view>

          <block v-else-if="article.content.length">
            <text
              v-for="(paragraph, index) in article.content"
              :id="`article-para-${index}`"
              :key="`${article.id}-para-${index}`"
              class="para"
              user-select
            >
              {{ paragraph }}
            </text>
          </block>

          <text v-else-if="articleDetailError" class="detail-state detail-state--error">
            {{ articleDetailError }}
          </text>

          <text v-else class="detail-state">暂无内容</text>
        </view>

        <text
          v-if="articleDetailError && (articleContentHtml.length || article.content.length)"
          class="detail-state detail-state--error detail-state--inline"
        >
          {{ articleDetailError }}
        </text>

      </view>
    </scroll-view>

    <view class="float-actions">
      <button class="float-save" :class="{ active: articleSaved }" @tap="toggleArticleSave">
        <AppIcon
          name="bookmark"
          :size="18"
          :color="articleSaved ? '#fff' : T.accent"
          :filled="articleSaved"
        />
      </button>

      <button
        v-if="displayTocItems.length"
        class="float-toc"
        :class="{ active: articleTocOpen }"
        @tap="articleTocOpen = !articleTocOpen"
      >
        <AppIcon name="list" :size="18" :color="articleTocOpen ? '#fff' : T.text2" />
      </button>

      <button class="float-top" @tap="scrollArticleToTop">
        <AppIcon name="chevrons-up" :size="19" :color="T.accent" />
      </button>
    </view>

    <view v-if="articleTocOpen && displayTocItems.length" class="toc-mask" @tap="articleTocOpen = false">
      <view class="toc-sheet" @tap.stop="">
        <view class="sheet-handle" />
        <view class="toc-head">
          <view class="meta-inline">
            <AppIcon name="list" :size="15" :color="T.accent" />
            <text class="serif">文章目录</text>
            <text class="toc-count">{{ displayTocItems.length }} 个章节</text>
          </view>
        </view>

        <button
          v-for="(item, index) in displayTocItems"
          :key="`${article.id}-toc-${index}`"
          :class="['toc-row', `toc-row--${Math.min(item.level, 4)}`]"
          @tap="scrollArticleToSection(item, index)"
        >
          <text class="toc-index">{{ index + 1 }}</text>
          <text>{{ item.text }}</text>
        </button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, nextTick, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { fetchArticleDetail, type ArticleItemDto } from '../../api/index'
import AppIcon from '../../components/AppIcon.vue'
import { articles, type Article } from '../../mock/data'
import { renderArticleContent, type ArticleContentBlock, type ArticleTocItem } from '../../utils/article-content'
import { fmtCompact } from '../../utils/author-profile'
import { T } from '../../utils/theme'
import mpHtml from '../../components/mp-html/mp-html'

type DetailArticle = Pick<
  Article,
  'id' | 'title' | 'cover' | 'author' | 'authorAvatar' | 'date' | 'readTime' | 'views' | 'likes' | 'content'
>

interface CachedDetailArticle extends DetailArticle {
  contentHtml?: string
  tocItems?: ArticleTocItem[] | string[]
}

const ARTICLE_DETAIL_CACHE_PREFIX = 'chance_article_detail_'
const FALLBACK_AVATAR = 'https://images.unsplash.com/photo-1629740936456-4b990c27e503?w=100&auto=format'
const DEFAULT_ARTICLE_COVER = '/static/article-default.png'
const FALLBACK_CONTENT_IMAGE = '/static/logo.png'

const defaultArticle = articles[0]

const article = ref<DetailArticle>({
  id: defaultArticle.id,
  title: defaultArticle.title,
  cover: defaultArticle.cover,
  author: defaultArticle.author,
  authorAvatar: defaultArticle.authorAvatar,
  date: defaultArticle.date,
  readTime: defaultArticle.readTime,
  views: defaultArticle.views,
  likes: defaultArticle.likes,
  content: defaultArticle.content,
})

const articleBlocks = ref<ArticleContentBlock[]>([])
const articleContentHtml = ref('')
const articleContentRef = ref<InstanceType<typeof mpHtml> | null>(null)
const articleLiked = ref(false)
const articleSaved = ref(false)
const articleAuthorFollowed = ref(false)
const articleLikes = ref(article.value.likes)
const articleDetailError = ref('')
const articleDetailLoading = ref(false)
const articleTocOpen = ref(false)
const articleTocItems = ref<ArticleTocItem[]>([])
const articleScrollTop = ref(0)
const articleScrollIntoView = ref('')
const authorAvatarFailed = ref(false)
const bodyImageErrorMap = ref<Record<number, boolean>>({})
const statusBarHeight = uni.getSystemInfoSync().statusBarHeight ?? 0
const instance = getCurrentInstance()

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
  '--safe-top': `${statusBarHeight}px`,
}))

const articleContentContainerStyle =
  'color: #3f3633; font-size: 15px; line-height: 1.9; word-break: break-word; overflow-wrap: anywhere;'

const articleContentTagStyle = {
  a: 'color: #d26149; text-decoration: underline; word-break: break-all;',
  blockquote:
    'margin: 0 0 16px; padding: 12px 14px; border-left: 4px solid #e8866a; background: #fff5ef; color: #6b5757; border-radius: 12px;',
  code:
    'font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; color: #1f2328; background: transparent; padding: 0; border-radius: 0;',
  h1: 'margin: 0 0 18px; color: #221b18; font-size: 28px; font-weight: 800; line-height: 1.35;',
  h2: 'margin: 24px 0 16px; color: #221b18; font-size: 22px; font-weight: 800; line-height: 1.4;',
  h3: 'margin: 20px 0 14px; color: #221b18; font-size: 18px; font-weight: 800; line-height: 1.45;',
  h4: 'margin: 18px 0 12px; color: #221b18; font-size: 16px; font-weight: 800; line-height: 1.45;',
  h5: 'margin: 18px 0 12px; color: #221b18; font-size: 16px; font-weight: 800; line-height: 1.45;',
  h6: 'margin: 18px 0 12px; color: #221b18; font-size: 16px; font-weight: 800; line-height: 1.45;',
  img: 'display: block; margin: 16px 0; border-radius: 16px; background: #f7ede5;',
  li: 'margin: 8px 0;',
  p: 'margin: 0 0 16px; color: #3f3633; font-size: 15px; line-height: 1.9;',
  pre: 'margin: 0 0 18px; padding: 14px 16px; border-radius: 14px; background: #f6f8fa; color: #1f2328; border: 1px solid #d8dee4; overflow-x: auto; white-space: pre; line-height: 1.7; font-size: 13px; tab-size: 2;',
  table: 'width: 100%; border-collapse: collapse; margin: 0 0 16px;',
  td: 'border: 1px solid #eadfd6; padding: 8px 10px;',
  th: 'border: 1px solid #eadfd6; padding: 8px 10px; background: #fff7f2;',
}

const displayTocItems = computed(() => {
  if (articleTocItems.value.length > 0) {
    return articleTocItems.value
  }

  return articleBlocks.value
    .filter((block): block is Extract<ArticleContentBlock, { type: 'heading' }> => block.type === 'heading')
    .map((block) => ({
      id: block.anchorId,
      text: block.text,
      level: block.level,
    }))
})

onLoad((options) => {
  const articleId = typeof options?.id === 'string' ? options.id.trim() : ''
  if (!articleId) {
    articleDetailError.value = '文章 ID 无效'
    return
  }

  const cachedArticle = uni.getStorageSync(`${ARTICLE_DETAIL_CACHE_PREFIX}${articleId}`)
  if (cachedArticle && typeof cachedArticle === 'object' && typeof cachedArticle.title === 'string') {
    hydrateFromCache(cachedArticle as CachedDetailArticle)
  }

  void loadArticleDetail(articleId)
})

function goBack() {
  uni.navigateBack()
}

function openArticleAuthor() {
  uni.navigateTo({
    url: `/pages/article/author?name=${encodeURIComponent(article.value.author)}&avatar=${encodeURIComponent(article.value.authorAvatar)}`,
  })
}

function toggleArticleLike() {
  articleLiked.value = !articleLiked.value
  articleLikes.value += articleLiked.value ? 1 : -1
}

function toggleArticleSave() {
  articleSaved.value = !articleSaved.value
}

function hydrateFromCache(cachedArticle: CachedDetailArticle) {
  const renderedFromCacheHtml = cachedArticle.contentHtml ? renderArticleContent(cachedArticle.contentHtml) : null

  article.value = {
    id: cachedArticle.id || article.value.id,
    title: cachedArticle.title || article.value.title,
    cover: cachedArticle.cover || article.value.cover,
    author: cachedArticle.author || article.value.author,
    authorAvatar: cachedArticle.authorAvatar || article.value.authorAvatar,
    date: cachedArticle.date || article.value.date,
    readTime: typeof cachedArticle.readTime === 'number' ? cachedArticle.readTime : article.value.readTime,
    views: typeof cachedArticle.views === 'number' ? cachedArticle.views : article.value.views,
    likes: typeof cachedArticle.likes === 'number' ? cachedArticle.likes : article.value.likes,
    content: Array.isArray(cachedArticle.content) ? cachedArticle.content : article.value.content,
  }

  articleLikes.value = article.value.likes
  articleTocItems.value = normalizeCachedTocItems(cachedArticle.tocItems, renderedFromCacheHtml?.tocItems || [])
  articleContentHtml.value = renderedFromCacheHtml?.html || ''
  articleBlocks.value = renderedFromCacheHtml?.blocks || []
  resetVisualFallbacks()
  bindArticleAnchorScope()
}

async function loadArticleDetail(articleId: string) {
  articleDetailLoading.value = true
  articleDetailError.value = ''

  try {
    const detail = await fetchArticleDetail(articleId)
    if (!detail.article) {
      throw new Error('文章不存在')
    }

    applyArticleDetail(detail.article)
  } catch (error) {
    articleDetailError.value = error instanceof Error ? error.message : '文章详情加载失败'

    if (article.value.id !== articleId) {
      const matched = articles.find((item) => item.id === articleId)
      if (matched) {
        article.value = matched
        articleLikes.value = matched.likes
      }
    }
  } finally {
    articleDetailLoading.value = false
  }
}

function applyArticleDetail(detail: ArticleItemDto) {
  const contentSource = (detail.content || '').trim()
  const rendered = renderArticleContent(contentSource || detail.summary || '')
  const nextArticle: DetailArticle = {
    id: String(detail.articleId),
    title: detail.title?.trim() || article.value.title || '未命名文章',
    cover: detail.cover?.trim() || article.value.cover || DEFAULT_ARTICLE_COVER,
    author: detail.authorName?.trim() || article.value.author || '佚名',
    authorAvatar: detail.authorAvatar?.trim() || article.value.authorAvatar || FALLBACK_AVATAR,
    date: formatArticleDate(detail.createTime || detail.lastUpdateTime),
    readTime: estimateReadTime(contentSource, detail.summary),
    views: toNumber(detail.count?.readCount),
    likes: toNumber(detail.count?.praiseCount),
    content: rendered.plainParagraphs.length > 0 ? rendered.plainParagraphs : fallbackContent(detail.summary),
  }

  article.value = nextArticle
  articleBlocks.value = rendered.blocks
  articleContentHtml.value = rendered.html
  articleLikes.value = nextArticle.likes
  articleTocItems.value = rendered.tocItems
  resetVisualFallbacks()
  bindArticleAnchorScope()

  const cachePayload: CachedDetailArticle = {
    ...nextArticle,
    contentHtml: rendered.html,
    tocItems: rendered.tocItems,
  }
  uni.setStorageSync(`${ARTICLE_DETAIL_CACHE_PREFIX}${nextArticle.id}`, cachePayload)
}

function resetVisualFallbacks() {
  authorAvatarFailed.value = false
  bodyImageErrorMap.value = {}
}

function handleArticleCoverError() {
  if (article.value.cover === DEFAULT_ARTICLE_COVER) {
    return
  }

  article.value = {
    ...article.value,
    cover: DEFAULT_ARTICLE_COVER,
  }
}

function isDefaultArticleCover(cover?: string) {
  return (cover || '').trim() === DEFAULT_ARTICLE_COVER
}

function handleAuthorAvatarError() {
  authorAvatarFailed.value = true
}

function handleBodyImageError(index: number) {
  bodyImageErrorMap.value = {
    ...bodyImageErrorMap.value,
    [index]: true,
  }
}

function resolveBodyImageSrc(src: string, index: number) {
  if (bodyImageErrorMap.value[index]) {
    return FALLBACK_CONTENT_IMAGE
  }

  return src || FALLBACK_CONTENT_IMAGE
}

function scrollArticleToSection(item: ArticleTocItem, index: number) {
  articleTocOpen.value = false
  if (articleContentHtml.value.length) {
    void scrollArticleToAnchor(item.id)
    return
  }

  articleScrollIntoView.value = `article-para-${index}`
  setTimeout(() => {
    articleScrollIntoView.value = ''
  }, 60)
}

function scrollArticleToTop() {
  articleScrollTop.value = 1
  setTimeout(() => {
    articleScrollTop.value = 0
  }, 16)
}

function fallbackContent(summary?: string) {
  return summary?.trim() ? [summary.trim()] : ['暂无内容']
}

function normalizeCachedTocItems(source: CachedDetailArticle['tocItems'], fallback: ArticleTocItem[]) {
  if (!Array.isArray(source) || source.length === 0) {
    return fallback
  }

  const firstItem = source[0]
  if (typeof firstItem === 'string') {
    return source
      .map((text, index) =>
        typeof text === 'string' && text.trim()
          ? {
              id: fallback[index]?.id || `article-section-${index}`,
              text: text.trim(),
              level: fallback[index]?.level || 2,
            }
          : null,
      )
      .filter((item): item is ArticleTocItem => item !== null)
  }

  return source
    .map((item, index) => {
      if (!item || typeof item !== 'object') {
        return null
      }

      const text = typeof item.text === 'string' ? item.text.trim() : ''
      if (!text) {
        return null
      }

      return {
        id: typeof item.id === 'string' && item.id.trim() ? item.id.trim() : fallback[index]?.id || `article-section-${index}`,
        text,
        level: typeof item.level === 'number' && item.level >= 1 ? item.level : fallback[index]?.level || 2,
      }
    })
    .filter((item): item is ArticleTocItem => item !== null)
}

function bindArticleAnchorScope() {
  void nextTick(() => {
    articleContentRef.value?.in?.(instance?.proxy, '.scroll-page', 'articleScrollTop')
  })
}

function scrollArticleToAnchor(anchorId: string) {
  return new Promise<void>((resolve) => {
    void nextTick(() => {
      const selector = uni
        .createSelectorQuery()
        .in(instance?.proxy)
        .select(`.scroll-page >>> #${anchorId}`)
        .boundingClientRect()

      selector
        .select('.scroll-page')
        .scrollOffset()
        .select('.scroll-page')
        .boundingClientRect()
        .exec((result) => {
          const targetRect = result?.[0]
          const scrollState = result?.[1]
          const scrollRect = result?.[2]

          if (!targetRect || !scrollState || !scrollRect) {
            articleContentRef.value?.navigateTo?.(anchorId, 0).catch(() => {})
            resolve()
            return
          }

          articleScrollTop.value = 0
          setTimeout(() => {
            articleScrollTop.value = scrollState.scrollTop + targetRect.top - scrollRect.top - 8
            resolve()
          }, 16)
        })
    })
  })
}

function handleArticleLinkTap(payload: { href?: string }) {
  if (!payload.href?.includes('://')) {
    return
  }

  // Mini Program runtimes cannot directly open arbitrary external sites, so
  // mp-html falls back to copying the link. We surface that behavior clearly.
  // #ifdef MP
  uni.showToast({
    title: 'Link copied',
    icon: 'none',
  })
  // #endif
}

function estimateReadTime(content?: string, summary?: string) {
  const source = `${content || ''}${summary || ''}`.trim()
  return Math.max(1, Math.round(source.length / 320) || 1)
}

function formatArticleDate(timestamp?: number | string) {
  const value = toNumber(timestamp)
  if (!value) {
    return '刚刚'
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return '刚刚'
  }

  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${month}-${day}`
}

function toNumber(value?: number | string | null) {
  const result = Number(value)
  return Number.isFinite(result) ? result : 0
}
</script>

<style scoped>
.page-root {
  min-height: 100vh;
  background: var(--bg);
}

.top-bar {
  display: flex;
  align-items: center;
  padding: 0 16px;
  padding-top: var(--safe-top);
  height: 44px;
  background: #fff;
  border-bottom: 1px solid var(--border);
  position: relative;
  z-index: 10;
}

.icon-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.icon-btn.right {
  margin-left: auto;
}

.top-title {
  position: absolute;
  left: 52px;
  right: 52px;
  color: var(--text1);
  font-size: 15px;
  font-weight: 700;
  text-align: center;
}

.scroll-page {
  height: calc(100vh - 44px - var(--safe-top));
}

.detail-cover {
  position: relative;
  height: 220px;
  overflow: hidden;
  background: linear-gradient(135deg, #fff6ee 0%, #f7ede5 100%);
}

.detail-cover--fallback {
  height: auto;
}

.fill-img {
  width: 100%;
  height: 100%;
}

.fill-img--fallback {
  display: block;
  height: auto;
}

.detail-cover-fallback {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.detail-cover-fallback__text {
  color: var(--text3);
  font-size: 13px;
}

.fade-light {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(255, 253, 247, 0) 0%, rgba(255, 253, 247, 0.2) 55%, var(--bg) 100%);
}

.detail-body {
  padding: 18px 16px 26px;
}

.detail-title {
  display: block;
  color: var(--text1);
  font-size: 24px;
  font-weight: 900;
  line-height: 1.3;
}

.author-card {
  margin-top: 18px;
  padding: 14px;
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 2px 20px rgba(180, 120, 100, 0.08), 0 0 0 1px var(--border);
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar-md {
  width: 52px;
  height: 52px;
  border-radius: 18px;
}

.avatar-md--fallback {
  background: var(--surface2);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border);
}

.author-info {
  flex: 1;
  min-width: 0;
}

.author-name {
  display: block;
  color: var(--text1);
  font-size: 14px;
  font-weight: 800;
}

.author-sub {
  display: block;
  color: var(--text4);
  font-size: 11px;
  margin-top: 3px;
}

.follow-btn {
  min-width: 68px;
  padding: 6px 12px;
  border-radius: 999px;
  color: #fff;
  background: var(--accent-grad);
  font-size: 11px;
  font-weight: 700;
}

.follow-btn.followed {
  color: var(--text3);
  background: var(--surface2);
  border: 1px solid var(--border);
}

.stat-row,
.meta-inline {
  display: flex;
  align-items: center;
}

.stat-row {
  justify-content: space-between;
  margin-top: 12px;
  color: var(--text3);
  font-size: 12px;
}

.meta-inline {
  gap: 5px;
}

.stat-like-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: var(--text4);
  font-size: 12px;
}

.stat-like-btn.active {
  color: var(--accent-pink);
}

.article-content {
  margin-top: 20px;
}

.article-rich {
  display: block;
}

.article-native {
  display: block;
}

.article-heading {
  display: block;
  color: var(--text1);
  font-weight: 800;
  line-height: 1.4;
}

.article-heading--1 {
  margin: 0 0 18px;
  font-size: 28px;
}

.article-heading--2 {
  margin: 24px 0 16px;
  font-size: 22px;
}

.article-heading--3 {
  margin: 20px 0 14px;
  font-size: 18px;
}

.article-heading--4,
.article-heading--5,
.article-heading--6 {
  margin: 18px 0 12px;
  font-size: 16px;
}

.para {
  display: block;
  color: var(--text2);
  font-size: 15px;
  line-height: 1.9;
  margin-bottom: 16px;
}

.article-quote {
  display: block;
  margin-bottom: 16px;
  padding: 12px 14px;
  border-left: 4px solid #e8866a;
  background: #fff5ef;
  color: #6b5757;
  border-radius: 12px;
  font-size: 15px;
  line-height: 1.9;
}

.article-image {
  width: 100%;
  display: block;
  margin: 16px 0;
  border-radius: 16px;
  background: #f7ede5;
}

.article-list {
  margin-bottom: 16px;
}

.article-list__item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 8px;
}

.article-list__marker {
  min-width: 20px;
  color: var(--accent);
  font-size: 15px;
  line-height: 1.9;
  font-weight: 700;
}

.article-list__text {
  flex: 1;
  color: var(--text2);
  font-size: 15px;
  line-height: 1.9;
}

.detail-state {
  display: block;
  color: var(--text3);
  font-size: 14px;
  line-height: 1.8;
}

.detail-state--error {
  color: #c65b47;
}

.detail-state--inline {
  margin-top: 10px;
}

.float-actions {
  position: fixed;
  right: 16px;
  bottom: 30px;
  z-index: 20;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.float-save,
.float-toc,
.float-top {
  width: 46px;
  height: 46px;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(180, 120, 100, 0.16);
  display: flex;
  align-items: center;
  justify-content: center;
}

.float-save {
  background: #fff;
  border: 1px solid var(--border);
}

.float-save.active {
  background: var(--accent-grad);
  border-color: transparent;
}

.float-toc {
  background: #fff;
  border: 1px solid var(--border);
}

.float-toc.active {
  background: var(--accent-grad);
  border-color: transparent;
}

.float-top {
  background: #fff;
  border: 1px solid var(--border);
}

.toc-mask {
  position: fixed;
  inset: 0;
  background: rgba(40, 30, 30, 0.2);
  display: flex;
  align-items: flex-end;
}

.toc-sheet {
  width: 100%;
  max-height: 66vh;
  background: #fff;
  border-radius: 24px 24px 0 0;
  padding: 10px 18px 22px;
}

.sheet-handle {
  width: 44px;
  height: 5px;
  border-radius: 999px;
  margin: 0 auto 12px;
  background: var(--border);
}

.toc-head {
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border);
}

.toc-count {
  margin-left: auto;
  color: var(--text4);
  font-size: 11px;
}

.toc-row {
  width: 100%;
  padding: 12px 0;
  border-bottom: 1px solid var(--border-light);
  display: flex;
  align-items: center;
  gap: 12px;
  text-align: left;
  color: var(--text2);
  font-size: 13px;
}

.toc-row--2 {
  padding-left: 12px;
}

.toc-row--3 {
  padding-left: 24px;
}

.toc-row--4 {
  padding-left: 36px;
}

.toc-index {
  width: 22px;
  color: var(--accent);
  font-weight: 700;
  flex-shrink: 0;
}

.line-1 {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
