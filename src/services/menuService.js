/**
 * 菜單服務 - 處理與 Google Apps Script 的通信
 */
import { API_CONFIG } from '@/config/api'

export class MenuService {
  static async getMenuData() {
    return new Promise((resolve, reject) => {
      const callbackName = 'jsonpCallback_' + Math.round(Math.random() * 1000000)
      window[callbackName] = (data) => {
        delete window[callbackName]
        document.head.removeChild(script)
        resolve(data)
      }

      const script = document.createElement('script')
      script.src = `${API_CONFIG.GOOGLE_SCRIPT_URL}?action=getAllData&callback=${callbackName}`
      script.onerror = (err) => {
        delete window[callbackName]
        document.head.removeChild(script)
        reject(new Error('JSONP 請求失敗'))
      }

      document.head.appendChild(script)
    })
  }

  static async updateMenu(menuData) {
    try {
      const response = await fetch(API_CONFIG.GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'updateMenu',
          data: menuData,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('MenuService.updateMenu 失敗:', error)
      throw error
    }
  }

  // 添加模擬數據方法
  static getMockData() {
    return {
      shopData: {
        shop_name: '水果PARTY',
        address: '台北市信義區水果街123號',
        hours: '10:00-22:00',
        phone: '(02)1234-5678',
      },
      categories: [
        { id: '1', name: '經典飲品', c_name: '經典飲品', is_active: true },
        { id: '2', name: '鮮果系列', c_name: '鮮果系列', is_active: true },
        { id: '3', name: '特調飲品', c_name: '特調飲品', is_active: true },
      ],
      menuItems: [
        {
          id: '101',
          category_id: '1',
          item_name: '珍珠奶茶',
          price: 50,
          is_active: true,
          tags: ['熱門'],
        },
        { id: '102', category_id: '1', item_name: '波霸奶茶', price: 55, is_active: true },
        { id: '103', category_id: '1', item_name: '茉莉綠茶', price: 40, is_active: true },
        { id: '104', category_id: '1', item_name: '四季春茶', price: 40, is_active: true },
        {
          id: '201',
          category_id: '2',
          item_name: '芒果冰沙',
          price: 70,
          is_active: true,
          tags: ['熱門'],
        },
        { id: '202', category_id: '2', item_name: '草莓冰沙', price: 70, is_active: true },
        {
          id: '203',
          category_id: '2',
          item_name: '藍莓優格',
          price: 75,
          is_active: true,
          tags: ['新品'],
        },
        { id: '204', category_id: '2', item_name: '奇異果冰沙', price: 75, is_active: true },
        { id: '301', category_id: '3', item_name: '蜂蜜檸檬', price: 60, is_active: true },
        {
          id: '302',
          category_id: '3',
          item_name: '百香果綠茶',
          price: 65,
          is_active: true,
          tags: ['熱門'],
        },
        {
          id: '303',
          category_id: '3',
          item_name: '葡萄柚綠茶',
          price: 65,
          is_active: true,
          tags: ['新品'],
        },
        { id: '304', category_id: '3', item_name: '檸檬冰茶', price: 55, is_active: true },
      ],
      addOns: [
        { id: '1', name: '爆乳', price: 10, is_active: true },
        { id: '2', name: '奶蓋', price: 10, is_active: true },
        { id: '3', name: '布丁', price: 35, is_active: true },
        { id: '6', name: '麵茶', price: 5, is_active: true },
      ],
    }
  }
}
