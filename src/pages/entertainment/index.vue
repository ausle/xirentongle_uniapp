<template>
  <view class="page-root">
    <view class="fixed-head">
      <text class="eyebrow">玩转有趣 🎪</text>
      <text class="page-title serif">娱乐广场</text>
    </view>

    <scroll-view scroll-y class="scroll-page">
      <view class="page-pad">
        <view
          class="ent-feature"
          :style="{
            background: entertainmentItems[0].grad,
            boxShadow: `0 10px 32px ${entertainmentItems[0].accentColor}30`,
          }"
          @tap="openEntertainment(entertainmentItems[0].id)"
        >
          <view class="soft-circle one" />
          <text class="ent-feature-emoji">{{ entertainmentItems[0].emoji }}</text>
          <view class="ent-feature-copy">
            <text class="ent-hot">🔥 本周最热</text>
            <text class="ent-feature-title serif">{{ entertainmentItems[0].title }}</text>
            <text class="ent-desc">{{ entertainmentItems[0].desc }}</text>
          </view>
          <AppIcon name="chevron-right" :size="20" color="rgba(255,255,255,0.7)" />
        </view>

        <view class="ent-grid">
          <view
            v-for="item in entertainmentItems.slice(1)"
            :key="item.id"
            class="ent-card"
            :style="{
              background: item.grad,
              boxShadow: `0 8px 28px ${item.accentColor}30, 0 2px 8px ${item.accentColor}15`,
            }"
            @tap="openEntertainment(item.id)"
          >
            <view class="soft-circle one" />
            <view class="soft-circle two" />
            <text v-if="item.hot || item.isNew" class="ent-badge" :class="{ new: item.isNew }">
              {{ item.hot ? '🔥 热门' : '✨ 新上线' }}
            </text>
            <text class="ent-emoji">{{ item.emoji }}</text>
            <text class="ent-title serif">{{ item.title }}</text>
            <text class="ent-tag">{{ item.tag }}</text>
            <text class="ent-desc">{{ item.desc }}</text>
            <view class="ent-cta">
              <text>开始</text>
              <AppIcon name="chevron-right" :size="11" color="#fff" />
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import AppIcon from '../../components/AppIcon.vue'
import { entertainmentItems } from '../../mock/entertainment'

function openEntertainment(id: string) {
  uni.navigateTo({
    url: `/pages/entertainment/detail?id=${encodeURIComponent(id)}`,
  })
}
</script>

<style scoped>
.page-root { min-height: 100vh; background: #fffdf7; }
.fixed-head { padding: 12px 20px; background: #fff; border-bottom: 1px solid #ede4da; }
.eyebrow { display: block; color: #c4afaf; font-size: 11px; letter-spacing: 0.06em; margin-bottom: 2px; }
.page-title { color: #3d2c2c; font-size: 26px; font-weight: 900; }
.scroll-page { height: calc(100vh - 86px); }
.page-pad { padding: 16px; }
.ent-feature { border-radius: 22px; padding: 22px; display: flex; align-items: center; gap: 20px; overflow: hidden; position: relative; margin-bottom: 16px; }
.soft-circle { position: absolute; border-radius: 50%; background: rgba(255,255,255,0.18); }
.soft-circle.one { top: -20px; right: -20px; width: 80px; height: 80px; }
.soft-circle.two { bottom: -10px; left: -10px; width: 50px; height: 50px; background: rgba(255,255,255,0.12); }
.ent-feature-emoji { font-size: 52px; line-height: 1; z-index: 1; }
.ent-feature-copy { flex: 1; z-index: 1; }
.ent-hot { display: inline-block; margin-bottom: 6px; color: #fff; background: rgba(255,80,60,0.85); border-radius: 999px; padding: 2px 8px; font-size: 9px; font-weight: 700; }
.ent-feature-title,.ent-title { color: #fff; font-weight: 900; }
.ent-feature-title { display: block; font-size: 18px; margin-bottom: 4px; }
.ent-desc { display: block; color: rgba(255,255,255,0.85); font-size: 11px; line-height: 1.5; }
.ent-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
.ent-card { min-height: 168px; border-radius: 22px; padding: 20px 16px 16px; position: relative; overflow: hidden; display: flex; flex-direction: column; }
.ent-badge { position: absolute; top: 12px; right: 12px; padding: 2px 8px; border-radius: 999px; background: rgba(255,80,60,0.85); color: #fff; font-size: 9px; font-weight: 700; }
.ent-badge.new { background: rgba(60,170,100,0.85); }
.ent-emoji { font-size: 34px; line-height: 1; margin-bottom: 10px; z-index: 1; }
.ent-title { font-size: 15px; line-height: 1.25; margin-bottom: 5px; z-index: 1; }
.ent-tag { align-self: flex-start; color: #fff; background: rgba(255,255,255,0.28); border-radius: 999px; padding: 2px 9px; font-size: 10px; font-weight: 700; margin-bottom: 8px; z-index: 1; }
.ent-cta { margin-top: auto; align-self: flex-end; display: inline-flex; align-items: center; gap: 2px; color: #fff; background: rgba(255,255,255,0.22); border-radius: 999px; padding: 4px 12px; font-size: 10px; font-weight: 700; z-index: 1; }
</style>
