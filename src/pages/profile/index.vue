<template>
  <view class="page-root" :style="themeVars">
    <scroll-view scroll-y class="scroll-page">
      <template v-if="!profileLoggedIn">
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
              <text>每一次翻阅，都是心灵的展翼</text>
            </view>
          </view>
        </view>

        <view class="login-card">
          <text class="welcome serif">欢迎回来 ✨</text>
          <text class="welcome-sub">登录后解锁更多精彩内容</text>
          <button class="wechat-btn" @tap="openLoginPage">
            <text class="wechat-logo">W</text>
            <view class="wechat-copy">
              <text class="wechat-title">微信一键登录</text>
              <text class="wechat-sub">进入独立登录页完成授权</text>
            </view>
          </button>
        </view>

        <view class="login-card feature-card">
          <text class="feature-title">登录后专属你的功能 🎨</text>
          <view class="feature-grid">
            <button
              v-for="item in profileFeatures"
              :key="item.title"
              class="feature-item"
              :style="{ background: item.bg, borderColor: `${item.color}20` }"
              @tap="openProfileFeature(item.title, item.emoji, item.desc)"
            >
              <text class="feature-emoji">{{ item.emoji }}</text>
              <view class="feature-copy">
                <text class="feature-name">{{ item.title }}</text>
                <text class="feature-desc">{{ item.desc }}</text>
              </view>
            </button>
          </view>
        </view>

        <text class="agreement">登录即代表同意《服务协议》和《隐私政策》</text>
      </template>

      <template v-else>
        <view class="profile-hero">
          <image class="fill-img" :src="DEFAULT_HERO_IMAGE" mode="aspectFill" />
          <view class="login-grad" />
          <view class="profile-copy">
            <view class="profile-user">
              <button @tap="openMyProfile">
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

        <view class="panel">
          <text class="panel-title">我的功能</text>
          <view class="quick-grid">
            <button
              v-for="item in profileQuickActions"
              :key="item.label"
              class="quick-action"
              @tap="openProfileFeature(item.label, item.emoji, `${item.label} 已切换为独立页面入口。`)"
            >
              <text class="quick-icon" :style="{ background: item.bg, borderColor: `${item.color}20` }">
                {{ item.emoji }}
              </text>
              <text>{{ item.label }}</text>
            </button>
          </view>
        </view>

        <view class="panel">
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
            @tap="openProfileFeature('联系客服', '💬', '遇到问题，随时找我们，这里可以继续接客服系统。')"
          >
            <text class="menu-emoji">💬</text>
            <view class="menu-copy">
              <text>联系客服</text>
              <text>遇到问题，随时找我们</text>
            </view>
            <AppIcon name="chevron-right" :size="15" :color="T.text4" />
          </button>
          <button
            class="menu-row"
            @tap="openProfileFeature('关注公众号', '📣', '这里可以接入公众号二维码、活动与内容推送。')"
          >
            <text class="menu-emoji">📣</text>
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

        <text class="version">一望雀起 v1.0.25 · 用爱制作 🌱</text>
      </template>

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

const profileFeatures = [
  { emoji: '🔖', bg: T.accentLight, color: T.accent, title: '内容收藏', desc: '文章项目一键收藏' },
  { emoji: '🎬', bg: T.pinkBg, color: T.pink, title: '娱乐八卦', desc: '明星资讯随时掌握' },
  { emoji: '✍️', bg: T.sageBg, color: T.sage, title: '文章发表', desc: '记录分享你的想法' },
  { emoji: '🔔', bg: T.goldBg, color: T.gold, title: '智能推送', desc: '第一时间获取新内容' },
]

const profileQuickActions = [
  { emoji: '🔖', label: '我的收藏', color: T.accent, bg: T.accentLight },
  { emoji: '🎬', label: '娱乐八卦', color: T.pink, bg: T.pinkBg },
  { emoji: '✍️', label: '发表文章', color: T.sage, bg: T.sageBg },
  { emoji: '🔔', label: '智能推送', color: T.gold, bg: T.goldBg },
]

const profileInterestTags = [
  { label: '前端开发', color: T.accent, bg: T.accentLight },
  { label: 'TypeScript', color: T.lavender, bg: T.lavenderBg },
  { label: 'Node.js', color: T.sage, bg: T.sageBg },
  { label: 'AI工具', color: T.peach, bg: T.peachBg },
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

function openSettingsPage() {
  uni.navigateTo({ url: '/pages/profile/settings' })
}

function openProfileFeature(title: string, emoji: string, desc: string) {
  uni.navigateTo({
    url: `/pages/profile/feature?title=${encodeURIComponent(title)}&emoji=${encodeURIComponent(emoji)}&desc=${encodeURIComponent(desc)}`,
  })
}

function openMyProfile() {
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
.page-root { min-height: 100vh; background: var(--bg); }
.scroll-page { height: 100vh; }
.login-hero,.profile-hero { position: relative; height: 240px; overflow: hidden; }
.fill-img { width: 100%; height: 100%; }
.login-grad { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(30,20,15,0.35) 0%, rgba(50,30,20,0.78) 100%); }
.login-copy,.profile-copy { position: absolute; left: 20px; right: 20px; bottom: 20px; }
.login-brand { display: block; color: rgba(255,255,255,0.65); font-size: 11px; letter-spacing: 0.2em; margin-bottom: 6px; }
.login-title { color: #fff; font-size: 30px; font-weight: 900; line-height: 1.25; }
.login-title text,.login-desc text { display: block; }
.login-desc { color: rgba(255,255,255,0.75); font-size: 12px; line-height: 1.7; margin-top: 10px; }
.login-card,.panel,.menu-panel { margin: 16px 16px 0; background: #fff; border-radius: 24px; box-shadow: 0 2px 16px rgba(180,120,100,0.07),0 0 0 1px var(--border); }
.login-card { padding: 22px; display: flex; flex-direction: column; align-items: center; }
.welcome { color: var(--text1); font-size: 19px; font-weight: 800; margin-bottom: 4px; }
.welcome-sub { color: var(--text3); font-size: 12px; margin-bottom: 22px; }
.wechat-btn,.profile-user,.name-row,.profile-stats,.feature-item,.menu-row,.quick-action,.meta-inline { display: flex; align-items: center; }
.wechat-btn { width: calc(100% - 24px); min-height: 60px; padding: 14px 12px; border-radius: 18px; justify-content: center; gap: 12px; background: var(--surface2); box-shadow: 0 2px 12px rgba(180,120,100,0.12), inset 0 0 0 1.5px var(--border); }
.wechat-logo { width: 32px; height: 32px; border-radius: 10px; background: linear-gradient(135deg, #57cb5a 0%, #3db440 100%); color: #fff; text-align: center; line-height: 32px; font-size: 16px; font-weight: 900; box-shadow: 0 3px 10px rgba(60,180,64,0.35); }
.wechat-copy { min-width: 0; }
.wechat-title,.wechat-sub,.feature-name,.feature-desc,.agreement,.version,.profile-sub { display: block; }
.wechat-title { color: var(--text1); font-size: 14px; font-weight: 800; text-align: left; }
.wechat-sub { color: var(--text4); font-size: 10px; margin-top: 1px; text-align: left; }
.feature-card { align-items: stretch; }
.feature-title,.panel-title { color: var(--text3); font-size: 12px; font-weight: 700; margin-bottom: 14px; }
.feature-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
.feature-item { gap: 10px; padding: 12px; border-radius: 16px; border: 1px solid; }
.feature-emoji { width: 36px; height: 36px; border-radius: 12px; background: #fff; text-align: center; line-height: 36px; font-size: 18px; }
.feature-copy { flex: 1; min-width: 0; text-align: left; }
.feature-name { color: var(--text1); font-size: 12px; font-weight: 700; }
.feature-desc { color: var(--text3); font-size: 10px; line-height: 1.4; margin-top: 2px; }
.agreement,.version { color: var(--text4); font-size: 11px; text-align: center; margin-top: 16px; }
.profile-user { align-items: flex-end; gap: 12px; margin-bottom: 12px; }
.profile-avatar { width: 64px; height: 64px; border-radius: 20px; border: 3px solid rgba(255,255,255,0.9); box-shadow: 0 4px 16px rgba(0,0,0,0.25); }
.profile-user-copy { flex: 1; min-width: 0; }
.name-row { gap: 8px; }
.profile-name { color: #fff; font-size: 20px; font-weight: 900; }
.level { color: #fff; background: rgba(232,134,106,0.85); border-radius: 999px; padding: 2px 8px; font-size: 9px; font-weight: 800; }
.profile-sub { color: rgba(255,255,255,0.7); font-size: 11px; }
.profile-stats { background: rgba(255,253,247,0.15); border: 1px solid rgba(255,255,255,0.2); border-radius: 14px; overflow: hidden; }
.profile-stat-item { flex: 1; padding: 9px 0; display: flex; flex-direction: column; align-items: center; }
.profile-stat-item text:first-child { color: #fff; font-size: 16px; font-weight: 800; }
.profile-stat-item text:last-child { color: rgba(255,255,255,0.65); font-size: 9px; }
.panel { padding: 16px 16px 12px; }
.quick-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
.quick-action { flex-direction: column; gap: 8px; color: var(--text2); font-size: 10px; font-weight: 600; line-height: 1.3; }
.quick-icon { width: 52px; height: 52px; border-radius: 16px; border: 1px solid; text-align: center; line-height: 52px; font-size: 24px; }
.tag-row { display: flex; flex-wrap: wrap; gap: 8px; }
.interest-tag { border: 1px solid; border-radius: 999px; padding: 4px 12px; font-size: 11px; font-weight: 600; }
.menu-panel { overflow: hidden; }
.menu-row { width: 100%; min-height: 64px; padding: 12px 16px; gap: 12px; border-bottom: 1px solid var(--border-light); }
.menu-emoji { width: 36px; height: 36px; border-radius: 14px; background: var(--surface2); text-align: center; line-height: 36px; font-size: 18px; }
.menu-copy { flex: 1; min-width: 0; text-align: left; }
.menu-copy text:first-child { display: block; color: var(--text1); font-size: 14px; font-weight: 500; }
.menu-copy text:last-child { display: block; color: var(--text4); font-size: 11px; margin-top: 1px; }
.bottom-gap { height: 20px; }
</style>
