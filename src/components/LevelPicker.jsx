import React, { useState } from 'react';


const LevelPicker = (props) => {
  // Initialize the form with the default level already checked
  const [levelChecked, setLevelChecked] = useState(props.level);

  const handleSubmit = (event) => {
    event.preventDefault();

    const inputs = event.target.querySelectorAll('input[name="level"]');
    const level = Array.from(inputs).find(input => input.checked).value;

    props.setLevel(level);
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