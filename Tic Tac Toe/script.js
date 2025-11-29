// =============== VARIABEL GLOBAL =================
let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameOver = false;
let mode = "2p";
let difficulty = "Hard";

// =============== MULAI GAME =================
function startGame() {
    mode = document.getElementById("mode").value;
    difficulty = document.getElementById("difficulty").value;

    document.getElementById("menu").classList.add("hidden");
    document.getElementById("game").classList.remove("hidden");

    generateBoard();
}

function generateBoard() {
    let boardDiv = document.getElementById("board");
    boardDiv.innerHTML = "";

    for (let i = 0; i < 9; i++) {
        let cell = document.createElement("div");
        cell.classList.add("cell");
        cell.setAttribute("data-id", i);
        cell.onclick = () => playerMove(i);
        boardDiv.appendChild(cell);
    }
}

// =============== LOGIKA 2 PLAYER =================
function playerMove(i) {
    if (gameOver) return;
    if (board[i] !== "") return;

    board[i] = currentPlayer;
    updateBoard();

    if (checkWinner(currentPlayer)) return endGame(true);
    if (isDraw()) return endGame(false);

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    document.getElementById("turnText").innerText = `PLAYER ${currentPlayer} TURN`;

    if (mode === "ai" && currentPlayer === "O") {
        setTimeout(aiMove, 400);
    }
}

// =============== UPDATE TAMPILAN =================
function updateBoard() {
    document.querySelectorAll(".cell").forEach((c, i) => {
        c.innerText = board[i];

        if (board[i] === "X") {
            c.style.color = "red";      // X merah
        } else if (board[i] === "O") {
            c.style.color = "cyan";     // O biru terang
        } else {
            c.style.color = "white";    // kosong
        }
    });
}

// =============== AI MOVE =================
function aiMove() {
    let move;
    if (difficulty === "Easy") {
        move = randomMove();
    } else if (difficulty === "Medium") {
        move = Math.random() < 0.25 ? randomMove() : minimaxMove();
    } else {
        move = minimaxMove();
    }

    board[move] = "O";
    updateBoard();

    if (checkWinner("O")) return endGame(true);
    if (isDraw()) return endGame(false);

    currentPlayer = "X";
    document.getElementById("turnText").innerText = `PLAYER X TURN`;
}

function randomMove() {
    let empty = board.map((v, i) => v === "" ? i : null).filter(v => v !== null);
    return empty[Math.floor(Math.random() * empty.length)];
}

// =============== MINIMAX =================
function minimaxMove() {
    let bestScore = -999;
    let move = 0;

    for (let i = 0; i < 9; i++) {
        if (board[i] === "") {
            board[i] = "O";
            let score = minimax(false);
            board[i] = "";
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

function minimax(isMax) {
    if (checkWinner("O")) return 10;
    if (checkWinner("X")) return -10;
    if (isDraw()) return 0;

    if (isMax) {
        let best = -999;
        for (let i = 0; i < 9; i++) {
            if (board[i] === "") {
                board[i] = "O";
                best = Math.max(best, minimax(false));
                board[i] = "";
            }
        }
        return best;
    } else {
        let best = 999;
        for (let i = 0; i < 9; i++) {
            if (board[i] === "") {
                board[i] = "X";
                best = Math.min(best, minimax(true));
                board[i] = "";
            }
        }
        return best;
    }
}

// =============== CEK MENANG =================
function checkWinner(p) {
    const win = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ];
    return win.some(c => 
        board[c[0]] === p && 
        board[c[1]] === p && 
        board[c[2]] === p
    );
}

function isDraw() {
    return board.every(c => c !== "");
}

// =============== AKHIR GAME =================
function endGame(win) {
    gameOver = true;

    let sticker = document.getElementById("sticker");
    sticker.style.display = "block";

    if (win) {
        document.getElementById("turnText").innerText = `PLAYER ${currentPlayer} WINS!`;
        sticker.src = "winner.png";
    } else {
        document.getElementById("turnText").innerText = "DRAW!";
        sticker.src = "loser.png";
    }
    document.getElementById("resetBtn").classList.remove("hidden");
    
}

function resetBoard() {
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameOver = false;

    document.getElementById("sticker").style.display = "none";
    document.getElementById("resetBtn").classList.add("hidden");
    document.getElementById("turnText").innerText = "PLAYER X TURN";

    updateBoard();
}

function backToMenu() {
    // Sembunyikan game
    document.getElementById("game").classList.add("hidden");

    // Tampilkan menu
    document.getElementById("menu").classList.remove("hidden");

    // Reset board
    board = ["", "", "", "", "", "", "", "", ""];
    gameOver = false;
    currentPlayer = "X";

    // Reset UI
    document.getElementById("sticker").style.display = "none";
    document.getElementById("resetBtn").classList.add("hidden");

    updateBoard();
}

function updateBoard() {
    document.querySelectorAll(".cell").forEach((c, i) => {
        c.innerText = ""; // hapus teks asli

        c.classList.remove("x", "o");

        if (board[i] === "X") {
            c.classList.add("x");
        } else if (board[i] === "O") {
            c.classList.add("o");
        }
    });
}

