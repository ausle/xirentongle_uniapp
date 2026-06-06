import { marked } from 'marked'

marked.setOptions({
  async: false,
  breaks: true,
  gfm: true,
})

export type ArticleContentBlock =
  | {
      type: 'heading'
      level: number
      text: string
      anchorId: string
    }
  | {
      type: 'paragraph'
      text: string
    }
  | {
      type: 'quote'
      text: string
    }
  | {
      type: 'image'
      src: string
      alt: string
    }
  | {
      type: 'list'
      ordered: boolean
      items: string[]
    }

export interface ArticleTocItem {
  id: string
  text: string
  level: number
}

export interface RenderedArticleContent {
  headings: string[]
  tocItems: ArticleTocItem[]
  html: string
  plainParagraphs: string[]
  blocks: ArticleContentBlock[]
}

export function renderArticleContent(source?: string | null): RenderedArticleContent {
  const normalizedSource = (source || '').trim()
  if (!normalizedSource) {
    return {
      headings: [],
      html: '',
      plainParagraphs: [],
      blocks: [],
    }
  }

  const baseHtml = looksLikeHtml(normalizedSource) ? normalizedSource : String(marked.parse(normalizedSource))
  const htmlWithAnchors = attachHeadingAnchors(baseHtml)
  const blocks = buildBlocks(htmlWithAnchors)
  const tocItems = extractTocItems(htmlWithAnchors)
  const headings = tocItems.map((item) => item.text)
  const plainParagraphs = blocks.flatMap((block) => {
    if (block.type === 'list') {
      return block.items
    }
    if (block.type === 'image') {
      return []
    }
    return block.text ? [block.text] : []
  })

  return {
    headings,
    tocItems,
    html: htmlWithAnchors,
    plainParagraphs,
    blocks,
  }
}

function buildBlocks(html: string) {
  const blocks: ArticleContentBlock[] = []
  const normalizedHtml = normalizeHtml(html)
  const pattern =
    /<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>|<blockquote[^>]*>([\s\S]*?)<\/blockquote>|<(ul|ol)[^>]*>([\s\S]*?)<\/\5>|<p[^>]*>([\s\S]*?)<\/p>|<img([^>]*)\/?>/gi
  let match: RegExpExecArray | null
  let headingIndex = 0

  while ((match = pattern.exec(normalizedHtml))) {
    if (match[1] && match[3] != null) {
      const text = extractText(match[3])
      const anchorId = extractAttr(match[2] || '', 'id') || `article-section-${headingIndex}`
      if (text) {
        blocks.push({
          type: 'heading',
          level: Number(match[1]),
          text,
          anchorId,
        })
        headingIndex += 1
      }
      continue
    }

    if (match[4] != null) {
      const text = extractText(match[4])
      if (text) {
        blocks.push({
          type: 'quote',
          text,
        })
      }
      continue
    }

    if (match[5] && match[6] != null) {
      const items = extractListItems(match[6])
      if (items.length > 0) {
        blocks.push({
          type: 'list',
          ordered: match[5].toLowerCase() === 'ol',
          items,
        })
      }
      continue
    }

    if (match[7] != null) {
      const inner = match[7]
      const imageAttrs = inner.match(/^\s*<img([^>]*)\/?>\s*$/i)
      if (imageAttrs) {
        const src = extractAttr(imageAttrs[1], 'src')
        if (src) {
          blocks.push({
            type: 'image',
            src,
            alt: extractAttr(imageAttrs[1], 'alt'),
          })
        }
        continue
      }

      const text = extractText(inner)
      if (text) {
        blocks.push({
          type: 'paragraph',
          text,
        })
      }
      continue
    }

    if (match[8] != null) {
      const src = extractAttr(match[8], 'src')
      if (src) {
        blocks.push({
          type: 'image',
          src,
          alt: extractAttr(match[8], 'alt'),
        })
      }
    }
  }

  return blocks
}

function attachHeadingAnchors(html: string) {
  let headingIndex = 0

  return html.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/gi, (_match, level: string, attrs: string, inner: string) => {
    const existingId = extractAttr(attrs || '', 'id')
    const anchorId = existingId || `article-section-${headingIndex}`
    const attrsWithoutId = (attrs || '').replace(/\s+id\s*=\s*["'][^"']*["']/i, '')
    headingIndex += 1

    return `<h${level}${attrsWithoutId} id="${anchorId}">${inner}</h${level}>`
  })
}

function extractTocItems(html: string) {
  const tocItems: ArticleTocItem[] = []
  const headingPattern = /<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/gi
  let match: RegExpExecArray | null
  let headingIndex = 0

  while ((match = headingPattern.exec(html))) {
    const text = extractText(match[3])
    if (!text) {
      continue
    }

    tocItems.push({
      id: extractAttr(match[2] || '', 'id') || `article-section-${headingIndex}`,
      text,
      level: Number(match[1]),
    })
    headingIndex += 1
  }

  return tocItems
}

function normalizeHtml(html: string) {
  return html
    .replace(/\r/g, '')
    .replace(/<p[^>]*>\s*(<img[\s\S]*?>)\s*<\/p>/gi, '$1')
    .replace(/<figure[^>]*>\s*(<img[\s\S]*?>)[\s\S]*?<\/figure>/gi, '$1')
}

function extractListItems(html: string) {
  const items: string[] = []
  const liPattern = /<li[^>]*>([\s\S]*?)<\/li>/gi
  let match: RegExpExecArray | null

  while ((match = liPattern.exec(html))) {
    const text = extractText(match[1])
    if (text) {
      items.push(text)
    }
  }

  return items
}

function extractAttr(attrs: string, name: string) {
  const pattern = new RegExp(`${name}\\s*=\\s*["']([^"']*)["']`, 'i')
  const match = attrs.match(pattern)
  return decodeHtmlEntities(match?.[1] || '').trim()
}

function extractText(value: string) {
  const text = value
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>\s*<p[^>]*>/gi, '\n')
    .replace(/<a[^>]*>([\s\S]*?)<\/a>/gi, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/\u00a0/g, ' ')

  return decodeHtmlEntities(text)
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .join('\n')
}

function looksLikeHtml(value: string) {
  return /<\/?[a-z][\s\S]*>/i.test(value)
}

function decodeHtmlEntities(value: string) {
  return value
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&#x27;/gi, "'")
}
