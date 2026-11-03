<template>
  <section class="max-w-5xl mx-auto px-3 sm:px-4 py-5 sm:py-8">
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-4 sm:mb-6">
      <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900">Giỏ hàng</h1>
      <router-link to="/" class="text-xs sm:text-sm text-brand-600 hover:underline">← Tiếp tục mua sắm</router-link>
    </div>

    <div v-if="isEmpty" class="card p-8 sm:p-10 text-center">
      <div class="text-4xl sm:text-5xl mb-3">🛒</div>
      <div class="text-base sm:text-lg font-semibold text-slate-800">Chưa có sản phẩm nào</div>
      <p class="text-xs sm:text-sm text-slate-500 mt-1 mb-4">Hãy quay lại cửa hàng để chọn sản phẩm nhé.</p>
      <router-link to="/" class="btn-primary">Mua sắm ngay</router-link>
    </div>

    <div v-else class="flex flex-col lg:grid lg:grid-cols-3 gap-4 sm:gap-6 w-full">
      <div class="order-2 lg:order-1 lg:col-span-2 space-y-2.5 sm:space-y-3 w-full">
        <CartItem v-for="it in items" :key="it.id" :item="it" @remove="remove" />
      </div>

      <div class="order-1 lg:order-2 w-full lg:sticky lg:top-24 z-20">
        <div class="w-full bg-white sm:rounded-2xl lg:border lg:border-slate-200 lg:shadow-sm border border-slate-200 rounded-2xl px-4 sm:px-5 py-4 sm:py-5 h-full lg:h-fit">
          <h2 class="font-semibold text-base sm:text-lg mb-3 sm:mb-4">Tóm tắt đơn hàng</h2>
          <div class="space-y-2 text-xs sm:text-sm">
            <div class="flex justify-between items-center">
              <span class="text-slate-600">Số sản phẩm</span>
              <span class="font-medium">{{ count }} sản phẩm</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-slate-600">Thành tiền</span>
              <span class="font-medium">{{ formatVND(total) }}</span>
            </div>
            <div class="flex justify-between items-center text-brand-600 font-bold text-sm sm:text-base pt-2 border-t border-slate-200">
              <span>Tổng tiền</span>
              <span>{{ formatVND(total) }}</span>
            </div>
          </div>
          <div class="flex flex-col gap-2 mt-4 sm:mt-5">
            <router-link to="/invoice" class="btn-primary w-full !py-2.5 text-sm sm:text-base text-center">Xem / Xuất hóa đơn</router-link>
            <button class="btn-secondary w-full !py-2.5" @click="clearAll">Xóa hết giỏ hàng</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, onBeforeUnmount, computed } from 'vue'
import { useCartStore } from '../stores/cart'
import CartItem from '../components/CartItem.vue'
import { formatVND } from '../utils/format'

const cart = useCartStore()
cart._ensureInit()

const items = computed(() => cart.items)
const count = computed(() => cart.count)
const total = computed(() => cart.total)
const isEmpty = computed(() => cart.isEmpty)

function resync() {
  cart.reloadFromStorage()
}

let storageHandler = null

onMounted(() => {
  resync()
  if (typeof window !== 'undefined') {
    storageHandler = (e) => {
      if (e.key === 'gymshop_cart_v1' || e.key === null) resync()
    }
    window.addEventListener('storage', storageHandler)
  }
})

onBeforeUnmount(() => {
  if (storageHandler && typeof window !== 'undefined') {
    window.removeEventListener('storage', storageHandler)
    storageHandler = null
  }
})

function remove(id) {
  cart.removeProduct(id)
}
function clearAll() {
  if (confirm('Xóa tất cả sản phẩm trong giỏ hàng?')) {
    cart.clear()
  }
}
</script>
