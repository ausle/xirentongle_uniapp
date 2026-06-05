export const DEFAULT_USER_NAME = '林晓峰'
export const DEFAULT_USER_AVATAR = 'https://images.unsplash.com/photo-1629740936456-4b990c27e503?w=200&auto=format'
export const DEFAULT_HERO_IMAGE = 'https://images.unsplash.com/photo-1597925428895-88e78e3f2011?w=800&auto=format'
export const DEFAULT_USER_PHONE = '155****4643'
export const DEFAULT_PROFILE_HANDLE = '@xiaofeng_dev'
export const DEFAULT_PROFILE_SUBTITLE = '前端架构师'

const NICKNAME_KEY = 'chance_profile_nickname'
const LOGIN_KEY = 'chance_profile_logged_in'

export function getStoredNickname() {
  const value = uni.getStorageSync(NICKNAME_KEY)
  return typeof value === 'string' && value.trim() ? value : DEFAULT_USER_NAME
}

export function setStoredNickname(value: string) {
  const next = value.trim() || DEFAULT_USER_NAME
  uni.setStorageSync(NICKNAME_KEY, next)
  return next
}

export function clearStoredNickname() {
  uni.removeStorageSync(NICKNAME_KEY)
}

export function getStoredLoginState() {
  return uni.getStorageSync(LOGIN_KEY) === true
}

export function setStoredLoginState(value: boolean) {
  uni.setStorageSync(LOGIN_KEY, value)
  return value
}

export function clearStoredLoginState() {
  uni.removeStorageSync(LOGIN_KEY)
}
