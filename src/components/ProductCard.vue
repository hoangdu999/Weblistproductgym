<template>
  <div class="card overflow-hidden flex flex-col h-full">
    <div class="aspect-square bg-slate-100 overflow-hidden relative">
      <img
        v-if="product.image_url"
        :src="product.image_url"
        :alt="product.name"
        class="w-full h-full object-cover"
        loading="lazy"
      />
      <div v-else class="w-full h-full flex items-center justify-center text-slate-400 text-[10px] sm:text-xs">
        Không có ảnh
      </div>
      <span v-if="product.category_name" class="absolute top-1 left-1 sm:top-2 sm:left-2 chip bg-white/90 shadow !px-1.5 !py-0.5 !text-[10px] sm:text-xs">
        {{ product.category_name }}
      </span>
    </div>

    <div class="p-2 sm:p-3 md:p-4 flex flex-col gap-1 sm:gap-1.5 md:gap-2 flex-1">
      <h3 class="text-xs sm:text-sm md:text-base font-semibold text-slate-800 line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem] md:min-h-[3rem] leading-snug">
        {{ product.name }}
      </h3>
      <p v-if="product.description" class="text-[10px] sm:text-[11px] md:text-xs text-slate-500 line-clamp-2">
        {{ product.description }}
      </p>

      <div class="mt-auto">
        <div class="text-brand-600 font-bold text-sm sm:text-base md:text-lg tabular-nums mb-1.5 sm:mb-2">
          {{ formatVND(product.price) }}
        </div>
        <div class="flex items-center justify-between gap-1 sm:gap-2">
          <div class="flex items-center gap-1 shrink-0">
            <button
              type="button"
              class="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm"
              @click="dec"
            >-</button>
            <input
              :value="qty"
              @input="onInput($event.target.value)"
              min="1"
              type="number"
              class="w-8 sm:w-10 md:w-14 text-center border border-slate-200 rounded-md py-0.5 sm:py-1 text-[11px] sm:text-xs md:text-sm"
            />
            <button
              type="button"
              class="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm"
              @click="inc"
            >+</button>
          </div>
        </div>
      </div>

      <button class="btn-primary w-full mt-1.5 sm:mt-2 !py-1 sm:!py-1.5 md:!py-2 text-[11px] sm:text-xs md:text-sm" @click="handleAdd">
        Thêm vào giỏ
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { formatVND } from '../utils/format'
import { useCartStore } from '../stores/cart'

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
})

const cart = useCartStore()
const qty = ref(1)

function inc() {
  qty.value = Math.max(1, Number(qty.value || 0) + 1)
}
function dec() {
  qty.value = Math.max(1, Number(qty.value || 0) - 1)
}
function onInput(v) {
  const n = Math.max(1, Math.floor(Number(v) || 1))
  qty.value = n
}
function handleAdd() {
  cart.addProduct(props.product, qty.value)
  qty.value = 1
}
</script>
