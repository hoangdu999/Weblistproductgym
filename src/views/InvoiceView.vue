<template>
  <section class="max-w-4xl mx-auto px-3 sm:px-4 py-5 sm:py-8">
    <div class="flex flex-col gap-3 mb-4 sm:mb-6">
      <div>
        <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900">Hóa đơn đặt hàng</h1>
        <p class="text-xs sm:text-sm text-slate-500 mt-1 leading-5">
          Quý khách vui lòng kiểm tra thông tin, sau đó chụp màn hình hoặc tải ảnh hóa đơn này gửi cho người bán.
        </p>
      </div>
      <div class="flex gap-2 flex-wrap -mx-1">
        <button class="btn-primary !py-2 text-xs sm:text-sm" :disabled="rendering" @click="downloadImage">
          {{ rendering ? 'Đang xử lý...' : 'Tải hóa đơn (Ảnh)' }}
        </button>
        <button class="btn-secondary !py-2 text-xs sm:text-sm" onclick="window.print()">In / Lưu PDF</button>
        <router-link to="/cart" class="btn-secondary !py-2 text-xs sm:text-sm">← Quay lại giỏ hàng</router-link>
      </div>
    </div>

    <div v-if="isEmpty" class="card p-8 sm:p-10 text-center">
      <div class="text-slate-500 mb-4">Giỏ hàng trống, không thể tạo hóa đơn.</div>
      <router-link to="/" class="btn-primary">Chọn sản phẩm</router-link>
    </div>

    <div v-else id="invoice-root" class="card p-4 sm:p-6 lg:p-10 bg-white text-slate-900">
      <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 border-b-2 border-dashed border-slate-200 pb-4 sm:pb-6 mb-4 sm:mb-6">
        <div>
          <div class="flex items-center gap-2 font-bold text-xl sm:text-2xl text-brand-600">
            <span class="inline-block w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-brand-500 text-white flex items-center justify-center text-base sm:text-lg">💪</span>
            榛名ショップ
          </div>
          <div class="text-xs sm:text-sm text-slate-600 mt-2 max-w-md leading-5">
            Cung cấp thực phẩm bổ sung gym chính hãng<br class="hidden sm:block" />
            Liên hệ: <span class="font-medium">Messenger / Facebook / SĐT hiện có</span>
          </div>
        </div>
        <div class="text-xs sm:text-sm sm:text-right">
          <div class="font-semibold text-slate-800 text-base sm:text-lg">HÓA ĐƠN ĐẶT HÀNG</div>
          <div class="mt-2 space-y-1 text-slate-600">
            <div>Mã hóa đơn: <span class="font-mono text-slate-900 break-all">{{ invoiceNo }}</span></div>
            <div>Ngày tạo: {{ createdAt }}</div>
          </div>
        </div>
      </div>

      <div class="mb-4 sm:mb-6 text-xs sm:text-sm">
        <div class="grid sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <div class="text-slate-500">Khách hàng</div>
            <div class="font-medium">Khách lẻ (Không cần tài khoản)</div>
            <div class="text-slate-500 mt-1 leading-5">Thanh toán & nhận hàng theo thỏa thuận với người bán.</div>
          </div>
          <div>
            <div class="text-slate-500">Hình thức</div>
            <div class="font-medium">Đặt hàng qua website</div>
            <div class="text-slate-500 mt-1 leading-5">Khách gửi ảnh hóa đơn này cho người bán để xác nhận.</div>
          </div>
        </div>
      </div>

      <!-- Desktop: bảng -->
      <div class="hidden md:block overflow-hidden rounded-xl border border-slate-200">
        <table class="w-full text-xs sm:text-sm">
          <thead class="bg-slate-100 text-slate-700">
            <tr>
              <th class="text-left px-3 sm:px-4 py-2 w-8 sm:w-10">#</th>
              <th class="text-left px-3 sm:px-4 py-2">Sản phẩm</th>
              <th class="text-right px-3 sm:px-4 py-2 w-20 sm:w-28">Đơn giá</th>
              <th class="text-center px-3 sm:px-4 py-2 w-16 sm:w-20">SL</th>
              <th class="text-right px-3 sm:px-4 py-2 w-24 sm:w-32">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(it, idx) in items" :key="it.id" class="border-t border-slate-200 align-top">
              <td class="px-3 sm:px-4 py-3 text-slate-500">{{ idx + 1 }}</td>
              <td class="px-3 sm:px-4 py-3">
                <div class="font-medium text-slate-900 break-words">{{ it.name }}</div>
                <div v-if="it.description" class="text-[11px] sm:text-xs text-slate-500 mt-0.5 break-words">
                  {{ it.description }}
                </div>
                <div v-if="it.category_name" class="text-[11px] sm:text-xs text-slate-400 mt-0.5">
                  Danh mục: {{ it.category_name }}
                </div>
              </td>
              <td class="px-3 sm:px-4 py-3 text-right tabular-nums">{{ formatVND(it.price) }}</td>
              <td class="px-3 sm:px-4 py-3 text-center tabular-nums">{{ it.quantity }}</td>
              <td class="px-3 sm:px-4 py-3 text-right font-medium tabular-nums">{{ formatVND(it.price * it.quantity) }}</td>
            </tr>
          </tbody>
          <tfoot class="bg-slate-50 border-t-2 border-slate-200">
            <tr>
              <td colspan="4" class="px-3 sm:px-4 py-3 text-right font-semibold">Tổng cộng</td>
              <td class="px-3 sm:px-4 py-3 text-right font-bold text-brand-600 text-base sm:text-lg tabular-nums">{{ formatVND(total) }}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <!-- Mobile: cards stacked -->
      <div class="md:hidden space-y-2.5">
        <div
          v-for="(it, idx) in items"
          :key="it.id"
          class="rounded-xl border border-slate-200 p-3 bg-white"
        >
          <div class="flex items-start justify-between gap-2 mb-1">
              <div class="flex items-center gap-2 min-w-0">
                <span class="inline-flex items-center justify-center rounded-full bg-slate-100 text-slate-600 text-[10px] w-5 h-5 shrink-0">{{ idx + 1 }}</span>
                <div class="min-w-0 flex-1">
                  <div class="font-medium text-slate-900 text-sm leading-5 break-words">{{ it.name }}</div>
                  <div v-if="it.description" class="text-[11px] text-slate-500 mt-0.5 break-words line-clamp-2">{{ it.description }}</div>
                </div>
              </div>
              <div class="text-brand-600 font-bold text-sm tabular-nums whitespace-nowrap">{{ formatVND(it.price * it.quantity) }}</div>
            </div>
          <div v-if="it.category_name" class="text-[11px] text-slate-400 mb-1.5">Danh mục: {{ it.category_name }}</div>
          <div class="flex items-center justify-between gap-2 text-xs text-slate-600 pt-1.5 border-t border-dashed border-slate-200">
            <div>
              <span class="text-slate-500">Đơn giá:</span>
              <span class="ml-1 tabular-nums text-slate-800 font-medium">{{ formatVND(it.price) }}</span>
            </div>
            <div>
              <span class="text-slate-500">SL:</span>
              <span class="ml-1 tabular-nums text-slate-800 font-semibold">×{{ it.quantity }}</span>
            </div>
          </div>
        </div>

        <div class="rounded-xl border-t-2 border-slate-200 bg-slate-50 p-3 mt-2">
          <div class="flex items-center justify-between gap-3">
            <div class="text-slate-700 font-semibold text-sm">Tổng cộng</div>
            <div class="text-right font-bold text-brand-600 text-lg tabular-nums">{{ formatVND(total) }}</div>
          </div>
        </div>
      </div>


    </div>

    <div v-if="downloadError" class="mt-3 sm:mt-4 card p-4 bg-rose-50 border-rose-200 text-rose-700 text-xs sm:text-sm whitespace-pre-wrap leading-5">
      {{ downloadError }}
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCartStore } from '../stores/cart'
import { formatVND, invoiceId, todayStr } from '../utils/format'
import html2canvas from 'html2canvas'

const cart = useCartStore()
cart._ensureInit()

const isEmpty = computed(() => cart.isEmpty)
const items = computed(() => cart.items)
const total = computed(() => cart.total)

const invoiceNo = ref(invoiceId())
const createdAt = ref(todayStr())

const rendering = ref(false)
const downloadError = ref('')

function triggerDownload(blob, filename) {
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(link.href), 1000)
}

async function downloadImage() {
  const node = document.getElementById('invoice-root')
  if (!node) return
  const clone = node.cloneNode(true)
  clone.style.position = 'fixed'
  clone.style.left = '-999999px'
  clone.style.top = '0'
  clone.style.width = '900px'
  clone.style.maxWidth = '900px'
  clone.style.boxShadow = 'none'
  clone.style.borderRadius = '0'
  clone.style.margin = '0'
  const mobileList = clone.querySelector('.md\\:hidden')
  if (mobileList) mobileList.style.display = 'none'
  const desktopTable = clone.querySelector('.hidden.md\\:block')
  if (desktopTable) {
    desktopTable.style.display = 'block'
    desktopTable.classList.remove('hidden')
  }
  document.body.appendChild(clone)
  try {
    rendering.value = true
    downloadError.value = ''
    const canvas = await html2canvas(clone, {
      backgroundColor: '#ffffff',
      scale: Math.min(2, window.devicePixelRatio || 2),
      useCORS: true,
      allowTaint: true,
      logging: false,
    })
    const blob = await new Promise((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error('Không tạo được ảnh'))),
        'image/png',
      )
    })
    triggerDownload(blob, `${invoiceNo.value}.png`)
  } catch (e) {
    downloadError.value = 'Lỗi xuất ảnh hóa đơn: ' + String(e?.message || e) + '. Bạn có thể dùng In / Lưu PDF thay thế.'
  } finally {
    if (clone.parentNode) clone.parentNode.removeChild(clone)
    rendering.value = false
  }
}
</script>

<style>
@media print {
  body * {
    visibility: hidden;
  }
  #invoice-root,
  #invoice-root * {
    visibility: visible;
  }
  #invoice-root {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    border: none !important;
    box-shadow: none !important;
  }
}
</style>
