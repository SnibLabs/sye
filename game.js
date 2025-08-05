// --- Space Shooter Main Game ---

const GAME_WIDTH = 440;
const GAME_HEIGHT = 640;

// Draw a stylized Terminator (T-800) head as the player
class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 21;
        this.speed = 5;
        this.cooldown = 0;
        this.lives = 3;
        this.isAlive = true;
        // No longer using color, all drawing is custom
    }

    move(dx) {
        this.x += dx * this.speed;
        this.x = clamp(this.x, this.radius, GAME_WIDTH - this.radius);
    }

    draw(ctx) {
        ctx.save();
        // Metallic skull base
        let grad = ctx.createRadialGradient(this.x, this.y - 11, 12, this.x, this.y, this.radius);
        grad.addColorStop(0, "#f5f8ff");
        grad.addColorStop(0.35, "#b2bbc7");
        grad.addColorStop(1, "#5a646b");

        ctx.beginPath();
        ctx.ellipse(this.x, this.y, this.radius * 1.02, this.radius * 1.15, 0, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.shadowColor = "#d2eaff66";
        ctx.shadowBlur = 10;
        ctx.fill();

        // Jaw (robotic)
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(this.x, this.y + 12, this.radius * 0.65, this.radius * 0.36, 0, 0, Math.PI * 2);
        ctx.fillStyle = "#8ea0b8";
        ctx.globalAlpha = 0.92;
        ctx.fill();
        ctx.globalAlpha = 1.0;
        ctx.restore();

        // Cheekbone shadows
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(this.x - 8.5, this.y + 2, 5, 6, 0.15, 0, Math.PI * 2);
        ctx.ellipse(this.x + 8.5, this.y + 2, 5, 6, -0.15, 0, Math.PI * 2);
        ctx.fillStyle = "#838fa2";
        ctx.globalAlpha = 0.23;
        ctx.fill();
        ctx.globalAlpha = 1.0;
        ctx.restore();

        // Face grooves (robotic lines)
        ctx.save();
        ctx.strokeStyle = "#8591a8";
        ctx.lineWidth = 2.1;
        ctx.globalAlpha = 0.46;
        ctx.beginPath();
        ctx.moveTo(this.x - 10, this.y - 9);
        ctx.lineTo(this.x - 10, this.y + 11);
        ctx.moveTo(this.x + 10, this.y - 9);
        ctx.lineTo(this.x + 10, this.y + 11);
        ctx.moveTo(this.x, this.y - 14);
        ctx.lineTo(this.x, this.y + 13);
        ctx.stroke();
        ctx.globalAlpha = 1.0;
        ctx.restore();

        // Terminator glowing red eyes
        ctx.save();
        ctx.shadowColor = "#ff2222cc";
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.ellipse(this.x - 7.3, this.y - 4.3, 3.7, 2.6, 0, 0, Math.PI * 2);
        ctx.ellipse(this.x + 7.3, this.y - 4.3, 3.7, 2.6, 0, 0, Math.PI * 2);
        ctx.fillStyle = "#ff2222";
        ctx.globalAlpha = 0.97;
        ctx.fill();
        ctx.restore();

        // Metallic nose bridge
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(this.x - 2, this.y + 0.6);
        ctx.lineTo(this.x, this.y - 5.8);
        ctx.lineTo(this.x + 2, this.y + 0.6);
        ctx.closePath();
        ctx.fillStyle = "#b8c0d0";
        ctx.globalAlpha = 0.72;
        ctx.fill();
        ctx.restore();

        // Face mask highlights
        ctx.save();
        ctx.strokeStyle = "#eff6fa";
        ctx.lineWidth = 1.16;
        ctx.globalAlpha = 0.22;
        ctx.beginPath();
        ctx.moveTo(this.x - 5.5, this.y + 11.2);
        ctx.lineTo(this.x - 9, this.y + 17);
        ctx.moveTo(this.x + 5.5, this.y + 11.2);
        ctx.lineTo(this.x + 9, this.y + 17);
        ctx.stroke();
        ctx.globalAlpha = 1.0;
        ctx.restore();

        // Mouth slit (robotic style)
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(this.x - 4, this.y + 9.8);
        ctx.lineTo(this.x + 4, this.y + 9.8);
        ctx.strokeStyle = "#535a69";
        ctx.lineWidth = 1.4;
        ctx.globalAlpha = 0.7;
        ctx.stroke();
        ctx.globalAlpha = 1.0;
        ctx.restore();

        // Underjaw bolts
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x - 7.5, this.y + 15.8, 1.4, 0, Math.PI * 2);
        ctx.arc(this.x + 7.5, this.y + 15.8, 1.4, 0, Math.PI * 2);
        ctx.fillStyle = "#c4d4e4";
        ctx.globalAlpha = 0.75;
        ctx.fill();
        ctx.globalAlpha = 1.0;
        ctx.restore();

        // Subtle red underglow for menace
        ctx.save();
        ctx.shadowColor = "#ff222233";
        ctx.shadowBlur = 24;
        ctx.globalAlpha = 0.28;
        ctx.beginPath();
        ctx.arc(this.x, this.y + 16, this.radius * 0.62, 0, Math.PI * 2);
        ctx.fillStyle = "#ff2222";
        ctx.fill();
        ctx.restore();

        ctx.restore();
    }
}

class Bullet {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 5;
        this.speed = 10;
        this.color = '#fff23a';
        this.active = true;
    }

    update() {
        this.y -= this.speed;
        if (this.y < -this.radius) this.active = false;
    }

    draw(ctx) {
        ctx.save();
        ctx.shadowColor = '#ffe23a80';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = 0.96;
        ctx.fill();
        ctx.restore();
    }
}

// --- T-3000 ENEMY DRAWING ---
// The T-3000 from Terminator is a metallic humanoid with glowing blue eyes and a segmented/chiseled face.
// We'll draw a stylized metallic humanoid robot head with glowing blue eyes.

class Enemy {
    constructor(x, y, type = 0) {
        this.x = x;
        this.y = y;
        this.radius = 18;
        this.speed = randInt(2, 4) + type;
        this.type = type; // Used to vary color/shape
        // You can tweak type for more T-3000 variants if desired
        this.color = "#babfd1"; // metallic silver base
        this.eyeColor = "#48e6ff"; // glowing blue eyes
        this.active = true;
    }

    update() {
        this.y += this.speed;
        if (this.y > GAME_HEIGHT + this.radius) this.active = false;
    }

    draw(ctx) {
        ctx.save();
        // Metallic head with shine
        let grad = ctx.createRadialGradient(this.x, this.y - 6, this.radius * 0.35, this.x, this.y, this.radius);
        grad.addColorStop(0, "#f4f8ff");
        grad.addColorStop(0.45, this.color);
        grad.addColorStop(1, "#535a69");

        ctx.beginPath();
        ctx.ellipse(this.x, this.y, this.radius * 1.03, this.radius * 1.18, 0, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.shadowColor = "#b5e2ff66";
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();

        ctx.save();

        // Robotic jaw/chin
        ctx.beginPath();
        ctx.ellipse(this.x, this.y + 10, this.radius * 0.55, this.radius * 0.35, 0, 0, Math.PI * 2);
        ctx.fillStyle = "#8ea0b8";
        ctx.globalAlpha = 0.88;
        ctx.fill();
        ctx.globalAlpha = 1.0;
        ctx.restore();

        ctx.save();
        // Draw facial grooves (robotic lines)
        ctx.strokeStyle = "#8390a8";
        ctx.lineWidth = 2.2;
        ctx.globalAlpha = 0.55;
        ctx.beginPath();
        ctx.moveTo(this.x - 8, this.y - 7);
        ctx.lineTo(this.x - 8, this.y + 8);
        ctx.moveTo(this.x + 8, this.y - 7);
        ctx.lineTo(this.x + 8, this.y + 8);
        ctx.moveTo(this.x, this.y - 10);
        ctx.lineTo(this.x, this.y + 11);
        ctx.stroke();
        ctx.globalAlpha = 1.0;
        ctx.restore();

        // Glowing blue eyes
        ctx.save();
        ctx.shadowColor = this.eyeColor + "cc";
        ctx.shadowBlur = 16;
        ctx.beginPath();
        ctx.ellipse(this.x - 6.4, this.y - 3.8, 2.9, 2, 0, 0, Math.PI * 2);
        ctx.ellipse(this.x + 6.4, this.y - 3.8, 2.9, 2, 0, 0, Math.PI * 2);
        ctx.fillStyle = this.eyeColor;
        ctx.globalAlpha = 0.98;
        ctx.fill();
        ctx.restore();

        // Face mask lines
        ctx.save();
        ctx.strokeStyle = "#e4eaf5";
        ctx.lineWidth = 1.2;
        ctx.globalAlpha = 0.25;
        ctx.beginPath();
        ctx.moveTo(this.x - 4, this.y + 10);
        ctx.lineTo(this.x - 7, this.y + 15);
        ctx.moveTo(this.x + 4, this.y + 10);
        ctx.lineTo(this.x + 7, this.y + 15);
        ctx.stroke();
        ctx.globalAlpha = 1.0;
        ctx.restore();

        // Mouth slit (robotic style)
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(this.x - 3, this.y + 7.5);
        ctx.lineTo(this.x + 3, this.y + 7.5);
        ctx.strokeStyle = "#6d768b";
        ctx.lineWidth = 1.2;
        ctx.globalAlpha = 0.65;
        ctx.stroke();
        ctx.globalAlpha = 1.0;
        ctx.restore();

        // (Optional) Subtle blue underglow for menace
        ctx.save();
        ctx.shadowColor = "#48e6ff33";
        ctx.shadowBlur = 24;
        ctx.globalAlpha = 0.38;
        ctx.beginPath();
        ctx.arc(this.x, this.y + 14, this.radius * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = "#48e6ff";
        ctx.fill();
        ctx.restore();
    }
}

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.radius = randInt(1, 3);
        this.color = color;
        this.vx = (Math.random() - 0.5) * 4;
        this.vy = (Math.random() - 0.5) * 4;
        this.alpha = 1;
        this.life = randInt(18, 32);
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life--;
        this.alpha -= 0.03;
        if (this.alpha < 0) this.alpha = 0;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.globalAlpha = 1.0;
        ctx.restore();
    }

    isAlive() {
        return this.life > 0 && this.alpha > 0.05;
    }
}

class Star {
    constructor() {
        this.x = randInt(0, GAME_WIDTH);
        this.y = randInt(0, GAME_HEIGHT);
        this.radius = Math.random() * 1.3 + 0.7;
        this.speed = Math.random() * 1.2 + 0.5;
        this.alpha = Math.random() * 0.5 + 0.25;
    }

    update() {
        this.y += this.speed;
        if (this.y > GAME_HEIGHT) {
            this.y = 0;
            this.x = randInt(0, GAME_WIDTH);
        }
    }
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = "#fff";
        ctx.fill();
        ctx.globalAlpha = 1.0;
        ctx.restore();
    }
}

class GameManager {
    constructor(container) {
        this.container = container;
        this.canvas = document.createElement('canvas');
        this.canvas.width = GAME_WIDTH;
        this.canvas.height = GAME_HEIGHT;
        this.canvas.tabIndex = 0;
        this.ctx = this.canvas.getContext('2d');
        this.container.appendChild(this.canvas);

        this.state = "menu"; // "menu", "playing", "gameover"
        this.keys = {};
        this.score = 0;

        this.stars = [];
        this.player = null;
        this.bullets = [];
        this.enemies = [];
        this.particles = [];
        this.spawnTimer = 0;

        this.initEvents();
        this.initStars();
        this.showMenu();
    }

    initEvents() {
        // Keyboard
        this.canvas.addEventListener('keydown', e => {
            this.keys[e.code] = true;
            // Allow shooting with Space in menu/gameover for restart
            if (this.state === "menu" && (e.code === "Space" || e.code === "Enter")) {
                this.startGame();
            } else if (this.state === "gameover" && (e.code === "Space" || e.code === "Enter")) {
                this.startGame();
            }
            // Prevent scrolling
            if (["ArrowLeft","ArrowRight","Space"].includes(e.code)) e.preventDefault();
        });
        this.canvas.addEventListener('keyup', e => {
            this.keys[e.code] = false;
        });

        // Mouse for the button
        document.addEventListener('click', e => {
            if (this.state === "menu" && e.target.id === "startBtn") {
                this.startGame();
            }
            if (this.state === "gameover" && e.target.id === "restartBtn") {
                this.startGame();
            }
        });
    }

    initStars() {
        this.stars = [];
        for (let i = 0; i < 66; ++i) {
            this.stars.push(new Star());
        }
    }

    showMenu() {
        this.clearMenus();
        // Create menu overlay
        let menu = document.createElement('div');
        menu.id = "startMenu";
        menu.innerHTML = `
            <h1 style="color:#fff;text-shadow:0 2px 22px #0af2,0 0 6px #202;">SPACE SHOOTER</h1>
            <p style="color:#c0eaff;margin:16px 0 0 0;">Arrow keys or A/D: Move<br>Space: Shoot</p>
            <button id="startBtn">Start Game</button>
        `;
        document.body.appendChild(menu);
        // Focus canvas for key input
        setTimeout(() => this.canvas.focus(), 100);
        // Show first frame of background
        this.render();
    }

    showGameOver() {
        this.clearMenus();
        let menu = document.createElement('div');
        menu.id = "startMenu";
        menu.innerHTML = `
            <h2 style="color:#fff;text-shadow:0 2px 16px #f23,0 0 6px #202;">GAME OVER</h2>
            <p style="color:#fc8;font-size:1.2em;margin:10px 0;">Score: <b>${this.score}</b></p>
            <button id="restartBtn">Restart</button>
        `;
        document.body.appendChild(menu);
        setTimeout(() => this.canvas.focus(), 100);
        this.render();
    }

    clearMenus() {
        let menu = document.getElementById("startMenu");
        if (menu) menu.remove();
    }

    startGame() {
        this.clearMenus();
        this.state = "playing";
        this.score = 0;
        this.player = new Player(GAME_WIDTH / 2, GAME_HEIGHT - 58);
        this.bullets = [];
        this.enemies = [];
        this.particles = [];
        this.spawnTimer = 0;
        this.initStars();
        this.canvas.focus();
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }

    gameLoop() {
        if (this.state !== "playing") return;

        // --- Update ---
        this.update();

        // --- Render ---
        this.render();

        // Next frame
        requestAnimationFrame(() => this.gameLoop());
    }

    update() {
        // Update stars
        this.stars.forEach(s => s.update());

        // Player movement
        let dx = 0;
        if (this.keys["ArrowLeft"] || this.keys["KeyA"]) dx -= 1;
        if (this.keys["ArrowRight"] || this.keys["KeyD"]) dx += 1;
        if (dx !== 0) this.player.move(dx);

        // Player shooting
        if (this.player.cooldown > 0) this.player.cooldown--;
        if ((this.keys["Space"] || this.keys["KeyW"] || this.keys["ArrowUp"]) && this.player.cooldown === 0) {
            this.bullets.push(new Bullet(this.player.x, this.player.y - this.player.radius - 8));
            this.player.cooldown = 14;
        }

        // Update bullets
        this.bullets.forEach(b => b.update());
        this.bullets = this.bullets.filter(b => b.active);

        // Spawn enemies
        this.spawnTimer--;
        if (this.spawnTimer <= 0) {
            let type = Math.random() > 0.78 ? 1 : 0;
            let rx = randInt(30, GAME_WIDTH - 30);
            this.enemies.push(new Enemy(rx, -30, type));
            this.spawnTimer = randInt(28, 54);
        }
        this.enemies.forEach(e => e.update());
        this.enemies = this.enemies.filter(e => e.active);

        // Update particles
        this.particles.forEach(p => p.update());
        this.particles = this.particles.filter(p => p.isAlive());

        // Collisions: Bullet hits enemy
        for (let i = this.enemies.length - 1; i >= 0; --i) {
            let e = this.enemies[i];
            for (let j = this.bullets.length - 1; j >= 0; --j) {
                let b = this.bullets[j];
                if (circleCollides(e.x, e.y, e.radius, b.x, b.y, b.radius)) {
                    e.active = false;
                    b.active = false;
                    this.score += 10 + (e.type * 10);
                    // Particles
                    for (let k = 0; k < 12; ++k) {
                        this.particles.push(new Particle(e.x, e.y, "#babfd1"));
                    }
                    break;
                }
            }
        }

        // Collisions: Enemy hits player
        for (let i = this.enemies.length - 1; i >= 0; --i) {
            let e = this.enemies[i];
            if (circleCollides(this.player.x, this.player.y, this.player.radius, e.x, e.y, e.radius)) {
                e.active = false;
                this.player.lives--;
                for (let k = 0; k < 16; ++k) {
                    this.particles.push(new Particle(this.player.x, this.player.y, "#ff2222"));
                }
                if (this.player.lives <= 0) {
                    this.player.isAlive = false;
                    this.state = "gameover";
                    setTimeout(() => this.showGameOver(), 900);
                }
            }
        }
    }

    render() {
        // Clear
        this.ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

        // Background stars
        this.stars.forEach(s => s.draw(this.ctx));

        // Player
        if (this.player && this.player.isAlive) {
            this.player.draw(this.ctx);
        }

        // Bullets
        this.bullets.forEach(b => b.draw(this.ctx));

        // Enemies
        this.enemies.forEach(e => e.draw(this.ctx));

        // Particles
        this.particles.forEach(p => p.draw(this.ctx));

        // UI
        this.drawUI();
    }

    drawUI() {
        // Score
        this.ctx.save();
        this.ctx.font = "20px Segoe UI, Arial";
        this.ctx.fillStyle = "#fff";
        this.ctx.shadowColor = "#0cf";
        this.ctx.shadowBlur = 6;
        this.ctx.fillText("Score: " + this.score, 16, 32);
        this.ctx.restore();

        // Lives (draw small Terminator heads)
        for (let i = 0; i < (this.player ? this.player.lives : 0); ++i) {
            // Draw mini terminator heads as lives
            let px = GAME_WIDTH - 28 - i * 30;
            let py = 32;
            let r = 10;
            ctx = this.ctx;
            ctx.save();
            // Head
            let grad = ctx.createRadialGradient(px, py - 4, 5, px, py, r);
            grad.addColorStop(0, "#f5f8ff");
            grad.addColorStop(0.4, "#b2bbc7");
            grad.addColorStop(1, "#5a646b");
            ctx.beginPath();
            ctx.ellipse(px, py, r * 1.02, r * 1.15, 0, 0, Math.PI * 2);
            ctx.fillStyle = grad;
            ctx.shadowColor = "#d2eaff33";
            ctx.shadowBlur = 4;
            ctx.fill();

            // Eyes
            ctx.save();
            ctx.shadowColor = "#ff2222bb";
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.ellipse(px - 3.5, py - 2.5, 1.7, 1.1, 0, 0, Math.PI * 2);
            ctx.ellipse(px + 3.5, py - 2.5, 1.7, 1.1, 0, 0, Math.PI * 2);
            ctx.fillStyle = "#ff2222";
            ctx.globalAlpha = 0.89;
            ctx.fill();
            ctx.restore();

            // Jaw
            ctx.save();
            ctx.beginPath();
            ctx.ellipse(px, py + 6, r * 0.6, r * 0.38, 0, 0, Math.PI * 2);
            ctx.fillStyle = "#8ea0b8";
            ctx.globalAlpha = 0.88;
            ctx.fill();
            ctx.globalAlpha = 1.0;
            ctx.restore();

            // Mouth slit
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(px - 2, py + 5.3);
            ctx.lineTo(px + 2, py + 5.3);
            ctx.strokeStyle = "#535a69";
            ctx.lineWidth = 1;
            ctx.globalAlpha = 0.7;
            ctx.stroke();
            ctx.globalAlpha = 1.0;
            ctx.restore();

            ctx.restore();
        }
    }
}

// --- Game Initialization ---

function initGame() {
    const container = document.getElementById('gameContainer');
    new GameManager(container);
}

window.addEventListener('DOMContentLoaded', initGame);