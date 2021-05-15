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
          tile.firstChild.innerHTML = playerX.marker;
          const sq = gameBoard.determineSquare(tile.id.toString());
          gameBoard.setBoard(sq[0], sq[1], playerX.marker);
          game.checkWinner(playerX.marker);
        }
      } else {
        if (tile.firstChild.innerHTML === "") {
          tile.firstChild.innerHTML = playerO.marker;
          const sq = gameBoard.determineSquare(tile.id.toString());
          gameBoard.setBoard(sq[0], sq[1], playerO.marker);
          game.checkWinner(playerO.marker);
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
  }

  const checkHuman = () => {
    return isHuman;
  }

  return { changeName, getName, marker, checkHuman, changePlayerType};
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
    increaseTilesMarked();
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
        xTypeComputer.classList.add("playerCard__option--active")
        xTypePlayer.classList.remove("playerCard__option--active");
        gameBoard.clearBoard();
        game.resetScores();
      }
    } else if (id === "Xplayer") {
      playerX.changePlayerType();
      xTypePlayer.classList.add("playerCard__option--active");
      xTypeComputer.classList.remove("playerCard__option--active")
      gameBoard.clearBoard();
      game.resetScores();
    }

    //if it's the O Card
    if (id === "Ocomputer") {
      if (playerO.checkHuman()) {
        playerO.changePlayerType();
        oTypeComputer.classList.add("playerCard__option--active")
        oTypePlayer.classList.remove("playerCard__option--active");
        gameBoard.clearBoard();
        game.resetScores();
      }
    } else if (id === "Oplayer") {
      playerO.changePlayerType();
      oTypePlayer.classList.add("playerCard__option--active");
      oTypeComputer.classList.remove("playerCard__option--active")
      gameBoard.clearBoard();
      game.resetScores();
    }
  }

  return {
    resetScores, checkTurn, checkWinner, getTilesMarked, handlePlayerSwitch
  };
})();
