import React, { useState } from 'react';
import LevelPicker from '../components/LevelPicker';
import Grid from '../components/Grid';

// LEVELS:
// => Beginner has 10 mines, 9x9 grid
// => Intermediate has 40 mines, 16x16 grid
// => Expert has 99 mines, 16x30 grid
// => For personalized grid, (X-1)(Y-1) mines

// TODO:
// Add an option to pick the size of the grid.
// Add a timer.

// TODO:
// Handle winning and losing.

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

const openTile = (grid, row, col) => {
  const tile = document.querySelector(`[data-coord="${row}-${col}"]`);

  // Breaks the loop if the tile has already been opened
  if (tile && tile.classList.contains('opened')) {
    return;
  }

  if (grid[row][col] > 0) {
    tile.className = 'opened';
    tile.textContent = grid[row][col];
  }
  if (grid[row][col] === 0) {
    tile.className = 'opened';
    clickSurroundingTiles(grid, row, col);
  }
}

const clickSurroundingTiles = (grid, row, col) => {
  // On the same row
  openTile(grid, row, col + 1);
  openTile(grid, row, col - 1);

  // On the top row
  if (row > 0) {
    openTile(grid, row - 1, col);
    openTile(grid, row - 1, col + 1);
    openTile(grid, row - 1, col - 1);
  }

  // On the row below
  if (row < grid.length - 1) {
    openTile(grid, row + 1, col);
    openTile(grid, row + 1, col + 1);
    openTile(grid, row + 1, col - 1);
  }
}

const App = () => {
  const [level, setLevel] = useState('beginner');
  const [grid, setGrid] = useState(initGrid({ tiles: 81, mines: 10, rows: 9 }));
  const [stateOfTheGame, setStateOfTheGame] = useState('paused');

  // Left click logic
  // => If it's a mine, you lose.
  // => If it's a number, the tile opens and the number is displayed.
  // => If it's an empty tile, the tile and it's surrounding tiles open.
  const leftClickTile = (tile) => {
    const row = parseInt(tile.dataset.row);
    const col = parseInt(tile.dataset.col);
    const value = grid[row][col];
    
    if (value === 'X') {
      setStateOfTheGame('lost');
      const mineTiles = [];

      // Open all mines
      grid.forEach((row, rowIndex) => {
        row.forEach((tile, tileIndex) => {
          if (tile === 'X') {
            const mineElement = document.querySelector(`[data-coord="${rowIndex}-${tileIndex}"]`);
            mineTiles.push(mineElement);
          }
        })
      })
      mineTiles.forEach(mineTile => {
        mineTile.className = 'opened mine';
      });

      // Highlight mine clicked
      tile.classList.add('mine-clicked');
    } else if (value === 0) {
      tile.className = 'opened';
      clickSurroundingTiles(grid, row, col);
    } else {
      tile.className = 'opened';
      tile.textContent = value;
    }
  }

  // Right click logic
  // => First click adds a flag.
  // => Second click transforms it into a question mark.
  // => Third click resets it.
  const rightClickTile = (tile) => {
    if (tile.classList.contains('opened')) {
      return;
    } else if (tile.classList.contains('flagged')) {
      tile.classList.remove('flagged');
      tile.classList.add('question');
    } else if (tile.classList.contains('question')) {
      tile.classList.remove('question');
    } else {
      tile.classList.add('flagged');
    }
  }

  return (
    <div>
      <h1>Minesweeper</h1>

      <LevelPicker setGrid={setGrid} initGrid={initGrid} setLevel={setLevel} level={level} />

      <Grid grid={grid} leftClickTile={leftClickTile} rightClickTile={rightClickTile} />
    </div>
  );
}

export default App;
