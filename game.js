const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 400;

let score = 0;
let baseSpeed = 3;   // 游戏开始的基础速度
let acceleration = 0.001; // 每帧速度增加的量
let gameSpeed = baseSpeed;  // 当前游戏速度，初始等于基础速度
let gravity = 0.3;

// 加载奥利奥图像
let oreoImage = new Image();
oreoImage.src = 'oreo.png';

// 加载障碍物图像
let obstacleImage = new Image();
obstacleImage.src = 'obstacle.png';

let oreo = {
    x: 50,
    y: 300,
    width: 50,
    height: 50,
    dy: 0,
    jumpForce: 10,
    grounded: false,
    jump: function() {
        if (this.grounded) {
            this.dy = -this.jumpForce;
            this.grounded = false;
        }
    }
};
let obstacles = [];

function drawOreo() {
    ctx.drawImage(oreoImage, oreo.x, oreo.y, oreo.width, oreo.height);
    oreo.dy += gravity;
    oreo.y += oreo.dy;

    if (oreo.y + oreo.height > canvas.height) {
        oreo.y = canvas.height - oreo.height;
        oreo.dy = 0;
        oreo.grounded = true;
    }
}

function handleObstacles() {
    const minGap = 200 + 30 / gameSpeed;  // 根据速度调整间隔
    const maxGap = 300 + 60 / gameSpeed;
    let gap = Math.random() * (maxGap - minGap) + minGap;

    if (obstacles.length === 0 || obstacles[obstacles.length - 1].x < canvas.width - gap) {
        let obstacleHeight = 50;
        let obstacleWidth = 20;
        obstacles.push({
            x: canvas.width,
            width: obstacleWidth,
            height: obstacleHeight
        });
    }

    obstacles.forEach(function(obstacle, index) {
        obstacle.x -= gameSpeed;
        ctx.drawImage(obstacleImage, obstacle.x, canvas.height - obstacle.height, obstacle.width, obstacle.height);

        if (oreo.x < obstacle.x + obstacle.width &&
            oreo.x + oreo.width > obstacle.x &&
            oreo.y < canvas.height &&
            oreo.y + oreo.height > canvas.height - obstacle.height) {
            obstacles = [];
            score = 0;
            alert('Game over! Try again.');
            gameSpeed = baseSpeed;  // 重置速度
        }
    });

    obstacles = obstacles.filter(obstacle => obstacle.x + obstacle.width > 0);
}

function handleScore() {
    score++;
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 700, 30);
}

function update() {
    gameSpeed += acceleration;  // 每帧增加速度

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawOreo();
    handleObstacles();
    handleScore();
    requestAnimationFrame(update);
}

window.addEventListener('keydown', function(e) {
    if (e.code === 'Space') {
        oreo.jump();
    }
});

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight * 0.8;  // 使用屏幕的80%高度
    if (oreo.y + oreo.height > canvas.height) {
        oreo.y = canvas.height - oreo.height;  // 确保角色不会跑出画面底部
    }
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();  // 页面加载时调用

canvas.addEventListener('touchstart', function(e) {
    e.preventDefault();  // 阻止触摸时屏幕的滚动等默认行为
    oreo.jump();
}, false);

update();
