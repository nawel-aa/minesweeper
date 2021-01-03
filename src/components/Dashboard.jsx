import React, { useEffect, useState, useRef } from 'react';

const Dashboard = (props) => {
  const { mines, stateOfTheGame } = props;
  const [message, setMessage] = useState('😴');
  const [timerStart, setTimerStart] = useState(null);
  const [timer, setTimer] = useState('00:00');
  const [intervalId, setIntervalId] = useState(null);
  const isInitialMount = useRef(true);


  // TIMER : 
  // On enregistre l'heure au moment du départ.
  // On affiche l'heure de maintenant moins l'heure de départ.
  // On actualise toutes les secondes.
  
  useEffect(() => {
    switch (stateOfTheGame) {
      case 'running':
        setMessage('🙂');
        setTimerStart(Date.now);
        break;
      case 'won':
        setMessage('😎');
        break;
      case 'lost':
        setMessage('😖');
        break;
      default:
        setMessage('😴');
        setTimer('00:00');
        break;
    }
    return (clearInterval(intervalId));
  }, [stateOfTheGame])

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      setIntervalId(setInterval(() => {
        const ms = Date.now() - timerStart;
        setTimer(new Date(ms).toISOString().substring(14, 19));
      }, 1000));
    }
  }, [timerStart])

  return (
    <div className="dashboard">
      <div>
        <p>{mines}</p>
      </div>
      <div>
        <p>{message}</p>
      </div>
      <div>
        <p>{timer}</p>
      </div>
    </div>
  );
}

export default Dashboard;