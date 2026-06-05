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
      <view class="detail-cover">
        <image class="fill-img" :src="article.cover" mode="aspectFill" />
        <view class="fade-light" />
      </view>

      <view class="detail-body">
        <text class="detail-title serif">{{ article.title }}</text>

        <view class="author-card">
          <button @tap="openArticleAuthor">
            <image class="avatar-md" :src="article.authorAvatar" mode="aspectFill" />
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
            {{ articleAuthorFollowed ? '✅ 已关注' : '+ 关注' }}
          </button>
        </view>

        <view class="stat-row">
          <view class="meta-inline">
            <AppIcon name="eye" :size="13" :color="T.text4" />
            <text>{{ fmtCompact(article.views) }} 阅读</text>
          </view>
          <view class="meta-inline">
            <AppIcon name="heart" :size="13" :color="T.accentPink" filled />
            <text>{{ fmtCompact(articleLikes) }} 喜欢</text>
          </view>
        </view>

        <view class="article-content">
          <text
            v-for="(paragraph, index) in article.content"
            :id="`article-para-${index}`"
            :key="`${article.id}-${index}`"
            class="para"
          >
            {{ paragraph }}
          </text>
        </view>

        <view class="action-row">
          <button class="action-btn" :class="{ active: articleLiked }" @tap="toggleArticleLike">
            <view class="action-icon">
              <AppIcon
                name="heart"
                :size="22"
                :color="articleLiked ? T.accentPink : T.text4"
                :filled="articleLiked"
              />
            </view>
            <text>{{ fmtCompact(articleLikes) }}</text>
          </button>
          <button class="action-btn" :class="{ saved: articleSaved }" @tap="articleSaved = !articleSaved">
            <view class="action-icon">
              <AppIcon
                name="bookmark"
                :size="22"
                :color="articleSaved ? T.accent : T.text4"
                :filled="articleSaved"
              />
            </view>
            <text>收藏</text>
          </button>
          <button class="action-btn">
            <view class="action-icon">
              <AppIcon name="share-2" :size="22" :color="T.text4" />
            </view>
            <text>分享</text>
          </button>
        </view>
      </view>
    </scroll-view>

    <button class="float-toc" :class="{ active: articleTocOpen }" @tap="articleTocOpen = !articleTocOpen">
      <AppIcon name="list" :size="18" :color="articleTocOpen ? '#fff' : T.text2" />
    </button>
    <button class="float-top" @tap="scrollArticleToTop">
      <AppIcon name="chevrons-up" :size="19" :color="T.accent" />
    </button>

    <view v-if="articleTocOpen" class="toc-mask" @tap="articleTocOpen = false">
      <view class="toc-sheet" @tap.stop="">
        <view class="sheet-handle" />
        <view class="toc-head">
          <view class="meta-inline">
            <AppIcon name="list" :size="15" :color="T.accent" />
            <text class="serif">文章目录</text>
            <text class="toc-count">{{ article.content.length }} 个章节</text>
          </view>
        </view>
        <button
          v-for="(paragraph, index) in article.content"
          :key="`${article.id}-toc-${index}`"
          class="toc-row"
          @tap="scrollArticleToSection(index)"
        >
          <text class="toc-index">{{ index + 1 }}</text>
          <text>{{ tocHeading(paragraph) }}</text>
        </button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import AppIcon from '../../components/AppIcon.vue'
import { articles, type Article } from '../../mock/data'
import { fmtCompact } from '../../utils/author-profile'
import { T } from '../../utils/theme'

const article = ref<Article>(articles[0])
const articleLiked = ref(false)
const articleSaved = ref(false)
const articleAuthorFollowed = ref(false)
const articleLikes = ref(article.value.likes)
const articleTocOpen = ref(false)
const articleScrollTop = ref(0)
const articleScrollIntoView = ref('')

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
  const matched = articles.find((item) => item.id === options?.id)
  if (matched) {
    article.value = matched
    articleLikes.value = matched.likes
  }
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

function tocHeading(text: string) {
  const dotIndex = text.search(/[。！？.!?]/)
  const raw = dotIndex > 0 && dotIndex <= 28 ? text.slice(0, dotIndex) : text.slice(0, 24)
  return raw.length < text.length ? `${raw}…` : raw
}

function scrollArticleToSection(index: number) {
  articleTocOpen.value = false
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
  height: calc(100vh - 44px);
}

.detail-cover {
  position: relative;
  height: 220px;
}

.fill-img {
  width: 100%;
  height: 100%;
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
.meta-inline,
.action-row {
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

.article-content {
  margin-top: 20px;
}

.para {
  display: block;
  color: var(--text2);
  font-size: 15px;
  line-height: 1.9;
  margin-bottom: 16px;
}

.action-row {
  gap: 12px;
  margin-top: 20px;
}

.action-btn {
  flex: 1;
  padding: 12px 0;
  border-radius: 18px;
  background: #fff;
  color: var(--text3);
  font-size: 12px;
  border: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.action-btn.active,
.action-btn.saved {
  color: var(--text1);
  background: var(--surface2);
}

.action-icon {
  width: 40px;
  height: 40px;
  border-radius: 14px;
  background: var(--bg);
  display: flex;
  align-items: center;
  justify-content: center;
}

.float-toc,
.float-top {
  position: fixed;
  right: 16px;
  width: 46px;
  height: 46px;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(180, 120, 100, 0.16);
  display: flex;
  align-items: center;
  justify-content: center;
}

.float-toc {
  bottom: 88px;
  background: #fff;
}

.float-toc.active {
  background: var(--accent-grad);
}

.float-top {
  bottom: 30px;
  background: #fff;
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
