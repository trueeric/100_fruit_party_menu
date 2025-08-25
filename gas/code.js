const CONFIG = {
  TITLE: '水果PARTY 菜單',
}

function doGet(e) {
  // 檢查是否是調試請求
  if (e && e.parameter && e.parameter.debug === 'true') {
    try {
      const data = getAllData()
      return HtmlService.createHtmlOutput('<pre>' + JSON.stringify(data, null, 2) + '</pre>')
    } catch (error) {
      return HtmlService.createHtmlOutput('<h1>Error</h1><pre>' + error.toString() + '</pre>')
    }
  }

  // 正常的應用邏輯
  return HtmlService.createTemplateFromFile('index.html')
    .evaluate()
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .setTitle(CONFIG.TITLE)
}

function includes(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent()
}

// 取得所有選單資料
function getAllData() {
  const ss = getSpreadsheet()
  const result = {
    shopData: {},
    menuItems: [],
    categories: [],
    addOns: [],
  }

  try {
    // 嘗試獲取 menuItems
    try {
      result.menuItems = getActiveMenuItems()
    } catch (e) {
      console.error('獲取 menuItems 失敗:', e)
    }

    // 嘗試獲取 addOns
    try {
      result.addOns = readSheet(ss, '015_AddOns') || []
    } catch (e) {
      console.error('獲取 addOns 失敗:', e)
    }

    // 嘗試獲取並處理 shopData
    try {
      const shopInfos = readSheet(ss, '001_ShopInfos')
      shopInfos.forEach((row) => {
        result.shopData[row.key] = row.value
      })
    } catch (e) {
      console.error('獲取或處理 shopData 失敗:', e)
      result.shopData = { name: '載入錯誤' }
    }

    // 嘗試獲取 categories
    try {
      result.categories = getActiveCategories()
    } catch (e) {
      console.error('獲取 categories 失敗:', e)
    }

    return result
  } catch (error) {
    console.error('getAllData 主函數失敗:', error)
    return result // 返回可能部分填充的結果
  }
}

// 在 GAS 中添加新函數
function getShopData() {
  const ss = getSpreadsheet()
  try {
    const shopInfos = readSheet(ss, '001_ShopInfos')
    const shopData = {}
    shopInfos.forEach((row) => {
      shopData[row.key] = row.value
    })
    return shopData
  } catch (error) {
    console.error('獲取商店數據時發生錯誤:', error)
    return { name: '載入錯誤' }
  }
}

function getSpreadsheet() {
  return SpreadsheetApp.getActiveSpreadsheet()
}

// 讀取工作表資料
function readSheet(spreadsheet, sheetName) {
  try {
    const sheet = spreadsheet.getSheetByName(sheetName)
    if (!sheet) {
      console.warn(`找不到工作表: ${sheetName}`)
      return []
    }

    const dataRange = sheet.getDataRange()
    if (dataRange.getNumRows() <= 1) {
      console.warn(`工作表 ${sheetName} 沒有資料`)
      return []
    }

    const data = dataRange.getValues()
    const headers = data[0]
    const rows = data.slice(1)

    return rows
      .map((row) => {
        const obj = {}
        headers.forEach((header, index) => {
          obj[header] = row[index]
        })
        return obj
      })
      .filter((row) => {
        // 過濾掉完全空白的行
        return Object.values(row).some(
          (value) => value !== '' && value !== null && value !== undefined,
        )
      })
  } catch (error) {
    console.error(`讀取工作表 ${sheetName} 時發生錯誤:`, error)
    return []
  }
}

// 添加一個函數來列出所有工作表
function listAllSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const sheets = ss.getSheets()
  return sheets.map((sheet) => sheet.getName())
}

function getActiveCategories() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet()
    const categories = readSheet(ss, '011_Categories')

    return categories
      .filter((cat) => cat.is_active === true || cat.is_active === 'TRUE')
      .sort((a, b) => {
        const sortA = parseInt(a.sort_order) || 0
        const sortB = parseInt(b.sort_order) || 0
        return sortA - sortB
      })
      .map((cat) => ({
        id: cat.id,
        name: cat.name,
        c_name: cat.c_name,
        color: cat.color,
        layout: cat.layout,
        sort: parseInt(cat.sort_order) || 0,
      }))
  } catch (error) {
    console.error('讀取分類資料時發生錯誤:', error)
    return []
  }
}

function getActiveMenuItems() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet()
    const menuItems = readSheet(ss, '210_ActiveMenuItemsData')

    return menuItems
      .filter(
        (item) =>
          (item.is_active === true || item.is_active === 'TRUE') &&
          (item.category_is_active === true || item.category_is_active === 'TRUE'),
      )
      .sort((a, b) => {
        // 先比較 category_sort (M欄)
        const categoryA = parseInt(a.category_sort) || 0
        const categoryB = parseInt(b.category_sort) || 0

        if (categoryA !== categoryB) {
          return categoryA - categoryB
        }

        // 如果分類排序相同，再比較 sort_order (F欄)
        const sortA = parseInt(a.sort_order) || 0
        const sortB = parseInt(b.sort_order) || 0
        return sortA - sortB
      })
      .map((item) => ({
        id: item.id,
        item_name: item.name,
        tags: item.tags || '',
        category_name: item.category_name,
        category_c_name: item.category_c_name,
        description: item.description || '',
        price: parseFloat(item.price) || 0,
        category_id: item.category_id,
        category_sort: item.category_sort || 0,
        sort: parseInt(item.sort_order) || 0,
      }))
  } catch (error) {
    console.error('讀取菜單項目時發生錯誤:', error)
    return []
  }
}

function getAddOns() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet()
    const addOns = readSheet(ss, '015_AddOns')

    return addOns
      .filter((addon) => addon.is_active === true || addon.is_active === 'TRUE')
      .filter((addon) => !isNaN(addon.id) && !isNaN(addon.price)) // 數字驗證
      .sort((a, b) => (parseInt(a.sort) || 0) - (parseInt(b.sort) || 0))
      .map((addon) => ({
        id: parseInt(addon.id),
        name: addon.name,
        price: parseFloat(addon.price),
      }))
  } catch (error) {
    console.error('讀取加購項目時發生錯誤:', error)
    return []
  }
}

function testGetData() {
  try {
    const data = getAllData()
    Logger.log('測試結果:')
    Logger.log(JSON.stringify(data, null, 2))
    return '測試完成，請查看日誌'
  } catch (error) {
    Logger.log('測試時發生錯誤: ' + error.toString())
    return '測試失敗: ' + error.toString()
  }
}

// 當打開 Google Sheet 時添加自定義菜單
function onOpen() {
  var ui = SpreadsheetApp.getUi()
  ui.createMenu('菜單工具').addItem('打印菜單', 'printMenu').addToUi()
}

// 打印菜單功能
function printMenu() {
  // 獲取菜單數據
  var data = getAllData()

  // 將數據轉換為 JSON 字符串
  var jsonData = JSON.stringify(data)

  // 使用您的 Vue 應用的 URL，而不是 Google Apps Script URL
  var vueAppUrl = 'https://menu-print-app.netlify.app/#/print-menu' // 替換為您的 Vue 應用的實際 URL

  // 記錄將要使用的 URL
  console.log('打印菜單使用的 URL: ' + vueAppUrl)

  // 創建一個臨時 HTML 頁面，將數據存儲到 localStorage 並打開打印頁面
  var htmlOutput = HtmlService.createHtmlOutput(
    `
    <!DOCTYPE html>
    <html>
    <head>
      <base target="_top">
      <style>
        body { font-family: Arial, sans-serif; padding: 15px; }
        button {
          padding: 8px 15px;
          background-color: #4285f4;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          margin-top: 10px;
        }
        .info { font-size: 12px; color: #666; margin: 10px 0; }
      </style>
    </head>
    <body>
      <h3>菜單打印準備</h3>
      <p>正在準備打印菜單數據...</p>
      <div id="status" class="info">正在處理...</div>

      <script>
        // 將數據存儲到 localStorage
        try {
          localStorage.setItem('menuData', ${JSON.stringify(jsonData)});
          document.getElementById('status').textContent = '✓ 菜單數據已準備完成';

          // 延遲 1 秒後打開打印頁面
          setTimeout(function() {
            openPrintPage();
          }, 1000);
        } catch(e) {
          document.getElementById('status').innerHTML = '❌ 存儲數據時出錯: ' + e.message + '<br>請嘗試使用無痕模式或清除瀏覽器緩存。';
          console.error("存儲數據時出錯:", e);
        }

        function openPrintPage() {
          try {
            // 使用 Vue 應用的 URL，包含正確的路由
            var printWindow = window.open('${vueAppUrl}', '_blank');
            if (!printWindow) {
              document.getElementById('status').innerHTML += '<br>❌ 彈出窗口被阻止。請允許彈出窗口後再試。';
            }
          } catch(e) {
            document.getElementById('status').innerHTML += '<br>❌ 打開頁面時出錯: ' + e.message;
            console.error("打開頁面時出錯:", e);
          }
        }
      </script>

      <p class="info">將打開: <a href="${vueAppUrl}" target="_blank">${vueAppUrl}</a></p>
      <p>如果頁面沒有自動打開，請點擊下面的按鈕：</p>
      <button onclick="openPrintPage()">手動打開打印頁面</button>
    </body>
    </html>
  `,
  )
    .setWidth(450)
    .setHeight(250)

  SpreadsheetApp.getUi().showModalDialog(htmlOutput, '打印菜單')
}

// 獲取 Web 應用程序 URL
function getWebAppUrl_ori_temp() {
  // 獲取當前腳本的部署 URL
  var url = ScriptApp.getService().getUrl()

  console.log('原始腳本 URL: ' + url)

  // 如果是在開發環境中，可以使用一個固定的 URL
  if (!url || url.includes('dev')) {
    // return 'https://your-app-url.com'
    return 'https://script.google.com/macros/s/AKfycbzMOPb6jfQqpGeiZbZrt78_bC1aMYKzlgiJ-tB1PNUDthpVEDgckqDcNc1X7TnamFpxrA/exec'
  }

  // 從腳本 URL 中提取基本 URL
  // 假設您的應用部署在同一個域名下
  var baseUrl = url.split('/').slice(0, 3).join('/')
  return baseUrl
}

function getWebAppUrl() {
  // 直接返回你的正式部署 URL
  const PRODUCTION_URL =
    'https://script.google.com/macros/s/AKfycbzMOPb6jfQqpGeiZbZrt78_bC1aMYKzlgiJ-tB1PNUDthpVEDgckqDcNc1X7TnamFpxrA/exec'

  // 獲取當前腳本 URL（主要用於 debug）
  var currentUrl = ScriptApp.getService().getUrl()
  console.log('ScriptApp.getService().getUrl() 返回: ' + currentUrl)
  console.log('使用的正式 URL: ' + PRODUCTION_URL)

  return PRODUCTION_URL
}

function testDataReading() {
  const ss = SpreadsheetApp.getActiveSpreadsheet()

  // 列出所有工作表
  const sheets = ss.getSheets()
  console.log('所有工作表:')
  sheets.forEach((sheet) => {
    console.log(`- ${sheet.getName()}`)
  })

  // 測試讀取各個工作表
  const sheetNames = [
    '001_shopInfos',
    '011_Categories',
    '013_MenuItems',
    '015_AddOns',
    '220_SortedMenuItems',
  ]

  sheetNames.forEach((sheetName) => {
    console.log(`\n測試讀取: ${sheetName}`)
    try {
      const data = readSheet(ss, sheetName)
      console.log(`成功讀取 ${data.length} 筆資料`)
      if (data.length > 0) {
        console.log('第一筆資料:', JSON.stringify(data[0]))
      }
    } catch (error) {
      console.error(`讀取 ${sheetName} 失敗:`, error)
    }
  })
}

// 測試 getWebAppUrl 函數
function testWebAppUrl() {
  var url = getWebAppUrl()
  console.log('Web App URL: ' + url)
  return 'Web App URL: ' + url
}
