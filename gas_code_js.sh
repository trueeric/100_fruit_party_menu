#!/bin/bash
echo -e "\n### GAS: Build for Google Apps Script ###\n"

SRC_GAS_DIR="./src/gas"
GAS_DIR="./gas"
DIST_DIR="./dist"

# 檢查 dist 目錄是否存在
if [ ! -d $DIST_DIR ]; then
    echo -e "\n### GAS: 您需要先構建專案! 請執行 npm run build ###\n"
    exit 1
fi

# 創建 gas 目錄（如果不存在）
if [ ! -d $GAS_DIR ]; then
    mkdir $GAS_DIR
fi

# 複製 src/gas 中的所有 .js 文件到 gas 目錄
echo -e "### GAS: 複製後端代碼 ###"
cp $SRC_GAS_DIR/*.js $GAS_DIR/

# 複製 appsscript.json（如果存在）
if [ -f "$SRC_GAS_DIR/appsscript.json" ]; then
    cp $SRC_GAS_DIR/appsscript.json $GAS_DIR/
else
    # 如果不存在，創建一個基本的 appsscript.json
    if [ ! -f "$GAS_DIR/appsscript.json" ]; then
        echo '{
  "timeZone": "Asia/Taipei",
  "dependencies": {
  },
  "exceptionLogging": "STACKDRIVER",
  "runtimeVersion": "V8"
}' > $GAS_DIR/appsscript.json
        echo -e "### GAS: 創建了基本的 appsscript.json ###"
    fi
fi

# 處理 index.html
echo -e "### GAS: 處理 index.html ###"
cat $DIST_DIR/index.html | sed -E "s/<script.+script>/<?!= includes(\"js.html\"); ?>/" | sed -E "s/<link rel=\"stylesheet\".+>/<?!= includes(\"css.html\"); ?>/" > $GAS_DIR/index.html
echo -e "### GAS: index.html 已創建! ###"

# 處理 JavaScript
echo -e "### GAS: 處理 JavaScript ###"
echo "<script type=\"module\" crossorigin>" > $GAS_DIR/js.html
cat $DIST_DIR/assets/index*.js >> $GAS_DIR/js.html
echo "</script>" >> $GAS_DIR/js.html
echo -e "### GAS: js.html 已創建! ###"

# 處理 CSS
echo -e "### GAS: 處理 CSS ###"
echo "<style>" > $GAS_DIR/css.html
cat $DIST_DIR/assets/index*.css >> $GAS_DIR/css.html
echo "</style>" >> $GAS_DIR/css.html
echo -e "### GAS: css.html 已創建! ###"

echo -e "\n### GAS: 構建完成! 現在您可以運行 'clasp push' 來上傳 ###\n"