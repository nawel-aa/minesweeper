import React from 'react';

const Grid = (props) => {

  const handleLeftClick = (event) => {
    props.leftClickTile(event.target);
  }
  
  const handleRightClick = (event) => {
    event.preventDefault();
    props.rightClickTile(event.target);
  }

  return (
    <table>
      <tbody>
        {props.grid.map((row, rowIndex) => {
          return (
            <tr key={`${rowIndex} ${row}`}>
              {row.map((tile, tileIndex) => {
                return(
                  <td key={`${rowIndex}-${tileIndex}`} data-row={rowIndex} data-col={tileIndex} data-coord={`${rowIndex}-${tileIndex}`} className="unopened" onClick={handleLeftClick} onContextMenu={handleRightClick}>
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Grid;