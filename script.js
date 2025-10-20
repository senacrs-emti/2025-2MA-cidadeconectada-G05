const bola = document.getElementById("bola");
const cesta = document.getElementById("cesta");
const placar = document.getElementById("placar");
let pontos = 0;

let isDragging = false;
let startX, startY;
let vx = 0, vy = 0;
let x = bola.offsetLeft, y = bola.offsetTop;
let gravity = 0.7;
let inAir = false;

bola.addEventListener("mousedown", (e) => {
    if (inAir) return;
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    bola.style.cursor = "grabbing";
});

window.addEventListener("mousemove", (e) => {
    if (!isDragging || inAir) return;
    let dx = e.clientX - startX;
    let dy = e.clientY - startY;
    bola.style.left = x + dx + "px";
    bola.style.top = y + dy + "px";
});

window.addEventListener("mouseup", (e) => {
    if (!isDragging || inAir) return;
    isDragging = false;
    bola.style.cursor = "grab";

    // calcula força do arremesso
    vx = (x - bola.offsetLeft) * 0.3;
    vy = (y - bola.offsetTop) * 0.3;
    inAir = true;
    animar();
});

function animar() {
    if (!inAir) return;
    vx *= 0.99;
    vy += gravity;

    x += vx;
    y += vy;

    // colisão com chão
    if (y + bola.clientHeight >= 500) {
        y = 500 - bola.clientHeight;
        vy *= -0.6;
        vx *= 0.8;
        if (Math.abs(vy) < 1 && Math.abs(vx) < 1) {
            inAir = false;
            return;
        }
    }

    // colisão lateral
    if (x <= 0 || x + bola.clientWidth >= 800) {
        vx *= -0.8;
    }

    // detectar cesta
    const cestaRect = cesta.getBoundingClientRect();
    const bolaRect = bola.getBoundingClientRect();

    if (
        bolaRect.right > cestaRect.left + 40 &&
        bolaRect.left < cestaRect.right - 40 &&
        bolaRect.bottom > cestaRect.top + 60 &&
        bolaRect.top < cestaRect.bottom - 20
    ) {
        pontos++;
        placar.textContent = "Pontos: " + pontos;
        resetarBola();
        return;
    }

    bola.style.left = x + "px";
    bola.style.top = y + "px";

    requestAnimationFrame(animar);
}

function resetarBola() {
    x = 100;
    y = 400;
    bola.style.left = x + "px";
    bola.style.top = y + "px";
    inAir = false;
}
