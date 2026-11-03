import { createRouter, createWebHistory } from 'vue-router'
import { installAuthGuards } from './guards'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
    meta: { title: 'Sản phẩm' },
  },
  {
    path: '/cart',
    name: 'cart',
    component: () => import('../views/CartView.vue'),
    meta: { title: 'Giỏ hàng' },
  },
  {
    path: '/invoice',
    name: 'invoice',
    component: () => import('../views/InvoiceView.vue'),
    meta: { title: 'Hóa đơn' },
  },
  {
    path: '/admin/login',
    name: 'admin-login',
    component: () => import('../views/admin/AdminLoginView.vue'),
    meta: { title: 'Admin - Đăng nhập' },
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('../views/admin/AdminDashboardView.vue'),
    meta: { title: 'Admin - Quản lý', requiresAuth: true },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach(async (to) => {
  if (to.meta?.title) {
    document.title = `${to.meta.title} | 榛名ショップ`
  }
})

installAuthGuards(router)

export default router
