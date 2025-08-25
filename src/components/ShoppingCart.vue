<template>
  <div class="shopping-cart">
    <v-card elevation="4">
      <!-- 標題區域 -->
      <v-card-title class="d-flex justify-space-between align-center pa-4">
        <span class="text-h6">購物車 ({{ cartItemCount }})</span>
        <v-btn
          v-if="cartItemCount > 0"
          color="error"
          variant="text"
          size="small"
          @click="clearCart"
        >
          清空
        </v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <!-- 購物車項目列表 -->
      <div class="cart-items-container">
        <v-list v-if="cartItemCount > 0" class="pa-0">
          <v-list-item v-for="item in cart" :key="item.id" class="cart-item px-4 py-3">
            <template v-slot:prepend>
              <v-btn
                icon="mdi-delete"
                variant="text"
                color="error"
                density="compact"
                size="small"
                @click="removeItem(item.id)"
              ></v-btn>
            </template>

            <div class="flex-grow-1">
              <v-list-item-title class="text-subtitle-1 font-weight-medium mb-1">
                {{ item.item.item_name }}
              </v-list-item-title>

              <!-- 加購項目顯示 -->
              <v-list-item-subtitle v-if="item.addOns && item.addOns.length > 0">
                <div class="text-caption text-grey-darken-1">
                  加購:
                  <span v-for="(addon, index) in item.addOns" :key="addon.id">
                    {{ addon.name }} (${{ addon.price }}){{
                      index < item.addOns.length - 1 ? ', ' : ''
                    }}
                  </span>
                </div>
              </v-list-item-subtitle>

              <!-- 數量顯示（如果有的話） -->
              <div v-if="item.quantity" class="text-caption text-grey-darken-1 mt-1">
                數量: {{ item.quantity }}
              </div>
            </div>

            <template v-slot:append>
              <div class="text-right">
                <div class="text-h6 text-red-darken-1 font-weight-bold">${{ item.total }}</div>
              </div>
            </template>
          </v-list-item>
        </v-list>

        <!-- 空購物車狀態 -->
        <v-card-text v-else class="text-center py-8">
          <v-icon size="64" color="grey-lighten-2" class="mb-4">mdi-cart-outline</v-icon>
          <div class="text-grey-darken-1">購物車是空的</div>
          <div class="text-caption text-grey mt-1">快去選購美味的餐點吧！</div>
        </v-card-text>
      </div>

      <!-- 總計和結帳區域 -->
      <template v-if="cartItemCount > 0">
        <v-divider></v-divider>

        <v-card-actions class="pa-4">
          <div class="d-flex justify-space-between align-center w-100">
            <div class="text-h6 font-weight-bold">
              總計: <span class="text-red-darken-1">${{ cartTotal }}</span>
            </div>
            <div class="d-flex gap-2">
              <v-btn color="error" variant="outlined" @click="clearCart"> 清空購物車 </v-btn>
              <v-btn color="success" variant="elevated" @click="checkout"> 結帳 </v-btn>
            </div>
          </div>
        </v-card-actions>
      </template>
    </v-card>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useMenuStore } from '@/stores/menuStore'

const menuStore = useMenuStore()

// 計算屬性
const cart = computed(() => menuStore.cart)
const cartItemCount = computed(() => menuStore.cartItemCount)
const cartTotal = computed(() => menuStore.cartTotal)

// 方法
function removeItem(id) {
  if (confirm('確定要移除此項目嗎？')) {
    menuStore.removeCartItem(id)
  }
}

function clearCart() {
  if (confirm('確定要清空購物車嗎？')) {
    menuStore.clearCart()
  }
}

function checkout() {
  if (cartItemCount.value === 0) {
    alert('購物車是空的！')
    return
  }

  // 這裡可以實現更複雜的結帳邏輯
  // 例如：導航到結帳頁面、彈出結帳表單等
  alert(`即將結帳 ${cartItemCount.value} 項商品，總金額 $${cartTotal.value}`)

  // 示例：可以 emit 事件給父組件處理
  // emit('checkout', { items: cart.value, total: cartTotal.value });
}

// 如果需要向父組件發送事件，可以定義 emit
// const emit = defineEmits(['checkout']);
</script>

<style scoped>
.shopping-cart {
  margin-bottom: 16px;
}

.cart-items-container {
  max-height: 400px;
  overflow-y: auto;
}

.cart-item {
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  transition: background-color 0.2s ease;
}

.cart-item:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

.cart-item:last-child {
  border-bottom: none;
}

/* 自定義滾動條樣式 */
.cart-items-container::-webkit-scrollbar {
  width: 6px;
}

.cart-items-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.cart-items-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.cart-items-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 響應式設計 */
@media (max-width: 600px) {
  .cart-items-container {
    max-height: 300px;
  }

  .v-card-actions .d-flex {
    flex-direction: column;
    gap: 12px;
  }

  .v-card-actions .d-flex > div:first-child {
    align-self: stretch;
    text-align: center;
  }
}
</style>
