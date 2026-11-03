<template>
  <div class="card p-3 sm:p-4 flex items-stretch gap-3 sm:gap-4">
    <div class="w-16 h-16 sm:w-20 sm:h-20 sm:mb-0 sm:mb-0 md:w-24 md:h-24 rounded-xl bg-slate-100 overflow-hidden shrink-0">
      <img
        v-if="item.image_url"
        :src="item.image_url"
        :alt="item.name"
        class="w-full h-full object-cover"
      />
    </div>
    <div class="flex-1 min-w-0 flex flex-col">
      <div class="flex justify-between gap-2 sm:gap-3 items-start">
        <div class="min-w-0">
          <div class="text-[11px] sm:text-xs text-slate-500">{{ item.category_name }}</div>
          <div class="font-semibold text-sm sm:text-base text-slate-800 break-words">{{ item.name }}</div>
          <div v-if="item.description" class="text-[11px] sm:text-xs text-slate-500 mt-0.5 line-clamp-2 break-words">{{ item.description }}</div>
        </div>
        <button class="text-slate-400 hover:text-rose-500 text-xs self-start shrink-0 whitespace-nowrap" @click="$emit('remove', item.id)">
          Xóa
        </button>
      </div>

      <div class="mt-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 pt-2 sm:pt-3">
        <div class="flex items-center gap-2 justify-start sm:justify-start w-full sm:w-auto">
          <button
            class="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold shrink-0"
            @click="change(-1)"
          >-</button>
          <input
            type="number"
            min="1"
            :value="item.quantity"
            @input="onQty($event.target.value)"
            class="w-12 sm:w-16 text-center border border-slate-200 rounded-md py-1 text-xs sm:text-sm"
          />
          <button
            class="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold shrink-0"
            @click="change(1)"
          >+</button>
        </div>
        <div class="text-right w-full sm:w-auto">
          <div class="text-[11px] sm:text-xs text-slate-500">{{ formatVND(item.price) }} / sp</div>
          <div class="text-brand-600 font-bold text-sm sm:text-base">{{ formatVND(item.price * item.quantity) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { formatVND } from '../utils/format'
import { useCartStore } from '../stores/cart'

const props = defineProps({
  item: { type: Object, required: true },
})
defineEmits(['remove'])

const cart = useCartStore()

function change(delta) {
  cart.setQuantity(props.item.id, Number(props.item.quantity || 0) + delta)
}
function onQty(v) {
  cart.setQuantity(props.item.id, Math.floor(Number(v) || 0))
}
</script>
