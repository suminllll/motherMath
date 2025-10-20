export interface LoginCredentials {
  username: string
  password: string
}

export interface AuthResult {
  success: boolean
  message?: string
  admin?: {
    username: string
    name: string
  }
}

// 하드코딩된 관리자 계정
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

export const loginAdmin = (credentials: LoginCredentials): AuthResult => {
  if (credentials.username === ADMIN_USERNAME && credentials.password === ADMIN_PASSWORD) {
    return {
      success: true,
      admin: {
        username: ADMIN_USERNAME,
        name: '관리자'
      }
    }
  }

  return {
    success: false,
    message: '아이디 또는 비밀번호가 잘못되었습니다.'
  }
}

// 간단한 세션 관리
export const setAdminSession = (admin: { username: string; name: string }) => {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('admin', JSON.stringify(admin))
  }
}

export const getAdminSession = () => {
  if (typeof window !== 'undefined') {
    const admin = sessionStorage.getItem('admin')
    return admin ? JSON.parse(admin) : null
  }
  return null
}

export const clearAdminSession = () => {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('admin')
  }
}