import React, { useEffect } from 'react';

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

const isGameWon = (grid) => {
  // If only mines are unopen, game is won.
  const unopenTiles = Array.from(document.querySelectorAll('.unopen'));
  return unopenTiles.every(tile => {
    const row = parseInt(tile.dataset.row);
    const col = parseInt(tile.dataset.col);
    return grid[row][col] === 'X';
  });
}

const openAllMines = (grid) => {
      const mineTiles = [];

      // Open all mines
      grid.forEach((row, rowIndex) => {
        row.forEach((tile, tileIndex) => {
          const mineElement = document.querySelector(`[data-coord="${rowIndex}-${tileIndex}"]`);

          if (tile === 'X') {
            mineTiles.push(mineElement);
            // Highlight flagged tiles that didn't have a mine.
          } else if (mineElement.className.includes('flagged')) {
            mineElement.className = 'open wrong-flag';
          }
        })
      })
      mineTiles.forEach(mineTile => {
        mineTile.className = 'open mine';
      });
}

const removeClickedMine = (grid, row, col) => {
  // Switch the mine with the first empty tile of the grid.
  let i = 0;
  let value = 'X';
  let updatedGrid = grid;
  while (value === 'X') {
    const emptyTileIndex = updatedGrid[i].findIndex(tile => tile === 0);
    if (emptyTileIndex !== -1) {
      value = 0;
      updatedGrid[row][col] = 0;
      updatedGrid[i][emptyTileIndex] = 'X';
    }
    i += 1;
  }
  return updatedGrid;
}

const Grid = (props) => {
  const { stateOfTheGame, setStateOfTheGame, grid, countMinesNextToTiles, setGrid, firstClickMine, setFirstClickMine } = props;

  // Left click logic
  // => If it's a mine, you lose.
  // => If it's a number, the tile opens and the number is displayed.
  // => If it's an empty tile, the tile and it's surrounding tiles open.
  const handleLeftClick = (event) => {
    if (stateOfTheGame === 'won' || stateOfTheGame === 'lost') {
      return;
    }

    const tile = event.target;
    const row = parseInt(tile.dataset.row);
    const col = parseInt(tile.dataset.col);
    let value = grid[row][col];

    if (stateOfTheGame === 'notStarted') {
      setStateOfTheGame('running');

      if (value === 'X') {
        const updatedGrid = removeClickedMine(grid, row, col);
        setGrid(countMinesNextToTiles(updatedGrid));
        setFirstClickMine({ row, col });
        return;
      }
    }

    // If the tile is a mine
    if (value === 'X') {
      setStateOfTheGame('lost');
      openAllMines(grid, tile);
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

    // Check if game is won
    isGameWon(grid) && setStateOfTheGame('won');
  }

  // Right click logic
  // => First click adds a flag.
  // => Second click transforms it into a question mark.
  // => Third click resets it.
  const handleRightClick = (event) => {
    event.preventDefault();

    if (stateOfTheGame === 'lost' || stateOfTheGame === 'won') {
      return;
    }

    stateOfTheGame === 'notStarted' && setStateOfTheGame('running');
    
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

  // If the first click was a mine, open the tile after re-render
  useEffect(() => {
    if (firstClickMine) {
      openTile(grid, firstClickMine.row, firstClickMine.col);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstClickMine])
  
  return (
    <table>
      <tbody>
        {props.grid.map((row, rowIndex) => {
          return (
            <tr key={`${rowIndex}-${row}`}>
              {row.map((_tile, tileIndex) => {
                return(
                  <td key={`${rowIndex}-${tileIndex}`} data-row={rowIndex} data-col={tileIndex} data-coord={`${rowIndex}-${tileIndex}`} className='unopen' onClick={handleLeftClick} onContextMenu={handleRightClick}>
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