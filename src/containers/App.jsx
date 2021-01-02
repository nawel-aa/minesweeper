import React, { useState } from 'react';
import LevelPicker from '../components/LevelPicker';
import Grid from '../components/Grid';
// DEFINITION -- Levels:
// => Beginner has 10 mines, 9x9 grid
// => Intermediate has 40 mines, 16x16 grid
// => Expert has 99 mines, 16x30 grid
// => For personalized grid, (X-1)(Y-1) mines

// Generate the mines and the grid concept:
// => Generate an array with an entry for each tile, containing 0 for good tiles and X for mines.
// => Randomize this array.
// => Inside the array, split the entries into one array per row.

// DEFINITION -- Tiles next to each other:
// => In the current row (array), entries with index +1 and index -1.
// => In the next row, entries with index, index +1 and index -1.
// => In the previous row, entries with index, index +1 and index -1.

// Generate the numbers:
// => If the entry is a mine, skip.
// => For other entries, sum the number of mines that are next to it.
// => Replace the content of the entry with the right number.

// Generate the HTML grid:
// => For each array (row), generate a tr.
// => For each entry inside an array, generate a td:
// ----> Add a data-row = row index
// ----> Add a data-col = entry index
// ----> All of them have the class "unopened"

// On left click on a tile:
// => Remove its class "unopened"
// => Use its data-row and data-col to find the right tile in the grid.
// => If there is a mine, you lose
// => If the entry value > 0, add the right class.
// => Else, change its class to "opened", and check the tiles next to it:
// ----> If it has a number, open it.
// ----> If it is empty, open it and check the tiles next to it.

// On right click on a tile:
// => If it has the class "opened", do nothing.
// => If it has the class "flagged", remove it and add the class "question".
// => If it has the class "question", remove it.
// => Else, add the class "flagged".

const App = () => {
  const [mines, setMines] = useState(10);
  const [tiles, setTiles] = useState(81);
  const [level, setLevel] = useState('beginner');
  
  return (
    <div>
      <h1>Minesweeper</h1>

      {/* Level picker */}
      <LevelPicker setMines={setMines} setTiles={setTiles} level={level} setLevel={setLevel} />

      {/* Grid */}
      <Grid mines={mines} tiles={tiles} />
    </div>
  );
}

export default App;
