<template>
  <view class="author-overlay">
    <button class="author-back" @tap="$emit('back')">
      <AppIcon name="arrow-left" :size="18" :color="T.text2" />
    </button>

    <scroll-view scroll-y class="author-scroll">
      <view class="author-hero">
        <view class="author-main">
          <image class="author-avatar" :src="profile.avatar" mode="aspectFill" />
          <view class="author-main-copy">
            <view class="author-name-row">
              <text class="author-big-name serif">{{ profile.name }}</text>
              <button
                class="author-follow"
                :class="{ followed: isFollowed }"
                @tap="$emit('toggle-follow')"
              >
                {{ isFollowed ? '✅ 已关注' : '+ 关注' }}
              </button>
            </view>
            <text class="author-bio">{{ profile.bio }}</text>
            <view class="author-tag-row">
              <text v-for="tag in profile.tags" :key="tag" class="author-tag">{{ tag }}</text>
            </view>
          </view>
        </view>

        <view class="author-stats">
          <view v-for="item in profile.stats" :key="item.label" class="author-stat-item">
            <text class="author-stat-value">{{ item.value }}</text>
            <text class="author-stat-label">{{ item.label }}</text>
          </view>
        </view>
      </view>

      <view class="author-card-block">
        <text class="author-block-title serif">✨ 个人成就</text>
        <view
          v-for="item in profile.achievements"
          :key="item.label"
          class="achievement-row"
        >
          <text>{{ item.icon }} {{ item.label }}</text>
          <text class="achievement-value">{{ item.value }}</text>
        </view>
      </view>

      <view class="author-card-block">
        <text class="author-block-title serif">🗓 创作历程</text>
        <view v-for="item in profile.yearlyStats" :key="item.year" class="year-row">
          <text class="year-label">{{ item.year }}</text>
          <view class="year-track">
            <view class="year-fill" :style="{ width: item.width }" />
          </view>
          <text class="year-count">共 {{ item.count }} 篇</text>
        </view>
      </view>

      <view class="author-tabs-card">
        <view class="author-tabs">
          <button
            v-for="tab in authorTabs"
            :key="tab.key"
            class="author-tab-btn"
            :class="{ active: activeTab === tab.key }"
            @tap="$emit('change-tab', tab.key)"
          >
            {{ tab.emoji }} {{ tab.label }}
          </button>
        </view>

        <template v-if="activeTab === 'articles'">
          <button
            v-for="article in profile.articles"
            :key="article.id"
            class="author-article-row"
            @tap="$emit('open-article', article)"
          >
            <image :src="article.cover" mode="aspectFill" />
            <view class="author-article-copy">
              <text class="line-2 author-article-title">{{ article.title }}</text>
              <text class="author-article-meta">
                ❤️ {{ fmtCompact(article.likes) }} 　👁 {{ fmtCompact(article.views) }}
              </text>
            </view>
          </button>
        </template>

        <template v-else-if="activeTab === 'following'">
          <view class="sub-tabs">
            <button
              class="sub-tab-btn"
              :class="{ active: followingTab === 'following' }"
              @tap="$emit('change-following-tab', 'following')"
            >
              关注列表
            </button>
            <button
              class="sub-tab-btn"
              :class="{ active: followingTab === 'fans' }"
              @tap="$emit('change-following-tab', 'fans')"
            >
              粉丝列表
            </button>
          </view>

          <view
            v-for="user in followingTab === 'following' ? profile.following : profile.fans"
            :key="user.id"
            class="user-row"
          >
            <image :src="user.avatar" mode="aspectFill" />
            <view class="user-copy">
              <text class="user-name">{{ user.name }}</text>
              <text class="user-meta">{{ user.followers.toLocaleString() }} 位关注者</text>
            </view>
            <button class="user-follow-btn">关注</button>
          </view>
        </template>

        <template v-else>
          <button
            v-for="article in profile.favorites"
            :key="article.id"
            class="author-article-row"
            @tap="$emit('open-article', article)"
          >
            <image :src="article.cover" mode="aspectFill" />
            <view class="author-article-copy">
              <text class="line-2 author-article-title">{{ article.title }}</text>
              <text class="author-article-meta">⭐ 已收藏</text>
            </view>
          </button>
        </template>
      </view>

      <view class="author-bottom-gap" />
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import AppIcon from './AppIcon.vue'
import { fmtCompact, type AuthorProfileData } from '../utils/author-profile'
import { T } from '../utils/theme'

defineProps<{
  profile: AuthorProfileData
  activeTab: 'articles' | 'following' | 'favorites'
  followingTab: 'following' | 'fans'
  isFollowed: boolean
}>()

defineEmits<{
  (e: 'back'): void
  (e: 'toggle-follow'): void
  (e: 'change-tab', tab: 'articles' | 'following' | 'favorites'): void
  (e: 'change-following-tab', tab: 'following' | 'fans'): void
  (e: 'open-article', article: any): void
}>()

const authorTabs = [
  { key: 'articles' as const, label: '文章', emoji: '📝' },
  { key: 'following' as const, label: '关注', emoji: '👥' },
  { key: 'favorites' as const, label: '收藏', emoji: '⭐' },
]
</script>

<style scoped>
.author-overlay {
  position: absolute;
  inset: 0;
  z-index: 18;
  background: var(--bg);
}

.author-back {
  position: absolute;
  top: 12px;
  left: 16px;
  z-index: 20;
  width: 36px;
  height: 36px;
  border-radius: 12px;
  background: rgba(255, 253, 247, 0.88);
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 12px rgba(180, 120, 100, 0.15);
}

.author-scroll {
  height: 100%;
}

.author-hero {
  padding: 52px 20px 20px;
  background: linear-gradient(135deg, #ffe4d4 0%, #ffdce8 60%, #eee0ff 100%);
}

.author-main {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 14px;
}

.author-avatar {
  width: 68px;
  height: 68px;
  border-radius: 22px;
  border: 3px solid rgba(255, 255, 255, 0.85);
  box-shadow: 0 4px 16px rgba(180, 120, 100, 0.2);
}

.author-main-copy {
  flex: 1;
  min-width: 0;
}

.author-name-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.author-big-name {
  color: var(--text1);
  font-size: 20px;
  font-weight: 900;
}

.author-follow {
  min-width: 64px;
  padding: 4px 12px;
  border-radius: 999px;
  color: #fff;
  background: var(--accent-grad);
  font-size: 11px;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(232, 134, 106, 0.25);
}

.author-follow.followed {
  color: var(--text3);
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid var(--border);
  box-shadow: none;
}

.author-bio {
  display: block;
  color: var(--text2);
  font-size: 12px;
  line-height: 1.5;
  margin-bottom: 8px;
}

.author-tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.author-tag {
  color: var(--accent);
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(232, 134, 106, 0.19);
  border-radius: 999px;
  padding: 2px 8px;
  font-size: 10px;
  font-weight: 600;
}

.author-stats {
  display: flex;
  background: rgba(255, 255, 255, 0.62);
  border-radius: 16px;
  overflow: hidden;
}

.author-stat-item {
  flex: 1;
  padding: 10px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.author-stat-value {
  color: var(--text1);
  font-size: 17px;
  font-weight: 800;
}

.author-stat-label {
  color: var(--text3);
  font-size: 10px;
  margin-top: 2px;
}

.author-card-block,
.author-tabs-card {
  margin: 12px 16px 0;
  background: var(--surface);
  border-radius: 20px;
  box-shadow: 0 2px 16px rgba(180, 120, 100, 0.07), 0 0 0 1px var(--border);
}

.author-card-block {
  padding: 16px 18px;
}

.author-block-title {
  display: block;
  color: var(--text1);
  font-size: 13px;
  font-weight: 800;
  margin-bottom: 14px;
}

.achievement-row,
.year-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 11px;
  color: var(--text2);
  font-size: 13px;
}

.achievement-value {
  color: var(--text1);
  font-weight: 700;
}

.year-row {
  gap: 10px;
  color: var(--text3);
  font-size: 12px;
}

.year-label {
  width: 38px;
  flex-shrink: 0;
}

.year-track {
  flex: 1;
  height: 7px;
  background: var(--surface2);
  border-radius: 999px;
  overflow: hidden;
}

.year-fill {
  height: 100%;
  border-radius: 999px;
  background: var(--accent-grad);
}

.year-count {
  width: 56px;
  text-align: right;
  flex-shrink: 0;
}

.author-tabs-card {
  overflow: hidden;
}

.author-tabs {
  display: flex;
  border-bottom: 1px solid var(--border);
}

.author-tab-btn {
  flex: 1;
  padding: 13px 0;
  color: var(--text3);
  font-size: 13px;
  border-bottom: 2.5px solid transparent;
}

.author-tab-btn.active {
  color: var(--accent);
  font-weight: 700;
  border-bottom-color: var(--accent);
}

.author-article-row {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-light);
  text-align: left;
}

.author-article-row image {
  width: 76px;
  height: 58px;
  border-radius: 11px;
  flex-shrink: 0;
}

.author-article-copy {
  flex: 1;
  min-width: 0;
}

.author-article-title {
  display: block;
  color: var(--text1);
  font-size: 13px;
  font-weight: 700;
  line-height: 1.4;
}

.author-article-meta {
  display: block;
  color: var(--text4);
  font-size: 11px;
  margin-top: 5px;
}

.sub-tabs {
  display: flex;
  gap: 8px;
  padding: 10px 16px 8px;
}

.sub-tab-btn {
  padding: 5px 16px;
  color: var(--text3);
  border: 1px solid var(--border);
  border-radius: 999px;
  font-size: 12px;
}

.sub-tab-btn.active {
  color: var(--accent);
  background: var(--accent-light);
  border-color: rgba(232, 134, 106, 0.25);
  font-weight: 700;
}

.user-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 16px;
  border-bottom: 1px solid var(--border-light);
}

.user-row image {
  width: 46px;
  height: 46px;
  border-radius: 14px;
  border: 2px solid var(--border);
}

.user-copy {
  flex: 1;
  min-width: 0;
}

.user-name {
  display: block;
  color: var(--text1);
  font-size: 14px;
  font-weight: 700;
}

.user-meta {
  display: block;
  color: var(--text4);
  font-size: 11px;
  margin-top: 3px;
}

.user-follow-btn {
  padding: 5px 14px;
  color: var(--accent);
  background: var(--accent-light);
  border: 1px solid rgba(232, 134, 106, 0.19);
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
}

.author-bottom-gap {
  height: 28px;
}
</style>

