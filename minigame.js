window.addEventListener('load', () => {
    const tela = document.getElementById('tela');
    const bola = document.getElementById('bola');
    const linha = document.getElementById('trajetoria');
    const placarEl = document.getElementById('pontos');
    const resetBtn = document.getElementById('resetar');
  
    const cestas = [
      { el: document.getElementById('cesta'), pontos: 1 },
      { el: document.createElement('div'), pontos: 2, img: 'https://static.vecteezy.com/system/resources/previews/024/089/832/non_2x/green-waste-bin-ecology-free-png.png' },
      { el: document.createElement('div'), pontos: -3, img: 'https://png.pngtree.com/png-vector/20240811/ourmid/pngtree-garbage-basket-full-of-on-transparent-background-ai-generated-png-image_13446676.png' },
      { el: document.createElement('div'), pontos: 4, img: 'https://cdn-icons-png.flaticon.com/512/833/833314.png' },
    ];
  
    for (let i = 1; i < cestas.length; i++) {
      cestas[i].el.id = 'cesta' + (i + 1);
      cestas[i].el.style.position = 'absolute';
      cestas[i].el.style.width = '100px';
      cestas[i].el.style.height = '100px';
      cestas[i].el.style.background = `url('${cestas[i].img}') center/contain no-repeat`;
      cestas[i].el.style.pointerEvents = 'none';
      tela.appendChild(cestas[i].el);
    }
  
    let WIDTH = tela.clientWidth;
    let HEIGHT = tela.clientHeight;
    let x = 100, y = HEIGHT - 120;
    let vx = 0, vy = 0;
    let gravity = 0.6;
    let inAir = false;
    let pontos = 0;
    placarEl.textContent = pontos;
  
    let aiming = false;
    let origin = { x: 0, y: 0 };
    let pointer = { x: 0, y: 0 };
    const MAX_FORCE = 35;
  
    function resizeCanvas() {
      WIDTH = tela.clientWidth;
      HEIGHT = tela.clientHeight;
      const dpr = window.devicePixelRatio || 1;
      linha.width = WIDTH * dpr;
      linha.height = HEIGHT * dpr;
      linha.style.width = WIDTH + 'px';
      linha.style.height = HEIGHT + 'px';
      linha.getContext('2d').setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
  
    function placeBall(px, py) {
      x = px;
      y = py;
      bola.style.left = x + 'px';
      bola.style.top = y + 'px';
    }
    placeBall(100, HEIGHT - 120);
  
    function moverCestaAleatoria(cesta) {
      const pad = 20;
      const minLeft = WIDTH / 2;
      const maxLeft = WIDTH - cesta.el.clientWidth - pad;
      const maxTop = Math.floor(HEIGHT / 2);
      const left = minLeft + Math.random() * (maxLeft - minLeft);
      const top = Math.random() * maxTop;
      cesta.el.style.left = left + 'px';
      cesta.el.style.top = top + 'px';
      const ang = (Math.random() * 20) - 10;
      cesta.el.style.transform = `rotate(${ang}deg)`;
    }
  
    // Inicializa todas as cestas
    cestas.forEach(c => moverCestaAleatoria(c));
  
    function clientToLocal(clientX, clientY) {
      const rect = tela.getBoundingClientRect();
      return {
        x: Math.max(0, Math.min(WIDTH, clientX - rect.left)),
        y: Math.max(0, Math.min(HEIGHT, clientY - rect.top))
      };
    }
  
    const ctx = linha.getContext('2d');
  
    function desenharTrajetoria(endX, endY) {
      ctx.clearRect(0, 0, WIDTH, HEIGHT);
      const origemX = x + bola.clientWidth / 2;
      const origemY = y + bola.clientHeight / 2;
      let dx = endX - origemX;
      let dy = endY - origemY;
      const dist = Math.sqrt(dx*dx + dy*dy);
      const forceRatio = Math.min(1, dist / 200);
      const force = forceRatio * MAX_FORCE;
      const ux = dx / (dist || 1);
      const uy = dy / (dist || 1);
      let simVX = ux * force;
      let simVY = uy * force;
      let tempX = origemX, tempY = origemY;
      let stepVX = simVX * 0.25, stepVY = simVY * 0.25;
      const g = gravity * 0.25;
      ctx.fillStyle = 'rgba(255,50,50,0.95)';
      const steps = 40;
      for (let i = 0; i < steps; i++) {
        tempX += stepVX;
        tempY += stepVY;
        stepVY += g;
        if (tempX < -50 || tempX > WIDTH + 50 || tempY > HEIGHT + 50) break;
        ctx.beginPath();
        ctx.arc(tempX, tempY, 3, 0, Math.PI*2);
        ctx.fill();
      }
    }
  
    function startAiming(clientX, clientY) {
      if (inAir) return;
      const local = clientToLocal(clientX, clientY);
      const ballRect = bola.getBoundingClientRect();
      const localBall = {
        left: ballRect.left - tela.getBoundingClientRect().left,
        top: ballRect.top - tela.getBoundingClientRect().top,
        width: bola.clientWidth,
        height: bola.clientHeight
      };
      if (local.x >= localBall.left && local.x <= localBall.left + localBall.width &&
          local.y >= localBall.top && local.y <= localBall.top + localBall.height) {
        aiming = true;
        origin.x = x + bola.clientWidth / 2;
        origin.y = y + bola.clientHeight / 2;
        pointer.x = local.x;
        pointer.y = local.y;
        desenharTrajetoria(pointer.x, pointer.y);
      }
    }
  
    function updateAiming(clientX, clientY) {
      if (!aiming) return;
      const local = clientToLocal(clientX, clientY);
      pointer.x = local.x;
      pointer.y = local.y;
      desenharTrajetoria(pointer.x, pointer.y);
    }
  
    function releaseAiming(clientX, clientY) {
      if (!aiming) return;
      aiming = false;
      ctx.clearRect(0,0,WIDTH,HEIGHT);
      const local = clientToLocal(clientX, clientY);
      let dx = local.x - (x + bola.clientWidth/2);
      let dy = local.y - (y + bola.clientHeight/2);
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 10) return;
      const maxDist = 200;
      const ratio = Math.min(1, dist / maxDist);
      const power = ratio * MAX_FORCE;
      const ux = dx / dist;
      const uy = dy / dist;
      vx = ux * power;
      vy = uy * power;
      inAir = true;
      requestAnimationFrame(stepAnim);
    }
  
    function stepAnim() {
      if (!inAir) return;
      vx *= 0.995;
      vy += gravity;
      x += vx;
      y += vy;
  
      const floorY = HEIGHT - 40;
      if (y + bola.clientHeight >= floorY) {
        y = floorY - bola.clientHeight;
        vy *= -0.55;
        vx *= 0.75;
        if (Math.abs(vy) < 1 && Math.abs(vx) < 1) inAir = false;
      }
  
      if (x <= 0) { x = 0; vx *= -0.6; }
      else if (x + bola.clientWidth >= WIDTH) { x = WIDTH - bola.clientWidth; vx *= -0.6; }
  
      bola.style.left = x + 'px';
      bola.style.top = y + 'px';
  
      const bolaRect = { left: x, top: y, right: x + bola.clientWidth, bottom: y + bola.clientHeight };
  
      for (let cesta of cestas) {
        const cestaRect = cesta.el.getBoundingClientRect();
        const telaRect = tela.getBoundingClientRect();
        const cestaLocal = {
          left: cestaRect.left - telaRect.left,
          top: cestaRect.top - telaRect.top,
          right: cestaRect.right - telaRect.left,
          bottom: cestaRect.bottom - telaRect.top
        };
  
        if (bolaRect.right > cestaLocal.left + 20 &&
            bolaRect.left < cestaLocal.right - 20 &&
            bolaRect.bottom > cestaLocal.top + 20 &&
            bolaRect.top < cestaLocal.bottom - 10) {
          pontos += cesta.pontos;
          placarEl.textContent = pontos;
          moverCestaAleatoria(cesta);
          resetarBola();
          return;
        }
      }
  
      requestAnimationFrame(stepAnim);
    }
  
    // Eventos mouse/touch
    tela.addEventListener('mousedown', (ev) => startAiming(ev.clientX, ev.clientY));
    window.addEventListener('mousemove', (ev) => updateAiming(ev.clientX, ev.clientY));
    window.addEventListener('mouseup', (ev) => releaseAiming(ev.clientX, ev.clientY));
  
    tela.addEventListener('touchstart', (ev) => { startAiming(ev.changedTouches[0].clientX, ev.changedTouches[0].clientY); ev.preventDefault(); }, {passive:false});
    window.addEventListener('touchmove', (ev) => { updateAiming(ev.changedTouches[0].clientX, ev.changedTouches[0].clientY); ev.preventDefault(); }, {passive:false});
    window.addEventListener('touchend', (ev) => { if (ev.changedTouches[0]) releaseAiming(ev.changedTouches[0].clientX, ev.changedTouches[0].clientY); ev.preventDefault(); }, {passive:false});
  
    function resetarBola() {
      inAir = false;
      vx = 0; vy = 0;
      placeBall(100, HEIGHT - 120);
      ctx.clearRect(0,0,WIDTH,HEIGHT);
    }
    resetBtn.addEventListener('click', resetarBola);
  
    window.addEventListener('mouseleave', () => {
      if (aiming) {
        const px = Math.max(0, Math.min(WIDTH, pointer.x || origin.x));
        const py = Math.max(0, Math.min(HEIGHT, pointer.y || origin.y));
        releaseAiming(px, py);
      }
    });
    window.addEventListener('blur', () => { if (aiming) { aiming=false; ctx.clearRect(0,0,WIDTH,HEIGHT); } });
  
    requestAnimationFrame(() => placeBall(100, HEIGHT - 120));
  });
  // adicionando cestas extras
const cestas = [
    { el: document.getElementById('cesta'), pontos: 1 },
    { el: document.getElementById('cesta2'), pontos: 2 },
    { el: document.getElementById('cesta3'), pontos: 3 },
    { el: document.getElementById('cesta4'), pontos: 4 }
  ];
  
  // mover uma cesta aleatória (somente a que foi acertada)
  function moverCestaAleatoria(cesta) {
    const pad = 20;
    const minLeft = WIDTH / 2; // parte direita
    const maxLeft = WIDTH - cesta.el.clientWidth - pad;
    const maxTop = Math.floor(HEIGHT / 2);
    const left = minLeft + Math.random() * (maxLeft - minLeft);
    const top = Math.random() * maxTop;
    cesta.el.style.left = left + 'px';
    cesta.el.style.top = top + 'px';
    const ang = (Math.random() * 20) - 10;
    cesta.el.style.transform = `rotate(${ang}deg)`;
  }
  
  // inicializa todas as cestas
  cestas.forEach(cesta => moverCestaAleatoria(cesta));
  
  // na animação principal, verifica colisão para todas as cestas
  function stepAnim() {
    if (!inAir) return;
  
    vx *= 0.995;
    vy += gravity;
    x += vx;
    y += vy;
  
    const floorY = HEIGHT - 40;
    if (y + bola.clientHeight >= floorY) {
      y = floorY - bola.clientHeight;
      vy *= -0.55;
      vx *= 0.75;
      if (Math.abs(vy) < 1 && Math.abs(vx) < 1) inAir = false;
    }
  
    if (x <= 0) { x = 0; vx *= -0.6; }
    else if (x + bola.clientWidth >= WIDTH) { x = WIDTH - bola.clientWidth; vx *= -0.6; }
  
    bola.style.left = x + 'px';
    bola.style.top = y + 'px';
  
    const bolaRect = { left: x, top: y, right: x + bola.clientWidth, bottom: y + bola.clientHeight };
  
    for (let cesta of cestas) {
      const cestaRect = cesta.el.getBoundingClientRect();
      const telaRect = tela.getBoundingClientRect();
      const cestaLocal = {
        left: cestaRect.left - telaRect.left,
        top: cestaRect.top - telaRect.top,
        right: cestaRect.right - telaRect.left,
        bottom: cestaRect.bottom - telaRect.top
      };
  
      if (bolaRect.right > cestaLocal.left + 20 &&
          bolaRect.left < cestaLocal.right - 20 &&
          bolaRect.bottom > cestaLocal.top + 20 &&
          bolaRect.top < cestaLocal.bottom - 10) {
        pontos += cesta.pontos;
        placarEl.textContent = pontos;
        moverCestaAleatoria(cesta); // somente a cesta acertada se move
        resetarBola();
        return;
      }
    }
  
    requestAnimationFrame(stepAnim);
  }
  