<template>
  <v-container>
    <div v-if="loading" class="text-center my-8">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      <div class="mt-4">載入中...</div>
    </div>

    <div v-else-if="error" class="text-center my-8">
      <v-alert type="error" title="載入失敗" :text="error"></v-alert>
      <v-btn color="primary" class="mt-4" @click="fetchData">重試</v-btn>
    </div>

    <template v-else>
      <MenuHeader :shopData="shopData" />

      <CategoryNav :categories="categories" />

      <div class="menu-items-container">
        <MenuItem
          v-for="item in filteredMenuItems"
          :key="item.id"
          :item="item"
          :currentCategory="currentCategory"
        />
      </div>

      <AddOnsSection :addOns="addOns" />

      <ShoppingCart />
    </template>
  </v-container>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useMenuStore } from '@/stores/menuStore'
import MenuHeader from '@/components/MenuHeader.vue'
import CategoryNav from '@/components/CategoryNav.vue'
import MenuItem from '@/components/MenuItem.vue'
import AddOnsSection from '@/components/AddOnsSection.vue'
import ShoppingCart from '@/components/ShoppingCart.vue'

const menuStore = useMenuStore()

// 從 store 獲取數據
const shopData = computed(() => menuStore.shopData)
const categories = computed(() => menuStore.categories)
const addOns = computed(() => menuStore.addOns)
const filteredMenuItems = computed(() => menuStore.filteredMenuItems)
const currentCategory = computed(() => menuStore.currentCategory)
const loading = computed(() => menuStore.loading)
const error = computed(() => menuStore.error)

// 獲取菜單數據
async function fetchData() {
  await menuStore.fetchMenuData()
}

// 組件掛載時獲取數據
onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.menu-items-container {
  margin-bottom: 80px; /* 為固定在底部的購物車留出空間 */
}
</style>
