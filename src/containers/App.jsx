import React, { useEffect, useState } from 'react';
import LevelPicker from '../components/LevelPicker';
import Grid from '../components/Grid';

// LEVELS:
// => Beginner has 10 mines, 9x9 grid
// => Intermediate has 40 mines, 16x16 grid
// => Expert has 99 mines, 16x30 grid
// => For personalized grid, (X-1)(Y-1) mines

// TODO: 
// On right click on a tile:
// => If it has the class "opened", do nothing.
// => If it has the class "flagged", remove it and add the class "question".
// => If it has the class "question", remove it.
// => Else, add the class "flagged".

// TODO:
// Refresh the grid that has already been played when the level changes.
// Add an option to pick the size of the grid.

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
    const rowEndIndex = (i * tilesPerRow) - 1;
    const rowBeginIndex = (i - 1) * tilesPerRow;
    grid.push(tilesArray.slice(rowBeginIndex, rowEndIndex));
  }

  // Add the number tiles
  return countMinesNextToTiles(grid);
};

const App = () => {
  const [mines, setMines] = useState(10);
  const [tiles, setTiles] = useState(81);
  const [level, setLevel] = useState('beginner');
  const [rows, setRows] = useState(9);
  const [grid, setGrid] = useState(initGrid({tiles, mines, rows}));

  useEffect(() => {
    switch (level) {
      case 'intermediate':
        setMines(40);
        setTiles(256);
        setRows(16);
        break;
      case 'expert':
        setMines(99);
        setTiles(480);
        setRows(16);
        break;
      default:
        setMines(10);
        setTiles(81);
        setRows(9);
        break;
    }

    setGrid(initGrid({tiles, mines, rows}));
  }, [tiles, mines, rows, level])

  const openTile = (row, col) => {
    const tile = document.querySelector(`[data-coord="${row}-${col}"]`);

    // Breaks the loop if the tile has already been opened
    if (tile && tile.classList.contains('opened')) {
      return;
    }

    if (grid[row][col] >= 0) {
      tile.className = 'opened';
    }
    if (grid[row][col] === 0) {
      clickSurroundingTiles(row, col);
    }
  }

  const clickSurroundingTiles = (row, col) => {
    // On the same row
    openTile(row, col + 1);
    openTile(row, col - 1);

    // On the top row
    if (row > 0) {
      openTile(row - 1, col);
      openTile(row - 1, col + 1);
      openTile(row - 1, col - 1);
    }

    // On the row below
    if (row < grid.length - 1) {
      openTile(row + 1, col);
      openTile(row + 1, col + 1);
      openTile(row + 1, col - 1);
    }
  }

  const leftClickTile = (tile) => {
    const row = parseInt(tile.dataset.row);
    const col = parseInt(tile.dataset.col);
    const value = grid[row][col];
    
    if (value === 'X') {
      tile.className = 'mine opened';
    } else if (value === 0) {
      tile.className = 'opened';
      clickSurroundingTiles(row, col);
    } else {
      tile.className = 'opened';
    }
  }
  
  return (
    <div>
      <h1>Minesweeper</h1>

      {/* Level picker */}
      <LevelPicker level={level} setLevel={setLevel}/>

      {/* Grid */}
      <Grid grid={grid} leftClickTile={leftClickTile} />
    </div>
  );
}

export default App;
