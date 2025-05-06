/*
Minesweeper code
based on: https://www.geeksforgeeks.org/create-a-minesweeper-game-using-html-css-javascript/
*/
const numRows = 16;
const numCols = 16;
const numMines = 40;
let started = false;
let squares = (numCols*numRows)-numMines;
let done = false;

const gameBoard = document.getElementById("game");
let board = [];

function initializeBoard() {
    for (let i = 0; i < numRows; i++) {
        board[i] = [];
        for (let j = 0; j < numCols; j++) {
            board[i][j] = {isMine: false, revealed: false, count: 0, flag: false};
        }
    }
}

function reset() {
    started = false;
    squares = (numCols*numRows)-numMines;
    done = false;
    initializeBoard();
    renderBoard();
}

function revealCell(row, col) {
    if ((done&&started)||(row < 0 || row >= numRows || col < 0 || col >= numCols || board[row][col].revealed)) {
        return;
    }
    if (board[row][col].flag){
        board[row][col].flag = false;
    }else{

    
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
    squares--;
    if (board[row][col].isMine) {
        // Handle game over
        done=true;
    } else if (board[row][col].count === 0) {
        // If cell has no mines nearby,
        // Reveal adjacent cells
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++){
                revealCell(row + dx, col + dy);}
        }
    }
    }
    
    if (done) {
        alert("Game Over! You stepped on a mine.");
        endRender();
    } else {
        renderBoard();
    }
    if (squares<=0){
        alert("You win!");
        done=true;
    }
}

function applyFlag(row,col,e){
    board[row][col].flag=!board[row][col].flag;
    renderBoard();
}

function endRender() {
    gameBoard.innerHTML = "";

    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            const cell = document.createElement("div");
            cell.className = "cell";
            if (board[i][j].revealed) {
                cell.classList.add("revealed");
                if (board[i][j].isMine) {
                    cell.classList.add("mine");
                    cell.textContent = "*";
                } else if (board[i][j].count > 0) {
                    cell.textContent = board[i][j].count;
                }
            } else {
                if(board[i][j].isMine){
                    if(board[i][j].flag){
                        cell.classList.add("foundMine");
                        cell.textContent = "*";
                    }else{
                        cell.classList.add("noRev");
                        cell.textContent= "*";
                    }
                } else{
                    if(board[i][j].flag){
                        cell.classList.add("falseFlag");
                        cell.textContent = "F";
                    }else{
                        cell.classList.add("noRev");
                    }
                }
            }
            gameBoard.appendChild(cell);
        }
        gameBoard.appendChild(document.createElement("br"));
    }
    const btnReset = document.createElement("div");
    btnReset.className = "reset";
    btnReset.textContent = "Reset";
    btnReset.addEventListener("click", () => reset());
    gameBoard.appendChild(btnReset);   
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
                    cell.textContent = "*";
                } else if (board[i][j].count > 0) {
                    cell.textContent = board[i][j].count;
                }
            } else if (board[i][j].flag){
                cell.classList.add("noRev");
                cell.classList.add("flagged");
                cell.textContent = "F";
            } else {
                cell.classList.add("noRev");
            }
            cell.addEventListener("click", () => revealCell(i, j));
            if (started){
                cell.addEventListener("contextmenu", (e) => e.preventDefault());
                cell.addEventListener("contextmenu", () => applyFlag(i,j));}
            gameBoard.appendChild(cell);
        }
        gameBoard.appendChild(document.createElement("br"));
    }
    const btnReset = document.createElement("div");
    btnReset.className = "reset";
    btnReset.textContent = "Reset";
    btnReset.addEventListener("click", () => reset());
    gameBoard.appendChild(btnReset);   
}

initializeBoard();
renderBoard();