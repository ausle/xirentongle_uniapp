<template>
  <view class="page-root" :style="themeVars">
    <view class="top-bar">
      <button class="icon-btn" @tap="goBack">
        <AppIcon name="arrow-left" :size="22" :color="T.text3" />
      </button>
      <text class="top-title serif">{{ item.title }}</text>
    </view>

    <view class="ent-detail-hero" :style="{ background: item.grad }">
      <view class="soft-circle detail-one" />
      <view class="soft-circle detail-two" />
      <text class="ent-detail-emoji">{{ item.emoji }}</text>
      <text class="ent-detail-title serif">{{ item.title }}</text>
      <text class="ent-detail-tag">{{ item.tag }}</text>
    </view>

    <view class="ent-detail-body">
      <view class="develop-card">
        <text class="develop-emoji">🛠️</text>
        <text class="develop-title serif">功能开发中</text>
        <text class="develop-desc">{{ item.desc }}</text>
        <text class="develop-wait">敬请期待 ✨</text>
      </view>
      <button
        class="ent-back-btn"
        :style="{
          background: item.grad,
          boxShadow: `0 4px 20px ${item.accentColor}40`,
        }"
        @tap="goBack"
      >
        返回娱乐广场
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import AppIcon from '../../components/AppIcon.vue'
import { entertainmentItems, type EntertainmentItem } from '../../mock/entertainment'
import { T } from '../../utils/theme'

const item = ref<EntertainmentItem>(entertainmentItems[0])
const statusBarHeight = uni.getSystemInfoSync().statusBarHeight ?? 0

const themeVars = computed(() => ({
  '--bg': T.bg,
  '--surface': T.surface,
  '--border': T.border,
  '--text1': T.text1,
  '--text3': T.text3,
  '--safe-top': `${statusBarHeight}px`,
}))

onLoad((options) => {
  const matched = entertainmentItems.find((entry) => entry.id === options?.id)
  if (matched) item.value = matched
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

.ent-detail-hero {
  height: 220px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  overflow: hidden;
}

.soft-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.18);
}

.detail-one {
  top: -30px;
  right: -30px;
  width: 130px;
  height: 130px;
}

.detail-two {
  bottom: -20px;
  left: -20px;
  width: 90px;
  height: 90px;
  background: rgba(255, 255, 255, 0.1);
}

.ent-detail-emoji {
  font-size: 56px;
  margin-bottom: 8px;
}

.ent-detail-title {
  color: #fff;
  font-size: 20px;
  font-weight: 900;
}

.ent-detail-tag {
  align-self: center;
  color: #fff;
  background: rgba(255, 255, 255, 0.28);
  border-radius: 999px;
  padding: 2px 9px;
  font-size: 10px;
  font-weight: 700;
  margin-top: 8px;
}

.ent-detail-body {
  padding: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.develop-card {
  width: 100%;
  background: #fff;
  border-radius: 24px;
  padding: 32px 24px;
  text-align: center;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
}

.develop-emoji {
  font-size: 48px;
  margin-bottom: 16px;
}

.develop-title {
  color: var(--text1);
  font-size: 18px;
  font-weight: 800;
  margin-bottom: 8px;
}

.develop-desc {
  color: var(--text3);
  font-size: 13px;
  line-height: 1.7;
}

.develop-wait {
  color: var(--text3);
  font-size: 12px;
  margin-top: 10px;
}

.ent-back-btn {
  width: 100%;
  height: 48px;
  border-radius: 18px;
  color: #fff;
  font-size: 15px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
