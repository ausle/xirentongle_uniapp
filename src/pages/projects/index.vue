<template>
  <view class="page-root" :style="themeVars">
    <view class="fixed-head">
      <text class="eyebrow">精心挑选 🧸</text>
      <text class="page-title serif">好用的开源项目</text>
    </view>

    <scroll-view scroll-y class="scroll-page">
      <view class="project-search-zone">
        <view class="search-box" :class="{ focused: projectSearch }">
          <AppIcon name="search" :size="14" :color="projectSearch ? T.accent : T.text4" />
          <input
            v-model="projectSearch"
            class="search-input"
            placeholder="搜索项目名、作者.."
            placeholder-class="placeholder"
            @focus="projectSearchFocused = true"
            @blur="handleProjectSearchBlur"
          />
          <button v-if="projectSearch" class="clear-btn" @tap="projectSearch = ''">
            <AppIcon name="x" :size="14" :color="T.text4" />
          </button>
        </view>

        <view v-if="projectSearchFocused && !projectSearch && recentSearches.length" class="recent-zone">
          <view class="recent-head">
            <text>最近搜索</text>
            <button @tap="recentSearches = []">清除全部</button>
          </view>
          <view class="recent-tags">
            <button v-for="query in recentSearches" :key="query" class="recent-tag" @tap="selectRecentSearch(query)">
              <AppIcon name="history" :size="11" :color="T.text4" />
              <text>{{ query }}</text>
            </button>
          </view>
        </view>

        <template v-else>
          <scroll-view scroll-x class="filter-scroll">
            <button
              v-for="filter in projectFilters"
              :key="filter.key"
              class="filter-pill"
              :class="{ active: activeProjectFilter === filter.key }"
              @tap="activeProjectFilter = filter.key"
            >
              {{ filter.emoji }} {{ filter.label }}
            </button>
          </scroll-view>

          <view class="project-sort">
            <button :class="{ active: activeProjectSort === 'newest' }" @tap="activeProjectSort = 'newest'">
              <AppIcon name="clock" :size="11" :color="activeProjectSort === 'newest' ? T.accent : T.text4" />
              <text>最新</text>
            </button>
            <button :class="{ active: activeProjectSort === 'hottest' }" @tap="activeProjectSort = 'hottest'">
              <AppIcon name="flame" :size="11" :color="activeProjectSort === 'hottest' ? T.accent : T.text4" />
              <text>最热</text>
            </button>
          </view>
        </template>
      </view>

      <view class="page-pad">
        <view v-if="filteredProjects.length === 0" class="empty">
          <text class="empty-emoji">🔍</text>
          <text class="empty-title">没有找到相关项目</text>
          <text class="empty-desc">试试换个关键词？</text>
        </view>

        <view v-for="project in filteredProjects" :key="project.id" class="project-card" @tap="openProject(project.id)">
          <view class="project-cover">
            <image class="fill-img" :src="project.cover" mode="aspectFill" />
            <view class="project-grad" />
            <view class="star-badge">
              <AppIcon name="star" :size="11" color="#F5A623" filled />
              <text>{{ project.stars }}</text>
            </view>
            <view class="project-cover-copy">
              <text class="project-name serif">{{ project.name }}</text>
              <text class="project-tagline">{{ project.tagline }}</text>
            </view>
          </view>

          <view class="project-body">
            <text class="line-2 project-desc">{{ project.description }}</text>
            <view class="tag-row">
              <text v-for="tag in project.tags.slice(0, 3)" :key="`${project.id}-${tag}`" class="hash-tag">#{{ tag }}</text>
            </view>
            <view class="project-meta">
              <image class="avatar-xs" :src="project.authorAvatar" mode="aspectFill" />
              <text>{{ project.authorName }}</text>
              <view
                class="lang-pill"
                :style="{
                  color: project.langColor,
                  background: `${project.langColor}18`,
                  borderColor: `${project.langColor}30`,
                }"
              >
                <view class="lang-dot" :style="{ background: project.langColor }" />
                <text>{{ project.language }}</text>
              </view>
              <view class="meta-inline">
                <AppIcon name="git-fork" :size="10" :color="T.text4" />
                <text>{{ project.forks }}</text>
              </view>
            </view>
          </view>
        </view>

        <view class="bottom-gap" />
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import AppIcon from '../../components/AppIcon.vue'
import { T } from '../../utils/theme'
import { projects } from '../../mock/data'

type ProjectFilter = 'all' | 'JavaScript' | 'TypeScript' | 'CSS'
type ProjectSort = 'newest' | 'hottest'

const activeProjectFilter = ref<ProjectFilter>('all')
const activeProjectSort = ref<ProjectSort>('newest')
const projectSearch = ref('')
const projectSearchFocused = ref(false)
const recentSearches = ref<string[]>([])

const projectFilters = [
  { key: 'all' as const, label: '全部', emoji: '✨' },
  { key: 'TypeScript' as const, label: 'TypeScript', emoji: '💙' },
  { key: 'JavaScript' as const, label: 'JavaScript', emoji: '💛' },
  { key: 'CSS' as const, label: 'CSS', emoji: '🎨' },
]

const themeVars = computed(() => ({
  '--bg': T.bg,
  '--border': T.border,
  '--border-light': T.borderLight,
  '--text1': T.text1,
  '--text2': T.text2,
  '--text3': T.text3,
  '--text4': T.text4,
  '--accent': T.accent,
}))

const filteredProjects = computed(() => {
  const query = projectSearch.value.trim().toLowerCase()
  let list =
    activeProjectFilter.value === 'all'
      ? [...projects]
      : projects.filter((project) => project.language === activeProjectFilter.value)
  if (query) {
    list = list.filter(
      (project) =>
        project.name.toLowerCase().includes(query) ||
        project.authorName.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query),
    )
  }
  if (activeProjectSort.value === 'hottest') {
    list.sort((left, right) => parseStars(right.stars) - parseStars(left.stars))
  }
  return list
})

function parseStars(value: string) {
  if (value.includes('万')) return parseFloat(value) * 10000
  return parseFloat(value.replace(/[^0-9.]/g, '')) || 0
}

function handleProjectSearchBlur() {
  projectSearchFocused.value = false
  const query = projectSearch.value.trim()
  if (!query) return
  recentSearches.value = [query, ...recentSearches.value.filter((item) => item !== query)].slice(0, 8)
}

function selectRecentSearch(query: string) {
  projectSearch.value = query
  projectSearchFocused.value = false
}

function openProject(id: string) {
  uni.navigateTo({
    url: `/pages/project/detail?id=${encodeURIComponent(id)}`,
  })
}
</script>

<style scoped>
.page-root { min-height: 100vh; background: var(--bg); }
.fixed-head { padding: 12px 20px; background: #fff; border-bottom: 1px solid var(--border); }
.eyebrow { display: block; color: var(--text4); font-size: 11px; letter-spacing: 0.06em; margin-bottom: 2px; }
.page-title { color: var(--text1); font-size: 26px; font-weight: 900; }
.scroll-page { height: calc(100vh - 86px); }
.project-search-zone { background: #fff; padding: 12px 20px 14px; border-bottom: 1px solid var(--border); }
.search-box,.recent-tag,.project-sort button,.filter-pill,.lang-pill,.project-meta,.meta-inline { display: flex; align-items: center; }
.search-box { min-height: 40px; padding: 0 14px; border-radius: 13px; background: var(--bg); border: 1.5px solid var(--border); gap: 8px; box-shadow: 0 2px 8px rgba(180,120,100,0.05); }
.search-box.focused { border-color: rgba(232, 134, 106, 0.25); box-shadow: 0 2px 8px rgba(180,120,100,0.05), 0 0 0 1px rgba(232, 134, 106, 0.16); }
.search-input { flex: 1; height: 42px; color: var(--text2); font-size: 13px; }
.placeholder { color: var(--text4); }
.clear-btn { width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; }
.recent-zone { margin-top: 6px; }
.recent-head { display: flex; justify-content: space-between; color: var(--text4); font-size: 11px; margin-bottom: 8px; }
.recent-head button { color: var(--accent); font-weight: 700; }
.recent-tags { display: flex; flex-wrap: wrap; gap: 8px; }
.recent-tag { gap: 6px; padding: 5px 12px; border-radius: 999px; background: #fff; color: var(--text2); border: 1px solid var(--border); font-size: 12px; }
.filter-scroll { white-space: nowrap; margin-bottom: 8px; }
.filter-pill { display: inline-flex; margin-right: 8px; padding: 7px 12px; border-radius: 999px; color: var(--text3); background: #fff8f1; border: 1px solid var(--border); font-size: 12px; }
.filter-pill.active { color: #fff; background: linear-gradient(135deg, #e8866a 0%, #e8a5b4 100%); border-color: transparent; }
.project-sort { display: inline-flex; align-items: center; border: 1px solid var(--border); border-radius: 999px; overflow: hidden; background: #fff8f1; }
.project-sort button { gap: 4px; padding: 6px 12px; color: var(--text4); font-size: 11px; }
.project-sort button.active { color: var(--accent); font-weight: 700; background: #fff0eb; }
.page-pad { padding: 16px; }
.empty { padding: 42px 20px; text-align: center; }
.empty-emoji,.empty-title,.empty-desc,.project-name,.project-tagline,.project-desc { display: block; }
.empty-emoji { font-size: 38px; }
.empty-title { color: var(--text2); font-size: 15px; font-weight: 700; margin-top: 12px; }
.empty-desc { color: var(--text4); font-size: 12px; margin-top: 4px; }
.project-card { overflow: hidden; background: #fff; border-radius: 20px; box-shadow: 0 2px 20px rgba(180,120,100,0.09),0 0 0 1px var(--border); margin-bottom: 16px; }
.project-cover { position: relative; height: 156px; overflow: hidden; }
.fill-img { width: 100%; height: 100%; }
.project-grad { position: absolute; inset: 0; background: linear-gradient(to top, rgba(61,44,44,0.8) 0%, rgba(61,44,44,0.15) 55%, transparent 100%); }
.star-badge { position: absolute; top: 12px; right: 12px; padding: 4px 10px; border-radius: 999px; color: var(--text2); background: rgba(255,255,255,0.86); display: inline-flex; align-items: center; gap: 4px; font-size: 10px; font-weight: 700; }
.project-cover-copy { position: absolute; left: 16px; right: 16px; bottom: 12px; color: rgba(255,255,255,0.85); }
.project-name { color: #fff; font-size: 18px; font-weight: 800; }
.project-tagline { color: rgba(255,255,255,0.8); font-size: 11px; margin-top: 2px; }
.project-body { padding: 12px 16px 16px; }
.project-desc { color: var(--text2); font-size: 13px; line-height: 1.6; margin-bottom: 12px; }
.tag-row { display: flex; flex-wrap: wrap; gap: 8px; }
.hash-tag { color: var(--accent); background: #fff0eb; border: 1px solid rgba(232,134,106,0.15); border-radius: 999px; padding: 3px 9px; font-size: 10px; font-weight: 600; }
.project-meta { gap: 8px; color: var(--text4); font-size: 11px; margin-top: 12px; }
.avatar-xs { width: 20px; height: 20px; border-radius: 50%; }
.lang-pill { margin-left: auto; border: 1px solid; border-radius: 999px; padding: 3px 8px; font-size: 10px; font-weight: 700; }
.lang-dot { width: 8px; height: 8px; border-radius: 50%; margin-right: 5px; }
.meta-inline { gap: 4px; }
.bottom-gap { height: 20px; }
.line-2 { overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; }
</style>
