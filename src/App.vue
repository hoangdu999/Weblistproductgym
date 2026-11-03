<template>
  <div class="min-h-screen flex flex-col">
    <header class="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-slate-200">
      <div class="max-w-6xl mx-auto px-3 sm:px-4 py-2 sm:py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
        <router-link to="/" class="flex items-center gap-2 font-bold text-base sm:text-lg text-brand-600">
          <span class="inline-block w-7 h-7 rounded-lg bg-brand-500 text-white flex items-center justify-center text-sm">💪</span>
          榛名ショップ
        </router-link>

        <nav class="flex flex-nowrap overflow-x-auto no-scrollbar items-center justify-start sm:justify-end gap-1 sm:gap-3 text-xs sm:text-sm shrink-0 w-full sm:w-auto">
          <router-link to="/" class="hover:text-brand-600 px-2 py-1 shrink-0 whitespace-nowrap">Cửa hàng</router-link>
          <router-link to="/cart" class="relative hover:text-brand-600 px-2 py-1 font-medium shrink-0 whitespace-nowrap">
            <span>Giỏ hàng</span>
            <span
              v-if="count > 0"
              class="ml-1 inline-flex items-center justify-center rounded-full bg-brand-500 text-white text-[10px] w-4 h-4 sm:text-xs sm:w-5 sm:h-5 align-middle"
            >{{ count > 99 ? '99+' : count }}</span>
          </router-link>
          <router-link to="/admin/login" class="text-slate-500 hover:text-brand-600 text-xs px-2 py-1 shrink-0 whitespace-nowrap ml-auto sm:ml-0">Admin</router-link>
        </nav>
      </div>
    </header>

    <main class="flex-1 w-full">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <footer class="border-t border-slate-200 bg-white">
      <div class="max-w-6xl mx-auto px-4 py-6 text-sm text-slate-500 flex flex-col sm:flex-row justify-between gap-2">
        <div>© {{ new Date().getFullYear() }} GymShop - Gửi link đặt hàng trực tiếp cho khách</div>
        <div>Cần hỗ trợ? Liên hệ người bán qua Facebook / SĐT hiện có</div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCartStore } from './stores/cart'

const cart = useCartStore()
cart._ensureInit()

const count = computed(() => cart.count)
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 150ms ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
