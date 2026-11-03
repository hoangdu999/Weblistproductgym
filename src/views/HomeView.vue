<template>
  <section class="max-w-6xl mx-auto px-3 sm:px-4 py-5 sm:py-8">
    <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
      <div>
        <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900">Chọn sản phẩm bổ sung gym</h1>
        <p class="text-xs sm:text-sm text-slate-500 mt-1 leading-5">
          Chọn sản phẩm, thêm vào giỏ, xuất hóa đơn và gửi lại cho người bán.
        </p>
      </div>

      <div class="flex flex-col sm:flex-row gap-2 items-stretch sm:items-end w-full md:w-auto">
        <input
          v-model="searchKeyword"
          type="search"
          class="input text-xs sm:text-sm py-1.5 sm:py-2 w-full sm:w-56"
          placeholder="🔍 Tìm tên sản phẩm..."
        />
        <div class="flex flex-wrap gap-2 items-center">
          <label class="label !mb-0 hidden sm:block text-xs">Sắp xếp:</label>
          <select v-model="sortBy" class="input !w-auto text-xs sm:text-sm py-1.5 sm:py-2">
            <option value="default">Mặc định</option>
            <option value="price_asc">Giá tăng dần</option>
            <option value="price_desc">Giá giảm dần</option>
            <option value="name">Tên A-Z</option>
          </select>
          <router-link to="/cart" class="btn-primary !py-1.5 sm:!py-2 text-xs sm:text-sm">
            Giỏ hàng ({{ cart.count }})
          </router-link>
        </div>
      </div>
    </div>

    <div v-if="error" class="card p-4 mb-4 sm:mb-6 border-rose-200 bg-rose-50 text-rose-700 text-sm">
      {{ error }}
    </div>

    <div class="flex flex-wrap gap-2 mb-4 sm:mb-6 -mx-1 px-1 overflow-x-auto no-scrollbar">
      <button
        class="chip !text-[11px] sm:text-xs whitespace-nowrap shrink-0"
        :class="!activeCategoryId ? 'chip-active' : ''"
        @click="activeCategoryId = ''"
      >
        Tất cả ({{ products.length }})
      </button>
      <button
        v-for="cat in categories"
        :key="cat.id"
        class="chip !text-[11px] sm:text-xs whitespace-nowrap shrink-0"
        :class="activeCategoryId === cat.id ? 'chip-active' : ''"
        @click="activeCategoryId = cat.id"
      >
        {{ cat.name }} ({{ productsByCategory(cat.id).length }})
      </button>
    </div>

    <div v-if="loading" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
      <div v-for="i in 8" :key="i" class="card h-56 sm:h-64 md:h-72 animate-pulse bg-slate-100" />
    </div>

    <div v-else-if="filteredProducts.length === 0" class="card p-8 sm:p-10 text-center text-slate-500">
      Chưa có sản phẩm trong danh mục này.
    </div>

    <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
      <ProductCard v-for="p in filteredProducts" :key="p.id" :product="p" />
    </div>

    <div v-if="!supabaseEnabled" class="mt-6 sm:mt-8 card p-4 border-dashed border-amber-300 bg-amber-50 text-amber-800 text-xs sm:text-sm">
      <strong>Gợi ý:</strong> Bạn đang xem dữ liệu <strong>mẫu</strong>. Muốn admin tự quản lý sản phẩm?
      Cấu hình Supabase bằng cách điền <code class="px-1 bg-white rounded">.env</code> theo
      <code class="px-1 bg-white rounded">.env.example</code>, sau đó import migration SQL trong
      <code class="px-1 bg-white rounded">docs/</code>.
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { getProductsPublic } from '../services/products'
import { SUPABASE_CONFIG } from '../lib/supabase'
import { useCartStore } from '../stores/cart'
import ProductCard from '../components/ProductCard.vue'

const cart = useCartStore()
const supabaseEnabled = SUPABASE_CONFIG.enabled

const categories = ref([])
const products = ref([])
const loading = ref(true)
const error = ref('')
const activeCategoryId = ref('')
const sortBy = ref('default')
const searchKeyword = ref('')

function productsByCategory(catId) {
  return products.value.filter((p) => p.category_id === catId)
}

const filteredProducts = computed(() => {
  let list = products.value.slice()
  if (activeCategoryId.value) {
    list = list.filter((p) => p.category_id === activeCategoryId.value)
  }
  const q = searchKeyword.value.trim().toLowerCase()
  if (q) {
    list = list.filter((p) => {
      const haystack = `${String(p.name || '')} ${String(p.description || '')} ${String(p.category_name || '')}`.toLowerCase()
      return haystack.includes(q)
    })
  }
  switch (sortBy.value) {
    case 'price_asc':
      list.sort((a, b) => a.price - b.price)
      break
    case 'price_desc':
      list.sort((a, b) => b.price - a.price)
      break
    case 'name':
      list.sort((a, b) => String(a.name).localeCompare(String(b.name), 'vi'))
      break
    default:
      list.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
  }
  return list
})

onMounted(async () => {
  try {
    loading.value = true
    const res = await getProductsPublic()
    categories.value = res.categories
    products.value = res.products
  } catch (e) {
    error.value = String(e?.message || e || 'Lỗi tải sản phẩm')
  } finally {
    loading.value = false
  }
})
</script>
