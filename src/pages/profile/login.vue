<template>
  <view class="page-root" :style="themeVars">
    <view class="bg-orb bg-orb--top" />
    <view class="bg-orb bg-orb--bottom" />

    <view class="top-bar">
      <button class="icon-btn" @tap="goBack">
        <AppIcon name="arrow-left" :size="22" :color="T.text3" />
      </button>
      <text class="top-title serif">登录</text>
    </view>

    <view class="login-shell">
      <view class="hero-badge">
        <view class="hero-badge__inner">
          <AppIcon name="code-2" :size="42" color="#FFFFFF" />
        </view>
      </view>

      <text class="hero-title serif">欢迎使用一望笔记</text>
      <text class="hero-sub">使用微信账号快速登录，登录后即可查看个人信息、标签与更多专属功能。</text>

      <view class="benefit-row">
        <view v-for="item in loginBenefits" :key="item.title" class="benefit-chip" :style="{ background: item.bg }">
          <text class="benefit-chip__emoji">{{ item.emoji }}</text>
          <text class="benefit-chip__text">{{ item.title }}</text>
        </view>
      </view>

      <button class="wechat-btn" @tap="loginWechat">
        <text class="wechat-btn__label">微信快速登录</text>
      </button>

      <button class="agreement-row" @tap="toggleAgreement">
        <view class="agreement-check" :class="{ 'agreement-check--active': agreed }">
          <text>✓</text>
        </view>
        <text class="agreement-text">
          我已阅读并同意
          <text class="agreement-link">《用户协议》</text>
          和
          <text class="agreement-link">《隐私政策》</text>
        </text>
      </button>
    </view>

    <view v-if="loginState !== 'idle'" class="login-mask">
      <view class="login-dialog">
        <template v-if="loginState === 'loading'">
          <view class="spinner" />
          <text class="dialog-title">正在验证微信账号</text>
          <text class="dialog-sub">请稍候，马上带你回到我的页面</text>
        </template>
        <template v-else>
          <text class="success-icon">✓</text>
          <text class="dialog-title">登录成功</text>
          <text class="dialog-sub">欢迎回来，{{ nickname }}</text>
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
  DEFAULT_USER_NAME,
  getStoredNickname,
  setStoredLoginState,
} from '../../utils/profile-store'

const nickname = ref(getStoredNickname())
const agreed = ref(true)
const loginState = ref<'idle' | 'loading' | 'done'>('idle')

const loginBenefits = [
  { emoji: '🔖', title: '收藏同步', bg: T.accentLight },
  { emoji: '🏷️', title: '标签展示', bg: T.lavenderBg },
  { emoji: '✍️', title: '创作入口', bg: T.sageBg },
]

const themeVars = computed(() => ({
  '--bg': T.bg,
  '--border': T.border,
  '--text1': T.text1,
  '--text2': T.text2,
  '--text3': T.text3,
  '--text4': T.text4,
  '--accent': T.accent,
  '--accent-pink': T.accentPink,
  '--surface': T.surface,
}))

let loginTimerOne: ReturnType<typeof setTimeout> | null = null
let loginTimerTwo: ReturnType<typeof setTimeout> | null = null

function goBack() {
  uni.navigateBack()
}

function toggleAgreement() {
  agreed.value = !agreed.value
}

function loginWechat() {
  if (loginState.value !== 'idle') return
  if (!agreed.value) {
    uni.showToast({ title: '请先同意协议', icon: 'none' })
    return
  }

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
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background:
    radial-gradient(circle at top, rgba(232, 165, 180, 0.16), transparent 34%),
    linear-gradient(180deg, #fffdf9 0%, #fffaf5 100%);
}

.bg-orb {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  background: rgba(232, 165, 180, 0.12);
  filter: blur(2px);
}

.bg-orb--top {
  width: 280px;
  height: 280px;
  top: -110px;
  right: -110px;
}

.bg-orb--bottom {
  width: 240px;
  height: 240px;
  left: -120px;
  bottom: 80px;
  background: rgba(232, 134, 106, 0.1);
}

.top-bar {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  padding: 0 16px;
  height: 44px;
}

.icon-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.72);
  box-shadow: 0 0 0 1px rgba(237, 228, 218, 0.8);
}

.top-title {
  position: absolute;
  left: 52px;
  right: 52px;
  color: var(--text1);
  font-size: 17px;
  font-weight: 800;
  text-align: center;
}

.login-shell {
  position: relative;
  z-index: 1;
  min-height: calc(100vh - 44px);
  padding: 78px 28px 36px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hero-badge {
  width: 122px;
  height: 122px;
  padding: 10px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(232, 134, 106, 0.12) 0%, rgba(232, 165, 180, 0.18) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-badge__inner {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #e8866a 0%, #e8a5b4 100%);
  box-shadow: 0 18px 30px rgba(232, 134, 106, 0.26);
}

.hero-title,
.hero-sub,
.wechat-btn__label,
.agreement-text,
.dialog-title,
.dialog-sub,
.success-icon {
  display: block;
}

.hero-title {
  margin-top: 38px;
  color: var(--text1);
  font-size: 26px;
  font-weight: 900;
  text-align: center;
}

.hero-sub {
  margin-top: 14px;
  color: var(--text3);
  font-size: 13px;
  line-height: 1.8;
  text-align: center;
}

.benefit-row {
  width: 100%;
  margin-top: 24px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
}

.benefit-chip {
  min-width: 88px;
  height: 34px;
  padding: 0 12px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  box-shadow: inset 0 0 0 1px rgba(237, 228, 218, 0.8);
}

.benefit-chip__emoji {
  font-size: 14px;
}

.benefit-chip__text {
  color: var(--text2);
  font-size: 12px;
  font-weight: 700;
}

.wechat-btn {
  width: 100%;
  margin-top: 42px;
  min-height: 56px;
  border-radius: 999px;
  background: linear-gradient(135deg, #e8866a 0%, #e8a5b4 100%);
  box-shadow: 0 16px 28px rgba(232, 134, 106, 0.28);
}

.wechat-btn__label {
  color: #fff;
  font-size: 20px;
  font-weight: 800;
  letter-spacing: 0.02em;
}

.agreement-row {
  width: 100%;
  margin-top: 32px;
  padding: 8px 0;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 10px;
  background: transparent;
}

.agreement-check {
  width: 20px;
  height: 20px;
  margin-top: 1px;
  flex-shrink: 0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: inset 0 0 0 1px rgba(196, 175, 175, 0.9);
}

.agreement-check text {
  color: transparent;
  font-size: 12px;
  font-weight: 800;
}

.agreement-check--active {
  background: linear-gradient(135deg, #e8866a 0%, #e8a5b4 100%);
  box-shadow: none;
}

.agreement-check--active text {
  color: #fff;
}

.agreement-text {
  flex: 1;
  color: var(--text3);
  font-size: 12px;
  line-height: 1.7;
}

.agreement-link {
  color: var(--accent);
}

.login-mask {
  position: fixed;
  inset: 0;
  z-index: 30;
  background: rgba(40, 30, 30, 0.46);
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-dialog {
  min-width: 236px;
  padding: 34px 28px;
  background: #fff;
  border-radius: 28px;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.18);
  text-align: center;
}

.spinner {
  width: 52px;
  height: 52px;
  margin: 0 auto 18px;
  border-radius: 50%;
  border: 4px solid #f3e7dd;
  border-top-color: #e8866a;
  animation: spin 0.9s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.dialog-title {
  color: var(--text1);
  font-size: 16px;
  font-weight: 800;
  margin-bottom: 8px;
}

.dialog-sub {
  color: var(--text4);
  font-size: 12px;
  line-height: 1.6;
}

.success-icon {
  width: 54px;
  height: 54px;
  margin: 0 auto 14px;
  border-radius: 50%;
  color: #fff;
  font-size: 28px;
  line-height: 54px;
  background: linear-gradient(135deg, #e8866a 0%, #e8a5b4 100%);
}
</style>
