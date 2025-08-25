<template>
  <v-dialog v-model="showModal" max-width="500px">
    <v-card>
      <v-card-title class="text-h5"> 加購項目 </v-card-title>
      <v-card-text>
        <v-list v-if="availableAddOns.length > 0">
          <v-list-item v-for="addon in availableAddOns" :key="addon.id">
            <v-checkbox
              v-model="selectedAddOns"
              :value="addon"
              :label="`${addon.name} (+$${addon.price})`"
              hide-details
            ></v-checkbox>
          </v-list-item>
        </v-list>
        <div class="text-center py-4 text-grey-darken-1">沒有可用的加購項目</div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" variant="text" @click="closeModal">取消</v-btn>
        <v-btn color="success" variant="text" @click="confirmAddToCart">確認加入購物車</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useMenuStore } from '@/stores/menuStore'

const menuStore = useMenuStore()
const selectedAddOns = ref([])

// 從 store 獲取可用的加購項目
const availableAddOns = computed(() => menuStore.addOns)

const showModal = computed({
  get: () => menuStore.showAddOnsModal,
  set: (value) => {
    if (!value) {
      menuStore.closeAddOnsModal()
    }
  },
})

function closeModal() {
  selectedAddOns.value = []
  menuStore.closeAddOnsModal()
}

function confirmAddToCart() {
  menuStore.addToCart(selectedAddOns.value)
  selectedAddOns.value = []
}

// 當彈窗打開時，清空選擇
watch(
  () => menuStore.showAddOnsModal,
  (newValue) => {
    if (newValue) {
      selectedAddOns.value = []
    }
  },
)
</script>
