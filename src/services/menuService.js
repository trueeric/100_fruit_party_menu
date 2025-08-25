/**
 * 菜單服務 - 處理與 Google Apps Script 的通信
 */

// 從 Google Apps Script 獲取菜單數據
export async function fetchDataInParts() {
  try {
    console.log('開始分段獲取數據...')

    // 獲取商店數據
    const shopData = await new Promise((resolve, reject) => {
      google.script.run
        .withSuccessHandler((data) => {
          console.log('獲取商店數據成功:', data)
          resolve(data)
        })
        .withFailureHandler((error) => {
          console.error('獲取商店數據失敗:', error)
          resolve(getMockData().shopData)
        })
        .getShopData()
    })

    // 獲取分類
    const categories = await new Promise((resolve, reject) => {
      google.script.run
        .withSuccessHandler((data) => {
          console.log('獲取分類成功:', data)
          resolve(data)
        })
        .withFailureHandler((error) => {
          console.error('獲取分類失敗:', error)
          resolve(getMockData().categories)
        })
        .getActiveCategories()
    })

    // 獲取菜單項目
    const menuItems = await new Promise((resolve, reject) => {
      google.script.run
        .withSuccessHandler((data) => {
          console.log('獲取菜單項目成功:', data)
          resolve(data)
        })
        .withFailureHandler((error) => {
          console.error('獲取菜單項目失敗:', error)
          resolve(getMockData().menuItems)
        })
        .getActiveMenuItems()
    })

    // 獲取加購項目
    const addOns = await new Promise((resolve, reject) => {
      google.script.run
        .withSuccessHandler((data) => {
          console.log('獲取加購項目成功:', data)
          resolve(data)
        })
        .withFailureHandler((error) => {
          console.error('獲取加購項目失敗:', error)
          resolve(getMockData().addOns)
        })
        .getAddOns()
    })

    // 組合所有數據
    const combinedData = {
      shopData,
      categories,
      menuItems,
      addOns,
    }

    console.log('所有數據獲取完成:', combinedData)
    return combinedData
  } catch (error) {
    console.error('分段獲取數據時發生錯誤:', error)
    return getMockData()
  }
}

// 本地開發時的模擬數據
function getMockData() {
  return {
    shopData: {
      shop_name: '測試餐廳',
      title: '美味佳餚盡在此處',
      description: '這是一個測試描述',
    },
    categories: [
      { id: '1', name: 'Drinks', c_name: '飲料', color: '#3498db', layout: 'grid', sort: 1 },
      { id: '2', name: 'Food', c_name: '食物', color: '#e74c3c', layout: 'grid', sort: 2 },
      { id: '3', name: 'Desserts', c_name: '甜點', color: '#f39c12', layout: 'grid', sort: 3 },
    ],
    menuItems: [
      {
        id: '101',
        item_name: '珍珠奶茶',
        tags: '熱門,推薦',
        category_name: 'Drinks',
        category_c_name: '飲料',
        description: '香濃奶茶配上QQ珍珠',
        price: 60,
        category_id: '1',
        category_sort: 1,
        sort: 1,
      },
      {
        id: '102',
        item_name: '烏龍茶',
        tags: '無糖',
        category_name: 'Drinks',
        category_c_name: '飲料',
        description: '清香烏龍',
        price: 40,
        category_id: '1',
        category_sort: 1,
        sort: 2,
      },
      {
        id: '201',
        item_name: '漢堡',
        tags: '熱門,推薦',
        category_name: 'Food',
        category_c_name: '食物',
        description: '美味牛肉漢堡',
        price: 120,
        category_id: '2',
        category_sort: 2,
        sort: 1,
      },
      {
        id: '301',
        item_name: '巧克力蛋糕',
        tags: '甜點',
        category_name: 'Desserts',
        category_c_name: '甜點',
        description: '濃郁巧克力蛋糕',
        price: 80,
        category_id: '3',
        category_sort: 3,
        sort: 1,
      },
    ],
    addOns: [
      { id: 1, name: '加珍珠', price: 10 },
      { id: 2, name: '加椰果', price: 10 },
      { id: 3, name: '加鮮奶', price: 15 },
      { id: 4, name: '加冰淇淋', price: 25 },
    ],
  }
}
