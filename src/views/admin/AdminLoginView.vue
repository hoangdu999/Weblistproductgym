<template>
  <section class="max-w-xl mx-auto px-3 sm:px-4 py-10 sm:py-14">
    <div class="card p-5 sm:p-8">
      <div class="text-center mb-5 sm:mb-6">
        <div class="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-brand-500 text-white text-xl sm:text-2xl font-bold mb-3">
          💪
        </div>
        <h1 class="text-lg sm:text-xl font-bold text-slate-900">Đăng nhập Admin</h1>
        <p class="text-xs sm:text-sm text-slate-500 mt-1 leading-5">
          {{ auth.useMock ? 'Bạn đang dùng chế độ DỮ LIỆU MẪU vì chưa cấu hình Supabase.' : 'Quản lý danh mục, sản phẩm, giá & ảnh.' }}
        </p>
      </div>

      <form class="space-y-3 sm:space-y-4" @submit.prevent="onSubmit">
        <div>
          <label class="label">Email</label>
          <input v-model="email" type="email" required autocomplete="email" class="input" :placeholder="auth.useMock ? 'admin@demo.com' : 'admin@yourdomain.com'" />
        </div>
        <div>
          <label class="label">Mật khẩu</label>
          <input v-model="password" type="password" required autocomplete="current-password" class="input" :placeholder="auth.useMock ? 'admin123' : 'Mật khẩu Supabase Auth'" />
        </div>

        <div v-if="error" class="rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm px-3 py-2 whitespace-pre-wrap leading-5">
          {{ error }}
        </div>

        <button class="btn-primary w-full" :disabled="loading">
          {{ loading ? 'Đang xử lý...' : 'Đăng nhập' }}
        </button>

        <div v-if="auth.useMock" class="rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[11px] sm:text-xs p-3 leading-5">
          <strong>Dữ liệu mẫu:</strong> đăng nhập thành công nhưng các thay đổi (thêm/sửa/xóa sản phẩm, upload ảnh) <strong>không được lưu thật</strong>.<br />
          Muốn lưu dữ liệu thật, hãy cấu hình Supabase theo <code class="px-1 bg-white rounded">.env.example</code> và chạy migration trong <code class="px-1 bg-white rounded">docs/supabase_setup.sql</code>.
        </div>
      </form>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

onMounted(() => {
  if (auth.useMock) {
    email.value = 'admin@demo.com'
    password.value = 'admin123'
  }
})

async function onSubmit() {
  error.value = ''
  try {
    loading.value = true
    const res = await auth.login(email.value.trim(), password.value)
    if (!res.ok) {
      error.value = res.error || 'Đăng nhập thất bại'
      return
    }
    const redirect = route.query.redirect?.toString() || '/admin'
    await router.replace(redirect)
  } catch (e) {
    error.value = String(e?.message || e || 'Đăng nhập thất bại')
  } finally {
    loading.value = false
  }
}
</script>
