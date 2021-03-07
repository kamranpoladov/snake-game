/*

  TODOS:
    1) draw and show snake
    2) make snake move
    3) control snake with keyboard
    4) draw and display food
    5) make snake grow when it eats food
    6) make new food when snake eats one
    7) game over when snake hits itself
    8) game over when snake hits the border

*/

const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');
const startButton = document.getElementById('start');

const colors = {
  border: 'black',
  background: 'white',
  snake: 'lightblue',
  snakeEdge: 'darkblue',
};

let snake = [
  { x: 200, y: 200 },
  { x: 190, y: 200 },
  { x: 180, y: 200 },
  { x: 170, y: 200 },
  { x: 160, y: 200 },
];

let isChangingDirection = false;

let foodX, foodY;

let dx = 10;
let dy = 0;

const clearCanvas = () => {
  context.fillStyle = colors.background;
  context.strokestyle = colors.border;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.strokeRect(0, 0, canvas.width, canvas.height);
};

const drawSnake = () => {
  snake.forEach(drawSnakePart);
};

const drawSnakePart = (snakePart) => {
  context.fillStyle = colors.snake;
  context.strokestyle = colors.snakeEdge;
  context.fillRect(snakePart.x, snakePart.y, 10, 10);
  context.strokeRect(snakePart.x, snakePart.y, 10, 10);
};

const hasDied = () => {
  for (let i = 4; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
  }
  const hitLeftWall = snake[0].x < 0;
  const hitRightWall = snake[0].x > canvas.width - 10;
  const hitToptWall = snake[0].y < 0;
  const hitBottomWall = snake[0].y > canvas.height - 10;
  return hitLeftWall || hitRightWall || hitToptWall || hitBottomWall;
};

const changeDirection = (event) => {
  const LEFT_KEY = 37;
  const RIGHT_KEY = 39;
  const UP_KEY = 38;
  const DOWN_KEY = 40;

  if (isChangingDirection) return;
  isChangingDirection = true;
  const keyPressed = event.keyCode;
  const goingUp = dy === -10;
  const goingDown = dy === 10;
  const goingRight = dx === 10;
  const goingLeft = dx === -10;
  if (keyPressed === LEFT_KEY && !goingRight) {
    dx = -10;
    dy = 0;
  }
  if (keyPressed === UP_KEY && !goingDown) {
    dx = 0;
    dy = -10;
  }
  if (keyPressed === RIGHT_KEY && !goingLeft) {
    dx = 10;
    dy = 0;
  }
  if (keyPressed === DOWN_KEY && !goingUp) {
    dx = 0;
    dy = 10;
  }
};

document.addEventListener('keydown', changeDirection);

const getFoodPosition = (min, max) =>
  Math.round((Math.random() * (max - min) + min) / 10) * 10;

const generateFood = () => {
  foodX = getFoodPosition(0, canvas.width - 10);
  foodY = getFoodPosition(0, canvas.height - 10);
  snake.forEach((snakePart) => {
    const hasOverlap = snakePart.x === foodX && snakePart.y === foodY;

    if (hasOverlap) {
      generateFood();
    }
  });
};

generateFood();

const drawFood = () => {
  context.fillStyle = 'lightgreen';
  context.strokestyle = 'darkgreen';

  context.fillRect(foodX, foodY, 10, 10);
  context.strokeRect(foodX, foodY, 10, 10);
};

const move = () => {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(head);

  const hasEaten = head.x === foodX && head.y === foodY;

  hasEaten ? generateFood() : snake.pop();
};

const main = () => {
  if (hasDied()) {
    alert('You died');
    window.location.reload();
  }

  isChangingDirection = false;
  setTimeout(() => {
    clearCanvas();
    drawFood();
    move();
    drawSnake();
    main();
  }, 100);
};

startButton.onclick = main;
