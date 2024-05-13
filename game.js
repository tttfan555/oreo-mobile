const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 400;

let score = 0;
let highScore = 0;
let baseSpeed = 3;
let acceleration = 0.001;
let gameSpeed = baseSpeed;
let gravity = 0.3;

let oreoImage = new Image();
oreoImage.src = 'oreo.png';

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
    const minGap = 200 + 30 / gameSpeed;
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
            handleGameOver();
        }
    });

    obstacles = obstacles.filter(obstacle => obstacle.x + obstacle.width > 0);
}

function handleScore() {
    score++;
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Score: ${score}`, canvas.width / 2, 30);
}

function handleGameOver() {
    setTimeout(() => {
        if (score > highScore) {
            highScore = score;
            saveScore(highScore);
        }
        
        alert(`Game over! Your score: ${score}`);
        score = 0;
        gameSpeed = baseSpeed;
        obstacles = [];
        showLeaderBoard();
    }, 0);
}

function showLeaderBoard() {
    let scores = JSON.parse(localStorage.getItem('highScores')) || [];
    let leaderBoard = document.getElementById('leaderBoard');
    
    leaderBoard.innerHTML = '<b>Leaderboard</b><br>';
    scores.forEach((entry, index) => {
        leaderBoard.innerHTML += `${index + 1}. ${entry.name} - ${entry.score}<br>`;
    });
}

function saveScore(highScore) {
    let username = "Player";
    let scores = JSON.parse(localStorage.getItem('highScores')) || [];
    
    scores.push({ name: username, score: highScore });
    scores.sort((a, b) => b.score - a.score);
    scores = scores.slice(0, 5);
    
    localStorage.setItem('highScores', JSON.stringify(scores));
    showLeaderBoard();
}

function initializeLeaderBoard() {
    showLeaderBoard();
}

window.addEventListener('keydown', function(e) {
    if (e.code === 'Space') {
        oreo.jump();
    }
});

canvas.addEventListener('touchstart', function(e) {
    e.preventDefault();
    oreo.jump();
}, false);

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight * 0.8;
    if (oreo.y + oreo.height > canvas.height) {
        oreo.y = canvas.height - oreo.height;
    }
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
initializeLeaderBoard();
update();

function update() {
    gameSpeed += acceleration;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawOreo();
    handleObstacles();
    handleScore();
    requestAnimationFrame(update);
}
