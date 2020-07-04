const gridContainer = document.getElementById('#grid');
const startBtn = document.getElementById('#startBtn');
const refreshBtn = document.getElementById('#refreshBtn');
let showScore = document.getElementById('#score');
let showSpeed = document.getElementById('#speed');
let gameLost = document.getElementById('#game-over');
let gameLostP = document.getElementById('#game-over-p');

let gridWidth = 600;
let gridHeight = 600;
let cellWidth = 15;
let cellHeight = 15;
let grid;
const width = gridWidth / cellWidth;
const height = gridHeight / cellHeight;
let cellsInTable = (gridWidth * gridHeight) / (cellWidth * cellHeight);
let timerId;
score = 0;
speed = 1000;
const colors = [
  'green',
  'cyan',
  'olivedrab',
  'blue',
  'deepskyblue',
  'teal',
  'orange',
  'coral',
  'crimson',
  'yellow',
  'purple',
  'magenta',
  'red',
];
let snakeColors = ['green', 'green', 'green'];
let randomColor = 0;
let snake = [2, 1, 0];
let direction = ['right', 'right', 'right'];
let currPosition = [2, 1, 0];
let nextMove = '';

game();

refreshBtn.addEventListener('click', () => {
  location.reload();
  gameLost.classList.remove('game-lost');
  gameLostP.textContent = 'Game over!';
});

startBtn.addEventListener('click', () => {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  } else {
    draw();
    timerId = setInterval(move, speed);
  }
});

function game() {
  createGrid();
  apple();
}

function createGrid() {
  gridContainer.style.width = gridWidth + 'px';
  gridContainer.style.height = gridHeight + 'px';
  grid = [];

  let cell;
  for (let i = 0; i < cellsInTable; i++) {
    cell = document.createElement('div');
    cell.setAttribute('class', 'cell');
    cell.style.width = cellWidth + 'px';
    cell.style.height = cellHeight + 'px';
    //cell.textContent = i;
    gridContainer.appendChild(cell);
    grid.push(cell);
  }
}

function draw() {
  snake.forEach((index) => {
    grid[currPosition[index]].classList.add('snake');
    /* if (direction[index] === 'right' || direction[index] === 'left') {
      grid[currPosition[index]].style.backgroundImage = 'linear-gradient(green, yellow, green)';
    } else {
      grid[currPosition[index]].style.backgroundImage =
        'linear-gradient(to right, green, yellow, green)';
    } */
    //grid[currPosition[index]].style.backgroundColor = colors[snakeColor];
    grid[currPosition[index]].style.background =
      'radial-gradient(lavenderblush, ' + snakeColors[index] + ')';
  });
}

function undraw() {
  snake.forEach((index) => {
    grid[currPosition[index]].classList.remove('snake');
    grid[currPosition[index]].style.backgroundColor = '';
    grid[currPosition[index]].style.backgroundImage = '';
  });
}

function move() {
  //console.log(direction);
  snake.forEach((index) => {
    if (direction[index] === 'right') {
      moveRight(index);
    } else if (direction[index] === 'down') {
      moveDown(index);
    } else if (direction[index] === 'left') {
      moveLeft(index);
    } else if (direction[index] === 'up') {
      moveUp(index);
    }
  });

  isSnake();
  if (nextMove === '') {
    let lastMove = direction[0];
    //console.log(snake, currPosition, direction);
    direction.unshift(lastMove);
    direction.pop();
  } else {
    direction.unshift(nextMove);
    direction.pop();
    //console.log(snake, currPosition, direction);
  }
}

function moveRight(index) {
  if (currPosition[index] % width !== width - 1) {
    undraw();
    currPosition[index]++;
    isApple(index, 1);
    draw();
  } else {
    gameOver();
  }
}

function moveLeft(index) {
  if (currPosition[index] % width !== 0) {
    undraw();
    currPosition[index]--;
    isApple(index, -1);
    draw();
  } else {
    gameOver();
  }
}

function moveDown(index) {
  if (currPosition[index] < cellsInTable - width) {
    undraw();
    currPosition[index] += width;
    isApple(index, width);
    draw();
  } else {
    gameOver();
  }
}

function moveUp(index) {
  if (currPosition[index] > width) {
    undraw();
    currPosition[index] -= width;
    isApple(index, -width);
    draw();
  } else {
    gameOver();
  }
}

document.addEventListener('keyup', control);

function control(key) {
  if (key.keyCode === 40) {
    nextMove = 'down';
  } else if (key.keyCode === 38) {
    nextMove = 'up';
  } else if (key.keyCode === 39) {
    nextMove = 'right';
  } else if (key.keyCode === 37) {
    nextMove = 'left';
  } else {
    nextMove = '';
  }
  move();
}

function apple() {
  let i = Math.floor(Math.random() * cellsInTable);
  let except = [0, width - 1, cellsInTable - width, cellsInTable - 1];
  except = except.concat(currPosition);
  while (except.includes(i) === true) {
    i = Math.floor(Math.random() * cellsInTable);
  }
  grid[i].classList.add('apple');

  randomColor = Math.floor(Math.random() * colors.length);
  grid[i].style.backgroundColor = colors[randomColor];
}

function isApple(index, step) {
  if (grid[currPosition[0]].classList.contains('apple')) {
    grid[currPosition[0]].classList.remove('apple');
    grid[currPosition[0]].style.backgroundColor = '';
    snake.unshift(snake.length);
    currPosition.unshift(currPosition[index] + step);
    let lastMove = direction[0];
    direction.unshift(lastMove);
    //console.log('Apple:');
    //console.log(snake, currPosition, direction);
    score += 10;
    showScore.textContent = score;

    snakeColors.unshift(colors[randomColor]);
    apple();
    increaseSpeed();
  }
}

function isSnake() {
  let except = currPosition.slice(0);
  let head = except.shift();
  if (except.includes(head) === true) {
    draw();
    gameOver();
  }
}

function gameOver() {
  //showScore.textContent = 'Game over!';
  clearInterval(timerId);
  gameLost.classList.add('game-lost');
  gameLostP.textContent = 'Game over!';
}

function increaseSpeed() {
  if (speed > 50) {
    speed -= 25;
    showSpeed.textContent = speed + 'ms';
    clearInterval(timerId);
    timerId = setInterval(move, speed);
  }
}
