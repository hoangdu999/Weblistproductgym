import { defineStore } from 'pinia'

const STORAGE_KEY = 'gymshop_cart_v1'
const LEGACY_LOCAL_KEY = 'gymshop_cart_v1'

function storageLayer() {
  if (typeof window === 'undefined') return { getItem: () => null, setItem: () => {}, removeItem: () => {} }
  return window.sessionStorage
}

function loadFromStorage() {
  try {
    const raw = storageLayer().getItem(STORAGE_KEY)
    if (!raw) return { items: [] }
    const parsed = JSON.parse(raw)
    return {
      items: Array.isArray(parsed?.items) ? parsed.items : [],
    }
  } catch {
    return { items: [] }
  }
}

function migrateAndClearLegacy() {
  if (typeof window === 'undefined') return
  try {
    if (window.localStorage.getItem(LEGACY_LOCAL_KEY)) {
      window.localStorage.removeItem(LEGACY_LOCAL_KEY)
    }
  } catch {}
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
    _init: false,
  }),

  getters: {
    count(state) {
      return state.items.reduce((sum, it) => sum + (Number(it.quantity) || 0), 0)
    },
    total(state) {
      return state.items.reduce(
        (sum, it) => sum + (Number(it.price) || 0) * (Number(it.quantity) || 0),
        0,
      )
    },
    isEmpty(state) {
      return state.items.length === 0
    },
  },

  actions: {
    _ensureInit() {
      if (this._init) return
      migrateAndClearLegacy()
      this._init = true
      this.reloadFromStorage()
      if (typeof window !== 'undefined') {
        try {
          window.addEventListener('storage', (e) => {
            if (e.key === STORAGE_KEY || e.key === null) {
              this.reloadFromStorage()
            }
          })
        } catch {}
      }
    },

    reloadFromStorage() {
      const next = loadFromStorage()
      this.items.splice(0, this.items.length, ...next.items)
    },

    _persist() {
      try {
        storageLayer().setItem(
          STORAGE_KEY,
          JSON.stringify({ items: this.items }),
        )
      } catch {}
    },

    addProduct(product, quantity = 1) {
      this._ensureInit()
      this.reloadFromStorage()
      if (!product?.id) return
      const existing = this.items.find((it) => it.id === product.id)
      if (existing) {
        existing.quantity = Math.max(1, Number(existing.quantity) + Number(quantity || 1))
      } else {
        this.items.push({
          id: product.id,
          name: product.name,
          description: product.description || '',
          price: Number(product.price) || 0,
          image_url: product.image_url || null,
          category_name: product.category_name || '',
          quantity: Math.max(1, Number(quantity) || 1),
        })
      }
      this._persist()
    },

    setQuantity(productId, quantity) {
      this._ensureInit()
      this.reloadFromStorage()
      const q = Math.max(0, Math.floor(Number(quantity) || 0))
      const it = this.items.find((x) => x.id === productId)
      if (!it) return
      if (q === 0) {
        this.removeProduct(productId)
        return
      }
      it.quantity = q
      this._persist()
    },

    removeProduct(productId) {
      this._ensureInit()
      this.reloadFromStorage()
      const idx = this.items.findIndex((it) => it.id === productId)
      if (idx >= 0) this.items.splice(idx, 1)
      this._persist()
    },

    clear() {
      this._ensureInit()
      this.items.splice(0, this.items.length)
      this._persist()
    },
  },
})
