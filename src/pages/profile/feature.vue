<template>
  <view class="page-root" :style="themeVars">
    <view class="top-bar">
      <button class="icon-btn" @tap="goBack">
        <AppIcon name="arrow-left" :size="22" :color="T.text3" />
      </button>
      <text class="top-title serif line-1">{{ title }}</text>
    </view>

    <view class="feature-wrap">
      <view class="feature-card">
        <text class="feature-emoji">{{ emoji }}</text>
        <text class="feature-title serif">{{ title }}</text>
        <text class="feature-desc">{{ desc }}</text>
        <text class="feature-sub">这里现在已经是独立页面入口，后续可以继续往里接真实业务。</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import AppIcon from '../../components/AppIcon.vue'
import { T } from '../../utils/theme'

const title = ref('功能页面')
const emoji = ref('✨')
const desc = ref('这是一个独立的新页面。')
const statusBarHeight = uni.getSystemInfoSync().statusBarHeight ?? 0

const themeVars = computed(() => ({
  '--bg': T.bg,
  '--border': T.border,
  '--text1': T.text1,
  '--text3': T.text3,
  '--text4': T.text4,
  '--accent': T.accent,
  '--safe-top': `${statusBarHeight}px`,
}))

onLoad((options) => {
  if (typeof options?.title === 'string') title.value = decodeURIComponent(options.title)
  if (typeof options?.emoji === 'string') emoji.value = decodeURIComponent(options.emoji)
  if (typeof options?.desc === 'string') desc.value = decodeURIComponent(options.desc)
})

function goBack() {
  uni.navigateBack()
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

.feature-wrap {
  min-height: calc(100vh - 44px - var(--safe-top));
  padding: 24px 16px;
}

.feature-card {
  background: #fff;
  border-radius: 24px;
  padding: 28px 22px;
  box-shadow: 0 4px 24px rgba(180, 120, 100, 0.08), 0 0 0 1px var(--border);
}

.feature-emoji,
.feature-title,
.feature-desc,
.feature-sub {
  display: block;
}

.feature-emoji {
  font-size: 46px;
  margin-bottom: 16px;
}

.feature-title {
  color: var(--text1);
  font-size: 22px;
  font-weight: 900;
}

.feature-desc {
  color: var(--text3);
  font-size: 14px;
  line-height: 1.8;
  margin-top: 14px;
}

.feature-sub {
  color: var(--text4);
  font-size: 12px;
  line-height: 1.7;
  margin-top: 12px;
}

.line-1 {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
