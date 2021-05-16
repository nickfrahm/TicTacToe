//on load, create both players, default 1 to user & 2 to CPU
let playerX;
let playerO;

window.addEventListener("load", () => {
  playerX = playerFactory("Player 1", "X", true);
  playerO = playerFactory("Computer", "O", false);
});

//get player type options
const xTypePlayer = document.getElementById("Xplayer");
const xTypeComputer = document.getElementById("Xcomputer");
const oTypePlayer = document.getElementById("Oplayer");
const oTypeComputer = document.getElementById("Ocomputer");

[Xplayer, Xcomputer, Oplayer, Ocomputer].forEach((playerType) => {
  playerType.addEventListener("click", (e) => {
    game.handlePlayerSwitch(e.target.id);
  });
});

//add click listener--> main driver for game logic.
const boardTiles = document.querySelectorAll(".gameBoard__tile");
boardTiles.forEach((tile) => {
  tile.addEventListener("click", () => {
    if (playerX.checkHuman() && playerO.checkHuman()) {
      //on click, try and play a square and check winner (player v player)
      if (game.getTilesMarked() < 9) {
        if (game.checkTurn() === "X") {
          if (tile.firstChild.innerHTML === "") {
            game.increaseTilesMarked();
            tile.firstChild.innerHTML = playerX.marker;
            const sq = gameBoard.determineSquare(tile.id.toString());
            gameBoard.setBoard(sq[0], sq[1], playerX.marker);
            game.checkWinner(playerX.marker);
          }
        } else {
          if (tile.firstChild.innerHTML === "") {
            game.increaseTilesMarked();
            tile.firstChild.innerHTML = playerO.marker;
            const sq = gameBoard.determineSquare(tile.id.toString());
            gameBoard.setBoard(sq[0], sq[1], playerO.marker);
            game.checkWinner(playerO.marker);
          }
        }
      }
    } else {
      //handle computer response if computer vs player
      if (game.getTilesMarked() < 9) {
        if (game.checkTurn() === "X") {
          if (tile.firstChild.innerHTML === "") {
            game.increaseTilesMarked();
            tile.firstChild.innerHTML = playerX.marker;
            const sq = gameBoard.determineSquare(tile.id.toString());
            gameBoard.setBoard(sq[0], sq[1], playerX.marker);
            let won = game.checkWinner(playerX.marker);
            if (!won) {
              game.computerPlaceTile("O");
              game.checkWinner(playerO.marker);
            }
          }
        } else {
          if (tile.firstChild.innerHTML === "") {
            game.increaseTilesMarked();
            tile.firstChild.innerHTML = playerO.marker;
            const sq = gameBoard.determineSquare(tile.id.toString());
            gameBoard.setBoard(sq[0], sq[1], playerO.marker);
            let won = game.checkWinner(playerO.marker);
            if (!won) {
              game.computerPlaceTile("X");
              game.checkWinner(playerX.marker);
            }
          }
        }
      }
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

  const changePlayerType = () => {
    isHuman = !isHuman;
  };

  const checkHuman = () => {
    return isHuman;
  };

  return { changeName, getName, marker, checkHuman, changePlayerType };
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
    boardTiles.forEach((tile) => {
      tile.firstChild.innerHTML = "";
    });
  };

  //display board
  const displayBoard = () => {
    let flatBoard = board.flat();

    boardTiles.forEach((tile, index) => {
      tile.firstChild.innerHTML = flatBoard[index];
    });
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
  return { setBoard, clearBoard, determineSquare, board, displayBoard };
})();

//game module
const game = (() => {
  let scoreX = 0;
  let scoreO = 0;
  let tilesMarked = 0;
  const scoreBoardX = document.querySelector(".score__scoreX");
  const scoreBoardO = document.querySelector(".score__scoreO");

  const getTilesMarked = () => {
    return tilesMarked;
  };

  const increaseTilesMarked = () => tilesMarked++;
  const resetTilesMarked = () => (tilesMarked = 0);

  const increaseX = () => {
    scoreX++;
    scoreBoardX.innerHTML = `X: ${scoreX}`;
  };

  const increaseO = () => {
    scoreO++;
    scoreBoardO.innerHTML = `O: ${scoreO}`;
  };

  const resetScores = () => {
    scoreX = 0;
    scoreO = 0;
    scoreBoardX.innerHTML = `X: ${scoreO}`;
    scoreBoardO.innerHTML = `O: ${scoreO}`;
  };

  const checkWinner = (marker) => {
    if (checkRowW() || checkColW() || checkDiags()) {
      gameBoard.clearBoard();
      switch (marker) {
        case "X":
          increaseX();
          break;
        case "O":
          increaseO();
          break;
      }
      resetTilesMarked();
      if (!playerX.checkHuman()) {
        computerPlaceTile(playerX.marker);
      }
      return true;
    }
    return false;
  };

  const checkTurn = () => {
    if (tilesMarked % 2 === 0) {
      return "X";
    }
    return "O";
  };

  const checkRowW = () => {
    let marker = "";

    for (let i = 0; i < gameBoard.board.length; i++) {
      marker = gameBoard.board[i][0];
      let matches = 0;
      for (let j = 0; j < gameBoard.board[i].length; j++) {
        if (gameBoard.board[i][j] === marker) {
          matches++;
          if (matches === 3 && marker !== "") {
            return true;
          }
        }
      }
    }
    return false;
  };

  const checkColW = () => {
    let marker = "";

    for (let i = 0; i < gameBoard.board.length; i++) {
      marker = gameBoard.board[0][i];
      let matches = 0;
      for (let j = 0; j < gameBoard.board[i].length; j++) {
        if (gameBoard.board[j][i] === marker) {
          matches++;
          if (matches === 3 && marker !== "") {
            return true;
          }
        }
      }
    }
    return false;
  };

  const checkDiags = () => {
    let marker = gameBoard.board[0][0];
    if (
      marker === gameBoard.board[1][1] &&
      marker === gameBoard.board[2][2] &&
      marker !== ""
    ) {
      return true;
    } else {
      marker = gameBoard.board[0][2];
      if (
        marker === gameBoard.board[1][1] &&
        marker === gameBoard.board[2][0] &&
        marker !== ""
      ) {
        return true;
      }
      return false;
    }
  };

  const handlePlayerSwitch = (id) => {
    console.log(id);
    //if it's the X card
    if (id === "Xcomputer") {
      if (playerO.checkHuman()) {
        playerX.changePlayerType();
        xTypeComputer.classList.add("playerCard__option--active");
        xTypePlayer.classList.remove("playerCard__option--active");
        gameBoard.clearBoard();
        game.resetScores();
        computerPlaceTile(playerX.marker);
      }
    } else if (id === "Xplayer") {
      playerX.changePlayerType();
      xTypePlayer.classList.add("playerCard__option--active");
      xTypeComputer.classList.remove("playerCard__option--active");
      gameBoard.clearBoard();
      game.resetScores();
    }

    //if it's the O Card
    if (id === "Ocomputer") {
      if (playerX.checkHuman()) {
        playerO.changePlayerType();
        oTypeComputer.classList.add("playerCard__option--active");
        oTypePlayer.classList.remove("playerCard__option--active");
        gameBoard.clearBoard();
        game.resetScores();
      }
    } else if (id === "Oplayer") {
      playerO.changePlayerType();
      oTypePlayer.classList.add("playerCard__option--active");
      oTypeComputer.classList.remove("playerCard__option--active");
      gameBoard.clearBoard();
      game.resetScores();
    }
  };

  const computerPlaceTile = (marker) => {
    let rowIndex = 0;
    let colIndex = 0;
    let hasPlayed = false;

    while (!hasPlayed) {
      if (
        gameBoard.board[0].indexOf("") !== -1 ||
        gameBoard.board[1].indexOf("") !== -1 ||
        gameBoard.board[2].indexOf("") !== -1
      ) {

      rowIndex = Math.floor(Math.random() * 3);
      colIndex = Math.floor(Math.random() * 3);

      if (gameBoard.board[rowIndex][colIndex] === "") {
        hasPlayed = true;
        gameBoard.setBoard(rowIndex, colIndex, marker);
        gameBoard.displayBoard();
        increaseTilesMarked();
      }
      } else {
        hasPlayed = true;
      }
    }
  };

  return {
    resetScores,
    checkTurn,
    checkWinner,
    getTilesMarked,
    handlePlayerSwitch,
    computerPlaceTile,
    increaseTilesMarked,
  };
})();
