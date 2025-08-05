// --- Utility Functions ---

// Clamp a value between min and max
function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
}

// Random integer in [min, max]
function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Collision detection between circles
function circleCollides(ax, ay, ar, bx, by, br) {
    let dx = ax - bx, dy = ay - by;
    let distSq = dx * dx + dy * dy;
    let radii = ar + br;
    return distSq <= radii * radii;
}

// Collision detection between rectangle and circle
function rectCircleCollides(rx, ry, rw, rh, cx, cy, cr) {
    let closestX = clamp(cx, rx, rx + rw);
    let closestY = clamp(cy, ry, ry + rh);
    let dx = cx - closestX;
    let dy = cy - closestY;
    return (dx * dx + dy * dy) <= cr * cr;
}