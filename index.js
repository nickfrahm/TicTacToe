//on load, create both players, default 1 to user & 2 to CPU
let playerX;
let playerO;

window.addEventListener("load", () => {
  playerX = playerFactory("Player 1", "X", true);
  playerO = playerFactory("Computer", "O", false);
});

//add click listener--> main driver for game logic.
const boardTiles = document.querySelectorAll(".gameBoard__tile");
boardTiles.forEach((tile) => {
  tile.addEventListener("click", () => {
    //on click, try and play a square and check winner
    if (game.getTilesMarked() < 9) {
      if (game.checkTurn() === "X") {
        tile.firstChild.innerHTML = playerX.marker;
        const sq = gameBoard.determineSquare(tile.id.toString());
        gameBoard.setBoard(sq[0], sq[1], playerX.marker);
      } else {
        tile.firstChild.innerHTML = playerO.marker;
        const sq = gameBoard.determineSquare(tile.id.toString());
        gameBoard.setBoard(sq[0], sq[1], playerO.marker);
      }
      //console.log(gameBoard.board)
      game.checkWinner();
    }
  });
});

//player factory
const playerFactory = (name, marker, isHuman) => {
  const getName = () => {
    return name;
  };

  const changeName = (newName) => {
    name = newName;
  };

  return { changeName, getName, marker };
};

//board module pattern
const gameBoard = (() => {
  const board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];
  const setBoard = (row, column, marker) => {
    board[row][column] = marker;
  };
  const clearBoard = () => {
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        board[i][j] = "";
      }
    }
  };
  const determineSquare = (tileId) => {
    //breakdown the id into which column and row and return in an array
    //used for sending into setBoard;
    let rowCol = [];
    switch (tileId[0]) {
      case "t":
        rowCol[0] = 0;
        break;
      case "m":
        rowCol[0] = 1;
        break;
      case "b":
        rowCol[0] = 2;
        break;
    }
    switch (tileId[1]) {
      case "l":
        rowCol[1] = 0;
        break;
      case "m":
        rowCol[1] = 1;
        break;
      case "r":
        rowCol[1] = 2;
        break;
    }
    return rowCol;
  };
  return { setBoard, clearBoard, determineSquare, board };
})();

//game module
const game = (() => {
  let scoreX = 0;
  let scoreO = 0;
  let tilesMarked = 0;

  const getTilesMarked = () => {
    return tilesMarked;
  };

  const increaseTilesMarked = () => tilesMarked++;

  const increaseX = () => scoreX++;

  const increaseO = () => scoreO++;

  const getScores = () => {
    return [scoreX, scoreO];
  };

  const resetScores = () => {
    scoreX = 0;
    scoreO = 0;
  };

  const checkWinner = () => {
    increaseTilesMarked();
    if (checkRowW() || checkColW() || checkLeftToRightDiag()) {
      console.log("winner");
    }
  };

  const checkTurn = () => {
    if (tilesMarked % 2 === 0) {
      return "X";
    }
    return "O";
  };

  const checkRowW = () => {
    let marker = "";
    let match = false;
    const {board} = gameBoard.board

    for (let row = 0; row < board.length; row++) {
        marker = board[row][0]; //set the first element of the row = marker
    }
    return match;
  };

  const checkColW = () => {
    let marker = "";
    let match = false;

    return match;
  };

  const checkLeftToRightDiag = () => {};
  return {
    increaseX,
    increaseO,
    getScores,
    resetScores,
    checkTurn,
    checkWinner,
    getTilesMarked,
  };
})();
