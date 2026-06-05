import { articles, searchUsers, type Article } from '../mock/data'
import { T } from './theme'

const techTagSets = [
  ['React', 'TypeScript', '前端'],
  ['Go', 'Python', '后端'],
  ['AI/ML', 'PyTorch', '算法'],
  ['DevOps', 'K8s', 'Docker'],
  ['设计', 'UI/UX', 'Figma'],
  ['全栈', 'Node.js', 'Vue'],
]

const bioList = [
  '热爱技术，热爱生活。分享是最好的学习方式 ✨',
  '不断学习，不断成长。记录每一次探索的收获 🌱',
  '用代码改变世界，用文字传递价值 🚀',
  '技术是解决问题的工具，思维才是核心 💡',
  '分享优质内容，与你共同进步 🎯',
]

export interface AuthorProfileData {
  name: string
  avatar: string
  bio: string
  tags: string[]
  stats: Array<{ label: string; value: string }>
  achievements: Array<{ icon: string; label: string; value: string }>
  yearlyStats: Array<{ year: string; count: number; width: string }>
  articles: Article[]
  favorites: Article[]
  following: typeof searchUsers
  fans: typeof searchUsers
}

export function fmtCompact(n: number) {
  return n >= 10000 ? `${(n / 10000).toFixed(1)}万` : n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n)
}

function hashNum(value: string) {
  return value
    .split('')
    .reduce((acc, char) => (Math.imul(acc, 31) + char.charCodeAt(0)) | 0, 7) >>> 0
}

export function buildAuthorProfile(name: string, avatar: string): AuthorProfileData {
  const hash = hashNum(name)
  const yearlyStats = [
    { year: '2023', count: 3 + (hash % 15) },
    { year: '2024', count: 5 + (hash % 25) },
    { year: '2025', count: 4 + (hash % 20) },
    { year: '2026', count: 2 + (hash % 8) },
  ]
  const maxYear = Math.max(...yearlyStats.map((item) => item.count), 1)
  const authorArticles = articles.filter((article) => article.author === name)
  const fallbackStart = hash % 3

  return {
    name,
    avatar,
    bio: bioList[hash % bioList.length],
    tags: techTagSets[hash % techTagSets.length],
    stats: [
      { label: '加入天数', value: String(300 + (hash % 900)) },
      { label: '关注数', value: String(20 + (hash % 80)) },
      { label: '粉丝数', value: String(80 + (hash % 820)) },
    ],
    achievements: [
      { icon: '📄', label: '已发布文章', value: `${8 + (hash % 40)} 篇` },
      { icon: '👍', label: '文章被点赞', value: `${fmtCompact(800 + (hash % 3000))} 次` },
      { icon: '👁', label: '文章被阅读', value: `${fmtCompact(15000 + (hash % 80000))} 次` },
      { icon: '⭐', label: '文章被收藏', value: `${40 + (hash % 200)} 篇` },
    ],
    yearlyStats: yearlyStats.map((item) => ({
      ...item,
      width: `${Math.min(100, (item.count / maxYear) * 100)}%`,
    })),
    articles:
      authorArticles.length > 0
        ? authorArticles
        : articles.slice(fallbackStart, fallbackStart + 3),
    favorites: articles.filter((_, index) => (index + hash) % 3 !== 0).slice(0, 5),
    following: searchUsers.slice(0, 4),
    fans: searchUsers.slice(1),
  }
}

export function getCategoryMeta(categoryId: string) {
  return {
    borderColor: `${T.accent}25`,
    background: T.accentLight,
    color: T.accent,
    categoryId,
  }
}

