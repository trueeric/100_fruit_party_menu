<template>
  <v-container>
    <!-- 載入指示器 -->
    <div v-if="loading" class="text-center my-8">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      <div class="mt-4">載入中...</div>
    </div>

    <!-- 錯誤提示 -->
    <div v-else-if="error" class="text-center my-8">
      <v-alert type="error" title="1818載入失敗" :text="error"></v-alert>
      <v-btn color="primary" class="mt-4" @click="fetchData">重試</v-btn>
    </div>

    <!-- 主要內容 -->
    <template v-else-if="isDataLoaded">
      <v-row>
        <!-- 左側菜單 -->
        <v-col cols="12" md="8">
          <!-- 餐廳標題 -->
          <v-card class="mb-6">
            <v-card-item class="text-center">
              <v-card-title class="text-h4 font-weight-bold">{{
                shopData?.shop_name || '水果PARTY 菜單'
              }}</v-card-title>
              <v-card-subtitle v-if="shopData?.title" class="mt-2">{{
                shopData.title
              }}</v-card-subtitle>
            </v-card-item>
          </v-card>

          <!-- 分類導航 -->
          <v-card class="mb-6">
            <v-card-text>
              <v-chip-group
                v-model="selectedCategory"
                selected-class="primary"
                class="overflow-x-auto py-2"
              >
                <v-chip filter variant="elevated" value="all" @click="setCategory('all')">
                  全部
                </v-chip>
                <v-chip
                  v-for="category in categories"
                  :key="category.id"
                  filter
                  variant="elevated"
                  :value="category.id"
                  @click="setCategory(category.id)"
                >
                  {{ category.c_name }}
                </v-chip>
              </v-chip-group>
            </v-card-text>
          </v-card>

          <!-- 菜單項目 -->
          <v-card v-if="filteredMenuItems.length > 0" class="mb-6">
            <v-list>
              <v-list-item
                v-for="item in filteredMenuItems"
                :key="item.id"
                :title="item.item_name"
                :subtitle="item.description"
              >
                <template v-slot:append>
                  <div class="d-flex align-center">
                    <div class="text-red-darken-1 font-weight-bold mr-4">${{ item.price }}</div>
                    <v-btn
                      color="success"
                      variant="text"
                      icon="mdi-plus"
                      @click="addToCart(item)"
                    ></v-btn>
                  </div>
                </template>
              </v-list-item>
            </v-list>
          </v-card>

          <v-card v-else class="mb-6 text-center pa-4">
            <v-card-text>
              <p>沒有找到菜單項目</p>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- 右側購物車 -->
        <v-col cols="12" md="4">
          <ShoppingCart />
        </v-col>
      </v-row>
    </template>

    <div v-else class="text-center my-8">
      <div class="mt-4">等待數據...</div>
    </div>

    <!-- 使用 AddOnsSection 組件 -->
    <AddOnsSection />

    <!-- 調試區域 -->
    <div v-if="showDebug" class="debug-panel">
      <h3>調試數據</h3>
      <v-btn @click="toggleDebug" size="small" color="grey">隱藏調試</v-btn>
      <pre>{{ JSON.stringify(debugData, null, 2) }}</pre>
    </div>
    <v-btn
      v-else
      @click="toggleDebug"
      color="grey"
      size="small"
      icon="mdi-bug"
      class="debug-toggle"
    ></v-btn>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useMenuStore } from '@/stores/menuStore'
import ShoppingCart from '@/components/ShoppingCart.vue'
import AddOnsSection from '@/components/AddOnsSection.vue'
// import { load } from 'webfontloader'

const menuStore = useMenuStore()
const showDebug = ref(false)
const selectedCategory = ref('all')

// 從 store 獲取數據
const shopData = computed(() => menuStore.shopData)
const categories = computed(() => menuStore.categories)
const loading = computed(() => menuStore.loading)
const error = computed(() => menuStore.error)

// test data loading
const isDataLoaded = computed(
  () =>
    shopData.value &&
    Object.keys(shopData.value).length > 0 &&
    categories.value &&
    categories.value.length > 0,
)

const filteredMenuItems = computed(() => {
  if (selectedCategory.value === 'all') {
    return menuStore.menuItems
  }
  return menuStore.menuItems.filter((item) => item.category_id === selectedCategory.value)
})

const debugData = computed(() => ({
  shopData: menuStore.shopData,
  categories: menuStore.categories,
  menuItems: menuStore.menuItems.slice(0, 3), // 只顯示前3個項目以避免過多數據
  addOns: menuStore.addOns,
  currentCategory: selectedCategory.value,
  cartItemCount: menuStore.cartItemCount,
}))

function toggleDebug() {
  showDebug.value = !showDebug.value
}

function setCategory(categoryId) {
  selectedCategory.value = categoryId
  menuStore.setCategory(categoryId)
}

function addToCart(item) {
  menuStore.openAddOnsModal(item.id)
}

// 獲取菜單數據
async function fetchData() {
  // await menuStore.fetchDataInParts()
  await menuStore.fetchAllData()
}

// 組件掛載時獲取數據
onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.debug-panel {
  position: fixed;
  bottom: 0;
  right: 0;
  max-width: 80%;
  max-height: 80%;
  overflow: auto;
  background: rgba(0, 0, 0, 0.8);
  color: #4caf50;
  padding: 10px;
  font-family: monospace;
  z-index: 9999;
  border-radius: 4px 0 0 0;
}

.debug-toggle {
  position: fixed;
  bottom: 10px;
  right: 10px;
  z-index: 9999;
}

pre {
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
