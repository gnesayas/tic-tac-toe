const ticTacToe = (function () {

    const container = document.querySelector('.container');
    const result = document.querySelector('.result');

    function render(board) {
        container.replaceChildren();
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
                container.appendChild(square);
            }
        }
    }

    const gameBoard = (function () {

        let board = [];

        function createBoard() {
            board = [['', '', ''], ['', '', ''], ['', '', '']];
            render(board);
            gameController.resetTurnCount();
        };

        function markBoard(event) {
            const row = event.target.dataset.row;
            const col = event.target.dataset.col;
            if (!board[row][col]) {
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

    const playerFactory = (name, mark) => {
        return { name, mark };
    }

    const player = playerFactory('Player', 'X');
    const computer = playerFactory('Computer', 'O');

    const gameController = (function (player, computer) {

        let turnCount = 0;

        function getTurnCount() {
            return turnCount;
        }

        function getTurnPlayer() {
            return turnCount % 2 === 0 ? player : computer;
        }

        function incrementTurnCount() {
            turnCount++;
        }

        function resetTurnCount() {
            turnCount = 0;
        }

        function checkForGameOver(row, col) {
            const board = gameBoard.getBoard();
            const player = gameController.getTurnPlayer();
            let noWinner = true;
            if (board[row][0] === player.mark &&
                board[row][1] === player.mark &&
                board[row][2] === player.mark) {
                noWinner = false;
            }
            if (board[0][col] === player.mark &&
                board[1][col] === player.mark &&
                board[2][col] === player.mark) {
                noWinner = false;
            }
            if (row === col) {
                if (board[0][0] === player.mark &&
                    board[1][1] === player.mark &&
                    board[2][2] === player.mark) {
                    noWinner = false;
                }
            }
            if (Math.abs(col - row) === 2 || row === 1 && col === 1) {
                if (board[0][2] === player.mark &&
                    board[1][1] === player.mark &&
                    board[2][0] === player.mark) {
                    noWinner = false;
                }
            }
            if (!noWinner) {
                result.textContent = `${player.name} wins!`;
            } else if (gameController.getTurnCount() === 8) {
                result.textContent = 'The game ends in a tie!';
            }
        }

        return {
            getTurnCount, getTurnPlayer, incrementTurnCount,
            resetTurnCount, checkForGameOver
        };
    })(player, computer);

    gameBoard.createBoard();
})();