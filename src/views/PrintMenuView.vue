<template>
  <div class="print-container">
    <div id="loading" class="loading" v-if="loading">
      <div>載入中...</div>
    </div>

    <div id="menu-content" v-if="!loading">
      <div class="menu-container">
        <div class="header">
          <h1 id="shop-name">🍧 {{ shopName }} 🍦</h1>
          <div class="table-number">桌號: ____</div>
        </div>

        <div id="categories-container">
          <!-- 分類和菜單項目 -->
          <div v-for="(category, index) in categories" :key="category.id" class="menu-section">
            <div :class="['section-title', getCategoryClass(index)]">
              {{ category.c_name || category.name }}
            </div>

            <div class="section-content">
              <!-- 左欄 -->
              <div class="section-column">
                <div class="column-header">
                  <div>品項</div>
                  <div class="price-header">價格</div>
                  <div class="quantity-header">數量</div>
                </div>

                <div
                  v-for="item in getCategoryLeftItems(category.id)"
                  :key="item.id"
                  :class="['menu-item', getItemClass(index)]"
                >
                  <div class="item-name">
                    {{ item.item_name }}
                    <span v-if="isHotItem(item)" class="hot-tag">熱門</span>
                    <span v-if="isNewItem(item)" class="hot-tag">新品</span>
                  </div>
                  <div class="item-price">${{ item.price }}</div>
                  <div class="item-quantity">____</div>
                </div>
              </div>

              <!-- 右欄 -->
              <div class="section-column">
                <div class="column-header">
                  <div>品項</div>
                  <div class="price-header">價格</div>
                  <div class="quantity-header">數量</div>
                </div>

                <div
                  v-for="item in getCategoryRightItems(category.id)"
                  :key="item.id"
                  :class="['menu-item', getItemClass(index)]"
                >
                  <div class="item-name">
                    {{ item.item_name }}
                    <span v-if="isHotItem(item)" class="hot-tag">熱門</span>
                    <span v-if="isNewItem(item)" class="hot-tag">新品</span>
                  </div>
                  <div class="item-price">${{ item.price }}</div>
                  <div class="item-quantity">____</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 加購選項 -->
        <div class="notes">
          <h3>加點選項</h3>
          <div class="add-on-container">
            <div v-for="addon in addOns" :key="addon.id" class="add-on-item">
              <input type="checkbox" />
              <label
                >{{ addon.name }} <span style="color: #e63946">+${{ addon.price }}</span></label
              >
            </div>
          </div>

          <h3>特殊需求</h3>
          <p>• 甜度調整：正常 / 少糖 / 半糖 / 微糖 / 無糖</p>
          <p>• 冰塊：正常冰 / 少冰 / 去冰 / 溫熱</p>
          <textarea placeholder="其他備註事項..."></textarea>
        </div>

        <div class="footer">
          <p id="shop-hours">{{ hoursText }}</p>
          <p id="shop-address">地址：{{ shopAddress }}</p>
        </div>
      </div>

      <!-- 只在非打印模式下顯示 -->
      <div class="no-print" style="text-align: center; margin: 20px">
        <button @click="printMenu" class="print-button">打印菜單</button>
        <button @click="goBack" class="back-button">返回</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useMenuStore } from '@/stores/menuStore'

// 初始化 store
const menuStore = useMenuStore()

// 本地狀態
const loading = ref(true)
const error = ref(null)
const dataSource = ref('store') // 標記數據來源: 'store', 'localStorage', 'service'

// 從 store 獲取數據的計算屬性
const categories = computed(() => menuStore.categories)
const menuItems = computed(() => menuStore.menuItems)
const addOns = computed(() => menuStore.addOns)

// 店鋪信息
const shopName = computed(() => menuStore.shopData.shop_name || '水果PARTY')
const shopAddress = computed(() => menuStore.shopData.address || '台北市信義區水果街123號')
const hoursText = computed(() => {
  const hours = menuStore.shopData.hours || '10:00-22:00'
  const phone = menuStore.shopData.phone || '(02)1234-5678'
  return `營業時間：${hours} | 電話：${phone}`
})

// 獲取分類左側項目
const getCategoryLeftItems = (categoryId) => {
  const items = menuItems.value.filter((item) => item.category_id === categoryId)
  const halfLength = Math.ceil(items.length / 2)
  return items.slice(0, halfLength)
}

// 獲取分類右側項目
const getCategoryRightItems = (categoryId) => {
  const items = menuItems.value.filter((item) => item.category_id === categoryId)
  const halfLength = Math.ceil(items.length / 2)
  return items.slice(halfLength)
}

// 獲取分類樣式
const getCategoryClass = (index) => {
  const classes = ['traditional', 'fresh-fruit', 'new-items']
  return classes[index % classes.length]
}
// 檢查是否為熱門項目
const isHotItem = (item) => {
  return item.tags && item.tags.includes('熱門')
}

// 檢查是否為新品
const isNewItem = (item) => {
  return item.tags && item.tags.includes('新品')
}

// 打印菜單
const printMenu = () => {
  window.print()
}

// 返回
const goBack = () => {
  window.history.back()
}

// 從 localStorage 獲取數據
const fetchFromLocalStorage = () => {
  try {
    console.log('嘗試從 localStorage 獲取數據')
    const storedData = localStorage.getItem('menuData')

    if (storedData) {
      const parsedData = JSON.parse(storedData)
      console.log('成功從 localStorage 解析數據')

      // 更新 store 數據
      menuStore.shopData = parsedData.shopData || {}
      menuStore.categories = parsedData.categories || []
      menuStore.menuItems = parsedData.menuItems || []
      menuStore.addOns = parsedData.addOns || []
      menuStore.lastFetchTime = Date.now()

      dataSource.value = 'localStorage'
      return true
    } else {
      console.warn('localStorage 中沒有找到 menuData')
      return false
    }
  } catch (err) {
    console.error('解析 localStorage 數據時出錯:', err)
    return false
  }
}

// 檢查 store 中是否已有數據
const hasStoreData = () => {
  return menuStore.categories.length > 0 && menuStore.menuItems.length > 0
}

// 初始化數據
const initData = async () => {
  loading.value = true
  error.value = null

  try {
    // 策略 1: 先檢查 store 中是否已有數據
    if (hasStoreData()) {
      console.log('使用 store 中的現有數據')
      dataSource.value = 'store'
    }
    // 策略 2: 如果 store 中沒有數據，嘗試從 localStorage 獲取
    else if (fetchFromLocalStorage()) {
      console.log('從 localStorage 獲取數據成功')
    }
    // 策略 3: 如果前兩種方法都失敗，從服務獲取新數據
    else {
      console.log('從服務獲取新數據')
      await menuStore.fetchAllData()
      dataSource.value = 'service'
    }
  } catch (err) {
    console.error('初始化數據時出錯:', err)
    error.value = '載入菜單數據失敗，請重試'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  initData()
})
</script>

<style scoped>
@page {
  size: A4;
  margin: 12mm;
}

.print-container {
  font-family: 'Noto Sans TC', Arial, sans-serif;
  background: #f8f4e8;
  margin: 0;
  padding: 0;
  color: #333;
  font-size: 13px;
  line-height: 1.4;
}

.menu-container {
  max-width: 210mm;
  margin: 0 auto;
  background: white;
  border-radius: 10px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  padding: 18px;
  min-height: 297mm;
  box-sizing: border-box;
}

.header {
  text-align: center;
  margin-bottom: 20px;
  border-bottom: 2px dashed #ffb6c1;
  padding-bottom: 12px;
}

h1 {
  color: #ff6b6b;
  font-size: 2.2em;
  margin: 0;
}

.table-number {
  font-size: 1.2em;
  color: #666;
  margin-top: 10px;
}

.menu-section {
  margin-bottom: 25px;
  page-break-inside: avoid;
}

.section-title {
  background: #ff6b6b;
  color: white;
  padding: 8px 15px;
  border-radius: 18px;
  display: inline-block;
  margin-bottom: 15px;
  font-size: 1.2em;
  font-weight: bold;
}

.traditional {
  background: #4ecdc4;
}

.fresh-fruit {
  background: #ff9f1c;
}

.new-items {
  background: #9c27b0;
}

/* 每個系列分為左右兩欄 */
.section-content {
  display: flex;
  gap: 18px;
}

.section-column {
  flex: 1;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 12px;
  background: #fafafa;
}

.column-header {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 10px;
  font-weight: bold;
  margin-bottom: 10px;
  padding: 0 10px;
  color: #495057;
  font-size: 1em;
  border-bottom: 1px solid #ddd;
  padding-bottom: 6px;
}

.column-header .price-header {
  text-align: right;
  min-width: 45px;
}

.column-header .quantity-header {
  text-align: center;
  width: 40px;
}

.menu-item {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 10px;
  align-items: center;
  padding: 8px 10px;
  border-radius: 6px;
  transition: all 0.2s;
  position: relative;
  margin-bottom: 4px;
}

.menu-item:hover {
  background: #f0f0f0;
}

.traditional-item {
  border-left: 3px solid #4ecdc4;
}

.fresh-fruit-item {
  border-left: 3px solid #ff9f1c;
}

.new-item {
  border-left: 3px solid #9c27b0;
}

.item-name {
  font-weight: 500;
  position: relative;
  font-size: 1em;
  display: flex;
  align-items: center;
  gap: 6px;
}

.item-price {
  color: #e63946;
  font-weight: bold;
  text-align: right;
  min-width: 45px;
  font-size: 1em;
}

.item-quantity {
  width: 40px;
  text-align: center;
  font-size: 0.9em;
}

.hot-tag {
  background: #e63946;
  color: white;
  font-size: 0.7em;
  padding: 2px 6px;
  border-radius: 10px;
  font-weight: bold;
  white-space: nowrap;
}

.notes {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  margin-top: 18px;
  border-left: 3px solid #6c757d;
  font-size: 0.95em;
}

.notes h3 {
  margin-top: 0;
  margin-bottom: 10px;
  color: #495057;
  font-size: 1.1em;
}

.add-on-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 12px;
}

.add-on-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.9em;
}

.add-on-item input {
  margin: 0;
  transform: scale(1.2);
}

.notes textarea {
  width: 100%;
  height: 45px;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 8px;
  margin-top: 6px;
  font-size: 0.9em;
  resize: vertical;
}

.notes p {
  margin: 5px 0;
  font-size: 0.9em;
}

.footer {
  text-align: center;
  margin-top: 25px;
  color: #6c757d;
  font-size: 0.85em;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.print-button {
  padding: 10px 20px;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-right: 10px;
}

.back-button {
  padding: 10px 20px;
  background: #607d8b;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

@media print {
  .print-container {
    background: white;
    font-size: 12px;
  }

  .menu-container {
    box-shadow: none;
    border-radius: 0;
    padding: 12px;
    margin: 0;
    max-width: 100%;
  }

  .menu-item:hover {
    background: transparent;
  }

  .no-print {
    display: none;
  }
}
</style>
