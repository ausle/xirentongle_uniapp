export interface EntertainmentItem {
  id: string
  emoji: string
  title: string
  tag: string
  desc: string
  grad: string
  accentColor: string
  hot?: boolean
  isNew?: boolean
}

export const entertainmentItems: EntertainmentItem[] = [
  {
    id: 'mbti',
    emoji: '🧠',
    title: 'MBTI 人格测试',
    tag: '16种人格',
    desc: '发现你的人格类型，解锁深层自我认知',
    grad: 'linear-gradient(145deg, #C8B5F0 0%, #E8A5C8 100%)',
    accentColor: '#9B7ED4',
    hot: true,
  },
  {
    id: 'sbti',
    emoji: '🔮',
    title: 'SBTI 人格测试',
    tag: '行为偏好',
    desc: '从日常行为中解析你的真实性格底色',
    grad: 'linear-gradient(145deg, #F0C0D8 0%, #D4A8E8 100%)',
    accentColor: '#C870A0',
    isNew: true,
  },
  {
    id: 'color',
    emoji: '🎨',
    title: '色差测试',
    tag: '视觉挑战',
    desc: '你的眼睛能辨出多细微的颜色差异？',
    grad: 'linear-gradient(145deg, #A8D8A8 0%, #78C8B0 100%)',
    accentColor: '#4A9E7E',
  },
  {
    id: 'gossip',
    emoji: '🎬',
    title: '娱乐八卦',
    tag: '热点速递',
    desc: '明星动态、影视资讯，一网打尽',
    grad: 'linear-gradient(145deg, #F0C898 0%, #E8A080 100%)',
    accentColor: '#C86040',
    hot: true,
  },
  {
    id: 'ainews',
    emoji: '🤖',
    title: 'AI 新闻',
    tag: '前沿动态',
    desc: '追踪 GPT、Claude、Gemini 最新进展',
    grad: 'linear-gradient(145deg, #F0A888 0%, #E07898 100%)',
    accentColor: '#D05060',
    isNew: true,
  },
  {
    id: 'horoscope',
    emoji: '✨',
    title: '星座运势',
    tag: '今日运势',
    desc: '十二星座，今日桃花、事业与贵人指引',
    grad: 'linear-gradient(145deg, #F8D878 0%, #E8B858 100%)',
    accentColor: '#B08020',
  },
]
