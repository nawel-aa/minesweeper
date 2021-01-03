import React, { useState } from 'react';
import LevelPicker from './LevelPicker';
import Dashboard from './Dashboard';
import Grid from './Grid';

// TODO:
// Add an option to pick the size of the grid.
// Add a timer.

// TODO:
// Prevent losing on first click (change position of mine to the first empty spot).

// TODO:
// When lost, if a flag was misplaced, show a mine with a X on top of it.

// TODO:
// Styling.

const App = () => {
  const [grid, setGrid] = useState([]);
  const [stateOfTheGame, setStateOfTheGame] = useState('notStarted');
  const [mines, setMines] = useState(0);

  return (
    <div>
      <h1>Minesweeper</h1>

      <LevelPicker setGrid={setGrid} setStateOfTheGame={setStateOfTheGame} stateOfTheGame={stateOfTheGame} setMines={setMines} />

      <div className='game'>
        <Dashboard stateOfTheGame={stateOfTheGame} mines={mines} />
        
        <Grid grid={grid} setStateOfTheGame={setStateOfTheGame} stateOfTheGame={stateOfTheGame} />
      </div>
    </div>
  );
}

export default App;
