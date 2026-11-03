import { defineStore } from 'pinia'
import { getSupabaseOrThrow, SUPABASE_CONFIG } from '../lib/supabase'

const SESSION_KEY = 'gymshop_admin_session_v1'

function loadLocalSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    session: loadLocalSession(),
    loading: false,
    _realSessionChecked: false,
  }),

  getters: {
    isLoggedIn(state) {
      if (!SUPABASE_CONFIG.enabled) return Boolean(state.session?.email)
      return Boolean(state.session?.email) && state._realSessionChecked === true
    },
    email(state) {
      return state.session?.email || ''
    },
    useMock() {
      return !SUPABASE_CONFIG.enabled
    },
  },

  actions: {
    _saveSession(session) {
      this.session = session
      try {
        localStorage.setItem(SESSION_KEY, session ? JSON.stringify(session) : '')
      } catch {}
    },

    _clearSession() {
      this.session = null
      this._realSessionChecked = false
      try {
        localStorage.removeItem(SESSION_KEY)
      } catch {}
    },

    async login(email, password) {
      if (!SUPABASE_CONFIG.enabled) {
        if (email === 'admin@demo.com' && password === 'admin123') {
          this._saveSession({ email, mock: true, at: Date.now() })
          this._realSessionChecked = true
          return { ok: true }
        }
        return { ok: false, error: 'Chưa cấu hình Supabase. Tài khoản mẫu: admin@demo.com / admin123' }
      }
      const supabase = getSupabaseOrThrow()
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        return { ok: false, error: error.message }
      }
      if (!data?.user?.id || !data?.session?.access_token) {
        return { ok: false, error: 'Đăng nhập không thành công. Vui lòng kiểm tra lại email đã được xác minh (Xác nhận email) trong Supabase Auth.' }
      }
      this._saveSession({ email: data?.user?.email || email, at: Date.now() })
      this._realSessionChecked = true
      return { ok: true }
    },

    async refreshAndEnsureSessionOrNull() {
      if (!SUPABASE_CONFIG.enabled) {
        this._realSessionChecked = true
        return this.session ? { ok: true, email: this.session.email } : { ok: false, needsLogin: true }
      }
      try {
        const supabase = getSupabaseOrThrow()
        const { data, error } = await supabase.auth.getSession()
        if (error || !data?.session?.access_token || !data?.session?.user?.id) {
          this._clearSession()
          return { ok: false, needsLogin: true, reason: error?.message || 'Admin session không tồn tại.' }
        }
        this._saveSession({ email: data.session.user.email || this.session?.email || '', at: Date.now() })
        this._realSessionChecked = true
        return { ok: true, email: data.session.user.email }
      } catch (e) {
        this._clearSession()
        return { ok: false, needsLogin: true, reason: String(e?.message || e) }
      }
    },

    async logout() {
      if (SUPABASE_CONFIG.enabled) {
        try {
          const supabase = getSupabaseOrThrow()
          await supabase.auth.signOut()
        } catch {}
      }
      this._clearSession()
    },
  },
})
