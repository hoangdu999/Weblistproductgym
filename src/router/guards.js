import { useAuthStore } from '../stores/auth'
import { SUPABASE_CONFIG } from '../lib/supabase'

/**
 * Navigation guard đơn giản cho các route cần đăng nhập.
 * Nếu chưa đăng nhập sẽ chuyển về /admin/login.
 */
export function installAuthGuards(router) {
  router.beforeEach(async (to) => {
    if (!to.meta?.requiresAuth) return true
    const auth = useAuthStore()
    if (!SUPABASE_CONFIG.enabled) {
      if (auth.isLoggedIn) return true
      return { path: '/admin/login', query: { redirect: to.fullPath } }
    }
    if (auth.isLoggedIn) return true
    return { path: '/admin/login', query: { redirect: to.fullPath } }
  })
}
