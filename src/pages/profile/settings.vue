<template>
  <view class="page-root" :style="themeVars">
    <view class="top-bar">
      <button class="icon-btn" @tap="goBack">
        <AppIcon name="arrow-left" :size="22" :color="T.text3" />
      </button>
      <text class="top-title serif">设置</text>
    </view>

    <scroll-view scroll-y class="scroll-page">
      <view class="settings-body">
        <view class="settings-card">
          <view class="settings-row">
            <text>头像</text>
            <view class="avatar-edit">
              <image :src="DEFAULT_USER_AVATAR" mode="aspectFill" />
              <view class="avatar-edit-mask">
                <AppIcon name="camera" :size="13" color="#fff" />
              </view>
            </view>
            <AppIcon name="chevron-right" :size="15" :color="T.text4" />
          </view>

          <view class="settings-row">
            <text>昵称</text>
            <view v-if="editingNickname" class="nickname-edit">
              <input v-model="nicknameDraft" />
              <button @tap="saveNickname">保存</button>
            </view>
            <view v-else class="nickname-read" @tap="editingNickname = true">
              <text>{{ nickname }}</text>
              <AppIcon name="chevron-right" :size="15" :color="T.text4" />
            </view>
          </view>

          <view class="settings-row">
            <view class="meta-inline">
              <AppIcon name="phone" :size="14" :color="T.text4" />
              <text>已绑定手机号</text>
            </view>
            <text>{{ DEFAULT_USER_PHONE }}</text>
          </view>
        </view>

        <view class="settings-card">
          <view class="settings-row" @tap="openFeature('服务协议及隐私政策', '📄', '查看平台的服务协议、隐私政策与账号规范。')">
            <view class="meta-inline">
              <AppIcon name="file-text" :size="14" :color="T.text4" />
              <text>服务协议及隐私政策</text>
            </view>
            <AppIcon name="chevron-right" :size="15" :color="T.text4" />
          </view>
          <view class="settings-row danger" @tap="openFeature('注销账号', '🧹', '这里预留账号注销申请与说明页。')">
            <view class="meta-inline">
              <AppIcon name="trash-2" :size="14" color="#E87070" />
              <text>注销账号</text>
            </view>
            <AppIcon name="chevron-right" :size="15" color="#E87070" />
          </view>
        </view>

        <view class="settings-card">
          <button class="logout-btn" @tap="logout">
            <AppIcon name="log-out" :size="16" color="#E87070" />
            <text>退出登录</text>
          </button>
        </view>

        <text class="version">@ 一望雀起 v1.0.25</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import AppIcon from '../../components/AppIcon.vue'
import { T } from '../../utils/theme'
import {
  DEFAULT_USER_AVATAR,
  DEFAULT_USER_PHONE,
  getStoredNickname,
  clearStoredLoginState,
  clearStoredNickname,
  setStoredNickname,
} from '../../utils/profile-store'

const nickname = ref(getStoredNickname())
const nicknameDraft = ref(nickname.value)
const editingNickname = ref(false)

const themeVars = computed(() => ({
  '--bg': T.bg,
  '--border': T.border,
  '--border-light': T.borderLight,
  '--text1': T.text1,
  '--text3': T.text3,
  '--text4': T.text4,
}))

function goBack() {
  uni.navigateBack()
}

function saveNickname() {
  nickname.value = setStoredNickname(nicknameDraft.value)
  nicknameDraft.value = nickname.value
  editingNickname.value = false
  uni.showToast({ title: '昵称已保存', icon: 'success' })
}

function openFeature(title: string, emoji: string, desc: string) {
  uni.navigateTo({
    url: `/pages/profile/feature?title=${encodeURIComponent(title)}&emoji=${encodeURIComponent(emoji)}&desc=${encodeURIComponent(desc)}`,
  })
}

function logout() {
  clearStoredLoginState()
  clearStoredNickname()
  uni.showToast({ title: '已退出登录', icon: 'success' })
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

.scroll-page {
  height: calc(100vh - 44px);
}

.settings-body {
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.settings-card {
  background: #fff;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 2px 16px rgba(180, 120, 100, 0.07), 0 0 0 1px var(--border);
}

.settings-row,
.meta-inline,
.nickname-read,
.nickname-edit,
.logout-btn {
  display: flex;
  align-items: center;
}

.settings-row {
  min-height: 56px;
  padding: 10px 16px;
  border-bottom: 1px solid var(--border-light);
  justify-content: space-between;
  color: var(--text1);
  font-size: 14px;
  font-weight: 500;
}

.meta-inline {
  gap: 8px;
}

.avatar-edit {
  margin-left: auto;
  margin-right: 8px;
  position: relative;
}

.avatar-edit image {
  width: 42px;
  height: 42px;
  border-radius: 13px;
  border: 2px solid var(--border);
}

.avatar-edit-mask {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.18);
  border-radius: 13px;
}

.nickname-read,
.nickname-edit {
  margin-left: auto;
  gap: 8px;
  color: var(--text3);
  font-size: 13px;
}

.nickname-edit input {
  width: 140px;
  height: 30px;
  border: 1.5px solid rgba(232, 134, 106, 0.33);
  border-radius: 8px;
  background: #fff8f4;
  color: var(--text1);
  font-size: 13px;
  padding: 0 10px;
  text-align: right;
}

.nickname-edit button {
  color: #fff;
  background: linear-gradient(135deg, #e8866a 0%, #f4b088 100%);
  border-radius: 8px;
  padding: 5px 12px;
  font-size: 12px;
  font-weight: 700;
}

.danger,
.logout-btn {
  color: #e87070;
}

.logout-btn {
  width: 100%;
  min-height: 52px;
  justify-content: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 700;
}

.version {
  display: block;
  color: var(--text4);
  font-size: 11px;
  text-align: center;
  margin-top: 8px;
}
</style>
