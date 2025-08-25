const CONFIG_ORG = {
  TITLE: '水果PARTY 菜單',
}

function doGet(e) {
  return HtmlService.createTemplateFromFile('index.html')
    .evaluate()
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .setTitle(CONFIG_ORG.TITLE)
}

function includes(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent()
}

// 取得所有選單資料
function getAllData() {
  const ss = getSpreadsheet()
  try {
    // 讀取整合後的資料
    const menuItems = getActiveMenuItems()
    const addOns = readSheet(ss, '015_AddOns')
    const shopInfos = readSheet(ss, '001_ShopInfos')
    const categories = getActiveCategories()

    // 整理設定資料
    const shopData = {}
    shopInfos.forEach((row) => {
      shopData[row.key] = row.value
    })

    console.log('getAllData()_menuitems:', menuItems.slice(0, 10))

    return {
      shopData: shopData || {},
      menuItems: menuItems,
      categories: categories,
      addOns: addOns || [],
    }
  } catch (error) {
    console.error('取得選單資料時發生錯誤:', error)
    return {
      shopData: { name: '載入錯誤', info: {} },
      categories: [],
      menuItems: [],
      addOns: [],
      options: {},
    }
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
