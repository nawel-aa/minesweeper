import React from 'react';

const Dashboard = (props) => {
  const { mines, stateOfTheGame } = props;

  let message = '😴';
  switch (stateOfTheGame) {
    case 'running':
      message = '🙂';
      break;
    case 'won':
      message = 'You won. 😎';
      break;
    case 'lost':
      message = 'You lost. 😖';
      break;
    // no default
  }

  return (
    <div className="dashboard">
        <div>
          <p>{mines}</p>
        </div>
        <div>
          <p>{message}</p>
        </div>
        <div>
          <p>Timer</p>
        </div>
      </div>
  );
}

export default Dashboard;