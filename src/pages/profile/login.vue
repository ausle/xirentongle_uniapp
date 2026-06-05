<template>
  <view class="page-root" :style="themeVars">
    <view class="top-bar">
      <button class="icon-btn" @tap="goBack">
        <AppIcon name="arrow-left" :size="22" :color="T.text3" />
      </button>
      <text class="top-title serif">微信登录</text>
    </view>

    <view class="login-hero">
      <image class="fill-img" :src="DEFAULT_HERO_IMAGE" mode="aspectFill" />
      <view class="login-grad" />
      <view class="login-copy">
        <text class="login-brand">一望雀起</text>
        <view class="login-title serif">
          <text>望断云海间</text>
          <text>雀跃此刻起</text>
        </view>
        <view class="login-desc">
          <text>遇见让你怦然心动的好内容</text>
          <text>登录后开启你的专属功能页</text>
        </view>
      </view>
    </view>

    <scroll-view scroll-y class="login-scroll">
      <view class="login-card">
        <text class="welcome serif">欢迎回来 ✨</text>
        <text class="welcome-sub">登录后解锁更多精彩内容</text>
        <button class="wechat-btn" @tap="loginWechat">
          <text class="wechat-logo">W</text>
          <view class="wechat-copy">
            <text class="wechat-title">微信一键登录</text>
            <text class="wechat-sub">安全快捷，无需密码</text>
          </view>
        </button>
      </view>

      <view class="login-card feature-card">
        <text class="feature-title">登录后你会获得</text>
        <view class="feature-grid">
          <view
            v-for="item in profileFeatures"
            :key="item.title"
            class="feature-item"
            :style="{ background: item.bg, borderColor: `${item.color}20` }"
          >
            <text class="feature-emoji">{{ item.emoji }}</text>
            <view class="feature-copy">
              <text class="feature-name">{{ item.title }}</text>
              <text class="feature-desc">{{ item.desc }}</text>
            </view>
          </view>
        </view>
      </view>

      <text class="agreement">登录即代表同意《服务协议》和《隐私政策》</text>
    </scroll-view>

    <view v-if="loginState !== 'idle'" class="login-mask">
      <view class="login-dialog">
        <template v-if="loginState === 'loading'">
          <view class="spinner" />
          <text class="dialog-title">正在验证微信账号</text>
          <text class="dialog-sub">请稍候 🌱</text>
        </template>
        <template v-else>
          <text class="success-icon">✅</text>
          <text class="dialog-title">登录成功！</text>
          <text class="dialog-sub">欢迎回来，{{ nickname }} 🎉</text>
        </template>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import AppIcon from '../../components/AppIcon.vue'
import { T } from '../../utils/theme'
import {
  DEFAULT_HERO_IMAGE,
  DEFAULT_USER_NAME,
  getStoredNickname,
  setStoredLoginState,
} from '../../utils/profile-store'

const nickname = ref(getStoredNickname())
const loginState = ref<'idle' | 'loading' | 'done'>('idle')

const profileFeatures = [
  { emoji: '🔖', bg: T.accentLight, color: T.accent, title: '内容收藏', desc: '文章项目一键收藏' },
  { emoji: '🎬', bg: T.pinkBg, color: T.pink, title: '娱乐八卦', desc: '明星资讯随时掌握' },
  { emoji: '✍️', bg: T.sageBg, color: T.sage, title: '文章发表', desc: '记录分享你的想法' },
  { emoji: '🔔', bg: T.goldBg, color: T.gold, title: '智能推送', desc: '第一时间获取新内容' },
]

const themeVars = computed(() => ({
  '--bg': T.bg,
  '--surface2': T.surface2,
  '--border': T.border,
  '--text1': T.text1,
  '--text3': T.text3,
  '--text4': T.text4,
}))

let loginTimerOne: ReturnType<typeof setTimeout> | null = null
let loginTimerTwo: ReturnType<typeof setTimeout> | null = null

function goBack() {
  uni.navigateBack()
}

function loginWechat() {
  if (loginState.value !== 'idle') return
  loginState.value = 'loading'
  loginTimerOne = setTimeout(() => {
    loginState.value = 'done'
    setStoredLoginState(true)
    nickname.value = getStoredNickname() || DEFAULT_USER_NAME
    loginTimerTwo = setTimeout(() => {
      uni.navigateBack()
    }, 900)
  }, 1400)
}

onUnmounted(() => {
  if (loginTimerOne) clearTimeout(loginTimerOne)
  if (loginTimerTwo) clearTimeout(loginTimerTwo)
})
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
}

.icon-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
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

.login-hero {
  position: relative;
  height: 240px;
}

.fill-img {
  width: 100%;
  height: 100%;
}

.login-grad {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(30, 20, 15, 0.35) 0%, rgba(50, 30, 20, 0.78) 100%);
}

.login-copy {
  position: absolute;
  left: 20px;
  right: 20px;
  bottom: 20px;
}

.login-brand {
  display: block;
  color: rgba(255, 255, 255, 0.65);
  font-size: 11px;
  letter-spacing: 0.2em;
  margin-bottom: 6px;
}

.login-title {
  color: #fff;
  font-size: 30px;
  font-weight: 900;
  line-height: 1.25;
}

.login-title text,
.login-desc text {
  display: block;
}

.login-desc {
  color: rgba(255, 255, 255, 0.75);
  font-size: 12px;
  line-height: 1.7;
  margin-top: 10px;
}

.login-scroll {
  height: calc(100vh - 284px);
  padding: 20px 0;
}

.login-card {
  margin: 0 28px 16px;
  padding: 22px;
  border-radius: 24px;
  background: #fff;
  box-shadow: 0 2px 16px rgba(180, 120, 100, 0.07), 0 0 0 1px var(--border);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.welcome {
  color: var(--text1);
  font-size: 19px;
  font-weight: 800;
  margin-bottom: 4px;
}

.welcome-sub {
  color: var(--text3);
  font-size: 12px;
  margin-bottom: 22px;
}

.wechat-btn {
  width: calc(100% - 24px);
  min-height: 60px;
  padding: 14px 12px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: var(--surface2);
  box-shadow: 0 2px 12px rgba(180, 120, 100, 0.12), inset 0 0 0 1.5px var(--border);
}

.wechat-logo {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: linear-gradient(135deg, #57cb5a 0%, #3db440 100%);
  color: #fff;
  text-align: center;
  line-height: 32px;
  font-size: 16px;
  font-weight: 900;
  box-shadow: 0 3px 10px rgba(60, 180, 64, 0.35);
}

.wechat-copy {
  min-width: 0;
}

.wechat-title,
.wechat-sub {
  display: block;
  text-align: left;
}

.wechat-title {
  color: var(--text1);
  font-size: 14px;
  font-weight: 800;
}

.wechat-sub {
  color: var(--text4);
  font-size: 10px;
  margin-top: 1px;
}

.feature-card {
  padding: 18px;
}

.feature-title {
  color: var(--text3);
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 14px;
}

.feature-grid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.feature-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px;
  border-radius: 16px;
  border: 1px solid;
}

.feature-emoji {
  width: 36px;
  height: 36px;
  border-radius: 12px;
  background: #fff;
  text-align: center;
  line-height: 36px;
  font-size: 18px;
}

.feature-copy {
  flex: 1;
  min-width: 0;
}

.feature-name,
.feature-desc,
.agreement,
.dialog-title,
.dialog-sub,
.success-icon {
  display: block;
}

.feature-name {
  color: var(--text1);
  font-size: 12px;
  font-weight: 700;
}

.feature-desc {
  color: var(--text3);
  font-size: 10px;
  line-height: 1.4;
  margin-top: 2px;
}

.agreement {
  color: var(--text4);
  font-size: 11px;
  text-align: center;
  margin-bottom: 16px;
}

.login-mask {
  position: fixed;
  inset: 0;
  z-index: 30;
  background: rgba(40, 30, 30, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-dialog {
  min-width: 220px;
  padding: 36px 48px;
  background: #fff;
  border-radius: 28px;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.spinner {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: 4px solid var(--border);
  border-top-color: #e8866a;
  margin: 0 auto 18px;
  animation: spin 0.9s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.dialog-title {
  color: var(--text1);
  font-size: 15px;
  font-weight: 800;
  margin-bottom: 6px;
}

.dialog-sub {
  color: var(--text4);
  font-size: 12px;
}

.success-icon {
  color: #e8866a;
  font-size: 52px;
  line-height: 1;
  margin-bottom: 12px;
}
</style>
