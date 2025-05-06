
const numRows = 8;
const numCols = 8;
const numMines = 10;
let started = false;

const gameBoard = document.getElementById("game");
let board = [];

function initializeBoard() {
    for (let i = 0; i < numRows; i++) {
        board[i] = [];
        for (let j = 0; j < numCols; j++) {
            board[i][j] = {isMine: false, revealed: false, count: 0};
        }
    }
}

function revealCell(row, col) {
    if (row < 0 || row >= numRows || col < 0 || col >= numCols || board[row][col].revealed) {
        return;
    }

    
    if (!started){
        started = true;
        // Place mines randomly
        let minesPlaced = 0;
        while (minesPlaced < numMines) {
            const rowM = Math.floor(Math.random() * numRows);
            const colM = Math.floor(Math.random() * numCols);
            if (!((board[rowM][colM].isMine)||((col-1<=colM)&&(col+1>=colM)&&(row-1<=rowM)&&(row+1>=rowM)))) {
                board[rowM][colM].isMine = true;
                minesPlaced++;
            }
        }
        // Calculate counts
    for (let i = 0; i < numRows; i++) {
        for (let j = 0;j < numCols;j++) {
            if (!board[i][j].isMine) {
                let counter = 0;
                for (let dx = -1; dx <= 1; dx++) {
                    for (let dy = -1;dy <= 1;dy++) {
                        const ni = i + dx;
                        const nj = j + dy;
                        if (ni >= 0 && ni < numRows && nj >= 0 && nj < numCols && board[ni][nj].isMine){
                            counter++;}
                    }
                }
                board[i][j].count = counter;
            }
        }
    }
    }
    board[row][col].revealed = true;
    if (board[row][col].isMine) {
        // Handle game over
        alert("Game Over! You stepped on a mine.");
    } else if (board[row][col].count === 0) {
        // If cell has no mines nearby,
        // Reveal adjacent cells
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++){
                revealCell(row + dx, col + dy);}
        }
    }

    renderBoard();
}

function renderBoard() {
    gameBoard.innerHTML = "";

    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            const cell = document.createElement("div");
            cell.className = "cell";
            if (board[i][j].revealed) {
                cell.classList.add("revealed");
                if (board[i][j].isMine) {
                    cell.classList.add("mine");
                    cell.textContent = "????";
                } else if (board[i][j].count > 0) {
                    cell.textContent = board[i][j].count;
                }
            }
            cell.addEventListener("click", () => revealCell(i, j));
            gameBoard.appendChild(cell);
        }
        gameBoard.appendChild(document.createElement("br"));
    }
}

initializeBoard();
renderBoard();