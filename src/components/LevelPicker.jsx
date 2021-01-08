import React, { useState, useEffect } from 'react';

// LEVELS:
// => Beginner has 10 mines, 9x9 grid
// => Intermediate has 40 mines, 16x16 grid
// => Expert has 99 mines, 16x30 grid
// => For custom grid, 15% of mines (approx. intermediate)
const levels = {
  beginner: { tiles: 81, mines: 10, rows: 9 },
  intermediate: {tiles: 256, mines: 40, rows: 16},
  expert: {tiles: 480, mines: 99, rows: 16}
};


const LevelPicker = (props) => {
  const [levelChecked, setLevelChecked] = useState('');
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
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
      case 'custom':
        if (height > 3 && width > 3) {
          setGrid(initGrid({
            tiles: width * height,
            mines: Math.floor(width * height * 0.15),
            rows: height
          }));
          setMines(Math.floor(width * height * 0.15));
        }
        break;
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
    const level = event.target.value;
    setLevelChecked(level);

    const customSizeWrapper = document.querySelector('.custom-size');

    if (level === 'custom') {
      customSizeWrapper.classList.remove('hidden');
    } else {
      customSizeWrapper.classList.add('hidden');
    }
  }

  const handleCustomSize = (event) => {
    const name = event.target.name;
    const error = document.querySelector(`.error-${name}`);
    const value = parseInt(event.target.value);

    if (value > 2) {
      error.classList.add('hidden');
      name === 'height' ? setHeight(value) : setWidth(value);
    } else {
      error.classList.remove('hidden');
      error.textContent = 'Must be a number greater than 2';
    }
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

        <input type="radio" name="level" value="custom" id="custom" checked={levelChecked === 'custom'} onChange={checkLevel}/>
        <label htmlFor="custom">Custom</label>
        <div className="custom-size hidden">
          <label htmlFor="width">Width</label>
          <input type="number" id="width" name="width" onBlur={handleCustomSize}/>
          <p className="error-width hidden"></p>
          <label htmlFor="height">Height</label>
          <input type="number" id="height" name="height" onBlur={handleCustomSize}/>
          <p className="error-height hidden"></p>
        </div>

        <button>New game</button>
      </form>
    </div>
  );
};

export default LevelPicker;