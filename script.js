// Game constants
const GRID_SIZE = 20;
const CELL_SIZE = 20;
const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 400;

// Game variables
let canvas, ctx;
let ladybug, ants, dots, powerUps;
let score = 0;
let gameLoop;

// Initialize the game
function init() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');

    ladybug = {
        x: CANVAS_WIDTH / 2,
        y: CANVAS_HEIGHT / 2,
        direction: 0,
        nextDirection: 0
    };

    ants = [
        { x: 0, y: 0, color: '#FF9AA2' },
        { x: CANVAS_WIDTH - CELL_SIZE, y: 0, color: '#B5EAD7' },
        { x: 0, y: CANVAS_HEIGHT - CELL_SIZE, color: '#FFDAC1' },
        { x: CANVAS_WIDTH - CELL_SIZE, y: CANVAS_HEIGHT - CELL_SIZE, color: '#E2F0CB' }
    ];

    dots = [];
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            if (Math.random() < 0.5) {
                dots.push({ x: i * CELL_SIZE, y: j * CELL_SIZE });
            }
        }
    }

    powerUps = [
        { x: CELL_SIZE, y: CELL_SIZE },
        { x: CANVAS_WIDTH - 2 * CELL_SIZE, y: CELL_SIZE },
        { x: CELL_SIZE, y: CANVAS_HEIGHT - 2 * CELL_SIZE },
        { x: CANVAS_WIDTH - 2 * CELL_SIZE, y: CANVAS_HEIGHT - 2 * CELL_SIZE }
    ];

    document.addEventListener('keydown', handleKeyPress);

    gameLoop = setInterval(update, 100);
}

// Handle key presses
function handleKeyPress(e) {
    switch(e.key) {
        case 'ArrowUp': ladybug.nextDirection = 0; break;
        case 'ArrowRight': ladybug.nextDirection = 1; break;
        case 'ArrowDown': ladybug.nextDirection = 2; break;
        case 'ArrowLeft': ladybug.nextDirection = 3; break;
    }
}

// Update game state
function update() {
    moveLadybug();
    moveAnts();
    checkCollisions();
    draw();
}

// Move the ladybug
function moveLadybug() {
    ladybug.direction = ladybug.nextDirection;
    switch(ladybug.direction) {
        case 0: ladybug.y -= CELL_SIZE; break;
        case 1: ladybug.x += CELL_SIZE; break;
        case 2: ladybug.y += CELL_SIZE; break;
        case 3: ladybug.x -= CELL_SIZE; break;
    }

    // Wrap around the screen
    ladybug.x = (ladybug.x + CANVAS_WIDTH) % CANVAS_WIDTH;
    ladybug.y = (ladybug.y + CANVAS_HEIGHT) % CANVAS_HEIGHT;
}

// Move the ants (simple random movement)
function moveAnts() {
    ants.forEach(ant => {
        let direction = Math.floor(Math.random() * 4);
        switch(direction) {
            case 0: ant.y -= CELL_SIZE; break;
            case 1: ant.x += CELL_SIZE; break;
            case 2: ant.y += CELL_SIZE; break;
            case 3: ant.x -= CELL_SIZE; break;
        }
        ant.x = (ant.x + CANVAS_WIDTH) % CANVAS_WIDTH;
        ant.y = (ant.y + CANVAS_HEIGHT) % CANVAS_HEIGHT;
    });
}

// Check for collisions
function checkCollisions() {
    // Check for dot collisions
    dots = dots.filter(dot => {
        if (dot.x === ladybug.x && dot.y === ladybug.y) {
            score += 10;
            return false;
        }
        return true;
    });

    // Check for power-up collisions
    powerUps = powerUps.filter(powerUp => {
        if (powerUp.x === ladybug.x && powerUp.y === ladybug.y) {
            score += 50;
            return false;
        }
        return true;
    });

    // Check for ant collisions
    ants.forEach(ant => {
        if (ant.x === ladybug.x && ant.y === ladybug.y) {
            clearInterval(gameLoop);
            alert('Game Over! Your score: ' + score);
        }
    });

    // Check for win condition
    if (dots.length === 0 && powerUps.length === 0) {
        clearInterval(gameLoop);
        alert('You Win! Your score: ' + score);
    }
}

// Draw the game state
function draw() {
    // Clear the canvas
    ctx.fillStyle = '#A8D5BA';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw dots
    ctx.fillStyle = '#FAE8B0';
    dots.forEach(dot => {
        ctx.beginPath();
        ctx.arc(dot.x + CELL_SIZE / 2, dot.y + CELL_SIZE / 2, 3, 0, 2 * Math.PI);
        ctx.fill();
    });

    // Draw power-ups
    ctx.fillStyle = '#F5B8C0';
    powerUps.forEach(powerUp => {
        ctx.beginPath();
        ctx.arc(powerUp.x + CELL_SIZE / 2, powerUp.y + CELL_SIZE / 2, 6, 0, 2 * Math.PI);
        ctx.fill();
    });

    // Draw ladybug
    ctx.fillStyle = '#FF6B6B';
    ctx.beginPath();
    ctx.arc(ladybug.x + CELL_SIZE / 2, ladybug.y + CELL_SIZE / 2, CELL_SIZE / 2, 0, 2 * Math.PI);
    ctx.fill();

    // Draw ants
    ants.forEach(ant => {
        ctx.fillStyle = ant.color;
        ctx.beginPath();
        ctx.arc(ant.x + CELL_SIZE / 2, ant.y + CELL_SIZE / 2, CELL_SIZE / 2, 0, 2 * Math.PI);
        ctx.fill();
    });

    // Draw score
    ctx.fillStyle = '#000';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 10, 30);
}

// Start the game when the window loads
window.onload = init;
