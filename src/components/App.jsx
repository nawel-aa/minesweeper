import React, { useState } from 'react';
import LevelPicker from './LevelPicker';
import Dashboard from './Dashboard';
import Grid from './Grid';

// TODO:
// Add an option to pick the size of the grid.

// TODO:
// When lost, if a flag was misplaced, show a mine with a X on top of it.

// TODO:
// Styling.


// Uses the Fisher-Yates algorithm to shuffle the array
const shuffle = (array) => {
  let i = array.length;
  let randomIndex;

  while(i !== 0) {
    randomIndex = Math.floor(Math.random() * i);
    i -= 1;

    [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
  }

  return array;
};

// Takes an array or arrays.
// For each tile of these arrays, counts the mines in the surrounding tiles and replaces the tile's value by the sum.
// Returns the new array of arrays.
const countMinesNextToTiles = (grid) => {
  return grid.map((row, rowIndex) => {
    return row.map((tile, tileIndex) => {
      // If the tile is not a mine, sum the number of mines next to it
      if (tile !== 'X') {
        let numberOfMines = 0;

        // Tiles next to this tile, on the same row
        if (row[tileIndex + 1] === 'X') {
          numberOfMines += 1;
        }
        if (row[tileIndex - 1] === 'X') {
          numberOfMines += 1;
        }

        // Tiles next to this tile, on the row before
        if (rowIndex > 0) {
          if (grid[rowIndex - 1][tileIndex] === 'X') {
            numberOfMines += 1;
          }
          if ((grid[rowIndex + 1] !== undefined) && (grid[rowIndex - 1][tileIndex + 1] === 'X')) {
            numberOfMines += 1;
          }
          if (tileIndex > 0 && grid[rowIndex - 1][tileIndex - 1] === 'X') {
            numberOfMines += 1;
          }
        }

        // Tiles next to this tile, on the row after
        if (rowIndex < grid.length - 1) {
          if (grid[rowIndex + 1][tileIndex] === 'X') {
            numberOfMines += 1;
          }
          if (grid[rowIndex + 1][tileIndex + 1] === 'X') {
            numberOfMines += 1;
          }
          if (tileIndex > 0 && grid[rowIndex + 1][tileIndex - 1] === 'X') {
            numberOfMines += 1;
          }
        }
        return numberOfMines;
      }
      return 'X';
    });
  });
}

// Returns an array of arrays. Each array is a row, containing one tile per column. For a grid of 3 x 3, we would have:
// [
//  [tile-col1, tile-col2, tile-col3],
//  [tile-col1, tile-col2, tile-col3],
//  [tile-col1, tile-col3, tile-col3]
// ]
const initGrid = ({ tiles, mines, rows }) => {
  const tilesArray = [];

  // Add the good tiles
  for (let i = 0; i < tiles - mines; i += 1) {
    tilesArray.push(0);
  }

  // Add the mine tiles
  for (let i = 0; i < mines; i += 1) {
    tilesArray.push('X');
  }
  
  shuffle(tilesArray);

  const grid = [];
  const tilesPerRow = tilesArray.length / rows;

  // Cut the array into rows.
  for (let i = 1; i <= rows; i += 1) {
    const rowEndIndex = i * tilesPerRow;
    const rowBeginIndex = (i - 1) * tilesPerRow;
    grid.push(tilesArray.slice(rowBeginIndex, rowEndIndex));
  }

  // Add the number tiles
  return countMinesNextToTiles(grid);
};


const App = () => {
  const [grid, setGrid] = useState([]);
  const [stateOfTheGame, setStateOfTheGame] = useState('notStarted');
  const [mines, setMines] = useState(0);
  const [firstClickMine, setFirstClickMine] = useState(null);

  return (
    <div>
      <h1>Minesweeper</h1>

      <LevelPicker
        setGrid={setGrid}
        setStateOfTheGame={setStateOfTheGame}
        stateOfTheGame={stateOfTheGame}
        setMines={setMines}
        initGrid={initGrid}
      />

      <div className='game'>
        <Dashboard stateOfTheGame={stateOfTheGame}
          mines={mines}
        />
        
        <Grid
          grid={grid}
          setStateOfTheGame={setStateOfTheGame}
          stateOfTheGame={stateOfTheGame}
          countMinesNextToTiles={countMinesNextToTiles}
          setGrid={setGrid}
          firstClickMine={firstClickMine}
          setFirstClickMine={setFirstClickMine}
        />
      </div>
    </div>
  );
}

export default App;
