const ticTacToe = (function () {

    const grid = document.querySelector('.grid');
    const result = document.querySelector('.result');
    const player1Btn = document.querySelector('.player1btn');
    const player2Btn = document.querySelector('.player2btn');
    const restartBtn = document.querySelector('.restartbtn');

    player1Btn.addEventListener('click', setPlayerName);
    player2Btn.addEventListener('click', setPlayerName);

    const playerFactory = (name, mark) => {
        return { name, mark };
    }

    const player1 = playerFactory('Player 1', 'X');
    const player2 = playerFactory('Player 2', 'O');

    function setPlayerName(event) {
        const targetList = event.target.textContent.split(' ');
        const target = `${targetList[1]} ${targetList[2]}`;
        const name = prompt(`What is ${target} name?`);
        const player = target === "Player 1's" ? player1 : player2;
        player.name = name;
    }

    function render(board) {
        grid.replaceChildren();
        for (let row = 0; row < board.length; row++) {
            for (let col = 0; col < board[0].length; col++) {
                const square = document.createElement('div');
                square.classList.add('square');
                square.textContent = board[row][col];
                if (row < 2) {
                    square.style.borderBottom = '1px solid black';
                }
                if (col < 2) {
                    square.style.borderRight = '1px solid black';
                }
                square.dataset.row = row;
                square.dataset.col = col;
                square.addEventListener('click', gameBoard.markBoard);
                grid.appendChild(square);
            }
        }
    }

    const gameBoard = (function () {

        let board = [];

        function createBoard() {
            board = [['', '', ''], ['', '', ''], ['', '', '']];
            render(board);
        };

        function markBoard(event) {
            const row = event.target.dataset.row;
            const col = event.target.dataset.col;
            if (!gameController.getGameOver() && !board[row][col]) {
                board[row][col] = gameController.getTurnPlayer().mark;
                render(board);
                gameController.checkForGameOver(row, col);
                gameController.incrementTurnCount();
            }
        }

        function getBoard() {
            return board.slice();
        }

        return { createBoard, markBoard, getBoard };
    })();

    const gameController = (function (player1, player2) {

        let gameOver = false;
        let turnCount = 0;

        function getGameOver() {
            return gameOver;
        }

        function getTurnPlayer() {
            return turnCount % 2 === 0 ? player1 : player2;
        }

        function checkForGameOver(row, col) {
            const board = gameBoard.getBoard();
            const player = getTurnPlayer();
            let thereIsAWinner = false;
            if (board[row][0] === player.mark &&
                board[row][1] === player.mark &&
                board[row][2] === player.mark) {
                thereIsAWinner = true;
            }
            if (board[0][col] === player.mark &&
                board[1][col] === player.mark &&
                board[2][col] === player.mark) {
                thereIsAWinner = true;
            }
            if (row === col &&
                board[0][0] === player.mark &&
                board[1][1] === player.mark &&
                board[2][2] === player.mark) {
                thereIsAWinner = true;
            }
            if ((Math.abs(col - row) === 2 || row === 1 && col === 1) &&
                board[0][2] === player.mark &&
                board[1][1] === player.mark &&
                board[2][0] === player.mark) {
                thereIsAWinner = true;
            }
            if (thereIsAWinner) {
                result.textContent = `${player.name} wins!`;
                gameOver = true;
            } else if (turnCount === 8) {
                result.textContent = 'The game ends in a tie!';
                gameOver = true;
            }
        }

        function incrementTurnCount() {
            turnCount++;
        }

        function startNewGame() {
            gameOver = false;
            turnCount = 0;
            gameBoard.createBoard();
            result.textContent = 'No Winner yet...';
        }

        return {
            getGameOver, getTurnPlayer, checkForGameOver,
            incrementTurnCount, startNewGame
        };
    })(player1, player2);

    restartBtn.addEventListener('click', gameController.startNewGame);
    gameController.startNewGame();
})();