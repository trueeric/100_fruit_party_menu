<script setup>
import { useCounterStore } from '../stores/counter'
import { ref } from 'vue'

const counter = useCounterStore()

const amount = ref(1)

const increment = () => {
  counter.increment(amount.value)
}

const decrement = () => {
  counter.decrement(amount.value)
}

const reset = () => {
  counter.reset()
}
</script>

<template>
  <v-container fluid class="fill-height">
    <v-row justify="center" align="center">
      <v-col cols="12" sm="10" md="8" lg="6">
        <v-card elevation="4" rounded="lg" class="mx-auto">
          <!-- 標題區域 -->
          <v-card-title class="text-center py-4">
            <span class="text-h5 text-sm-h4 text-md-h3 font-weight-bold">Counter App</span>
          </v-card-title>

          <v-divider></v-divider>

          <v-card-text class="pa-4">
            <!-- 計數顯示區域 -->
            <v-row justify="center" class="my-4">
              <v-col cols="12" class="text-center">
                <v-sheet
                  color="primary"
                  rounded="xl"
                  elevation="2"
                  class="py-3 px-6 d-inline-block"
                >
                  <span class="text-h4 text-sm-h3 text-white">{{ counter.count }}</span>
                </v-sheet>
                <div class="text-body-1 text-md-h6 mt-2">當前計數</div>
              </v-col>
            </v-row>

            <!-- 雙倍計數顯示 -->
            <v-row justify="center" class="mb-4">
              <v-col cols="12" sm="8" class="text-center">
                <v-chip color="secondary" class="ma-2">
                  雙倍計數: {{ counter.doubleCount }}
                </v-chip>
              </v-col>
            </v-row>

            <!-- 輸入和按鈕區域 -->
            <v-row>
              <v-col cols="12" sm="4">
                <v-text-field
                  v-model="amount"
                  label="數量"
                  type="number"
                  min="1"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                  class="mb-4 mb-sm-0"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="8">
                <v-row>
                  <v-col cols="6">
                    <v-btn
                      color="success"
                      block
                      @click="increment"
                      prepend-icon="mdi-plus"
                      variant="elevated"
                      size="large"
                    >
                      增加
                    </v-btn>
                  </v-col>

                  <v-col cols="6">
                    <v-btn
                      color="error"
                      block
                      @click="decrement"
                      prepend-icon="mdi-minus"
                      variant="elevated"
                      size="large"
                    >
                      減少
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>

            <!-- 重置按鈕 -->
            <v-row class="mt-4">
              <v-col cols="12">
                <v-btn
                  color="secondary"
                  block
                  @click="reset"
                  prepend-icon="mdi-refresh"
                  variant="tonal"
                >
                  重置計數器
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
