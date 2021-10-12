/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  // TODO: set "board" to empty HEIGHT x WIDTH matrix array

  for (let i = 0; i < HEIGHT; i++) {
    board.push(Array(WIDTH).fill(null))
  }
  return board;
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
  const htmlBoard = document.querySelector('#board');

  // TODO: add comment for this code

  // create a variable 'top' and store a new table row element 'tr'
  const top = document.createElement('tr');
  // set attribute 'id' as 'column top'
  top.setAttribute('id', 'column-top');
  // add 'click' event listener to every cell within the top row.
  top.addEventListener('click', handleClick);

  // iterate number of WIDTH times to generate cells(columns) in the top row
  for (let x = 0; x < WIDTH; x++) {
    // create a variable 'headCell' and store a newly created 'td' element
    const headCell = document.createElement('td');
    // set id attribute to x
    headCell.setAttribute('id', x);
    // append the headCell to its parent element 'top'
    top.append(headCell);
  }
  // append the top row to its parent element htmlBoard
  htmlBoard.append(top);

  // TODO: add comment for this code

  // build the body of htmlBoard table
  // iterate HEIGHT times to create rows
  for (let y = 0; y < HEIGHT; y++) {
    // create 'tr' element and store it to row variable
    const row = document.createElement('tr');
    // iterate the WIDTH times to create column cells
    for (let x = 0; x < WIDTH; x++) {
      // create 'td' element and store it to cell variable
      const cell = document.createElement('td');
      // set the cell id value to y-x
      cell.setAttribute('id', `${y}-${x}`);
      // append the cell to its parent element 'row'.
      row.append(cell);
    }
    // append the body of talbe to htmlBoard
    htmlBoard.append(row);
  }

  // retun the htmlBoard
  return htmlBoard;
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  // TODO: write the real version of this, rather than always returning 0
  for (let i = HEIGHT - 1; i >= 0; i--) {
    if (!board[i][x]) {
      return i;
    }
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // TODO: make a div and insert into correct table cell
  const dot = document.createElement('div');
  const cell = document.getElementById(`${y}-${x}`);

  dot.classList.add('piece');

  // dot animation
  styleSheet = document.createElement('style');
  document.head.appendChild(styleSheet);

  // get a dot position dynamically
  let top = 6,
    left = 56 * x + 4;
  let bottom = 56 * y + 60;

  const keyframe = `@keyframes slide { 
    from{
      top:${top}px; 
      left:${left}px; 
    }
    to{
      top:${bottom}px; 
      left:${left}px; 
    }
}`;
  dot.style.top = `${bottom}px`;
  dot.style.left = `${left}px`;
  styleSheet.sheet.insertRule(keyframe);

  // switch classes p1 vs p2
  currPlayer === 1 ? dot.classList.add('p1') : dot.classList.add('p2');

  cell.append(dot);
}

/** endGame: announce game end */

function endGame(msg) {
  // TODO: pop up alert message
  alert(msg);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  let x = +evt.target.id;
  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === null) {
    return;
  }
  board[y][x] = currPlayer;
  // place piece in board and add to HTML table
  // TODO: add line to update in-memory board
  placeInTable(y, x);

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }
  // check for tie
  // TODO: check if all cells in board are filled; if so call, call endGame
  if (board[0].every((element) => element !== null))
    endGame("Game over! It's a draw");
  // switch players
  // TODO: switch currPlayer 1 <-> 2
  currPlayer = currPlayer === 1 ? 2 : 1;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // TODO: read and understand this code. Add comments to help you.

  // iterate over the row
  for (let y = 0; y < HEIGHT; y++) {
    //iterate over  the column
    for (let x = 0; x < WIDTH; x++) {
      // store the values of the current row and the current column + 3 following consecutive columns
      let horiz = [
        [y, x],
        [y, x + 1],
        [y, x + 2],
        [y, x + 3],
      ];
      // store the values of the current column and the row + 3 following consecutive rows.
      let vert = [
        [y, x],
        [y + 1, x],
        [y + 2, x],
        [y + 3, x],
      ];
      // store the values of diagnal(South East direction) rows and the columns
      let diagDR = [
        [y, x],
        [y + 1, x + 1],
        [y + 2, x + 2],
        [y + 3, x + 3],
      ];
      // store the values of diagnal(South West direction) rows and the columns
      let diagDL = [
        [y, x],
        [y + 1, x - 1],
        [y + 2, x - 2],
        [y + 3, x - 3],
      ];

      // call internal function _win and pass an argument of variables from above one at a time. If any of function call returns true, return true. The corresponing player won.
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
