import React, { useState } from 'react';


const LevelPicker = (props) => {
  const [levelChecked, setLevelChecked] = useState(props.level);

  const handleSubmit = (event) => {
    event.preventDefault();

    const level = event.target.value;
    props.setLevel(level);

    switch (level) {
      case 'intermediate':
        props.setMines(40);
        props.setTiles(256);
        break;
      case 'expert':
        props.setMines(99);
        props.setTiles(480);
        break;
      default:
        props.setMines(10);
        props.setTiles(81);
        break;
    }
  }

  const handleChange = (event) => {
    setLevelChecked(event.target.value);
  }

  return (
    <div>
      <h2>Level</h2>
      <form onSubmit={handleSubmit}>
        <input type="radio" name="level" value="beginner" id="beginner" checked={levelChecked === 'beginner'} onChange={handleChange}/>
        <label htmlFor="beginner">Beginner</label>

        <input type="radio" name="level" value="intermediate" id="intermediate" checked={levelChecked === 'intermediate'} onChange={handleChange}/>
        <label htmlFor="intermediate">Intermediate</label>

        <input type="radio" name="level" value="expert" id="expert" checked={levelChecked === 'expert'} onChange={handleChange}/>
        <label htmlFor="expert">Expert</label>

        <button>Restart the game</button>
      </form>
    </div>
  );
};

export default LevelPicker;