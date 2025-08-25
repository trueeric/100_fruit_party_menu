/**
 * 菜單服務 - 處理與 Google Apps Script 的通信
 */
import { API_CONFIG } from '@/config/api'

export class MenuService {
  static async getMenuData() {
    try {
      const response = await fetch(API_CONFIG.GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'getAllData',
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data.menu || data
    } catch (error) {
      console.error('MenuService.getMenu 失敗:', error)
      throw error
    }
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
}
