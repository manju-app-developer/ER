const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 600;

let car, obstacles, coins, score, gameSpeed, gameRunning;

function startGame() {
    car = { x: 175, y: 500, width: 50, height: 80 };
    obstacles = [];
    coins = [];
    score = 0;
    gameSpeed = 3;
    gameRunning = true;

    document.getElementById("score").textContent = score;
    requestAnimationFrame(updateGame);
}

function drawCar() {
    ctx.fillStyle = "blue";
    ctx.fillRect(car.x, car.y, car.width, car.height);
}

function drawObstacles() {
    ctx.fillStyle = "red";
    obstacles.forEach(obs => {
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
    });
}

function drawCoins() {
    ctx.fillStyle = "gold";
    coins.forEach(coin => {
        ctx.beginPath();
        ctx.arc(coin.x, coin.y, 10, 0, Math.PI * 2);
        ctx.fill();
    });
}

function updateGame() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawCar();
    drawObstacles();
    drawCoins();

    obstacles.forEach(obs => {
        obs.y += gameSpeed;
        if (obs.y > canvas.height) {
            score += 10;
            document.getElementById("score").textContent = score;
            obstacles.shift();
        }
        if (collision(car, obs)) {
            gameOver();
        }
    });

    coins.forEach((coin, index) => {
        coin.y += gameSpeed;
        if (coin.y > canvas.height) {
            coins.splice(index, 1);
        }
        if (collision(car, coin)) {
            score += 50;
            document.getElementById("score").textContent = score;
            coins.splice(index, 1);
        }
    });

    if (Math.random() < 0.02) {
        obstacles.push({ x: Math.random() * (canvas.width - 50), y: -50, width: 50, height: 50 });
    }

    if (Math.random() < 0.01) {
        coins.push({ x: Math.random() * (canvas.width - 10), y: -10, width: 20, height: 20 });
    }

    requestAnimationFrame(updateGame);
}

function collision(obj1, obj2) {
    return (
        obj1.x < obj2.x + obj2.width &&
        obj1.x + obj1.width > obj2.x &&
        obj1.y < obj2.y + obj2.height &&
        obj1.y + obj1.height > obj2.y
    );
}

document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" && car.x > 10) {
        car.x -= 20;
    }
    if (e.key === "ArrowRight" && car.x < canvas.width - car.width - 10) {
        car.x += 20;
    }
});

function gameOver() {
    gameRunning = false;
    alert("Game Over! Score: " + score);
}

function restartGame() {
    startGame();
}

startGame();
