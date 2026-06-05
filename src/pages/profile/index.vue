<template>
  <view class="page-root" :style="themeVars">
    <scroll-view scroll-y class="scroll-page">
      <view v-if="profileLoggedIn" class="profile-hero">
        <image class="fill-img" :src="DEFAULT_HERO_IMAGE" mode="aspectFill" />
        <view class="hero-grad" />
        <view class="profile-copy">
          <view class="profile-user">
            <button class="avatar-button" @tap="openMyProfile">
              <image class="profile-avatar" :src="DEFAULT_USER_AVATAR" mode="aspectFill" />
            </button>
            <view class="profile-user-copy">
              <view class="name-row">
                <text class="profile-name serif">{{ nickname }}</text>
                <text class="level">Lv.8</text>
              </view>
              <text class="profile-sub">{{ DEFAULT_PROFILE_HANDLE }} · {{ DEFAULT_PROFILE_SUBTITLE }}</text>
            </view>
          </view>
          <view class="profile-stats">
            <view v-for="item in profileStats" :key="item.label" class="profile-stat-item">
              <text>{{ item.value }}</text>
              <text>{{ item.label }}</text>
            </view>
          </view>
        </view>
      </view>

      <button v-else class="login-entry" @tap="openLoginPage">
        <view class="login-entry__glow login-entry__glow--left" />
        <view class="login-entry__glow login-entry__glow--right" />
        <view class="login-entry__icon">
          <AppIcon name="user" :size="30" color="#E8866A" />
        </view>
        <view class="login-entry__copy">
          <text class="login-entry__title">点击登录</text>
          <text class="login-entry__sub">登录后享受更多功能</text>
        </view>
        <view class="login-entry__arrow">
          <AppIcon name="chevron-right" :size="18" color="rgba(255,255,255,0.88)" />
        </view>
      </button>

      <view class="panel">
        <text class="panel-title">我的功能</text>
        <view class="quick-grid">
          <button
            v-for="item in profileQuickActions"
            :key="item.label"
            class="quick-action"
            @tap="openQuickAction(item)"
          >
            <text class="quick-icon" :style="{ background: item.bg, borderColor: `${item.color}20` }">
              {{ item.emoji }}
            </text>
            <text>{{ item.label }}</text>
          </button>
        </view>
      </view>

      <view v-if="profileLoggedIn" class="panel">
        <text class="panel-title">我的标签</text>
        <view class="tag-row">
          <text
            v-for="tag in profileInterestTags"
            :key="tag.label"
            class="interest-tag"
            :style="{ color: tag.color, background: tag.bg, borderColor: `${tag.color}25` }"
          >
            {{ tag.label }}
          </text>
        </view>
      </view>

      <view class="menu-panel">
        <button
          class="menu-row"
          @tap="openProfileFeature('联系客服', '💬', '遇到问题时，可以在这里继续接入客服系统。')"
        >
          <text class="menu-emoji">💬</text>
          <view class="menu-copy">
            <text>联系客服</text>
            <text>遇到问题时，随时都能找到我们</text>
          </view>
          <AppIcon name="chevron-right" :size="15" :color="T.text4" />
        </button>
        <button
          class="menu-row"
          @tap="openProfileFeature('关注公众号', '📚', '这里可以接入公众号二维码、活动与内容推送。')"
        >
          <text class="menu-emoji">📚</text>
          <view class="menu-copy">
            <text>关注公众号</text>
            <text>获取最新内容推送</text>
          </view>
          <AppIcon name="chevron-right" :size="15" :color="T.text4" />
        </button>
        <button class="menu-row" @tap="openSettingsPage">
          <text class="menu-emoji">⚙️</text>
          <view class="menu-copy">
            <text>设置</text>
            <text>账号、隐私与偏好</text>
          </view>
          <AppIcon name="chevron-right" :size="15" :color="T.text4" />
        </button>
      </view>

      <text class="version">一望笔记 v1.0.25 · 用爱制作 🌱</text>
      <view class="bottom-gap" />
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import AppIcon from '../../components/AppIcon.vue'
import { T } from '../../utils/theme'
import {
  DEFAULT_HERO_IMAGE,
  DEFAULT_PROFILE_HANDLE,
  DEFAULT_PROFILE_SUBTITLE,
  DEFAULT_USER_AVATAR,
  getStoredLoginState,
  getStoredNickname,
} from '../../utils/profile-store'

const profileQuickActions = [
  { emoji: '🔖', label: '我的收藏', color: T.accent, bg: T.accentLight, desc: '文章和项目一键收藏，回看更方便。' },
  { emoji: '🎬', label: '娱乐八卦', color: T.pink, bg: T.pinkBg, desc: '关注热点内容，轻松补全今日话题。' },
  { emoji: '✍️', label: '发表文章', color: T.sage, bg: T.sageBg, desc: '记录灵感、沉淀想法，发布你的内容。' },
  { emoji: '🔔', label: '智能推送', color: T.gold, bg: T.goldBg, desc: '第一时间获取适合你的新内容。' },
]

const profileInterestTags = [
  { label: '前端开发', color: T.accent, bg: T.accentLight },
  { label: 'TypeScript', color: T.lavender, bg: T.lavenderBg },
  { label: 'Node.js', color: T.sage, bg: T.sageBg },
  { label: 'AI 工具', color: T.peach, bg: T.peachBg },
  { label: '开源', color: T.pink, bg: T.pinkBg },
]

const profileStats = [
  { value: '47', label: '收藏' },
  { value: '1.2k', label: '点赞' },
  { value: '386', label: '粉丝' },
  { value: '128', label: '文章' },
]

const profileLoggedIn = ref(getStoredLoginState())
const nickname = ref(getStoredNickname())

const themeVars = computed(() => ({
  '--bg': T.bg,
  '--surface2': T.surface2,
  '--border': T.border,
  '--border-light': T.borderLight,
  '--text1': T.text1,
  '--text2': T.text2,
  '--text3': T.text3,
  '--text4': T.text4,
}))

function openLoginPage() {
  uni.navigateTo({ url: '/pages/profile/login' })
}

function ensureLoggedIn() {
  if (profileLoggedIn.value) return true
  uni.showToast({ title: '请先登录', icon: 'none' })
  setTimeout(() => {
    openLoginPage()
  }, 180)
  return false
}

function openSettingsPage() {
  if (!ensureLoggedIn()) return
  uni.navigateTo({ url: '/pages/profile/settings' })
}

function openProfileFeature(title: string, emoji: string, desc: string) {
  uni.navigateTo({
    url: `/pages/profile/feature?title=${encodeURIComponent(title)}&emoji=${encodeURIComponent(emoji)}&desc=${encodeURIComponent(desc)}`,
  })
}

function openQuickAction(item: { label: string; emoji: string; desc: string }) {
  if (!ensureLoggedIn()) return
  openProfileFeature(item.label, item.emoji, item.desc)
}

function openMyProfile() {
  if (!ensureLoggedIn()) return
  uni.navigateTo({
    url: `/pages/article/author?name=${encodeURIComponent(nickname.value)}&avatar=${encodeURIComponent(DEFAULT_USER_AVATAR)}`,
  })
}

onShow(() => {
  profileLoggedIn.value = getStoredLoginState()
  nickname.value = getStoredNickname()
})
</script>

<style scoped>
.page-root {
  min-height: 100vh;
  background: var(--bg);
}

.scroll-page {
  height: 100vh;
}

.profile-hero {
  position: relative;
  height: 240px;
  overflow: hidden;
}

.fill-img {
  width: 100%;
  height: 100%;
}

.hero-grad {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(30, 20, 15, 0.35) 0%, rgba(50, 30, 20, 0.78) 100%);
}

.profile-copy {
  position: absolute;
  left: 20px;
  right: 20px;
  bottom: 20px;
}

.login-entry,
.profile-user,
.name-row,
.profile-stats,
.menu-row,
.quick-action {
  display: flex;
  align-items: center;
}

.login-entry {
  position: relative;
  margin: 16px;
  min-height: 110px;
  padding: 0 20px;
  border-radius: 24px;
  overflow: hidden;
  justify-content: space-between;
  background: linear-gradient(135deg, #e8866a 0%, #d4956a 50%, #e8a5b4 100%);
  box-shadow: 0 12px 28px rgba(212, 149, 106, 0.24);
}

.login-entry__glow {
  position: absolute;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
}

.login-entry__glow--left {
  width: 112px;
  height: 112px;
  left: -28px;
  top: -24px;
}

.login-entry__glow--right {
  width: 136px;
  height: 136px;
  right: -52px;
  bottom: -56px;
}

.login-entry__icon,
.login-entry__arrow {
  position: relative;
  z-index: 1;
}

.login-entry__icon {
  width: 66px;
  height: 66px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 253, 247, 0.95);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.6);
}

.login-entry__copy {
  position: relative;
  z-index: 1;
  flex: 1;
  min-width: 0;
  margin: 0 14px 0 16px;
  text-align: left;
}

.login-entry__title,
.login-entry__sub,
.profile-sub,
.version {
  display: block;
}

.login-entry__title {
  color: #fff;
  font-size: 22px;
  font-weight: 900;
}

.login-entry__sub {
  margin-top: 6px;
  color: rgba(255, 255, 255, 0.88);
  font-size: 12px;
}

.avatar-button {
  padding: 0;
  background: transparent;
  border: 0;
  line-height: 1;
}

.profile-user {
  align-items: flex-end;
  gap: 12px;
  margin-bottom: 12px;
}

.profile-avatar {
  width: 64px;
  height: 64px;
  border-radius: 20px;
  border: 3px solid rgba(255, 255, 255, 0.9);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
}

.profile-user-copy {
  flex: 1;
  min-width: 0;
}

.name-row {
  gap: 8px;
}

.profile-name {
  color: #fff;
  font-size: 20px;
  font-weight: 900;
}

.level {
  color: #fff;
  background: rgba(232, 134, 106, 0.85);
  border-radius: 999px;
  padding: 2px 8px;
  font-size: 9px;
  font-weight: 800;
}

.profile-sub {
  color: rgba(255, 255, 255, 0.72);
  font-size: 11px;
}

.profile-stats {
  background: rgba(255, 253, 247, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 14px;
  overflow: hidden;
}

.profile-stat-item {
  flex: 1;
  padding: 9px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.profile-stat-item text:first-child {
  color: #fff;
  font-size: 16px;
  font-weight: 800;
}

.profile-stat-item text:last-child {
  color: rgba(255, 255, 255, 0.65);
  font-size: 9px;
}

.panel,
.menu-panel {
  margin: 16px 16px 0;
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 2px 16px rgba(180, 120, 100, 0.07), 0 0 0 1px var(--border);
}

.panel {
  padding: 16px 16px 12px;
}

.panel-title {
  color: var(--text3);
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 14px;
}

.quick-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.quick-action {
  flex-direction: column;
  gap: 8px;
  color: var(--text2);
  font-size: 10px;
  font-weight: 600;
  line-height: 1.3;
}

.quick-icon {
  width: 52px;
  height: 52px;
  border-radius: 16px;
  border: 1px solid;
  text-align: center;
  line-height: 52px;
  font-size: 24px;
}

.tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.interest-tag {
  border: 1px solid;
  border-radius: 999px;
  padding: 4px 12px;
  font-size: 11px;
  font-weight: 600;
}

.menu-panel {
  overflow: hidden;
}

.menu-row {
  width: 100%;
  min-height: 64px;
  padding: 12px 16px;
  gap: 12px;
  border-bottom: 1px solid var(--border-light);
}

.menu-emoji {
  width: 36px;
  height: 36px;
  border-radius: 14px;
  background: var(--surface2);
  text-align: center;
  line-height: 36px;
  font-size: 18px;
}

.menu-copy {
  flex: 1;
  min-width: 0;
  text-align: left;
}

.menu-copy text:first-child {
  display: block;
  color: var(--text1);
  font-size: 14px;
  font-weight: 500;
}

.menu-copy text:last-child {
  display: block;
  color: var(--text4);
  font-size: 11px;
  margin-top: 1px;
}

.version {
  color: var(--text4);
  font-size: 11px;
  text-align: center;
  margin-top: 16px;
}

.bottom-gap {
  height: 20px;
}
</style>
