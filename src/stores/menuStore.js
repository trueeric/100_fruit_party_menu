import { defineStore } from 'pinia'
// import { fetchMenuData } from '@/services/menuService'
import { fetchDataInParts } from '@/services/menuService'

export const useMenuStore = defineStore('menu', {
  state: () => ({
    shopData: {},
    categories: [],
    menuItems: [],
    addOns: [],
    cart: [],
    currentCategory: 'all',
    loading: false,
    error: null,
    showAddOnsModal: false,
    selectedItemId: null,
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
  },

  actions: {
    async fetchDataInParts() {
      this.loading = true
      this.error = null

      try {
        const data = await fetchDataInParts()
        this.shopData = data.shopData || {}
        this.categories = data.categories || []
        this.menuItems = data.menuItems || []
        this.addOns = data.addOns || []
      } catch (error) {
        console.error('獲取菜單數據失敗_useStoreError:', error)
        this.error = error.message || '獲取菜單數據失敗_useStoreError'
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
