export interface Category {
  id: string;
  name: string;
  icon: string;
  fromColor: string;
  toColor: string;
  accent: string;
  count: number;
}

export interface Article {
  id: string;
  categoryId: string;
  title: string;
  excerpt: string;
  cover: string;
  author: string;
  authorAvatar: string;
  date: string;
  readTime: number;
  views: number;
  likes: number;
  content: string[];
}

export interface Project {
  id: string;
  name: string;
  tagline: string;
  description: string;
  cover: string;
  authorName: string;
  authorAvatar: string;
  authorOrg: string;
  stars: string;
  forks: string;
  language: string;
  langColor: string;
  tags: string[];
  githubUrl: string;
  license: string;
  updated: string;
}

export interface SearchUser {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  followers: number;
}

export interface SearchVideo {
  id: string;
  title: string;
  cover: string;
  duration: string;
  views: string;
  author: string;
}

// Warm cream / pastel palette for categories
export const categories: Category[] = [
  { id: 'frontend', name: '前端开发', icon: '✨', fromColor: '#FFF0EB', toColor: '#FFE2D5', accent: '#E8866A', count: 12 },
  { id: 'backend', name: '后端技术', icon: '🌿', fromColor: '#EFF6EE', toColor: '#DFF0DC', accent: '#6FAE69', count: 8 },
  { id: 'ai', name: 'AI 智能', icon: '🦋', fromColor: '#F3EFFA', toColor: '#E8E0FF', accent: '#9B8FD4', count: 15 },
  { id: 'tools', name: '效率工具', icon: '🧸', fromColor: '#FFF7ED', toColor: '#FFE7C8', accent: '#D4956A', count: 10 },
  { id: 'design', name: '设计美学', icon: '🎀', fromColor: '#FFF0F4', toColor: '#FFE0EC', accent: '#E8A5B4', count: 7 },
  { id: 'career', name: '职场成长', icon: '🌸', fromColor: '#FFFBF0', toColor: '#FFF1CC', accent: '#D4A843', count: 9 },
  { id: 'cloud', name: '云原生', icon: '☁️', fromColor: '#EFF8FF', toColor: '#DBF0FF', accent: '#4A9EDB', count: 6 },
  { id: 'security', name: '安全防护', icon: '🛡️', fromColor: '#FFF3F3', toColor: '#FFE6E6', accent: '#D46A6A', count: 5 },
  { id: 'open-source', name: '开源生态', icon: '🌍', fromColor: '#F0FFF4', toColor: '#DCFFE8', accent: '#52A874', count: 8 },
  { id: 'mobile', name: '移动开发', icon: '📱', fromColor: '#FFF0FA', toColor: '#FFE0F5', accent: '#D46AAE', count: 9 },
  { id: 'devops', name: 'DevOps', icon: '🚀', fromColor: '#FFF8F0', toColor: '#FFE8CC', accent: '#D48A3A', count: 8 },
  { id: 'data-science', name: '数据科学', icon: '📊', fromColor: '#EFF9FF', toColor: '#D8F0FF', accent: '#3A9EC4', count: 7 },
];

export const articles: Article[] = [
  {
    id: 'f1',
    categoryId: 'frontend',
    title: '深入理解 React 18 并发特性',
    excerpt: '颠覆传统渲染机制的设计哲学，让你的界面流畅得像丝绸一样顺滑。',
    cover: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&auto=format',
    author: '代码匠心',
    authorAvatar: 'https://images.unsplash.com/photo-1629740936456-4b990c27e503?w=100&auto=format',
    date: '05月28日',
    readTime: 8,
    views: 3420,
    likes: 234,
    content: [
      'React 18 引入了全新的并发渲染模式，这是 React 架构上最重要的变革之一。并发模式允许 React 在渲染过程中暂停、恢复，并在多个任务之间灵活切换，从根本上改善了应用的响应性。在传统的同步渲染模式下，一旦开始渲染就无法中断，这在处理大型组件树时会导致明显的卡顿现象。',
      '并发特性的核心是优先级调度机制。React 18 将不同的状态更新分为不同的优先级：用户交互（点击、输入）拥有最高优先级，可以中断低优先级的渲染任务。这种机制确保了即使在大量计算任务正在执行时，界面依然能够快速响应用户操作，提供流畅的交互体验。',
      '新增的 Transition API 是并发模式最直接的使用入口。通过 useTransition Hook 和 startTransition 函数，开发者可以明确标记哪些状态更新属于"过渡"操作，React 会将这些操作的优先级降低，优先处理更紧急的渲染任务。典型的使用场景包括列表筛选、标签页切换等操作，用户将感受到显著的流畅度提升。',
      'Suspense 在 React 18 中也得到了全面升级，不再局限于代码分割场景，而是扩展到了任意异步操作。结合新的 use() Hook，组件可以直接"挂起"并等待 Promise 解析，由最近的 Suspense 边界展示 fallback UI，大幅简化了异步数据获取的复杂度，使代码更加直观易读。',
      '总结来看，React 18 的并发特性代表了声明式 UI 编程的新里程碑。它不仅解决了长期困扰开发者的性能问题，更提供了一套优雅的 API 来管理复杂的异步交互。随着生态的完善，并发模式将成为 React 应用开发的标准范式。',
    ],
  },
  {
    id: 'f2',
    categoryId: 'frontend',
    title: 'CSS Grid 布局完全指南',
    excerpt: '掌握二维布局的终极武器，让你的页面排版美到让人移不开眼。',
    cover: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&auto=format',
    author: '样式大师',
    authorAvatar: 'https://images.unsplash.com/photo-1569913486515-b74bf7751574?w=100&auto=format',
    date: '05月20日',
    readTime: 12,
    views: 5680,
    likes: 412,
    content: [
      'CSS Grid 是现代 Web 布局的革命性技术，它为我们提供了一个强大的二维布局系统。与 Flexbox 的一维布局不同，Grid 可以同时控制行和列，让复杂的页面布局变得前所未有的简单和直观。自 2017 年各大浏览器开始全面支持以来，CSS Grid 已成为前端工程师必须掌握的核心技能。',
      '理解 Grid 的核心概念是掌握它的第一步。Grid Container 是通过 display: grid 声明的父元素，它的直接子元素自动成为 Grid Items。grid-template-columns 和 grid-template-rows 属性定义了网格的列宽和行高，而神奇的 fr 单位则让比例分配变得极为简洁。',
      '网格线和网格区域是 Grid 布局中最强大的概念之一。通过 grid-column 和 grid-row 属性，元素可以跨越任意数量的网格单元。更进一步，grid-template-areas 属性允许我们用可视化的方式定义布局结构，大幅提高代码的可读性。',
      '响应式设计与 CSS Grid 的结合创造了令人惊叹的可能性。auto-fill 和 auto-fit 关键字配合 minmax() 函数，可以在不使用任何媒体查询的情况下实现流体网格布局，是现代响应式设计的最佳实践之一。',
    ],
  },
  {
    id: 'f3',
    categoryId: 'frontend',
    title: 'TypeScript 5.0 新特性全解析',
    excerpt: '类型系统的美丽进化，让你的代码严谨优雅又不失灵动。',
    cover: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&auto=format',
    author: '类型卫士',
    authorAvatar: 'https://images.unsplash.com/photo-1722270608841-35d7372a2e85?w=100&auto=format',
    date: '05月10日',
    readTime: 10,
    views: 2890,
    likes: 187,
    content: [
      'TypeScript 5.0 是 TypeScript 历史上最重要的里程碑版本之一，它不仅带来了性能上的显著提升，更引入了多项期待已久的语言特性。这次更新彻底重写了装饰器实现，让 TypeScript 的表达能力达到了新的高度。',
      '装饰器是 TypeScript 5.0 最重磅的特性。新的装饰器规范（Stage 3 提案）与旧版完全不同，提供了更安全、更符合标准的元编程能力。新装饰器不仅支持类和方法，还引入了字段装饰器和访问器装饰器。',
      'Const 类型参数是另一个让开发者欣喜的新特性。通过在泛型参数前添加 const 修饰符，TypeScript 会自动将推断的类型收窄为字面量类型，在处理配置对象、路由定义等场景时极大简化了代码。',
      '性能方面，TypeScript 5.0 通过将编译器迁移到模块化架构，实现了高达 10-25% 的速度提升。在大型项目中，这意味着显著缩短的类型检查时间和更快的增量编译速度。',
    ],
  },
  {
    id: 'b1',
    categoryId: 'backend',
    title: 'Go 语言高并发实践指南',
    excerpt: '像咖啡萃取一样，把并发的精华全部提取出来，简单而纯粹。',
    cover: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&auto=format',
    author: '后端老将',
    authorAvatar: 'https://images.unsplash.com/photo-1569913486515-b74bf7751574?w=100&auto=format',
    date: '05月25日',
    readTime: 15,
    views: 4120,
    likes: 298,
    content: [
      'Go 语言自设计之初便将并发作为第一类公民，其独创的 CSP 并发模型让构建高并发服务变得前所未有的简单。不同于传统语言的线程模型，Go 的 goroutine 是极其轻量的协程，初始栈空间仅需 2KB，使得在单机上创建百万级并发连接成为可能。',
      'Channel 是 Go 并发编程的核心通信机制，它遵循"不要通过共享内存来通信，而应通过通信来共享内存"的设计哲学。无缓冲 channel 提供了同步通信的能力，而有缓冲 channel 则允许生产者和消费者在一定范围内解耦。',
      'sync 包提供了 Go 原生的同步原语，包括 Mutex、RWMutex 和 WaitGroup 等。在某些场景下，直接操作共享内存配合互斥锁比 channel 更高效，但需要谨慎处理锁的粒度。',
      '在实际的高并发服务开发中，工作池（Worker Pool）模式是控制并发数量的常用手段。通过固定数量的 goroutine 从任务 channel 中消费工作，既避免了无限制地创建 goroutine，又实现了任务的并行处理。',
    ],
  },
  {
    id: 'b2',
    categoryId: 'backend',
    title: 'Redis 缓存架构设计最佳实践',
    excerpt: '给你的系统配一杯醒脑提速的浓缩缓存，性能飙升的秘密都在这里。',
    cover: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=800&auto=format',
    author: '架构师小王',
    authorAvatar: 'https://images.unsplash.com/photo-1629740936456-4b990c27e503?w=100&auto=format',
    date: '05月15日',
    readTime: 12,
    views: 3680,
    likes: 256,
    content: [
      'Redis 作为高性能内存数据库，已成为现代互联网架构中不可或缺的组件。其单线程的设计选择、丰富的数据结构支持以及持久化机制，让它在缓存、消息队列、分布式锁等场景中均有出色表现。',
      '缓存穿透、缓存击穿和缓存雪崩是 Redis 使用中最常见的三大问题。缓存穿透用布隆过滤器拦截；缓存击穿用互斥锁或逻辑过期解决；缓存雪崩通过分散 TTL 随机化来缓解。',
      'Redis Cluster 是官方推荐的分布式方案，它通过一致性哈希将数据分布在多个节点上。每个主节点负责一段 slot（共 16384 个），配合从节点实现高可用。',
      '分布式锁是 Redis 最重要的应用场景之一。基于 SET NX PX 命令的简单实现在大多数场景下足够用，而 Redlock 算法则提供了更强的可靠性保证。',
    ],
  },
  {
    id: 'ai1',
    categoryId: 'ai',
    title: 'GPT-4 代码生成的工程实践',
    excerpt: '把 AI 变成你最得力的编程搭子，效率翻倍不是梦。',
    cover: 'https://images.unsplash.com/photo-1597239451147-f163967b8581?w=800&auto=format',
    author: 'AI 布道师',
    authorAvatar: 'https://images.unsplash.com/photo-1722270608841-35d7372a2e85?w=100&auto=format',
    date: '06月01日',
    readTime: 10,
    views: 8920,
    likes: 673,
    content: [
      '大语言模型的崛起正在深刻改变软件开发的工作方式。GPT-4 在代码生成领域展现出了令人印象深刻的能力，不仅能够根据自然语言描述生成完整函数，还能进行代码重构、Bug 分析和单元测试编写。',
      '提示词工程（Prompt Engineering）是使用 GPT-4 进行代码生成的核心技能。一个高质量的提示词应当包含：清晰的任务描述、相关的上下文信息、期望的输出格式和约束条件。',
      '安全性是 AI 生成代码最需要警惕的方面。GPT-4 生成的代码可能包含 SQL 注入、XSS 等安全漏洞。建立代码审查流程，配合 SAST 工具自动扫描，是确保安全的必要措施。',
      '从团队工程角度看，AI 辅助编码工具的最大价值在于提升开发者的上限，而非降低入门门槛。对于有经验的工程师，AI 可以快速生成样板代码，让他们将精力集中在架构设计和业务逻辑上。',
    ],
  },
  {
    id: 'ai2',
    categoryId: 'ai',
    title: '从零构建 RAG 知识库系统',
    excerpt: '让 AI 读懂你的私域知识库，打造专属智能助理的完整攻略。',
    cover: 'https://images.unsplash.com/photo-1698919585695-546e4a31fc8f?w=800&auto=format',
    author: 'LLM 实践者',
    authorAvatar: 'https://images.unsplash.com/photo-1569913486515-b74bf7751574?w=100&auto=format',
    date: '05月30日',
    readTime: 18,
    views: 6540,
    likes: 521,
    content: [
      'RAG（检索增强生成）是解决大语言模型知识局限性的最有效方法之一。它的核心思路是：在生成回答之前，先从外部知识库中检索相关内容，将其作为上下文注入到 Prompt 中，有效解决了模型知识截止日期和幻觉问题。',
      'RAG 系统的构建分为两个主要阶段：索引阶段和检索阶段。索引阶段需要将原始文档切分成适当大小的 Chunk，通过嵌入模型转换为向量，存入向量数据库（如 Chroma、Milvus 或 Pinecone）。',
      '检索策略的选择对 RAG 系统的质量至关重要。混合检索（Hybrid Search）结合 BM25 稀疏检索和向量稠密检索，在处理包含专有名词、代码片段等场景时表现更好。',
      '评估 RAG 系统的质量需要建立完整的评估体系。RAGAS 框架提供了忠实性、答案相关性、上下文精确度等多个维度的自动化评估指标，定期监控这些指标是保持系统质量的关键。',
    ],
  },
  {
    id: 't1',
    categoryId: 'tools',
    title: 'Vite 5.0 性能飞跃与实战技巧',
    excerpt: '用上这个构建工具，等待编译变成历史，开发体验直接起飞。',
    cover: 'https://images.unsplash.com/photo-1607705703571-c5a8695f18f6?w=800&auto=format',
    author: '工具控',
    authorAvatar: 'https://images.unsplash.com/photo-1629740936456-4b990c27e503?w=100&auto=format',
    date: '05月22日',
    readTime: 9,
    views: 2340,
    likes: 156,
    content: [
      'Vite 已经确立了其作为现代前端工具链首选的地位，而 Vite 5.0 带来了一系列令人期待的改进。基于 Rollup 4 的升级带来了显著的构建性能提升，是前端工程化领域的重要里程碑。',
      'Vite 5.0 最重要的变化是彻底放弃了对 CommonJS API 的支持，完全拥抱 ESM（ES Modules）。这一决定使得代码更加简洁，vite.config.js 需要使用 .mjs 扩展名或声明 type: module。',
      '在大型项目的性能优化实践中，分包策略（Code Splitting）的配置至关重要。通过 manualChunks 选项合理划分 vendor chunk，配合动态 import 实现路由级别的懒加载，显著减小首屏加载体积。',
      '环境变量管理是 Vite 项目配置的重要环节。Vite 区分了客户端暴露（VITE_ 前缀）和服务端专用的环境变量，结合多个 .env 文件可以优雅地管理多环境配置。',
    ],
  },
  {
    id: 't2',
    categoryId: 'tools',
    title: 'Docker 容器化最佳实践',
    excerpt: '把你的应用打包成一个精致的礼盒，部署到哪里都一样完美。',
    cover: 'https://images.unsplash.com/photo-1561736778-92e52a7769ef?w=800&auto=format',
    author: 'DevOps 专家',
    authorAvatar: 'https://images.unsplash.com/photo-1722270608841-35d7372a2e85?w=100&auto=format',
    date: '05月18日',
    readTime: 11,
    views: 1890,
    likes: 134,
    content: [
      'Docker 容器化技术已成为现代软件部署的标准方式。镜像体积、构建速度、安全性和可维护性是衡量 Dockerfile 质量的四个核心维度，本文将系统梳理生产环境中的最佳实践。',
      '多阶段构建（Multi-stage Build）是减小镜像体积最有效的手段。以 Node.js 应用为例，在构建阶段安装依赖并编译，在运行阶段仅复制编译产物。这种方式可以将镜像从数百 MB 压缩到几十 MB。',
      '层缓存优化是加速 Docker 构建的关键技巧。应将变动频率低的指令放在前面，变动频率高的指令放在后面，充分复用已有缓存层，大幅缩短 CI/CD 时间。',
      '安全是容器化生产部署不可忽视的方面。避免以 root 用户运行容器，定期扫描镜像中的已知 CVE，设置适当的资源限制防止单个容器耗尽宿主机资源。',
    ],
  },
  {
    id: 'd1',
    categoryId: 'design',
    title: '2024 设计趋势：玻璃拟态与空间设计',
    excerpt: '这些美学语言正在重塑数字世界的颜值，看看你用上了几个？',
    cover: 'https://images.unsplash.com/photo-1563216368-5b6a40648062?w=800&auto=format',
    author: '美学探索',
    authorAvatar: 'https://images.unsplash.com/photo-1569913486515-b74bf7751574?w=100&auto=format',
    date: '06月02日',
    readTime: 7,
    views: 4210,
    likes: 387,
    content: [
      '2024 年的设计领域正在经历一场深刻的范式转移。随着空间计算时代的来临，UI 设计的关注点开始从平面像素转向三维空间。玻璃拟态（Glassmorphism）在实用性与美感之间找到了更好的平衡点，成为这个时代最具代表性的视觉语言之一。',
      '玻璃拟态设计的核心是半透明效果配合背景模糊，创造出如同磨砂玻璃般的质感。正确实现需要：足够的背景内容、适当的透明度、微妙的边框以及柔和的阴影。backdrop-filter: blur() 是实现这一效果的关键属性。',
      '空间计算 UI 设计遵循全新的设计原则。深度和阴影用于表达层级关系而非装饰，设计师需要考虑"舒适视角"——用户在正前方 1-2 米范围内最舒适的视觉区域。',
      '色彩系统在 2024 年呈现出两极分化的趋势：极简的中性色调（哑光灰、温暖米色）与大胆的渐变色彩同时流行。奶油色系正成为最受欢迎的 UI 风格之一，温柔而有品味。',
    ],
  },
  {
    id: 'c1',
    categoryId: 'career',
    title: '技术人的成长路径：从工程师到架构师',
    excerpt: '写给三年迷茫期的你，那些没人告诉你的晋升秘密。',
    cover: 'https://images.unsplash.com/photo-1611924707078-da8777fc99cb?w=800&auto=format',
    author: '职场老司机',
    authorAvatar: 'https://images.unsplash.com/photo-1629740936456-4b990c27e503?w=100&auto=format',
    date: '05月26日',
    readTime: 14,
    views: 7830,
    likes: 892,
    content: [
      '大多数技术人的成长困境都发生在工作 3-5 年之后：技术能力已经相对成熟，但晋升通道开始变得狭窄，职业发展的迷茫感随之而来。从工程师到架构师的转变，是思维方式的根本性转变——从"如何实现"到"为什么这样设计"。',
      '架构师的核心能力模型由三个层次构成：技术深度（至少一个方向的专家级理解）、技术广度（跨领域的知识储备）和工程判断力（在约束条件下做出合理权衡的能力）。工程判断力来自大量实际项目的踩坑经验。',
      '从执行到决策的转变需要主动创造机会。在日常工作中，主动参与技术选型讨论、提出架构改进方案、撰写技术调研文档。即使建议没有被采纳，这个思考和表达的过程本身就是宝贵的成长。',
      '技术影响力的建立是架构师不可或缺的软技能。通过技术分享建立专业声誉，通过良好的文档和沟通习惯降低协作摩擦。好的架构师能让团队理解并认同自己的决策，凝聚共识才能推动改变。',
    ],
  },
  {
    id: 'c2',
    categoryId: 'career',
    title: '远程工作效率提升的 10 个实践',
    excerpt: '在家 work from home 摸鱼变高效？这些方法真的救了我。',
    cover: 'https://images.unsplash.com/photo-1565772838491-cbeb32fac6ca?w=800&auto=format',
    author: '独立开发者',
    authorAvatar: 'https://images.unsplash.com/photo-1722270608841-35d7372a2e85?w=100&auto=format',
    date: '05月12日',
    readTime: 8,
    views: 5230,
    likes: 445,
    content: [
      '远程工作已从被迫选择演变为越来越多技术人的主动选择。然而，在家工作的自由度也带来了新的挑战：边界模糊、专注力难以维持、协作效率下降。这套方法论经过多年实践验证，真的有效。',
      '专属工作空间的建立是远程工作效率的物理基础。即使空间有限，也要为工作创造一个专用区域。这个物理边界会帮助大脑在"工作模式"和"休息模式"之间快速切换，减少内耗。',
      '时间管理在远程模式下尤为关键。番茄工作法（25分钟专注+5分钟休息）被大量远程工作者验证有效，它不仅提供了天然的节奏感，还帮助量化了每天的工作产出，成就感满满。',
      '异步沟通是远程团队协作的核心技能。养成"写作优先"的沟通习惯：将决策过程、讨论结论记录到文档中。Loom 短视频录制是替代冗长会议的有效工具，5 分钟的录屏演示往往比一小时视频会议更高效。',
    ],
  },
  {
    id: 'cl1',
    categoryId: 'cloud',
    title: 'Kubernetes 从入门到生产环境',
    excerpt: '容器编排的王者，手把手带你把 K8s 跑起来，再也不怕环境不一致了。',
    cover: 'https://images.unsplash.com/photo-1561736778-92e52a7769ef?w=800&auto=format',
    author: '云上飞翔',
    authorAvatar: 'https://images.unsplash.com/photo-1629740936456-4b990c27e503?w=100&auto=format',
    date: '06月03日',
    readTime: 16,
    views: 5640,
    likes: 432,
    content: [
      'Kubernetes（K8s）已成为容器编排领域无可争议的标准。它解决了大规模容器部署、服务发现、负载均衡和自动扩缩容等核心问题，让微服务架构的落地变得更加优雅。本文将带你从零开始，搭建一个可以用于生产的 K8s 集群。',
      'Pod 是 K8s 中最小的可部署单元，一个 Pod 可以包含一个或多个容器。理解 Pod 的生命周期、资源限制和健康检查，是用好 K8s 的第一步。建议先从单容器 Pod 开始，熟悉基本操作后再尝试多容器设计。',
      'Deployment 提供了声明式的 Pod 管理能力。通过定义期望状态，K8s 会自动对比当前状态并进行调协。配合 HPA（水平自动扩缩容），你的应用可以根据 CPU 和内存使用率自动扩容，从容应对流量高峰。',
      '网络是 K8s 中最复杂的部分。Service 提供了稳定的服务端点，Ingress 则负责外部流量的路由规则。选择合适的网络插件（CNI）和 Ingress Controller，直接影响集群的性能和稳定性。在生产环境推荐使用 Calico 或 Cilium。',
    ],
  },
  {
    id: 'cl2',
    categoryId: 'cloud',
    title: 'Service Mesh：微服务通信的优雅解法',
    excerpt: '告别混乱的服务间调用，让 Istio 帮你管理一切，丝滑到令人感动。',
    cover: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=800&auto=format',
    author: '云原生布道师',
    authorAvatar: 'https://images.unsplash.com/photo-1569913486515-b74bf7751574?w=100&auto=format',
    date: '05月29日',
    readTime: 13,
    views: 3210,
    likes: 267,
    content: [
      'Service Mesh 通过 Sidecar 代理模式，将服务间通信的治理能力从业务代码中剥离出来，实现了零侵入的流量管理。Istio 是目前最成熟的 Service Mesh 实现，提供了负载均衡、熔断、限流、追踪等开箱即用的能力。',
      '流量管理是 Istio 最核心的能力。通过 VirtualService 和 DestinationRule，你可以实现按比例的流量分配（灰度发布）、请求路由（A/B 测试）和故障注入（混沌工程）。这些功能在传统微服务架构中需要大量代码才能实现。',
      '可观测性是 Istio 的另一大亮点。集成 Prometheus、Grafana 和 Jaeger，你可以自动获得每个服务的 QPS、延迟、错误率等黄金指标，以及完整的分布式追踪链路。排查问题的效率大幅提升。',
    ],
  },
  {
    id: 's1',
    categoryId: 'security',
    title: '前端安全防护完全指南 2024',
    excerpt: '你的网站可能正在被黑客盯着，这些防护知识真的一刻都不能等！',
    cover: 'https://images.unsplash.com/photo-1563216368-5b6a40648062?w=800&auto=format',
    author: '白帽防护师',
    authorAvatar: 'https://images.unsplash.com/photo-1722270608841-35d7372a2e85?w=100&auto=format',
    date: '06月04日',
    readTime: 11,
    views: 7820,
    likes: 601,
    content: [
      'XSS（跨站脚本攻击）是前端最常见的安全威胁之一。攻击者通过在页面注入恶意脚本，窃取用户 Cookie、会话令牌乃至控制用户浏览器。防御 XSS 的核心是对所有用户输入进行严格的转义处理，并配置合理的 Content Security Policy（CSP）。',
      'CSRF（跨站请求伪造）利用了浏览器自动携带 Cookie 的特性。现代防御手段包括：SameSite Cookie 属性、CSRF Token 验证、以及对敏感操作增加二次确认。使用 `SameSite=Lax` 或 `SameSite=Strict` 可以覆盖大多数 CSRF 场景。',
      '依赖链安全日益重要。npm 生态中定期出现供应链攻击事件，定期运行 `npm audit` 并使用 Snyk 等工具扫描依赖漏洞是必要习惯。同时锁定依赖版本（package-lock.json）避免意外引入恶意更新版本。',
    ],
  },
  {
    id: 'os1',
    categoryId: 'open-source',
    title: '如何打造一个受欢迎的开源项目',
    excerpt: '从 0 到 1000 Star，我踩过的坑和学到的经验，毫无保留分享给你。',
    cover: 'https://images.unsplash.com/photo-1611924707078-da8777fc99cb?w=800&auto=format',
    author: '开源践行者',
    authorAvatar: 'https://images.unsplash.com/photo-1629740936456-4b990c27e503?w=100&auto=format',
    date: '05月31日',
    readTime: 10,
    views: 4380,
    likes: 375,
    content: [
      '一个好的开源项目，从选题就决定了 80% 的成败。选择一个你自己真实需要、且现有解决方案不够好的痛点，远比追热点更容易坚持。当你自己是第一个用户时，对项目的打磨欲望和理解深度都是最高的。',
      'README 是开源项目的门面。一个好的 README 应该在 30 秒内让访客明白：这个项目是做什么的、解决了什么问题、如何快速上手。Demo GIF、徽章（Badges）、快速开始代码示例，是提升 README 吸引力的三大法宝。',
      '社区建设是开源项目长期繁荣的关键。及时回复 Issue、认真对待 PR、建立清晰的贡献指南（CONTRIBUTING.md）。记住，每一个提问的人背后，可能有 100 个有同样困惑但没有开口的人。',
    ],
  },
  {
    id: 'mob1',
    categoryId: 'mobile',
    title: 'Flutter 3.x 跨平台开发全攻略',
    excerpt: '一套代码跑遍 iOS、Android、Web、桌面，真的不是在做梦！',
    cover: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format',
    author: '跨端飞人',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format',
    date: '06月01日',
    readTime: 14,
    views: 6120,
    likes: 523,
    content: [
      'Flutter 3.x 正式将 Windows、macOS、Linux 桌面端纳入稳定支持，实现了真正的"一次编写，六端运行"。借助 Dart 语言的 AOT 编译能力，Flutter 应用的性能接近原生，彻底打破了"跨平台 = 性能妥协"的刻板印象。',
      'Widget 是 Flutter 的核心哲学，"一切皆 Widget"的设计让 UI 构建变得极为统一和可预测。StatelessWidget 和 StatefulWidget 的区分简洁清晰，配合 Provider、Riverpod 等状态管理方案，可以构建任意复杂度的应用架构。',
      'Flutter 的热重载（Hot Reload）特性是开发体验的最大亮点。代码修改后几乎即时反映到设备上，保留应用状态，极大提升了 UI 调试和迭代的效率。配合 Dart DevTools，性能分析和内存检测也变得直观可视化。',
      '自定义绘制是 Flutter 的杀手级能力。通过 CustomPainter，你可以用 Canvas API 绘制任意图形、动画和视觉效果，不受平台 UI 组件的限制。这也是 Rive 等动画工具选择 Flutter 作为首选平台的原因。',
    ],
  },
  {
    id: 'dops1',
    categoryId: 'devops',
    title: 'GitHub Actions 自动化部署实战',
    excerpt: '告别手动部署的痛苦，让 CI/CD 流水线替你干脏活累活！',
    cover: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&auto=format',
    author: '流水线工程师',
    authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format',
    date: '06月04日',
    readTime: 9,
    views: 7230,
    likes: 589,
    content: [
      'GitHub Actions 将 CI/CD 能力直接集成到代码仓库中，无需维护额外的 Jenkins 或 GitLab CI 服务器。通过 YAML 文件定义 Workflow，可以在 push、PR、定时器等各种事件触发时自动执行测试、构建和部署流程。',
      'Workflow 由 Job 组成，Job 默认并行执行，通过 needs 关键字可以定义依赖关系实现串行。每个 Job 在独立的 Runner 环境中运行，GitHub 提供了 Ubuntu、Windows、macOS 三种托管 Runner，也支持自托管 Runner 以满足私有网络需求。',
      'Actions Marketplace 拥有数万个可复用的 Action，覆盖几乎所有常见场景：代码检查、安全扫描、Docker 构建、云平台部署等。善用社区 Action 可以大幅减少 Workflow 配置的复杂度，避免重复造轮子。',
      'Secrets 和 Environment 是安全管理敏感信息的正确方式。API 密钥、部署凭证永远不应硬编码在配置文件中，通过仓库或组织级别的 Secrets 注入，配合环境保护规则（Protection Rules）实现生产环境的审批流程。',
    ],
  },
  {
    id: 'ds1',
    categoryId: 'data-science',
    title: 'Python 数据分析：Pandas 实战技巧',
    excerpt: '数据清洗到可视化，这些 Pandas 技巧让你的分析效率翻三倍。',
    cover: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format',
    author: '数据洞察师',
    authorAvatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&auto=format',
    date: '05月25日',
    readTime: 11,
    views: 5340,
    likes: 428,
    content: [
      'Pandas 是 Python 数据分析生态的核心，DataFrame 和 Series 两个数据结构几乎覆盖了所有数据处理场景。理解向量化操作（避免显式 for 循环）是提升 Pandas 性能的关键，对一百万行数据的操作往往可以控制在秒级以内。',
      '数据清洗占据了数据分析工作 80% 的时间。isnull()、dropna()、fillna() 处理缺失值；astype() 转换数据类型；str 访问器处理文本数据；apply() 应用自定义函数。掌握这些方法，才能把"脏数据"变成可分析的"净数据"。',
      '分组聚合是数据分析的核心操作。groupby() 配合 agg()，可以在一行代码中完成复杂的统计计算：按时间维度统计销售额、按用户分群计算留存率等。pivot_table() 则将分组聚合以更直观的交叉表形式呈现。',
      'Matplotlib 和 Seaborn 将数据转化为洞察。折线图展示趋势、条形图比较类别、散点图揭示相关性、热力图呈现矩阵数据。一张好的图表胜过千行数字，学会选择合适的图表类型并优化视觉编码，是数据分析师的核心竞争力。',
    ],
  },
];

export const projects: Project[] = [
  {
    id: 'p1',
    name: 'React',
    tagline: '构建用户界面的 JavaScript 库',
    description: '由 Meta 开源的声明式、高效且灵活的 JavaScript 库，用于构建用户界面。让你创建由独立的、可复用的组件构成的复杂 UI，是目前全球最流行的前端框架。',
    cover: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&auto=format',
    authorName: 'Meta',
    authorAvatar: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=100&auto=format',
    authorOrg: 'facebook',
    stars: '22.6万',
    forks: '4.6万',
    language: 'JavaScript',
    langColor: '#f1e05a',
    tags: ['ui', 'frontend', 'javascript'],
    githubUrl: 'https://github.com/facebook/react',
    license: 'MIT',
    updated: '2 小时前',
  },
  {
    id: 'p2',
    name: 'Next.js',
    tagline: 'The React Framework for the Web',
    description: '用于构建全栈 Web 应用的 React 框架，包含 SSR、SSG、文件系统路由等特性，是现代全栈开发的首选方案，Vercel 出品，质量有保证。',
    cover: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&auto=format',
    authorName: 'Vercel',
    authorAvatar: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=100&auto=format',
    authorOrg: 'vercel',
    stars: '12.4万',
    forks: '2.6万',
    language: 'TypeScript',
    langColor: '#3178c6',
    tags: ['react', 'ssr', 'fullstack'],
    githubUrl: 'https://github.com/vercel/next.js',
    license: 'MIT',
    updated: '5 小时前',
  },
  {
    id: 'p3',
    name: 'Tailwind CSS',
    tagline: '无需离开 HTML 即可构建现代网站',
    description: '功能优先的 CSS 框架，提供大量底层工具类，无需写一行自定义 CSS 就能构建出美到窒息的界面。奶油风、玻璃态，统统搞得定！',
    cover: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&auto=format',
    authorName: 'Tailwind Labs',
    authorAvatar: 'https://images.unsplash.com/photo-1607705703571-c5a8695f18f6?w=100&auto=format',
    authorOrg: 'tailwindlabs',
    stars: '8.1万',
    forks: '4100',
    language: 'CSS',
    langColor: '#38bdf8',
    tags: ['css', 'utility-first', 'design'],
    githubUrl: 'https://github.com/tailwindlabs/tailwindcss',
    license: 'MIT',
    updated: '1 天前',
  },
  {
    id: 'p4',
    name: 'TypeScript',
    tagline: 'JavaScript With Syntax For Types',
    description: 'JavaScript 的强类型超集，通过静态类型系统为大规模应用开发提供了更好的工具支持。一旦用上就回不去了，安全感拉满！',
    cover: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&auto=format',
    authorName: 'Microsoft',
    authorAvatar: 'https://images.unsplash.com/photo-1597239451147-f163967b8581?w=100&auto=format',
    authorOrg: 'microsoft',
    stars: '10万',
    forks: '1.2万',
    language: 'TypeScript',
    langColor: '#3178c6',
    tags: ['typescript', 'language', 'microsoft'],
    githubUrl: 'https://github.com/microsoft/TypeScript',
    license: 'Apache-2.0',
    updated: '3 天前',
  },
  {
    id: 'p5',
    name: 'Vite',
    tagline: '下一代前端构建工具',
    description: '用上 Vite，等待编译就成了历史。利用浏览器原生 ES 模块，冷启动快到让你不敢相信，HMR 热更新毫秒级响应，开发体验直接拉满。',
    cover: 'https://images.unsplash.com/photo-1607705703571-c5a8695f18f6?w=800&auto=format',
    authorName: 'Evan You',
    authorAvatar: 'https://images.unsplash.com/photo-1629740936456-4b990c27e503?w=100&auto=format',
    authorOrg: 'vitejs',
    stars: '6.7万',
    forks: '6000',
    language: 'TypeScript',
    langColor: '#3178c6',
    tags: ['build-tool', 'frontend', 'hmr'],
    githubUrl: 'https://github.com/vitejs/vite',
    license: 'MIT',
    updated: '6 小时前',
  },
  {
    id: 'p6',
    name: 'Prisma',
    tagline: '下一代 Node.js ORM',
    description: '数据库操作从此不再痛苦。直观的数据模型、自动迁移、完整的类型安全，让你爱上写数据库逻辑。全栈开发者的宝藏工具！',
    cover: 'https://images.unsplash.com/photo-1698919585695-546e4a31fc8f?w=800&auto=format',
    authorName: 'Prisma',
    authorAvatar: 'https://images.unsplash.com/photo-1561736778-92e52a7769ef?w=100&auto=format',
    authorOrg: 'prisma',
    stars: '3.9万',
    forks: '1500',
    language: 'TypeScript',
    langColor: '#3178c6',
    tags: ['orm', 'database', 'typescript'],
    githubUrl: 'https://github.com/prisma/prisma',
    license: 'Apache-2.0',
    updated: '2 天前',
  },
];

export const searchImages = [
  'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&auto=format',
  'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400&auto=format',
  'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400&auto=format',
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&auto=format',
  'https://images.unsplash.com/photo-1563216368-5b6a40648062?w=400&auto=format',
  'https://images.unsplash.com/photo-1597239451147-f163967b8581?w=400&auto=format',
  'https://images.unsplash.com/photo-1698919585695-546e4a31fc8f?w=400&auto=format',
  'https://images.unsplash.com/photo-1565772838491-cbeb32fac6ca?w=400&auto=format',
  'https://images.unsplash.com/photo-1612441804231-77a36b284856?w=400&auto=format',
  'https://images.unsplash.com/photo-1607705703571-c5a8695f18f6?w=400&auto=format',
  'https://images.unsplash.com/photo-1561736778-92e52a7769ef?w=400&auto=format',
  'https://images.unsplash.com/photo-1611924707078-da8777fc99cb?w=400&auto=format',
];

export const searchUsers: SearchUser[] = [
  { id: 'u1', name: '林晓峰', username: '@xiaofeng_dev', avatar: 'https://images.unsplash.com/photo-1629740936456-4b990c27e503?w=100&auto=format', bio: 'React 核心贡献者 · 前端架构师 · 开源爱好者 🌸', followers: 12400 },
  { id: 'u2', name: '陈思远', username: '@siyuan_code', avatar: 'https://images.unsplash.com/photo-1569913486515-b74bf7751574?w=100&auto=format', bio: '全栈工程师 · Go & TypeScript · 写过几个有意思的小工具 🌿', followers: 8900 },
  { id: 'u3', name: '王子涵', username: '@zihan_ai', avatar: 'https://images.unsplash.com/photo-1722270608841-35d7372a2e85?w=100&auto=format', bio: 'AI 研究员 · LLM 应用开发 · 在探索 AGI 的边界 🦋', followers: 23600 },
  { id: 'u4', name: '赵明远', username: '@mingyuan_ux', avatar: 'https://images.unsplash.com/photo-1629740936456-4b990c27e503?w=100&auto=format', bio: 'UX 设计师 · 设计系统 · 奶油风爱好者 🎀', followers: 5700 },
  { id: 'u5', name: '李嘉诚', username: '@jiacheng_dev', avatar: 'https://images.unsplash.com/photo-1569913486515-b74bf7751574?w=100&auto=format', bio: '开源项目维护者 · Rust 爱好者 · 慢慢来，一定会更好 🌸', followers: 3200 },
];

export const searchVideos: SearchVideo[] = [
  { id: 'v1', title: 'React 18 并发特性深度解析 | 2024最新', cover: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&auto=format', duration: '32:18', views: '12.4万', author: '前端进阶' },
  { id: 'v2', title: '手把手带你用 TypeScript 重构项目', cover: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400&auto=format', duration: '1:04:52', views: '8.7万', author: '代码哲学' },
  { id: 'v3', title: 'Docker + K8s 生产环境部署实战', cover: 'https://images.unsplash.com/photo-1561736778-92e52a7769ef?w=400&auto=format', duration: '48:30', views: '6.2万', author: 'DevOps 实践' },
  { id: 'v4', title: '从零搭建 RAG 系统 | 完整教程', cover: 'https://images.unsplash.com/photo-1597239451147-f163967b8581?w=400&auto=format', duration: '1:22:10', views: '15.8万', author: 'AI 工程师成长' },
];

export const trendingTopics = ['React 18', 'AI 编程', 'Rust 入门', 'TypeScript', '远程工作', 'ChatGPT'];
