import { useRouter } from 'vue-router'

export function useAuth() {
  const router = useRouter()

  function getToken(): string | null {
    return localStorage.getItem('token')
  }

  function getUserFromToken(): { userId: string; role: string } | null {
    const token = getToken()
    if (!token) return null
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return { userId: payload.userId, role: payload.role }
    } catch {
      return null
    }
  }

  function isAuthenticated(): boolean {
    return !!getToken()
  }

  function isAdmin(): boolean {
    const user = getUserFromToken()
    return user?.role === 'admin'
  }

  function logout() {
    localStorage.removeItem('token')
    router.push('/login')
  }

  return { getToken, getUserFromToken, isAuthenticated, isAdmin, logout }
}
