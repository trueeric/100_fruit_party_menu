<template>
  <v-card class="restaurant-header mb-6">
    <v-card-item class="text-center">
      <v-card-title class="text-h4 font-weight-bold">{{ shopData.shop_name }}</v-card-title>
      <v-card-subtitle v-if="shopData.title" class="mt-2">{{ shopData.title }}</v-card-subtitle>
      <p v-if="shopData.description" class="mt-2">{{ shopData.description }}</p>
    </v-card-item>
  </v-card>
</template>

<script setup>
defineProps({
  shopData: {
    type: Object,
    default: () => ({})
  }
});
</script>

<style scoped>
.restaurant-header {
  background-color: white;
  border-radius: 8px;
}
</style>