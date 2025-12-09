// 全域變數
const BOARD_SIZE = 3; // 3x3 網格
const TILE_COUNT = BOARD_SIZE * BOARD_SIZE; // 9 個位置
const TILE_SIZE = 100; // 碎片尺寸 (需與 CSS 中的 grid-template-columns/rows 一致)
const IMAGE_URL = 'your_image.jpg'; // **請將此替換為您的圖片路徑！**

let boardState = []; // 儲存當前碎片編號的陣列 (0 代表空白)
let moveCount = 0;
let emptyIndex = TILE_COUNT - 1; 

const puzzleBoard = document.getElementById('puzzleBoard');
const moveCountDisplay = document.getElementById('moveCount');
const messageDisplay = document.getElementById('message');

// --- 核心函數 ---

// 1. 遊戲初始化：建立 8 個有背景定位的 HTML 元素
function createTiles() {
    puzzleBoard.innerHTML = ''; // 清空舊的碎片
    
    // 遍歷 0 到 TILE_COUNT-1，但只創建 8 個有圖片的碎片 (i = 1 to 8)
    for (let i = 1; i < TILE_COUNT; i++) {
        const tile = document.createElement('div');
        tile.className = 'puzzle-tile';
        tile.dataset.value = i; // 儲存碎片的正確編號

        // 計算圖片背景位置 (i - 1) 是為了讓編號 1-8 對應到 0-7 的索引
        const x = (i - 1) % BOARD_SIZE; // 0, 1, 2
        const y = Math.floor((i - 1) / BOARD_SIZE); // 0, 1, 2
        
        // 設定背景位置：background-position: -x*100px -y*100px;
        tile.style.backgroundPosition = `-${x * TILE_SIZE}px -${y * TILE_SIZE}px`;
        tile.style.backgroundImage = `url('${IMAGE_URL}')`;
        
        // 為了將點擊事件綁定到碎片，這裡先加一個事件監聽器
        tile.addEventListener('click', () => handleTileClick(tile));
        
        puzzleBoard.appendChild(tile);
    }

    // 創建空白碎片 (編號為 0)
    const emptyTile = document.createElement('div');
    emptyTile.className = 'empty-tile';
    emptyTile.dataset.value = 0;
    puzzleBoard.appendChild(emptyTile);
}

// 2. 啟動遊戲
function startGame() {
    // 初始狀態：[1, 2, 3, 4, 5, 6, 7, 8, 0]
    boardState = Array.from({ length: TILE_COUNT }, (_, i) => i + 1);
    boardState[TILE_COUNT - 1] = 0; 
    emptyIndex = TILE_COUNT - 1;

    moveCount = 0;
    moveCountDisplay.textContent = moveCount;
    messageDisplay.textContent = '遊戲開始！';
    
    // 進行隨機打亂
    shuffleBoard(boardState); 

    // 根據打亂後的 boardState 渲染拼圖
    renderBoard();
}

// 3. 渲染（更新）拼圖：根據 boardState 重新排列 HTML 元素
function renderBoard() {
    // 獲取所有已創建的碎片元素 (包含 .empty-tile)
    const allTiles = Array.from(puzzleBoard.children);
    
    // 清空網格，準備按 boardState 順序重新加入
    puzzleBoard.innerHTML = ''; 

    boardState.forEach(tileValue => {
        // 找到對應值的 HTML 元素 (data-value="tileValue")
        const tileElement = allTiles.find(t => parseInt(t.dataset.value) === tileValue);
        
        if (tileElement) {
            // 如果是空白碎片 (value=0)，更新 emptyIndex
            if (tileValue === 0) {
                emptyIndex = boardState.indexOf(0);
            }
            puzzleBoard.appendChild(tileElement);
        }
    });
}

// 4. 點擊事件處理
function handleTileClick(clickedTileElement) {
    const clickedValue = parseInt(clickedTileElement.dataset.value);
    const clickedIndex = boardState.indexOf(clickedValue); // 找出點擊碎片在陣列中的位置
    
    // 檢查點擊的碎片是否與空白塊相鄰 (可移動)
    if (isMoveable(clickedIndex, emptyIndex)) {
        // 執行交換
        swapTiles(clickedIndex, emptyIndex);
        
        // 更新計數
        moveCount++;
        moveCountDisplay.textContent = moveCount;
        
        // 渲染更新後的盤面
        renderBoard();
        
        // 檢查是否勝利
        if (checkWin()) {
            messageDisplay.textContent = `恭喜您！您用了 ${moveCount} 步完成拼圖！`;
            // 讓空白碎片顯示 (可選)
            const emptyTileElement = puzzleBoard.querySelector('.empty-tile');
            if (emptyTileElement) {
                emptyTileElement.style.backgroundImage = `url('${IMAGE_URL}')`;
                emptyTileElement.style.backgroundSize = `${BOARD_SIZE * TILE_SIZE}px ${BOARD_SIZE * TILE_SIZE}px`;
                emptyTileElement.style.backgroundPosition = `-${(TILE_COUNT - 1) % BOARD_SIZE * TILE_SIZE}px -${Math.floor((TILE_COUNT - 1) / BOARD_SIZE) * TILE_SIZE}px`;
                emptyTileElement.classList.remove('empty-tile');
                emptyTileElement.classList.add('puzzle-tile');
                // 移除點擊事件，阻止繼續遊戲
                puzzleBoard.querySelectorAll('.puzzle-tile').forEach(tile => tile.style.pointerEvents = 'none');
            }
        }
    }
}

// 輔助函數：檢查兩個索引是否相鄰
function isMoveable(index1, index2) {
    const row1 = Math.floor(index1 / BOARD_SIZE);
    const col1 = index1 % BOARD_SIZE;
    const row2 = Math.floor(index2 / BOARD_SIZE);
    const col2 = index2 % BOARD_SIZE;
    
    // 檢查是否在同一行且相鄰一格 (Col 差異為 1)
    const isSameRowAndAdjacent = (row1 === row2) && (Math.abs(col1 - col2) === 1);
    
    // 檢查是否在同一列且相鄰一格 (Row 差異為 1)
    const isSameColAndAdjacent = (col1 === col2) && (Math.abs(row1 - row2) === 1);
    
    return isSameRowAndAdjacent || isSameColAndAdjacent;
}

// 輔助函數：交換陣列中的兩個元素
function swapTiles(indexA, indexB) {
    [boardState[indexA], boardState[indexB]] = [boardState[indexB], boardState[indexA]];
}

// 5. 檢查勝利
function checkWin() {
    // 勝利順序為 [1, 2, 3, 4, 5, 6, 7, 8, 0]
    for (let i = 0; i < TILE_COUNT - 1; i++) {
        if (boardState[i] !== i + 1) {
            return false;
        }
    }
    // 檢查最後一個位置是否為 0 (空白)
    return boardState[TILE_COUNT - 1] === 0;
}

// 6. 打亂邏輯 (shuffleBoard) - **確保有解**
function shuffleBoard() {
    // 為了確保拼圖有解，不能隨機打亂，而要通過多次有效移動來打亂
    let randomMoves = 100; // 執行 100 次有效移動
    
    for (let i = 0; i < randomMoves; i++) {
        // 找到所有可以和空白塊交換的相鄰碎片
        const possibleMoves = [];
        
        // 檢查空白塊的上下左右鄰居
        const neighbors = [
            emptyIndex - BOARD_SIZE, // 上
            emptyIndex + BOARD_SIZE, // 下
            emptyIndex - 1,          // 左
            emptyIndex + 1           // 右
        ];
        
        neighbors.forEach(neighborIndex => {
            // 確保鄰居索引在範圍內且可移動 (isMoveable 會檢查邊界)
            if (neighborIndex >= 0 && neighborIndex < TILE_COUNT && isMoveable(neighborIndex, emptyIndex)) {
                possibleMoves.push(neighborIndex);
            }
        });
        
        // 從可能的移動中隨機選擇一個
        if (possibleMoves.length > 0) {
            const randomIndex = Math.floor(Math.random() * possibleMoves.length);
            const chosenIndex = possibleMoves[randomIndex];
            
            // 執行交換
            swapTiles(chosenIndex, emptyIndex);
            // 更新空白塊位置
            emptyIndex = chosenIndex;
        }
    }
}

// --- 初始化 ---
createTiles(); // 在頁面載入時先創建好所有碎片元素
startGame(); // 啟動第一次遊戲