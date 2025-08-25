<template>
  <div class="category-nav mb-6">
    <v-chip-group
      v-model="selectedCategory"
      selected-class="primary"
      class="overflow-x-auto py-2"
    >
      <v-chip
        filter
        variant="elevated"
        value="all"
        @click="setCategory('all')"
      >
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
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useMenuStore } from '@/stores/menuStore';

const props = defineProps({
  categories: {
    type: Array,
    default: () => []
  }
});

const menuStore = useMenuStore();
const selectedCategory = ref('all');

function setCategory(categoryId) {
  menuStore.setCategory(categoryId);
}

// 當 store 中的 currentCategory 變更時，同步更新本地選擇
watch(() => menuStore.currentCategory, (newCategory) => {
  selectedCategory.value = newCategory;
});
</script>

<style scoped>
.category-nav {
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: white;
  padding: 8px 0;
}
</style>