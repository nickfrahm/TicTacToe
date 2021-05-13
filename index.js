const gameBoard = (() => {
    const board = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""]
    ]
    const setBoard = (row, column, letter) => {
        board[row][column] = letter;
    }
    const clearBoard = () => {
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                board[i][j] = "";
            }
        }
    }
    return {setBoard, clearBoard, board};
})();

const game = (() => {
    let scoreX = 0;
    let scoreO = 0;

    const increaseX = () => {
        scoreX++;
    }

    const increaseO = () => {
        scoreO++;
    }

    const getScores = () => {
        return [scoreX, scoreO];
    }

    const resetScores = () => {
        scoreX = 0;
        scoreO = 0;
    }

    return {increaseX, increaseO, getScores, resetScores}
})();