//select canvas
const cvs = document.getElementById("pong");
const ctx = cvs.getContext("2d");

var isGamePaused = false;
var isGameInit = true;

var comGame = 0;
var userGame = 0;

//var startBtn = document.getElementById("startBtn");

//create user paddle
const user = {
    x: 3,
    y: cvs.height / 2 - 100 / 2,
    width: 10,
    height: 100,
    color: "RED",
    score: 0
}

//create computer paddle
const com = {
    x: cvs.width - 13,
    y: cvs.height / 2 - 100 / 2,
    width: 10,
    height: 100,
    color: "WHITE",
    score: 0
}

//create the ball
const ball = {
    x: cvs.width / 2,
    y: cvs.height / 2,
    radius: 10,
    speed: 5,
    velocityX: 5,
    velocityY: 5,
    color: "ORANGE"
}

//draw Rectangular functions
function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

//create the net
const net = {
    x: cvs.width / 2 - 1,
    y: 0,
    width: 2,
    height: 10,
    color: "WHITE"
}

//draw the net
function drawNet() {
    for (let i = 0; i <= cvs.height; i += 15) {
        drawRect(net.x, net.y + i, net.width, net.height, net.color)
    }
}

//draw Circle
function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
}

//draw Text
function drawText(text, x, y, color) {
    ctx.fillStyle = color;
    ctx.font = "35px arial";
    ctx.fillText(text, x, y);
}

//render the game
function render() {

    //clear the canvas
    drawRect(0, 0, cvs.width, cvs.height, "BLUE");

    //draw the net
    drawNet();

    //draw score
    drawText(user.score, cvs.width / 4, cvs.height / 5, "WHITE");
    drawText(com.score, 3 * cvs.width / 4, cvs.height / 5, "WHITE");

    //display set(game) score
    document.getElementById("player").innerHTML = userGame;
    document.getElementById("com").innerHTML = comGame;

    //draw computer and user paddle
    drawRect(user.x, user.y, user.width, user.height, user.color);
    drawRect(com.x, com.y, com.width, com.height, com.color);

    drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

//control the user paddle;
cvs.addEventListener("mousemove", movePaddle);

function movePaddle(evt) {
    let rect = cvs.getBoundingClientRect();

    user.y = evt.clientY - rect.top - user.height / 2;
}



//collision detection
function collision(b, p) {
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
}

//reset ball
function resetBall() {
    ball.x = cvs.width / 2;
    ball.y = cvs.height / 2;

    ball.speed = 5;
    //ball.velocityX = -ball.velocityX;
}

function resetScore() {
    user.score = 0;
    com.score = 0;
}

function resetGame(){
    userGame = 0;
    comGame = 0;
}

// update: position, movement, score ...
function update() {



    ball.x += ball.velocityX;
    ball.y += ball.velocityY;



    //AI to control the computer paddle
    let computerLevel = 0.12;
    com.y += ((ball.y - (com.y + com.height / 2))) * computerLevel;

    if (ball.y + ball.radius > cvs.height || ball.y - ball.radius < 0) {
        ball.velocityY = -ball.velocityY;
    }

    let player = (ball.x + ball.radius < cvs.width / 2) ? user : com;

    if (collision(ball, player)) {
        //where the ball hit the player
        let collidePoint = ball.y - (player.y + player.height / 2);

        //normalization
        collidePoint = collidePoint / (player.height / 2);

        //calculate angle in radian
        let angleRad = collidePoint * Math.PI / 4;

        //X direction of the ball after being hit
        let direction = (ball.x < cvs.width / 2) ? 1 : -1;

        //change the velocity of X and Y
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);

        //everytime the ball hits the paddle the speed is 
        //increased by the increment of 0.5
        ball.speed += 0.5;
    }

    //update the score
    if (ball.x - ball.radius < 0) {
        //the com scores
        com.score++;
        resetBall();
    } else if (ball.x + ball.radius > cvs.width) {
        //the user scores
        user.score++;
        resetBall();
    }

    //update the GameScore / Reset score
    if(com.score > 4){
        comGame++;
        resetScore();
    }else if(user.score > 4){
        userGame++;
        resetScore();
    }

    if(userGame > 2){
        alert("You win!");
        resetGame();
    }else if(comGame > 2){
        alert("You Lose :(");
        resetGame();
    }

    //Reset the score
    //if (user.score > 4 || com.score > 4) {
       // resetScore();
    //}
}

document.addEventListener("keypress", gamePaused);


//Pausing the game
function gamePaused(evt) {
    if (evt.keyCode == 32) {
        pauseGame();
    }
}

function pauseGame() {

    isGamePaused = !isGamePaused;
    requestAnimationFrame(game);
}



//initialize game
function game() {

    //startBtn.style.display = 'none';

    if(isGamePaused) {
        return;
    }

    update();
    render();
    requestAnimationFrame(game);
}

const framePerSecond = 50;
//loop
requestAnimationFrame(game);
