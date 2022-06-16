const SNAKE_COLOUR = 'lightgreen'
const SNAKE_STROKE_COLOR = 'darkgreen'
const GAME_SPEED = 100

type SnakePart = {x: number, y: number}
type Snake = Array<SnakePart>

// snake coordinates
const DEFAULT_SNAKE = [ 
  {x: 150, y: 150},  
  {x: 140, y: 150},  
  {x: 130, y: 150},  
  {x: 120, y: 150},  
  {x: 110, y: 150},
]
let snake: Snake = DEFAULT_SNAKE
// Get Canvas declared in html file
const gameCanvas: HTMLCanvasElement = document.getElementById('gameCanvas') as HTMLCanvasElement

// Canvas context
const ctx = gameCanvas.getContext('2d')

// horizontal velocity
let dx = 10
// vertical velocity
let dy = 0

// Food position
let foodX: number
let foodY: number

// Score
let score = 0


let changingDirection = false

function main(){
  if(didGameEnd(snake)) return; 
  setTimeout(() => {
    changingDirection = false
    clearCanvas()
    drawFood()
    advanceSnake()
    drawSnake()
    main()
  }, GAME_SPEED)
  
}


function didGameEnd(snakeProp: Snake){
  for(let i = 4; i < snakeProp.length; ++i){
    const didCollide = snakeProp[i].x === snakeProp[0].x && snakeProp[i].y === snakeProp[0].y
    if(didCollide) return true
  }
  const HIT_LEFT_WALL = snakeProp[0].x < 0
  const HIT_RIGHT_WALL = snakeProp[0].x > gameCanvas.width - 10
  const HIT_TOP_WALL = snakeProp[0].y < 0
  const HIT_BOTTOM_WALL = snakeProp[0].y > gameCanvas.height
  
  return HIT_LEFT_WALL || HIT_RIGHT_WALL || HIT_TOP_WALL ||  HIT_BOTTOM_WALL
}


function drawFood(){
  ctx.fillStyle = 'red'
  ctx.strokeStyle = 'darkred'
  ctx.fillRect(foodX, foodY, 10, 10)
  ctx.strokeRect(foodX, foodY, 10, 10)
}

function createFood(){
  foodX = randomTen(0, gameCanvas.width - 10)
  foodY = randomTen(0, gameCanvas.height - 10)

  snake.forEach((part) => {
    // check if food in some part of snake
    const foodIsOnSnake = part.x == foodX && part.y == foodY
    if(foodIsOnSnake) createFood()
  })

}

function randomTen(min: number, max: number){
  return Math.round((Math.random() * (max-min) + min) / 10) * 10
}

// Control direction changing
function changeDirection(event: KeyboardEvent){
  enum Arrows {
    LEFT_KEY = 'ArrowLeft',
    RIGHT_KEY = 'ArrowRight',
    UP_KEY = 'ArrowUp',
    DOWN_KEY = 'ArrowDown'
  }

  if(changingDirection) return;
  changingDirection = true

  const keyPressed = event.code;
  
  const goingUp = dy === -10
  const goingDown = dy === 10
  const goingRight = dx === 10
  const goingLeft = dx === -10

  if(keyPressed === Arrows.LEFT_KEY && !goingRight){
    dx = -10
    dy = 0
  }  

  if(keyPressed === Arrows.UP_KEY && !goingDown){
    dx = 0;
    dy = -10
  }


  if(keyPressed === Arrows.RIGHT_KEY && !goingLeft){
    dx = 10;
    dy = 0
  }

  if(keyPressed === Arrows.DOWN_KEY && !goingUp){
    dx = 0;
    dy = 10
  }

}

// clear canvas and set rect style
function clearCanvas() {
  ctx.fillStyle = 'white'
  ctx.strokeStyle = 'black'
  ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height)
  ctx.strokeRect(0, 0, gameCanvas.width, gameCanvas.height)
}

function advanceSnake(){
  const head = {x: snake[0].x + dx, y: snake[0].y + dy}
  snake.unshift(head)
  const didEatFood = snake[0].x === foodX && snake[0].y === foodY
  if(didEatFood){
    score += 10
    document.getElementById('score').innerHTML = `${score}`
    createFood()
    
  }else
    snake.pop()
}

// Put color in each snake parte
function drawSnakePart(snakePart: SnakePart) {
  ctx.fillStyle = SNAKE_COLOUR
  ctx.strokeStyle = SNAKE_STROKE_COLOR
  ctx.fillRect(snakePart.x, snakePart.y, 10, 10)
  ctx.strokeRect(snakePart.x, snakePart.y, 10, 10)

}

// At each position we draw a parte of snake
function drawSnake() {
  snake.forEach(drawSnakePart)
}


main()

createFood()


document.addEventListener("keydown", changeDirection);