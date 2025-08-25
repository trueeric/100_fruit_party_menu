<template>
  <v-card class="menu-item mb-4" :class="{ 'hidden': !isVisible }">
    <v-card-item>
      <div class="d-flex justify-space-between align-center">
        <div>
          <v-card-title>{{ item.item_name }}</v-card-title>
          <v-card-subtitle v-if="item.description">{{ item.description }}</v-card-subtitle>
          <div class="text-red-darken-1 text-h6 font-weight-bold mt-2">${{ item.price }}</div>
          <div v-if="item.tags" class="mt-1">
            <v-chip
              v-for="tag in tags"
              :key="tag"
              size="small"
              class="mr-1 mt-1"
              color="blue-grey-lighten-5"
            >
              {{ tag }}
            </v-chip>
          </div>
        </div>
        <v-btn
          color="success"
          @click="addToCart"
        >
          加入購物車
        </v-btn>
      </div>
    </v-card-item>
  </v-card>
</template>

<script setup>
import { computed } from 'vue';
import { useMenuStore } from '@/stores/menuStore';

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  currentCategory: {
    type: String,
    default: 'all'
  }
});

const menuStore = useMenuStore();

const isVisible = computed(() => {
  return props.currentCategory === 'all' || props.item.category_id === props.currentCategory;
});

const tags = computed(() => {
  if (!props.item.tags) return [];
  return props.item.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
});

function addToCart() {
  menuStore.openAddOnsModal(props.item.id);
}
</script>

<style scoped>
.menu-item.hidden {
  display: none;
}
</style>