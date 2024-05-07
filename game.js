const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 400;

let score = 0;
let gameSpeed = 3;
let gravity = 0.3;

// 加载奥利奥图像
let oreoImage = new Image();
oreoImage.src = 'oreo.png';  // 确保图像文件与HTML文件在同一目录

let oreo = {
    x: 50,
    y: 300,
    width: 50,  // 图像宽度
    height: 50, // 图像高度
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
    if (obstacles.length === 0 || obstacles[obstacles.length - 1].x < 400) {
        obstacles.push({ x: canvas.width, width: 20, height: 50 });
    }

    obstacles.forEach(function(obstacle, index) {
        obstacle.x -= gameSpeed;
        ctx.fillStyle = 'brown';
        ctx.fillRect(obstacle.x, canvas.height - obstacle.height, obstacle.width, obstacle.height);

        // 碰撞检测
        if (oreo.x < obstacle.x + obstacle.width &&
            oreo.x + oreo.width > obstacle.x &&
            oreo.y < canvas.height &&
            oreo.y + oreo.height > canvas.height - obstacle.height) {
            // 游戏结束
            obstacles = [];
            score = 0;
            alert('Game over! Try again.');
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
