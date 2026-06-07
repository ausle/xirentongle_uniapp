export interface ApiResponse<T> {
  code: number
  data: T
  message: string
}

export interface ArticleCategoryDto {
  categoryId: number
  category: string
  rank?: number
  status?: number
  selected?: boolean
}

export interface IndexResponseData {
  categories: ArticleCategoryDto[]
  currentCategory?: string
  categoryId?: number
}

export interface ArticleCountDto {
  praiseCount?: number
  readCount?: number
  collectionCount?: number
  commentCount?: number
}

export interface ArticleDetailCategoryDto {
  categoryId?: number
  category?: string
}

export interface ArticleTagDto {
  tagId?: number
  tag?: string
}

export interface ArticleItemDto {
  articleId: number
  author?: number
  authorName?: string
  authorAvatar?: string
  title?: string
  summary?: string
  cover?: string
  content?: string
  createTime?: number
  lastUpdateTime?: number
  category?: ArticleDetailCategoryDto
  tags?: ArticleTagDto[]
  count?: ArticleCountDto
}

export interface PageListResponse<T> {
  list: T[]
  hasMore: boolean
}

export interface CategoryArticleListResponse {
  archives?: string
  archiveId?: number
  articles?: PageListResponse<ArticleItemDto>
  pageNum?: number
  pageSize?: number
  pageTotal?: number
  total?: number
}

export interface ArticleDetailResponse {
  article?: ArticleItemDto | null
}

const FALLBACK_API_BASE_URL = 'http://127.0.0.1:8080'

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, '')
}

function resolveApiBaseUrl() {
  const runtimeBaseUrl = uni.getStorageSync('chance_api_base_url')
  if (typeof runtimeBaseUrl === 'string' && runtimeBaseUrl.trim()) {
    return trimTrailingSlash(runtimeBaseUrl.trim())
  }

  const envBaseUrl = import.meta.env.VITE_API_BASE_URL
  if (typeof envBaseUrl === 'string' && envBaseUrl.trim()) {
    return trimTrailingSlash(envBaseUrl.trim())
  }

  return FALLBACK_API_BASE_URL
}

function request<T>(url: string, data?: Record<string, unknown>) {
  return new Promise<T>((resolve, reject) => {
    const requestUrl = `${resolveApiBaseUrl()}${url}`
    console.log('[chance-api] request', {
      url: requestUrl,
      method: 'GET',
      data: data ?? null,
    })

    uni.request({
      url: requestUrl,
      method: 'GET',
      data,
      success: (response) => {
        console.log('[chance-api] response', {
          url: requestUrl,
          statusCode: response.statusCode,
          data: response.data,
        })
        const body = response.data as ApiResponse<T> | undefined
        if (response.statusCode < 200 || response.statusCode >= 300) {
          reject(new Error(body?.message || `Request failed with status ${response.statusCode}`))
          return
        }
        if (!body) {
          reject(new Error('Empty response body'))
          return
        }
        if (body.code !== 0) {
          reject(new Error(body.message || 'Request failed'))
          return
        }
        resolve(body.data)
      },
      fail: (error) => {
        console.error('[chance-api] fail', {
          url: requestUrl,
          error,
        })
        reject(error)
      },
    })
  })
}

export function fetchIndexData(category?: string) {
  const params = category ? { category } : undefined
  return request<IndexResponseData>('/index', params)
}

export function fetchArticlesByCategory(params?: {
  category?: string
  page?: number
  size?: number
  sort?: 'latest' | 'hot'
}) {
  const requestParams: Record<string, unknown> = {}

  if (params?.category) requestParams.category = params.category
  if (typeof params?.page === 'number') requestParams.page = params.page
  if (typeof params?.size === 'number') requestParams.size = params.size
  if (params?.sort) requestParams.sort = params.sort

  return request<CategoryArticleListResponse>('/article/category', requestParams)
}

export async function fetchArticleDetail(articleId: string | number) {
  const normalizedId = String(articleId).trim()
  return request<ArticleDetailResponse>(`/article/detail/${normalizedId}`)
}
