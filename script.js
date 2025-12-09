// 全域變數
const BOARD_SIZE = 3; // 3x3 網格
const TILE_COUNT = BOARD_SIZE * BOARD_SIZE; // 9 個位置
let boardState = []; // 用來儲存當前碎片排列 (例如: [1, 2, 0, 4, 5, 3, 7, 8, 6])
let moveCount = 0;
let emptyIndex = TILE_COUNT - 1; // 空白碎片的位置索引 (初始在右下角)

const puzzleBoard = document.getElementById('puzzleBoard');
const moveCountDisplay = document.getElementById('moveCount');
const messageDisplay = document.getElementById('message');

// --- 核心函數 ---

// 1. 遊戲初始化：建立 8 個有背景定位的 HTML 元素
function createTiles() {
    // 實作：遍歷 1 到 TILE_COUNT-1，為每個碎片設置正確的背景位置
    // 提示：(i, j) 座標轉背景位置：background-position: -j*100px -i*100px;
    // ...
}

// 2. 啟動遊戲
function startGame() {
    // 重設計數
    moveCount = 0;
    moveCountDisplay.textContent = moveCount;
    messageDisplay.textContent = '';
    
    // 設置初始的正確順序：[1, 2, 3, 4, 5, 6, 7, 8, 0]
    boardState = Array.from({ length: TILE_COUNT }, (_, i) => i + 1);
    boardState[TILE_COUNT - 1] = 0; // 0 代表空白碎片

    // 進行隨機打亂（請實作 shuffle 邏輯）
    shuffleBoard();

    // 根據打亂後的 boardState 渲染拼圖
    renderBoard();
}

// 3. 渲染（更新）拼圖
function renderBoard() {
    // 實作：根據 boardState 的順序，將 puzzleBoard 內的 tile 重新排列
    // 提示：可以考慮使用 CSS Grid 的 grid-area 或直接操作 DOM 元素的順序
    // ...

    // 綁定點擊事件
    // ...
}

// 4. 點擊事件處理
function handleTileClick(clickedIndex) {
    // 實作：
    // 1. 檢查 clickedIndex 是否可以移動 (是否與 emptyIndex 相鄰)
    // 2. 如果可以，執行 swapTiles(clickedIndex, emptyIndex)
    // 3. 更新 moveCount
    // 4. 執行 renderBoard()
    // 5. 執行 checkWin()
    // ...
}

// 5. 檢查勝利
function checkWin() {
    // 實作：判斷 boardState 是否等於 [1, 2, 3, 4, 5, 6, 7, 8, 0]
    // 如果贏了，顯示勝利訊息！
    // ...
}

// --- 初始化 ---
createTiles(); // 在頁面載入時先創建好所有碎片元素
startGame(); // 啟動第一次遊戲