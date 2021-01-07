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


const LevelPicker = (props) => {
  const [levelChecked, setLevelChecked] = useState('');
  const { setGrid, setStateOfTheGame, setMines, initGrid } = props;

  // Initialization with beginner level
  useEffect(() => {
    setGrid(initGrid(levels.beginner));
    setMines(levels.beginner.mines);
    setLevelChecked('beginner');
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

        <button>New game</button>
      </form>
    </div>
  );
};

export default LevelPicker;