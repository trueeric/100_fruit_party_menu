import { createRouter, createWebHashHistory } from 'vue-router'
import MenuView from '@/views/MenuView.vue'
import PrintMenuView from '@/views/PrintMenuView.vue'

// 在現有路由配置中添加以下路由
const routes = [
  {
    path: '/',
    name: 'Menu',
    component: MenuView,
  },
  {
    path: '/print-menu',
    name: 'PrintMenu',
    component: PrintMenuView,
  },
]

// 創建路由實例
const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

// 導出路由
export default router
