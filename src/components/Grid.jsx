import React from 'react';

const openTile = (grid, row, col) => {
  const tile = document.querySelector(`[data-coord="${row}-${col}"]`);

  // Breaks the loop if the tile has already been opened
  if (tile && tile.classList.contains('open')) {
    return;
  }

  if (grid[row][col] > 0) {
    tile.className = 'open';
    tile.textContent = grid[row][col];
  }
  if (grid[row][col] === 0) {
    tile.className = 'open';
    clickSurroundingTiles(grid, row, col);
  }
}

const clickSurroundingTiles = (grid, row, col) => {
  // On the same row
  openTile(grid, row, col + 1);
  openTile(grid, row, col - 1);

  // On the top row
  if (row > 0) {
    openTile(grid, row - 1, col);
    openTile(grid, row - 1, col + 1);
    openTile(grid, row - 1, col - 1);
  }

  // On the row below
  if (row < grid.length - 1) {
    openTile(grid, row + 1, col);
    openTile(grid, row + 1, col + 1);
    openTile(grid, row + 1, col - 1);
  }
}

const Grid = (props) => {
  const { stateOfTheGame, setStateOfTheGame, grid } = props;

  // Left click logic
  // => If it's a mine, you lose.
  // => If it's a number, the tile opens and the number is displayed.
  // => If it's an empty tile, the tile and it's surrounding tiles open.
  const handleLeftClick = (event) => {
    switch (stateOfTheGame) {
      case 'lost':
        return;
      case 'won':
        return;
      case 'notStarted':
        setStateOfTheGame('running');
        break;
      // no default
    }

    const tile = event.target;
    const row = parseInt(tile.dataset.row);
    const col = parseInt(tile.dataset.col);
    const value = grid[row][col];
    
    // If the tile is a mine
    if (value === 'X') {
      setStateOfTheGame('lost');
      const mineTiles = [];

      // Open all mines
      grid.forEach((row, rowIndex) => {
        row.forEach((tile, tileIndex) => {
          if (tile === 'X') {
            const mineElement = document.querySelector(`[data-coord="${rowIndex}-${tileIndex}"]`);
            mineTiles.push(mineElement);
          }
        })
      })
      mineTiles.forEach(mineTile => {
        mineTile.className = 'open mine';
      });

      // Highlight mine clicked
      tile.classList.add('mine-clicked');

    // If the tile is empty
    } else if (value === 0) {
      tile.className = 'open';
      clickSurroundingTiles(grid, row, col);

    // If the tile is a number
    } else {
      tile.className = 'open';
      tile.textContent = value;
    }

    // If only mines are unopen, game is won.
    const unopenTiles = Array.from(document.querySelectorAll('.unopen'));
    const won = unopenTiles.every(tile => {
      const row = parseInt(tile.dataset.row);
      const col = parseInt(tile.dataset.col);
      return grid[row][col] === 'X';
    });
    if (won) {
      setStateOfTheGame('won');
      return;
    }
  }

  // Right click logic
  // => First click adds a flag.
  // => Second click transforms it into a question mark.
  // => Third click resets it.
  const handleRightClick = (event) => {
    event.preventDefault();

    switch (stateOfTheGame) {
      case 'lost':
        return;
      case 'won':
        return;
      case 'notStarted':
        setStateOfTheGame('running');
        break;
      // no default
    }
    
    const tile = event.target;
    if (tile.classList.contains('open')) {
      return;
    } else if (tile.classList.contains('flagged')) {
      tile.classList.remove('flagged');
      tile.classList.add('question');
    } else if (tile.classList.contains('question')) {
      tile.classList.remove('question');
    } else {
      tile.classList.add('flagged');
    }
  }

  return (
    <table>
      <tbody>
        {props.grid.map((row, rowIndex) => {
          return (
            <tr key={`${rowIndex} ${row}`}>
              {row.map((tile, tileIndex) => {
                return(
                  <td key={`${rowIndex}-${tileIndex}`} data-row={rowIndex} data-col={tileIndex} data-coord={`${rowIndex}-${tileIndex}`} className="unopen" onClick={handleLeftClick} onContextMenu={handleRightClick}>
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