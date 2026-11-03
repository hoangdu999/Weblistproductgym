<template>
  <section class="max-w-7xl mx-auto px-3 sm:px-4 py-5 sm:py-8">
    <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
      <div>
        <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900">Quản lý cửa hàng</h1>
        <p class="text-xs sm:text-sm text-slate-500 mt-1 leading-5">
          Quản lý danh mục & sản phẩm khách hàng nhìn thấy. Đăng nhập:
          <span class="font-medium text-slate-700 break-all">{{ auth.email || 'Không xác định' }}</span>
          <span v-if="auth.useMock" class="ml-2 chip bg-amber-100 text-amber-800 !text-[11px] sm:text-xs">Dữ liệu mẫu</span>
        </p>
      </div>
      <div class="flex gap-2 flex-wrap -mx-1">
        <router-link to="/" class="btn-secondary !py-2 text-xs sm:text-sm">← Xem cửa hàng</router-link>
        <button class="btn-danger !py-2 text-xs sm:text-sm" @click="logout">Đăng xuất</button>
      </div>
    </div>

    <div v-if="error" class="card p-4 mb-4 sm:mb-6 bg-rose-50 border-rose-200 text-rose-700 text-xs sm:text-sm whitespace-pre-wrap leading-5">
      {{ error }}
    </div>

    <div class="flex flex-col lg:grid lg:grid-cols-3 gap-4 sm:gap-6 w-full">
      <div class="lg:col-span-2 order-1 lg:order-2 w-full">
        <div class="card p-4 sm:p-5 w-full max-w-full">
          <div class="flex flex-col gap-3 mb-3 sm:mb-4">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h2 class="font-semibold text-base sm:text-lg">Sản phẩm ({{ products.length }})</h2>
              <div class="flex flex-col gap-2 w-full sm:w-auto">
                <input v-model="productSearch" class="input w-full sm:w-64 text-xs sm:text-sm" placeholder="Tìm tên sản phẩm..." />
                <div class="flex flex-col sm:flex-row gap-2 w-full">
                  <select v-model="productFilterCategoryId" class="input w-full text-xs sm:text-sm">
                    <option value="">Tất cả danh mục</option>
                    <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
                  </select>
                  <button class="btn-primary w-full sm:w-auto !py-2 text-xs sm:text-sm whitespace-nowrap" :disabled="categories.length === 0" @click="openProductModal()">
                    + Thêm sản phẩm
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div v-if="loading" class="text-xs sm:text-sm text-slate-500">Đang tải...</div>
          <div v-else>
            <!-- Mobile card list (< md): không bao giờ bị ẩn cột Hiển thị / Hành động -->
            <div class="md:hidden space-y-2.5">
              <div
                v-for="p in filteredProducts"
                :key="p.id"
                class="border border-slate-200 rounded-xl p-3 flex gap-3"
              >
                <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                  <img v-if="p.image_url" :src="p.image_url" class="w-full h-full object-cover" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between gap-2">
                    <div class="min-w-0">
                      <div class="font-medium text-sm sm:text-base text-slate-800 break-words line-clamp-2" :title="p.name">
                        {{ p.name }}
                      </div>
                      <div class="text-[11px] sm:text-xs text-slate-500 mt-0.5">{{ p.category_name }} · Thứ tự {{ p.sort_order }}</div>
                    </div>
                    <span class="chip !px-2 shrink-0" :class="p.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'">
                      {{ p.is_active ? 'Bật' : 'Tắt' }}
                    </span>
                  </div>
                  <div v-if="p.description" class="text-[11px] sm:text-xs text-slate-500 mt-1 line-clamp-2 break-words" :title="p.description">
                    {{ p.description }}
                  </div>
                  <div class="flex items-end justify-between gap-2 mt-2">
                    <div class="text-brand-600 font-bold text-sm sm:text-base tabular-nums">
                      {{ formatVND(p.price) }}
                    </div>
                    <div class="flex items-center gap-2 shrink-0">
                      <button class="btn-primary !py-1 !px-3 !text-[11px]" @click="openProductModal(p)">Sửa</button>
                      <button class="btn-danger !py-1 !px-3 !text-[11px]" @click="removeProduct(p)">Xóa</button>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="filteredProducts.length === 0" class="py-8 sm:py-10 text-center text-xs sm:text-sm text-slate-500">
                {{ products.length === 0 ? 'Chưa có sản phẩm. Thêm danh mục trước, sau đó thêm sản phẩm.' : 'Không tìm thấy sản phẩm nào.' }}
              </div>
            </div>

            <!-- Desktop table (>= md): vẫn bảng cho quản lý nhanh -->
            <div class="hidden md:block overflow-x-auto rounded-xl border border-slate-200">
              <table class="w-full text-xs sm:text-sm">
                <thead class="bg-slate-100 text-slate-700">
                  <tr>
                    <th class="text-left px-2 sm:px-3 py-2 w-14 sm:w-16">Ảnh</th>
                    <th class="text-left px-2 sm:px-3 py-2 min-w-[180px]">Tên</th>
                    <th class="text-left px-2 sm:px-3 py-2 w-24 sm:w-28">Danh mục</th>
                    <th class="text-right px-2 sm:px-3 py-2 w-24 sm:w-28">Giá</th>
                    <th class="text-center px-2 sm:px-3 py-2 w-20">Hiển thị</th>
                    <th class="px-2 sm:px-3 py-2 text-right w-28 sm:w-32">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="p in filteredProducts" :key="p.id" class="border-t border-slate-200 align-middle">
                    <td class="px-2 sm:px-3 py-3">
                      <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                        <img v-if="p.image_url" :src="p.image_url" class="w-full h-full object-cover" />
                      </div>
                    </td>
                    <td class="px-2 sm:px-3 py-3">
                      <div class="font-medium max-w-[220px] truncate" :title="p.name">{{ p.name }}</div>
                      <div v-if="p.description" class="text-[11px] sm:text-xs text-slate-500 max-w-[220px] truncate" :title="p.description">
                        {{ p.description }}
                      </div>
                      <div class="text-[11px] sm:text-xs text-slate-400 mt-1">Thứ tự: {{ p.sort_order }}</div>
                    </td>
                    <td class="px-2 sm:px-3 py-3 text-slate-700 whitespace-nowrap">{{ p.category_name }}</td>
                    <td class="px-2 sm:px-3 py-3 text-right tabular-nums text-brand-600 font-semibold whitespace-nowrap">{{ formatVND(p.price) }}</td>
                    <td class="px-2 sm:px-3 py-3 text-center whitespace-nowrap">
                      <span class="chip !px-2" :class="p.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'">
                        {{ p.is_active ? 'Bật' : 'Tắt' }}
                      </span>
                    </td>
                    <td class="px-2 sm:px-3 py-3 text-right whitespace-nowrap">
                      <button class="text-[11px] sm:text-xs text-brand-600 hover:underline mr-2" @click="openProductModal(p)">Sửa</button>
                      <button class="text-[11px] sm:text-xs text-rose-600 hover:underline" @click="removeProduct(p)">Xóa</button>
                    </td>
                  </tr>
                  <tr v-if="filteredProducts.length === 0">
                    <td colspan="6" class="px-2 sm:px-3 py-8 sm:py-10 text-center text-xs sm:text-sm text-slate-500">
                      {{ products.length === 0 ? 'Chưa có sản phẩm. Thêm danh mục trước, sau đó thêm sản phẩm.' : 'Không tìm thấy sản phẩm nào.' }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-1 space-y-4 sm:space-y-6 order-2 lg:order-1 w-full">
        <div class="card p-4 sm:p-5 w-full">
          <div class="flex items-center justify-between mb-3">
            <h2 class="font-semibold text-base sm:text-lg">Danh mục</h2>
            <button class="btn-secondary text-[11px] sm:text-xs whitespace-nowrap" @click="openCategoryModal()">+ Thêm</button>
          </div>
          <div v-if="loading" class="text-xs sm:text-sm text-slate-500">Đang tải...</div>
          <div v-else class="space-y-2">
            <div
              v-for="c in categories"
              :key="c.id"
              class="flex items-start justify-between gap-2 border border-slate-200 rounded-xl px-3 py-2 hover:border-brand-300"
            >
              <div class="min-w-0">
                <div class="font-medium text-sm sm:text-base break-words">{{ c.name }}</div>
                <div class="text-[11px] sm:text-xs text-slate-500 break-all">{{ c.slug }} · Thứ tự {{ c.sort_order }}</div>
              </div>
              <div class="flex gap-2 shrink-0">
                <button class="text-[11px] sm:text-xs text-brand-600 hover:underline whitespace-nowrap" @click="openCategoryModal(c)">Sửa</button>
                <button
                  v-if="!isCategoryUsed(c.id)"
                  class="text-[11px] sm:text-xs text-rose-600 hover:underline whitespace-nowrap"
                  @click="removeCategory(c)"
                >Xóa</button>
                <span v-else class="text-[11px] sm:text-xs text-slate-400 whitespace-nowrap" title="Danh mục đã chứa sản phẩm">(đã dùng)</span>
              </div>
            </div>
            <div v-if="categories.length === 0" class="text-xs sm:text-sm text-slate-500">Chưa có danh mục.</div>
          </div>
        </div>

        <div class="card p-4 sm:p-5 bg-slate-50 border-dashed text-xs sm:text-sm text-slate-600 space-y-2 w-full">
          <h3 class="font-semibold text-slate-800">Mẹo nhanh</h3>
          <ul class="list-disc pl-5 space-y-1 leading-5">
            <li>Thêm danh mục trước rồi mới thêm sản phẩm.</li>
            <li>Sắp xếp bằng <code class="px-1 bg-white rounded">sort_order</code> (số nhỏ lên trước).</li>
            <li>Ảnh nên tải lên dưới 2MB, loại JPG/PNG.</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Category modal -->
    <div v-if="showCategoryModal" class="fixed inset-0 z-50 bg-slate-900/50 flex items-end sm:items-center justify-center sm:p-4" @click.self="closeCategoryModal">
      <div class="card !rounded-t-2xl sm:!rounded-2xl p-5 sm:p-6 w-full sm:max-w-md max-h-[90vh] overflow-y-auto no-scrollbar">
        <h3 class="font-semibold text-base sm:text-lg mb-4">{{ editingCategory?.id ? 'Sửa danh mục' : 'Thêm danh mục' }}</h3>
        <form @submit.prevent="saveCategory" class="space-y-3 sm:space-y-4">
          <div>
            <label class="label">Tên danh mục</label>
            <input v-model.trim="categoryForm.name" required class="input text-sm sm:text-base" placeholder="Ví dụ: Whey" />
          </div>
          <div>
            <label class="label">Slug</label>
            <input v-model.trim="categoryForm.slug" class="input text-sm sm:text-base" placeholder="ví-dụ: whey (bỏ trống sẽ tự tạo)" />
          </div>
          <div>
            <label class="label">Thứ tự hiển thị</label>
            <input v-model.number="categoryForm.sort_order" type="number" min="0" class="input text-sm sm:text-base" />
          </div>
          <div class="flex justify-end gap-2 pt-2">
            <button type="button" class="btn-secondary !py-2 text-xs sm:text-sm" @click="closeCategoryModal">Hủy</button>
            <button type="submit" class="btn-primary !py-2 text-xs sm:text-sm" :disabled="submitting">
              {{ submitting ? 'Đang lưu...' : 'Lưu' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Product modal -->
    <div v-if="showProductModal" class="fixed inset-0 z-50 bg-slate-900/50 flex items-end sm:items-center justify-center sm:p-4 overflow-y-auto" @click.self="closeProductModal">
      <div class="card !rounded-t-2xl sm:!rounded-2xl p-5 sm:p-6 w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto no-scrollbar my-0 sm:my-8">
        <h3 class="font-semibold text-base sm:text-lg mb-4">{{ editingProduct?.id ? 'Sửa sản phẩm' : 'Thêm sản phẩm' }}</h3>
        <form @submit.prevent="saveProduct" class="space-y-3 sm:space-y-4">
          <div class="grid sm:grid-cols-2 gap-3 sm:gap-4">
            <div class="sm:col-span-2">
              <label class="label">Tên sản phẩm</label>
              <input v-model.trim="productForm.name" required class="input text-sm sm:text-base" placeholder="Ví dụ: Whey Rule1 5.5lbs" />
            </div>
            <div>
              <label class="label">Danh mục</label>
              <select v-model="productForm.category_id" required class="input text-sm sm:text-base">
                <option value="" disabled>-- Chọn danh mục --</option>
                <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
              </select>
            </div>
            <div>
              <label class="label">Giá (VND)</label>
              <input v-model.number="productForm.price" type="number" min="0" required class="input text-sm sm:text-base" />
            </div>
            <div>
              <label class="label">Thứ tự</label>
              <input v-model.number="productForm.sort_order" type="number" min="0" class="input text-sm sm:text-base" />
            </div>
            <div class="flex items-start pt-6">
              <label class="inline-flex items-center gap-2 cursor-pointer">
                <input v-model="productForm.is_active" type="checkbox" class="w-4 h-4 accent-brand-500 shrink-0" />
                <span class="text-xs sm:text-sm">Hiển thị cho khách hàng</span>
              </label>
            </div>
            <div class="sm:col-span-2">
              <label class="label">Mô tả ngắn</label>
              <textarea v-model="productForm.description" rows="2" class="input resize-none text-sm sm:text-base" placeholder="Không bắt buộc"></textarea>
            </div>
            <div class="sm:col-span-2">
              <label class="label">Ảnh sản phẩm</label>
              <div class="flex flex-col sm:flex-row items-start gap-3">
                <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-xl border border-slate-200 bg-slate-50 overflow-hidden shrink-0">
                  <img v-if="productForm.image_url" :src="productForm.image_url" class="w-full h-full object-cover" />
                </div>
                <div class="flex-1 w-full space-y-2">
                  <input type="file" accept="image/*" class="block w-full text-xs sm:text-sm text-slate-600 file:mr-3 file:px-3 file:py-1.5 file:rounded-lg file:border-0 file:bg-brand-500 file:text-white file:text-sm file:font-medium hover:file:bg-brand-600" @change="onPickImage" />
                  <div class="text-[11px] sm:text-xs text-slate-500 leading-5">
                    {{ uploadImageProgress || 'Nên chọn ảnh vuông, JPG/PNG, dưới 2MB.' }}
                  </div>
                  <div class="text-[11px] sm:text-xs text-slate-400 break-all leading-5">URL: {{ productForm.image_url || '(trống)' }}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-2 pt-2 border-t border-slate-100 mt-2">
            <button type="button" class="btn-secondary !py-2 text-xs sm:text-sm" @click="closeProductModal">Hủy</button>
            <button type="submit" class="btn-primary !py-2 text-xs sm:text-sm" :disabled="submitting || uploadingImage">
              {{ submitting ? 'Đang lưu...' : 'Lưu sản phẩm' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { SUPABASE_CONFIG, getPublicImageUrl } from '../../lib/supabase'
import {
  deleteCategory,
  deleteProduct,
  getProductsAdmin,
  upsertCategory,
  upsertProduct,
  uploadProductImage,
} from '../../services/products'
import { formatVND } from '../../utils/format'

const auth = useAuthStore()
const router = useRouter()

const categories = ref([])
const products = ref([])
const loading = ref(true)
const submitting = ref(false)
const uploadingImage = ref(false)
const uploadImageProgress = ref('')
const error = ref('')

const productSearch = ref('')
const productFilterCategoryId = ref('')

const filteredProducts = computed(() => {
  const q = productSearch.value.trim().toLowerCase()
  return products.value.filter((p) => {
    if (productFilterCategoryId.value && p.category_id !== productFilterCategoryId.value) return false
    if (!q) return true
    return (
      String(p.name || '').toLowerCase().includes(q) ||
      String(p.description || '').toLowerCase().includes(q)
    )
  })
})

const showCategoryModal = ref(false)
const editingCategory = ref(null)
const categoryForm = reactive({ id: '', name: '', slug: '', sort_order: 0 })

const showProductModal = ref(false)
const editingProduct = ref(null)
const productForm = reactive({
  id: '',
  category_id: '',
  name: '',
  description: '',
  price: 0,
  image_url: '',
  is_active: true,
  sort_order: 0,
})

async function reload() {
  try {
    loading.value = true
    error.value = ''
    const res = await getProductsAdmin()
    categories.value = res.categories
    products.value = res.products
  } catch (e) {
    error.value = String(e?.message || e || 'Lỗi tải dữ liệu')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (!SUPABASE_CONFIG.enabled) {
    // Dữ liệu mẫu có sẵn, nhưng vẫn gọi hàm để đảm bảo nhất quán
  }
  reload()
})

function isCategoryUsed(catId) {
  return products.value.some((p) => p.category_id === catId)
}

async function logout() {
  await auth.logout()
  await router.replace('/admin/login')
}

/* ---------------- Category modal ---------------- */
function openCategoryModal(c = null) {
  editingCategory.value = c
  categoryForm.id = c?.id || ''
  categoryForm.name = c?.name || ''
  categoryForm.slug = c?.slug || ''
  categoryForm.sort_order = Number(c?.sort_order || 0)
  showCategoryModal.value = true
}
function closeCategoryModal() {
  showCategoryModal.value = false
  editingCategory.value = null
}
async function saveCategory() {
  if (!SUPABASE_CONFIG.enabled) {
    error.value = 'Đang dùng chế độ mẫu: không lưu được thật. Vui lòng cấu hình Supabase.'
    return
  }
  try {
    submitting.value = true
    error.value = ''
    await upsertCategory({ ...categoryForm })
    closeCategoryModal()
    await reload()
  } catch (e) {
    error.value = 'Lưu danh mục thất bại: ' + String(e?.message || e)
  } finally {
    submitting.value = false
  }
}
async function removeCategory(c) {
  if (!confirm(`Xóa danh mục "${c.name}"?`)) return
  if (!SUPABASE_CONFIG.enabled) {
    error.value = 'Đang dùng chế độ mẫu: không lưu được thật. Vui lòng cấu hình Supabase.'
    return
  }
  try {
    error.value = ''
    await deleteCategory(c.id)
    await reload()
  } catch (e) {
    error.value = 'Xóa danh mục thất bại: ' + String(e?.message || e)
  }
}

/* ---------------- Product modal ---------------- */
function openProductModal(p = null) {
  editingProduct.value = p
  productForm.id = p?.id || ''
  productForm.category_id = p?.category_id || categories.value[0]?.id || ''
  productForm.name = p?.name || ''
  productForm.description = p?.description || ''
  productForm.price = Number(p?.price || 0)
  productForm.image_url = p?.image_url || ''
  productForm.is_active = p?.is_active !== false
  productForm.sort_order = Number(p?.sort_order || 0)
  showProductModal.value = true
}
function closeProductModal() {
  showProductModal.value = false
  editingProduct.value = null
  uploadImageProgress.value = ''
}
async function onPickImage(ev) {
  const file = ev.target.files?.[0]
  if (!file) return
  if (!file.type.startsWith('image/')) {
    error.value = 'Vui lòng chọn file ảnh.'
    return
  }
  if (file.size > 5 * 1024 * 1024) {
    error.value = 'Ảnh quá lớn, tối đa 5MB.'
    return
  }
  try {
    uploadingImage.value = true
    error.value = ''
    uploadImageProgress.value = 'Đang upload ảnh...'
    const storedPath = await uploadProductImage(file)
    productForm.image_url = SUPABASE_CONFIG.enabled ? getPublicImageUrl(storedPath) : storedPath
    uploadImageProgress.value = 'Upload thành công.'
  } catch (e) {
    uploadImageProgress.value = ''
    error.value = 'Upload ảnh thất bại: ' + String(e?.message || e)
  } finally {
    uploadingImage.value = false
  }
  ev.target.value = ''
}
async function saveProduct() {
  if (!productForm.category_id) {
    error.value = 'Vui lòng chọn danh mục (thêm danh mục trước).'
    return
  }
  if (!SUPABASE_CONFIG.enabled) {
    error.value = 'Đang dùng chế độ mẫu: không lưu được thật. Vui lòng cấu hình Supabase.'
    return
  }
  try {
    submitting.value = true
    error.value = ''
    await upsertProduct({ ...productForm })
    closeProductModal()
    await reload()
  } catch (e) {
    error.value = 'Lưu sản phẩm thất bại: ' + String(e?.message || e)
  } finally {
    submitting.value = false
  }
}
async function removeProduct(p) {
  if (!confirm(`Xóa sản phẩm "${p.name}"? Hành động này không thể hoàn tác.`)) return
  if (!SUPABASE_CONFIG.enabled) {
    error.value = 'Đang dùng chế độ mẫu: không lưu được thật. Vui lòng cấu hình Supabase.'
    return
  }
  try {
    error.value = ''
    await deleteProduct(p.id)
    await reload()
  } catch (e) {
    error.value = 'Xóa sản phẩm thất bại: ' + String(e?.message || e)
  }
}
</script>
