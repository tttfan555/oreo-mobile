const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 400;

let score = 0;
let highScore = 0;
let baseSpeed = 3;   // Initial base speed of the game
let acceleration = 0.001; // Amount of speed increase per frame
let gameSpeed = baseSpeed;  // Current game speed starts at base speed
let gravity = 0.3;

// Load the Oreo image
let oreoImage = new Image();
oreoImage.src = 'oreo.png';

// Load the obstacle image
let obstacleImage = new Image();
obstacleImage.src = 'obstacle.png';

// Ensuring images are loaded
let imagesLoaded = 0;
let totalImages = 2; // Total number of images to load

oreoImage.onload = () => {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        startGame();
    }
};

obstacleImage.onload = () => {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        startGame();
    }
};

// Oreo character setup
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
    const minGap = 200 + 30 / gameSpeed;  // Adjust gap based on game speed
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
    ctx.textAlign = 'center';  // Center text alignment
    ctx.fillText(`Score: ${score}`, canvas.width / 2, 30);  // Draw at the top center
}

function handleGameOver() {
    setTimeout(() => {
        if (score > highScore) {
            highScore = score;
        }
        
        alert(`Game over! Your score: ${score}\nHigh Score: ${highScore}`);
        score = 0;
        gameSpeed = baseSpeed;
        obstacles = [];
        updateHighScore();
    }, 10);
}

function updateHighScore() {
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`High Score: ${highScore}`, canvas.width / 2, 50);
}

function startGame() {
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

    function update() {
        gameSpeed += acceleration;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawOreo();
        handleObstacles();
        handleScore();
        requestAnimationFrame(update);
    }

    update();
}

// In case images are already cached and 'onload' did not trigger
if (oreoImage.complete && obstacleImage.complete) {
    startGame();
}
