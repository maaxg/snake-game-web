var SNAKE_COLOUR = 'lightgreen';
var SNAKE_STROKE_COLOR = 'darkgreen';
var GAME_SPEED = 100;
// snake coordinates
var DEFAULT_SNAKE = [
    { x: 150, y: 150 },
    { x: 140, y: 150 },
    { x: 130, y: 150 },
    { x: 120, y: 150 },
    { x: 110, y: 150 },
];
var snake = DEFAULT_SNAKE;
// Get Canvas declared in html file
var gameCanvas = document.getElementById('gameCanvas');
// Canvas context
var ctx = gameCanvas.getContext('2d');
// horizontal velocity
var dx = 10;
// vertical velocity
var dy = 0;
// Food position
var foodX;
var foodY;
// Score
var score = 0;
var changingDirection = false;
function main() {
    if (didGameEnd(snake))
        return;
    setTimeout(function () {
        changingDirection = false;
        clearCanvas();
        drawFood();
        advanceSnake();
        drawSnake();
        main();
    }, GAME_SPEED);
}
function didGameEnd(snakeProp) {
    for (var i = 4; i < snakeProp.length; ++i) {
        var didCollide = snakeProp[i].x === snakeProp[0].x && snakeProp[i].y === snakeProp[0].y;
        if (didCollide)
            return true;
    }
    var HIT_LEFT_WALL = snakeProp[0].x < 0;
    var HIT_RIGHT_WALL = snakeProp[0].x > gameCanvas.width - 10;
    var HIT_TOP_WALL = snakeProp[0].y < 0;
    var HIT_BOTTOM_WALL = snakeProp[0].y > gameCanvas.height;
    return HIT_LEFT_WALL || HIT_RIGHT_WALL || HIT_TOP_WALL || HIT_BOTTOM_WALL;
}
function drawFood() {
    ctx.fillStyle = 'red';
    ctx.strokeStyle = 'darkred';
    ctx.fillRect(foodX, foodY, 10, 10);
    ctx.strokeRect(foodX, foodY, 10, 10);
}
function createFood() {
    foodX = randomTen(0, gameCanvas.width - 10);
    foodY = randomTen(0, gameCanvas.height - 10);
    snake.forEach(function (part) {
        // check if food in some part of snake
        var foodIsOnSnake = part.x == foodX && part.y == foodY;
        if (foodIsOnSnake)
            createFood();
    });
}
function randomTen(min, max) {
    return Math.round((Math.random() * (max - min) + min) / 10) * 10;
}
// Control direction changing
function changeDirection(event) {
    var Arrows;
    (function (Arrows) {
        Arrows["LEFT_KEY"] = "ArrowLeft";
        Arrows["RIGHT_KEY"] = "ArrowRight";
        Arrows["UP_KEY"] = "ArrowUp";
        Arrows["DOWN_KEY"] = "ArrowDown";
    })(Arrows || (Arrows = {}));
    if (changingDirection)
        return;
    changingDirection = true;
    var keyPressed = event.code;
    var goingUp = dy === -10;
    var goingDown = dy === 10;
    var goingRight = dx === 10;
    var goingLeft = dx === -10;
    if (keyPressed === Arrows.LEFT_KEY && !goingRight) {
        dx = -10;
        dy = 0;
    }
    if (keyPressed === Arrows.UP_KEY && !goingDown) {
        dx = 0;
        dy = -10;
    }
    if (keyPressed === Arrows.RIGHT_KEY && !goingLeft) {
        dx = 10;
        dy = 0;
    }
    if (keyPressed === Arrows.DOWN_KEY && !goingUp) {
        dx = 0;
        dy = 10;
    }
}
// clear canvas and set rect style
function clearCanvas() {
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
    ctx.strokeRect(0, 0, gameCanvas.width, gameCanvas.height);
}
function advanceSnake() {
    var head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);
    var didEatFood = snake[0].x === foodX && snake[0].y === foodY;
    if (didEatFood) {
        score += 10;
        document.getElementById('score').innerHTML = "".concat(score);
        createFood();
    }
    else
        snake.pop();
}
// Put color in each snake parte
function drawSnakePart(snakePart) {
    ctx.fillStyle = SNAKE_COLOUR;
    ctx.strokeStyle = SNAKE_STROKE_COLOR;
    ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
    ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
}
// At each position we draw a parte of snake
function drawSnake() {
    snake.forEach(drawSnakePart);
}
main();
createFood();
document.addEventListener("keydown", changeDirection);
