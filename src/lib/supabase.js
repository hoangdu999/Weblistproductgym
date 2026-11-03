import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const bucket = import.meta.env.VITE_SUPABASE_BUCKET || 'products'

export const SUPABASE_CONFIG = {
  enabled: Boolean(url && anonKey),
  bucket,
  publicBaseUrl: url ? `${url}/storage/v1/object/public/${bucket}` : '',
}

export const supabase = url && anonKey ? createClient(url, anonKey) : null

export function getSupabaseOrThrow() {
  if (!supabase) {
    throw new Error(
      'Chưa cấu hình Supabase. Vui lòng sao chép .env.example thành .env và điền VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY.',
    )
  }
  return supabase
}

export function getPublicImageUrl(path) {
  if (!path) return ''
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path
  }
  if (!SUPABASE_CONFIG.publicBaseUrl) return path
  const safe = String(path).replace(/^\//, '')
  return `${SUPABASE_CONFIG.publicBaseUrl}/${safe}`
}
