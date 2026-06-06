<template>
  <view class="page-root" :style="themeVars">
    <view class="top-bar">
      <button class="icon-btn" @tap="goBack">
        <AppIcon name="arrow-left" :size="22" :color="T.text3" />
      </button>
      <text class="top-title serif line-1">{{ project.name }}</text>
      <button class="icon-btn right" @tap="openWebview(project.githubUrl)">
        <AppIcon name="external-link" :size="18" :color="T.accent" />
      </button>
    </view>

    <scroll-view scroll-y class="scroll-page">
      <view class="project-detail-cover">
        <image class="fill-img" :src="project.cover" mode="aspectFill" />
        <view class="project-grad" />
        <view class="project-detail-copy">
          <text class="project-detail-title serif">{{ project.name }}</text>
          <text>{{ project.tagline }}</text>
        </view>
      </view>

      <view class="project-stats">
        <view class="project-stat-item">
          <view class="stat-big star">
            <AppIcon name="star" :size="14" color="#F5A623" filled />
            <text>{{ project.stars }}</text>
          </view>
          <text>Star 数</text>
        </view>
        <view class="divider" />
        <view class="project-stat-item">
          <view class="stat-big">
            <AppIcon name="git-fork" :size="14" :color="T.text3" />
            <text>{{ project.forks }}</text>
          </view>
          <text>Fork 数</text>
        </view>
        <view class="divider" />
        <view class="project-stat-item">
          <view class="stat-lang">
            <view class="lang-dot big" :style="{ background: project.langColor }" />
            <text>{{ project.language }}</text>
          </view>
          <text>主语言</text>
        </view>
      </view>

      <view class="detail-stack">
        <view class="info-card">
          <text class="info-eyebrow">🌟 项目介绍</text>
          <text class="info-text">{{ project.description }}</text>
        </view>

        <view class="info-card">
          <view class="meta-inline">
            <AppIcon name="tag" :size="13" :color="T.accent" />
            <text class="info-eyebrow">标签话题</text>
          </view>
          <view class="tag-row">
            <text v-for="tag in project.tags" :key="tag" class="hash-tag">#{{ tag }}</text>
          </view>
        </view>

        <view class="info-card">
          <text class="info-eyebrow">📋 项目信息</text>
          <view class="info-line">
            <view class="meta-inline">
              <AppIcon name="scale" :size="13" :color="T.text4" />
              <text>开源协议</text>
            </view>
            <text class="info-line-value">{{ project.license }}</text>
          </view>
          <view class="info-line">
            <view class="meta-inline">
              <AppIcon name="calendar" :size="13" :color="T.text4" />
              <text>最近更新</text>
            </view>
            <text class="info-line-value">{{ project.updated }}</text>
          </view>
        </view>

        <view class="info-card">
          <text class="info-eyebrow">👤 作者信息</text>
          <view class="author-mini">
            <image class="avatar-lg" :src="project.authorAvatar" mode="aspectFill" />
            <view class="author-mini-copy">
              <text class="author-name">{{ project.authorName }}</text>
              <text class="author-sub">@{{ project.authorOrg }}</text>
            </view>
          </view>
        </view>

        <button class="github-btn" @tap="openWebview(project.githubUrl)">
          <AppIcon name="external-link" :size="16" color="#fff" />
          <text>去 GitHub 看源码 ✨</text>
        </button>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import AppIcon from '../../components/AppIcon.vue'
import { projects, type Project } from '../../mock/data'
import { T } from '../../utils/theme'

const project = ref<Project>(projects[0])
const statusBarHeight = uni.getSystemInfoSync().statusBarHeight ?? 0

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
  '--accent-light': T.accentLight,
  '--accent-grad': T.accentGrad,
  '--safe-top': `${statusBarHeight}px`,
}))

onLoad((options) => {
  const matched = projects.find((item) => item.id === options?.id)
  if (matched) project.value = matched
})

function goBack() {
  uni.navigateBack()
}

function openWebview(url: string) {
  uni.navigateTo({
    url: `/pages/webview/index?url=${encodeURIComponent(url)}`,
  })
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

.project-detail-cover {
  position: relative;
  height: 220px;
}

.fill-img {
  width: 100%;
  height: 100%;
}

.project-grad {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(61, 44, 44, 0.8) 0%, rgba(61, 44, 44, 0.15) 55%, transparent 100%);
}

.project-detail-copy {
  position: absolute;
  left: 20px;
  right: 20px;
  bottom: 16px;
  color: rgba(255, 255, 255, 0.85);
  font-size: 12px;
}

.project-detail-title {
  display: block;
  color: #fff;
  font-size: 26px;
  font-weight: 900;
}

.project-stats {
  margin: 0 16px 16px;
  padding: 16px;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 2px 20px rgba(180, 120, 100, 0.09), 0 0 0 1px var(--border);
  display: flex;
  align-items: center;
  justify-content: space-around;
  transform: translateY(-18px);
}

.project-stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--text4);
  font-size: 10px;
}

.stat-big,
.stat-lang,
.meta-inline,
.author-mini {
  display: flex;
  align-items: center;
}

.stat-big,
.stat-lang {
  gap: 4px;
  color: var(--text2);
  font-size: 18px;
  font-weight: 800;
  margin-bottom: 2px;
}

.stat-big.star {
  color: #f5a623;
}

.divider {
  width: 1px;
  height: 28px;
  background: var(--border);
}

.detail-stack {
  padding: 0 16px 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-card {
  padding: 18px;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 2px 16px rgba(180, 120, 100, 0.07), 0 0 0 1px var(--border);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.info-eyebrow {
  color: var(--accent);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.info-text {
  color: var(--text2);
  font-size: 14px;
  line-height: 1.75;
}

.tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.hash-tag {
  color: var(--accent);
  background: var(--accent-light);
  border: 1px solid rgba(232, 134, 106, 0.15);
  border-radius: 999px;
  padding: 3px 9px;
  font-size: 10px;
  font-weight: 600;
}

.info-line,
.author-mini {
  justify-content: space-between;
  color: var(--text3);
  font-size: 13px;
}

.meta-inline {
  gap: 6px;
}

.info-line-value {
  color: var(--text1);
  font-weight: 700;
}

.author-mini {
  justify-content: flex-start;
  gap: 12px;
}

.avatar-lg {
  width: 52px;
  height: 52px;
  border-radius: 18px;
}

.author-mini-copy {
  display: flex;
  flex-direction: column;
}

.author-name {
  color: var(--text1);
  font-size: 14px;
  font-weight: 800;
}

.author-sub {
  color: var(--text4);
  font-size: 11px;
  margin-top: 3px;
}

.github-btn {
  height: 52px;
  border-radius: 18px;
  color: #fff;
  background: var(--accent-grad);
  font-size: 15px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 4px 20px rgba(232, 134, 106, 0.25);
}

.lang-dot.big {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 6px;
}

.line-1 {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
