// // Styles
// import '@mdi/font/css/materialdesignicons.css'
// import 'vuetify/styles'

// // Vuetify
// import { createVuetify } from 'vuetify'

// export default createVuetify(
//   // https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
// )

// 移除 @mdi/font 引入，改用自定義 CSS
// import '@mdi/font/css/materialdesignicons.css'
import '@/assets/mdi-icons.css' // 使用我們自定義的圖標 CSS
import 'vuetify/styles'

// Vuetify
import { createVuetify } from 'vuetify'

export default createVuetify({
  // 配置 Vuetify 使用內聯圖標
  icons: {
    defaultSet: 'mdi',
  },
})
