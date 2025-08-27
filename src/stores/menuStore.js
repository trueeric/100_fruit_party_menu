import { defineStore } from 'pinia'
import { MenuService } from '@/services/menuService.js'

export const useMenuStore = defineStore('menu', {
  state: () => ({
    shopData: {},
    categories: [],
    menuItems: [],
    addOns: [],

    // UI 狀態
    cart: [],
    currentCategory: 'all',
    loading: false,
    error: null,

    // Modal 狀態
    showAddOnsModal: false,
    selectedItemId: null,

    // 快取狀態
    lastFetchTime: null,
    cacheTimeout: 5 * 60 * 1000, // 5分鐘
  }),

  getters: {
    filteredMenuItems: (state) => {
      if (state.currentCategory === 'all') {
        return state.menuItems
      }
      return state.menuItems.filter((item) => item.category_id === state.currentCategory)
    },

    cartTotal: (state) => {
      return state.cart.reduce((total, item) => total + item.total, 0)
    },

    cartItemCount: (state) => {
      return state.cart.length
    },

    // 只返回有效分類
    activeCategories: (state) => {
      return state.categories.filter(
        (category) => category.is_active === 'TRUE' || category.is_active === true,
      )
    },

    // 只返回有效菜單項目
    activeMenuItems: (state) => {
      return state.menuItems.filter((item) => item.is_active === 'TRUE' || item.is_active === true)
    },

    // 只返回有效加購選項
    activeAddOns: (state) => {
      return state.addOns.filter((addon) => addon.is_active === 'TRUE' || addon.is_active === true)
    },

    // 新增：根據活躍分類過濾的菜單項目
    filteredActiveMenuItems: (state, getters) => {
      if (state.currentCategory === 'all') {
        return getters.activeMenuItems
      }
      return getters.activeMenuItems.filter((item) => item.category_id === state.currentCategory)
    },

    // 添加一個 getter 來檢查是否有數據
    hasData: (state) => {
      return state.categories.length > 0 && state.menuItems.length > 0
    },

    // 添加一個 getter 來檢查是否需要刷新
    needsRefresh: (state) => {
      if (!state.lastFetchTime) return true
      const now = Date.now()
      return now - state.lastFetchTime > state.cacheTimeout
    },
  },

  actions: {
    async fetchAllData(forceRefresh = false) {
      // 如果有資料且不需要強制刷新，且未過期，直接返回
      if (!forceRefresh && this.hasData && !this.needsRefresh) {
        console.log('使用快取資料')
        return
      }
      this.loading = true
      this.error = null

      try {
        const data = await MenuService.getMenuData()
        this.shopData = data.shopData || {}
        this.categories = data.categories || []
        this.menuItems = data.menuItems || []
        this.addOns = data.addOns || []
        this.lastFetchTime = Date.now()

        console.log('菜單資料獲取成功')
      } catch (error) {
        console.error('獲取菜單數據失敗:', error)
        this.error = error.message || '獲取菜單數據失敗'
        // 如果沒有任何資料，使用 mock 資料
        if (!this.hasData) {
          const mockData = MenuService.getMockData()
          this.shopData = mockData.shopData
          this.categories = mockData.categories
          this.menuItems = mockData.menuItems
          this.addOns = mockData.addOns
        }
      } finally {
        this.loading = false
      }
    },

    setCategory(categoryId) {
      this.currentCategory = categoryId
    },

    openAddOnsModal(itemId) {
      this.selectedItemId = itemId
      this.showAddOnsModal = true
    },

    closeAddOnsModal() {
      this.showAddOnsModal = false
      this.selectedItemId = null
    },

    addToCart(selectedAddOns = []) {
      if (!this.selectedItemId) return

      const menuItem = this.menuItems.find((item) => item.id === this.selectedItemId)
      if (!menuItem) return

      const cartItem = {
        id: Date.now(),
        item: menuItem,
        addOns: selectedAddOns,
        total: this.calculateItemTotal(menuItem, selectedAddOns),
      }

      this.cart.push(cartItem)
      this.closeAddOnsModal()
    },

    calculateItemTotal(item, addOns) {
      let total = parseFloat(item.price)
      addOns.forEach((addon) => {
        total += parseFloat(addon.price)
      })
      return total
    },

    removeCartItem(cartItemId) {
      const index = this.cart.findIndex((item) => item.id === cartItemId)
      if (index !== -1) {
        this.cart.splice(index, 1)
      }
    },

    clearCart() {
      this.cart = []
    },
  },
})
