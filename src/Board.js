import React, { useEffect, useState } from "react";
import "./Board.css"; // Import the CSS file
import { useNavigate } from "react-router-dom";

function Board({ params }) {
  const [isGameOver, setGameOver] = useState(false);
  const [board, setBoard] = useState([]);
  const [flags, setFlags] = useState(0);
  const [results, setResults] = useState("");
  const [gameParams, setparams] = useState({});
  const [isLoading, setLoading] = useState(true); 
  const Navigate = useNavigate();

  useEffect(() => {
    console.log(params)
    if (params === "Easy") {
        setparams({
            rows:10,
            columns:10,
            mines:10
        })
    } else if(params === "Medium") {
        setparams({
            rows:15,
            columns:15,
            mines:40
        })
    } else if(params === "Hard") {
        setparams({
            rows:16,
            columns:30,
            mines:99
        })
    } else {
        setGameOver(true)
        setResults("How did you get here...")
    }
  }, []);

  useEffect(() => {
    if (gameParams.rows && gameParams.columns) {
      createBoard();
      setFlags(gameParams.mines);
    }
  }, [gameParams]);

  function goHome() {
    Navigate("/");
  }

  useEffect(() => {
    if (board.length > 0) {
      setLoading(false); 
    }
  }, [board]);

  function checkWin() {
    let revealedCells = 0;
    let totalCells = 0;

    board.forEach((row) => {
      row.forEach((cell) => {
        totalCells++;
        if (cell.isRevealed || (cell.isMine && cell.isFlagged)) {
          revealedCells++;
        }
      });
    });

    if (revealedCells === totalCells) {
      setGameOver(true);
      setResults("Congrats You Won!");
    }
  }

  function createBoard() {
    let newBoard = [];
    for (let row = 0; row < gameParams.rows; row++) {
      let boardRow = [];
      for (let column = 0; column < gameParams.columns; column++) {
        boardRow.push({
          nearMines: 0,
          isRevealed: false,
          isMine: false,
          isFlagged: false,
        });
      }
      newBoard.push(boardRow);
    }
    calculateMines(newBoard); 
    setBoard(newBoard);
  }
  

  function flagCell(cell) {
    if (!cell.isRevealed) {
      cell.isFlagged = !cell.isFlagged;
      setFlags(flags + (cell.isFlagged ? -1 : 1));
    }
    checkWin();
    setBoard([...board]);
  }

  function checkClick(cell) {
    if (cell.isFlagged || cell.isRevealed) return;
    if (cell.isMine) {
      setGameOver(true);
      return;
    }
    cell.isRevealed = true;
    setBoard([...board]);
    checkWin();
  }

  function calculateMines(newBoard) {
    let placedMines = 0;
    while (placedMines < gameParams.mines) {
      let row = Math.floor(Math.random() * gameParams.rows);
      let column = Math.floor(Math.random() * gameParams.columns);
      if (!newBoard[row][column].isMine) {
        newBoard[row][column].isMine = true;
        placedMines++;
      }
    }
    calculateNearMines(newBoard);
  }

  function calculateNearMines(newBoard) {
    const rows = gameParams.rows;
    const cols = gameParams.columns;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (newBoard[row][col].isMine) continue;

        let adjacentMines = 0;
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            const newRow = row + i;
            const newCol = col + j;
            if (
              newRow >= 0 &&
              newRow < rows &&
              newCol >= 0 &&
              newCol < cols &&
              newBoard[newRow][newCol].isMine
            ) {
              adjacentMines++;
            }
          }
        }
        newBoard[row][col].nearMines = adjacentMines;
      }
    }
  }

  function displayMines() {
    return (
      <div className="mine-holder">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                onContextMenu={(e) => {
                  e.preventDefault();
                  flagCell(cell);
                }}
                onClick={() => checkClick(cell)}
                className={`cell ${cell.isRevealed ? "revealed" : ""}`}
              >
                {cell.isFlagged
                  ? "🚩"
                  : cell.isRevealed
                  ? cell.isMine
                    ? "🌸"
                    : cell.nearMines
                  : ""}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="board">
      <section className="score">Flags left: {flags}</section>
      {!isGameOver ? (
        isLoading ? <p>Loading...</p> : displayMines() 
      ) : (
        <section className="display-results">
          <>
            {results}
            <button className="try-again" onClick={goHome}>
              Try Again?
            </button>
          </>
        </section>
      )}
    </div>
  );
}

export default Board;
