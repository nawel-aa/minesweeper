import React, { useState, useEffect } from 'react';

// LEVELS:
// => Beginner has 10 mines, 9x9 grid
// => Intermediate has 40 mines, 16x16 grid
// => Expert has 99 mines, 16x30 grid
// => For personalized grid, (X-1)(Y-1) mines
const levels = {
  beginner: { tiles: 81, mines: 10, rows: 9 },
  intermediate: {tiles: 256, mines: 40, rows: 16},
  expert: {tiles: 480, mines: 99, rows: 16}
};

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

const LevelPicker = (props) => {
  const [levelChecked, setLevelChecked] = useState('');
  const { setGrid, setStateOfTheGame, setMines } = props;

  // Initialization with beginner level
  useEffect(() => {
    setGrid(initGrid(levels.beginner));
    setMines(levels.beginner.mines);
    setLevelChecked('beginner');
  }, [])

  const handleSubmit = (event) => {
    event.preventDefault();

    setStateOfTheGame('notStarted');

    switch (levelChecked) {
      case 'intermediate':
        setGrid(initGrid(levels.intermediate));
        setMines(levels.intermediate.mines);
        break;
      case 'expert':
        setGrid(initGrid(levels.expert));
        setMines(levels.expert.mines);
        break;
      default:
        setGrid(initGrid(levels.beginner));
        setMines(levels.beginner.mines);
        break;
    }
  }

  const checkLevel = (event) => {
    setLevelChecked(event.target.value);
  }

  return (
    <div>
      <h2>Level</h2>
      <form onSubmit={handleSubmit}>
        <input type="radio" name="level" value="beginner" id="beginner" checked={levelChecked === 'beginner'} onChange={checkLevel}/>
        <label htmlFor="beginner">Beginner</label>

        <input type="radio" name="level" value="intermediate" id="intermediate" checked={levelChecked === 'intermediate'} onChange={checkLevel}/>
        <label htmlFor="intermediate">Intermediate</label>

        <input type="radio" name="level" value="expert" id="expert" checked={levelChecked === 'expert'} onChange={checkLevel}/>
        <label htmlFor="expert">Expert</label>

        <button>Restart the game</button>
      </form>
    </div>
  );
};

export default LevelPicker;