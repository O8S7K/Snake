// Constants
const BOARD_SIZE = 10;
const GAME_SPEED = 500;
const SQUARE_TYPES = {
  EMPTY: 0,
  SNAKE: 1,
  FOOD: 2,
};
const DIRECTIONS = {
  ArrowUp: -BOARD_SIZE,
  ArrowDown: BOARD_SIZE,
  ArrowRight: 1,
  ArrowLeft: -1,
};
const OPPOSITE_DIRECTIONS = {
  ArrowUp: 'ArrowDown',
  ArrowDown: 'ArrowUp',
  ArrowLeft: 'ArrowRight',
  ArrowRight: 'ArrowLeft',
};

// Game Variables
let snake, score, direction, boardSquares, emptySquares, moveInterval;

// Cached DOM elements
const board = document.getElementById("board");
const scoreBoard = document.getElementById("scoreBoard");
const startButton = document.getElementById("start");
const gameOverSign = document.getElementById("gameover");

// Initialize the game
function initializeGame() {
  try {
    snake = ["00", "01", "02", "03"];
    score = 0
    direction = "ArrowRight"; // Initial direction set to "ArrowRight"
    boardSquares = Array.from({ length: BOARD_SIZE }, () =>
      Array(BOARD_SIZE).fill(SQUARE_TYPES.EMPTY)
    );
    board.innerHTML = "";
    emptySquares = [];
    createBoard();
  } catch (error) {
    console.error("Error initializing game:", error);
  }
}

// Create the game board
function createBoard() {
  for (let rowIndex = 0; rowIndex < BOARD_SIZE; rowIndex++) {
    for (let colIndex = 0; colIndex < BOARD_SIZE; colIndex++) {
      const squareValue = `${rowIndex}${colIndex}`;
      const squareElement = createSquareElement(squareValue);
      board.appendChild(squareElement);
      emptySquares.push(squareValue);
    }
  }
}

// Create a square element
function createSquareElement(id) {
  const squareElement = document.createElement("div");
  squareElement.classList.add("square", "empty-square");
  squareElement.id = id;
  return squareElement;
}

// Draw a square on the board
function drawSquare(square, type) {
  const [row, column] = square.split("").map(Number);
  boardSquares[row][column] = SQUARE_TYPES[type.toUpperCase()];
  const squareElement = document.getElementById(square);
  squareElement.className = `square ${type.toLowerCase()}-square`;

  updateEmptySquares(square, type);
}

// Update the empty squares array
function updateEmptySquares(square, type) {
  const index = emptySquares.indexOf(square);
  if (type === "empty" && index === -1) {
    emptySquares.push(square);
  } else if (type !== "empty" && index !== -1) {
    emptySquares.splice(index, 1);
  }
}

// Draw the snake on the board
function drawSnake() {
  snake.forEach((square) => drawSquare(square, "snake"));
}

// Update the score on the scoreboard
function updateScore() {
  scoreBoard.innerText = score;
}

// Create food on a random empty square
function createRandomFood() {
  if (emptySquares.length === 0) return;
  const randomIndex = Math.floor(Math.random() * emptySquares.length);
  const randomEmptySquare = emptySquares[randomIndex];
  drawSquare(randomEmptySquare, "food");
}

// Set the direction of the snake
function setDirection(newDirection) {
  direction = newDirection;
}

// Handle direction change based on keypress
function handleDirectionEvent(event) {
  const newDirection = event.code;
  if (newDirection in DIRECTIONS && OPPOSITE_DIRECTIONS[direction] !== newDirection) {
    setDirection(newDirection);
  }
}

// Move the snake on the board
function moveSnake() {
  const newHead = String(
    Number(snake[snake.length - 1]) + DIRECTIONS[direction]
  ).padStart(2, "0");

  const [row, column] = newHead.split("").map(Number);

  if (isGameOver(newHead, row, column)) {
    endGame();
  } else {
    updateSnakePosition(newHead, row, column);
  }
}

// Check if the game is over
function isGameOver(newHead, row, column) {
  return (
    newHead < 0 ||
    newHead >= BOARD_SIZE * BOARD_SIZE ||
    (direction === "ArrowRight" && column === 0) ||
    (direction === "ArrowLeft" && column === BOARD_SIZE - 1) ||
    boardSquares[row][column] === SQUARE_TYPES.SNAKE
  );
}

// Update snake position
function updateSnakePosition(newHead, row, column) {
  snake.push(newHead);

  if (boardSquares[row][column] === SQUARE_TYPES.FOOD) {
    score++;
    updateScore();
    createRandomFood();
  } else {
    const tail = snake.shift();
    drawSquare(tail, "empty");
  }

  drawSnake();
}

// End the game
function endGame() {
  gameOverSign.style.display = "block";
  clearInterval(moveInterval);
  startButton.disabled = false;
  document.removeEventListener("keydown", handleDirectionEvent);
}

// Start the game
function startGame() {
  initializeGame();
  gameOverSign.style.display = "none";
  startButton.disabled = true;
  drawSnake();
  updateScore();
  createRandomFood();

  document.addEventListener("keydown", handleDirectionEvent);
  moveInterval = setInterval(moveSnake, GAME_SPEED);
}

// Start game on button click
startButton.addEventListener("click", startGame);
