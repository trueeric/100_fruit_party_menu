import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment(amount = 1) {
    count.value += Number(amount)
  }

  // 減少計數，可以指定減少的數量，默認為1
  function decrement(amount = 1) {
    count.value -= Number(amount)
  }

  // 重置計數器
  function reset() {
    count.value = 0
  }

  return { count, doubleCount, increment, decrement, reset }
})
