// ===== Objetos desenhados por código (pré-renderizados quando possível) =====
const OBJ = {};

// ---------- Cérebro (vista lateral, prata, luz de cima/esquerda) ----------
function brainPath(c) {
  c.beginPath();
  c.ellipse(300, 230, 250, 180, -0.05, 0, Math.PI * 2);
  c.moveTo(440, 330); c.ellipse(270, 320, 190, 95, 0.08, 0, Math.PI * 2);
}
function buildBrain() {
  const Bw = 640, Bh = 540, cv = mkCanvas(Bw, Bh), c = cv.getContext('2d');
  const r = rng(42);
  // tronco e cerebelo (atrás)
  c.save();
  let g = c.createLinearGradient(360, 380, 420, 520);
  g.addColorStop(0, '#9c9ca2'); g.addColorStop(1, '#55555b');
  c.fillStyle = g;
  c.beginPath(); c.moveTo(375, 380); c.quadraticCurveTo(360, 470, 352, 520); c.lineTo(400, 520); c.quadraticCurveTo(405, 450, 430, 390); c.closePath(); c.fill();
  g = c.createRadialGradient(420, 360, 10, 445, 395, 120);
  g.addColorStop(0, '#d9d9dd'); g.addColorStop(1, '#6a6a70');
  c.fillStyle = g; c.beginPath(); c.ellipse(450, 395, 112, 70, 0.15, 0, Math.PI * 2); c.fill();
  c.save(); c.beginPath(); c.ellipse(450, 395, 112, 70, 0.15, 0, Math.PI * 2); c.clip();
  c.strokeStyle = 'rgba(40,40,46,0.55)'; c.lineWidth = 2.5;
  for (let i = -6; i < 8; i++) { c.beginPath(); c.ellipse(450, 395 + i * 11, 130, 40, 0.15, Math.PI * 0.05, Math.PI * 0.95); c.stroke(); }
  c.restore();
  c.restore();

  // cérebro (frente)
  c.save();
  brainPath(c);
  g = c.createRadialGradient(190, 120, 20, 300, 260, 330);
  g.addColorStop(0, '#f4f4f6'); g.addColorStop(0.45, '#b9b9bf'); g.addColorStop(1, '#5c5c63');
  c.fillStyle = g; c.fill();
  c.clip();
  // giros: "tubos" sinuosos com sulco escuro, corpo prateado e brilho
  const curves = [];
  for (let i = 0; i < 120; i++) {
    let x = 30 + r() * 560, y = 30 + r() * 420, a = r() * Math.PI * 2;
    const pts = [[x, y]], len = 5 + Math.floor(r() * 7);
    for (let k = 0; k < len; k++) { a += (r() - 0.5) * 2.2; x += Math.cos(a) * 16; y += Math.sin(a) * 16; pts.push([x, y]); }
    curves.push(pts);
  }
  const stroke = (pts, col, w, ox, oy) => {
    c.strokeStyle = col; c.lineWidth = w; c.lineCap = 'round'; c.lineJoin = 'round';
    c.beginPath(); c.moveTo(pts[0][0] + ox, pts[0][1] + oy);
    for (let k = 1; k < pts.length - 1; k++) {
      const mx = (pts[k][0] + pts[k + 1][0]) / 2, my = (pts[k][1] + pts[k + 1][1]) / 2;
      c.quadraticCurveTo(pts[k][0] + ox, pts[k][1] + oy, mx + ox, my + oy);
    }
    c.lineTo(pts[pts.length - 1][0] + ox, pts[pts.length - 1][1] + oy);
    c.stroke();
  };
  c.fillStyle = 'rgba(40,40,46,0.55)'; c.fillRect(0, 0, Bw, Bh);
  for (const p of curves) {
    stroke(p, 'rgba(28,28,34,0.95)', 30, 2, 3);
    stroke(p, '#a9a9b0', 22, 0, 0);
    stroke(p, '#cfcfd5', 12, -2, -3);
    stroke(p, 'rgba(255,255,255,0.75)', 4, -4, -6);
  }
  // fissura lateral (Sylvius)
  c.strokeStyle = 'rgba(25,25,30,0.8)'; c.lineWidth = 6;
  c.beginPath(); c.moveTo(150, 330); c.bezierCurveTo(250, 290, 330, 280, 430, 230); c.stroke();
  c.strokeStyle = 'rgba(255,255,255,0.4)'; c.lineWidth = 3;
  c.beginPath(); c.moveTo(150, 324); c.bezierCurveTo(250, 284, 330, 274, 430, 224); c.stroke();
  // sombreamento geral
  c.globalCompositeOperation = 'multiply';
  g = c.createRadialGradient(200, 130, 60, 330, 280, 360);
  g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(1, 'rgba(70,70,80,1)');
  c.fillStyle = g; c.fillRect(0, 0, Bw, Bh);
  c.globalCompositeOperation = 'screen';
  g = c.createRadialGradient(190, 110, 0, 190, 110, 200);
  g.addColorStop(0, 'rgba(255,255,255,0.35)'); g.addColorStop(1, 'rgba(255,255,255,0)');
  c.fillStyle = g; c.fillRect(0, 0, Bw, Bh);
  c.restore();
  // contorno interno escuro
  c.save(); brainPath(c); c.clip();
  c.strokeStyle = 'rgba(20,20,24,0.55)'; c.lineWidth = 18; c.filter = 'blur(8px)'; brainPath(c); c.stroke();
  c.restore();
  OBJ.brain = cv;

  // partículas: blocos de 8px com conteúdo
  const data = c.getImageData(0, 0, Bw, Bh).data, parts = [], S = 8, pr = rng(9);
  for (let y = 0; y < Bh; y += S) for (let x = 0; x < Bw; x += S) {
    const a = data[((y + 4) * Bw + (x + 4)) * 4 + 3];
    if (a > 40) {
      const nx = x / Bw;
      parts.push({ x, y, th: nx * 0.62 + pr() * 0.38, dx: 260 + pr() * 520, dy: -260 + pr() * 360, rs: 0.4 + pr() * 0.6 });
    }
  }
  OBJ.brainParts = parts; OBJ.brainSize = [Bw, Bh];
}
// desenha o cérebro centrado em (cx,cy) com largura w; P = quanto já se desfez (0..1)
function drawBrain(ctx, cx, cy, w, P = 0, blur = 0, alpha = 1) {
  const [Bw, Bh] = OBJ.brainSize, s = w / Bw;
  ctx.save(); ctx.globalAlpha = alpha;
  if (blur > 0.3) ctx.filter = `blur(${blur.toFixed(1)}px)`;
  ctx.translate(cx - Bw * s / 2, cy - Bh * s / 2); ctx.scale(s, s);
  if (P <= 0.001) { ctx.drawImage(OBJ.brain, 0, 0); ctx.restore(); return; }
  for (const p of OBJ.brainParts) {
    const k = clamp((P - p.th) / 0.35);
    if (k <= 0) { ctx.drawImage(OBJ.brain, p.x, p.y, 8, 8, p.x, p.y, 8, 8); continue; }
    if (k >= 1) continue;
    const e = easeIn(k);
    ctx.globalAlpha = alpha * (1 - k);
    const sz = 8 * (1 - k * 0.5 * p.rs);
    ctx.drawImage(OBJ.brain, p.x, p.y, 8, 8, p.x + p.dx * e, p.y + p.dy * e - 40 * Math.sin(k * 3), sz, sz);
    ctx.globalAlpha = alpha;
  }
  ctx.restore();
}

// ---------- Medalhão + anel tracejado ----------
function drawMedallion(ctx, cx, cy, r, alpha = 1, light = false) {
  if (r <= 1) return;
  ctx.save(); ctx.globalAlpha = alpha;
  ctx.shadowColor = 'rgba(0,0,0,0.38)'; ctx.shadowBlur = r * 0.35; ctx.shadowOffsetX = r * 0.08; ctx.shadowOffsetY = r * 0.14;
  const g = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.35, r * 0.05, cx, cy, r);
  if (light) { g.addColorStop(0, '#ffffff'); g.addColorStop(0.7, '#e3e3e8'); g.addColorStop(1, '#b4b4bc'); }
  else { g.addColorStop(0, '#45454b'); g.addColorStop(0.75, '#141416'); g.addColorStop(1, '#050506'); }
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.strokeStyle = light ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.12)'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(cx, cy, r - 2, Math.PI * 1.05, Math.PI * 1.6); ctx.stroke();
  ctx.restore();
}
function drawDashedRing(ctx, cx, cy, r, p, rot, color = '#111', w = 5) {
  if (p <= 0) return;
  ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = w; ctx.setLineDash([18, 12]); ctx.lineCap = 'butt';
  ctx.beginPath(); ctx.arc(cx, cy, r, rot - Math.PI / 2, rot - Math.PI / 2 + Math.PI * 2 * p); ctx.stroke();
  ctx.restore();
}
function drawPulseRing(ctx, cx, cy, r0, lf, start, color = C.yellow, w = 6) {
  for (let k = 0; k < 2; k++) {
    const t = (lf - start - k * 5) / 14;
    if (t < 0 || t > 1) continue;
    ctx.save(); ctx.globalAlpha = 1 - t; ctx.strokeStyle = color; ctx.lineWidth = w * (1 - t * 0.5);
    ctx.beginPath(); ctx.arc(cx, cy, r0 * (1 + 0.55 * easeOut(t)), 0, Math.PI * 2); ctx.stroke(); ctx.restore();
  }
}

// ---------- Neurônio (cantos, desfocado) ----------
function buildNeuron() {
  const cv = mkCanvas(560, 560), c = cv.getContext('2d'), r = rng(3);
  c.lineCap = 'round';
  const branch = (x, y, a, len, w, d) => {
    if (d > 5 || w < 0.8) return;
    const x2 = x + Math.cos(a) * len, y2 = y + Math.sin(a) * len;
    const g = c.createLinearGradient(x, y, x2, y2); g.addColorStop(0, '#6d6d74'); g.addColorStop(1, '#b0b0b8');
    c.strokeStyle = g; c.lineWidth = w;
    c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo((x + x2) / 2 + (r() - .5) * 30, (y + y2) / 2 + (r() - .5) * 30, x2, y2); c.stroke();
    const n = 1 + Math.floor(r() * 2.4);
    for (let i = 0; i < n; i++) branch(x2, y2, a + (r() - .5) * 1.4, len * (0.6 + r() * 0.25), w * 0.62, d + 1);
  };
  for (let i = 0; i < 7; i++) branch(280, 280, i / 7 * Math.PI * 2 + r() * 0.5, 70 + r() * 40, 16, 0);
  const g = c.createRadialGradient(265, 265, 4, 280, 280, 42);
  g.addColorStop(0, '#e6e6ea'); g.addColorStop(1, '#5b5b62');
  c.fillStyle = g; c.beginPath(); c.arc(280, 280, 40, 0, Math.PI * 2); c.fill();
  OBJ.neuron = cv;
}
function drawNeuron(ctx, x, y, s, rot, blur, alpha = 0.9) {
  ctx.save(); ctx.globalAlpha = alpha; ctx.filter = `blur(${blur}px)`;
  ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ctx.drawImage(OBJ.neuron, -280, -280); ctx.restore();
}

// ---------- Caderno antigo aberto (vista de cima) ----------
function drawNotebook(ctx, cx, cy, w, h, rot, content) {
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot);
  // sombra
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,0.35)'; ctx.shadowBlur = 60; ctx.shadowOffsetX = 26; ctx.shadowOffsetY = 40;
  let g = ctx.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2);
  g.addColorStop(0, '#6b4a2e'); g.addColorStop(1, '#3a2617');
  ctx.fillStyle = g; roundRect(ctx, -w / 2 - 22, -h / 2 - 18, w + 44, h + 36, 18); ctx.fill(); ctx.restore();
  // páginas
  for (const side of [-1, 1]) {
    const x0 = side < 0 ? -w / 2 : 0;
    g = ctx.createLinearGradient(x0, 0, x0 + w / 2, 0);
    if (side < 0) { g.addColorStop(0, '#efe5cf'); g.addColorStop(0.85, '#e8dcc0'); g.addColorStop(1, '#bfae8a'); }
    else { g.addColorStop(0, '#bfae8a'); g.addColorStop(0.12, '#ebe0c6'); g.addColorStop(1, '#f2e9d5'); }
    ctx.fillStyle = g; ctx.fillRect(x0, -h / 2, w / 2, h);
    ctx.strokeStyle = 'rgba(90,110,140,0.18)'; ctx.lineWidth = 2;
    for (let y = -h / 2 + 70; y < h / 2 - 20; y += 46) { ctx.beginPath(); ctx.moveTo(x0 + 30, y); ctx.lineTo(x0 + w / 2 - 30, y); ctx.stroke(); }
  }
  // manchas de envelhecimento
  const r = rng(11);
  for (let i = 0; i < 14; i++) {
    const x = (r() - .5) * w, y = (r() - .5) * h, rad = 20 + r() * 70;
    const gg = ctx.createRadialGradient(x, y, 0, x, y, rad);
    gg.addColorStop(0, 'rgba(150,110,60,0.10)'); gg.addColorStop(1, 'rgba(150,110,60,0)');
    ctx.fillStyle = gg; ctx.fillRect(x - rad, y - rad, rad * 2, rad * 2);
  }
  if (content) content(ctx, w, h);
  ctx.restore();
}
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}

// ---------- Ampulheta dourada ----------
function buildHourglass() {
  const cv = mkCanvas(340, 520), c = cv.getContext('2d');
  const gold = (y0, y1) => { const g = c.createLinearGradient(0, y0, 340, y1); g.addColorStop(0, '#f6dc8a'); g.addColorStop(0.35, '#b98a2c'); g.addColorStop(0.6, '#fbe9a8'); g.addColorStop(1, '#7a5512'); return g; };
  // vidro
  c.beginPath();
  c.moveTo(80, 70); c.bezierCurveTo(80, 220, 160, 230, 165, 260); c.bezierCurveTo(160, 290, 80, 300, 80, 450);
  c.lineTo(260, 450); c.bezierCurveTo(260, 300, 180, 290, 175, 260); c.bezierCurveTo(180, 230, 260, 220, 260, 70); c.closePath();
  c.fillStyle = 'rgba(255,255,255,0.10)'; c.fill();
  c.save(); c.clip();
  // areia
  c.fillStyle = '#f1e7d0';
  c.beginPath(); c.moveTo(90, 170); c.quadraticCurveTo(170, 160, 250, 170); c.lineTo(250, 230); c.quadraticCurveTo(170, 250, 90, 230); c.fill();
  c.beginPath(); c.moveTo(85, 450); c.quadraticCurveTo(170, 330, 255, 450); c.fill();
  c.fillRect(167, 255, 6, 120);
  c.restore();
  c.strokeStyle = 'rgba(255,255,255,0.65)'; c.lineWidth = 4;
  c.beginPath(); c.moveTo(98, 90); c.bezierCurveTo(98, 200, 150, 220, 158, 250); c.stroke();
  // colunas e tampas
  c.fillStyle = gold(0, 520);
  for (const x of [40, 290]) { c.fillRect(x, 50, 14, 420); }
  roundRect(c, 20, 30, 300, 40, 12); c.fill();
  roundRect(c, 20, 450, 300, 40, 12); c.fill();
  c.fillStyle = 'rgba(0,0,0,0.25)'; c.fillRect(20, 62, 300, 6); c.fillRect(20, 482, 300, 6);
  OBJ.hourglass = cv;
}

// ---------- Celular girando no eixo Y ----------
function drawPhone(ctx, cx, cy, w, h, ang, screenFn) {
  const co = Math.cos(ang), si = Math.sin(ang);
  const vw = Math.max(2, w * Math.abs(co)), th = 30 * Math.abs(si);
  ctx.save();
  // sombra no chão
  ctx.save(); ctx.filter = 'blur(28px)'; ctx.fillStyle = 'rgba(0,0,0,0.30)';
  ctx.beginPath(); ctx.ellipse(cx + 40, cy + h / 2 + 30, (vw + th) * 0.55, 34, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  // espessura lateral (borda metálica)
  if (th > 1) {
    const sx = co * si > 0 ? cx + vw / 2 - 2 : cx - vw / 2 - th + 2;
    const g = ctx.createLinearGradient(sx, 0, sx + th, 0);
    g.addColorStop(0, '#2c2c30'); g.addColorStop(0.5, '#8d8d94'); g.addColorStop(1, '#1d1d20');
    ctx.fillStyle = g; roundRect(ctx, sx, cy - h / 2 + 6, th, h - 12, Math.min(th / 2, 14)); ctx.fill();
  }
  // corpo
  const x0 = cx - vw / 2, y0 = cy - h / 2, rr = Math.min(64, vw / 2);
  let g = ctx.createLinearGradient(x0, y0, x0 + vw, y0 + h);
  g.addColorStop(0, '#3a3a40'); g.addColorStop(1, '#09090b');
  ctx.fillStyle = g; roundRect(ctx, x0, y0, vw, h, rr); ctx.fill();
  if (co > 0) {
    // tela
    const inset = 16 * Math.abs(co);
    ctx.save(); roundRect(ctx, x0 + inset, y0 + 16, vw - inset * 2, h - 32, Math.max(2, rr - 14)); ctx.clip();
    ctx.translate(cx, cy); ctx.scale(Math.abs(co), 1);
    ctx.fillStyle = '#fbfbfd'; ctx.fillRect(-w / 2, -h / 2, w, h);
    if (screenFn) screenFn(ctx, w - 32, h - 32);
    ctx.restore();
    // ilha dinâmica
    ctx.fillStyle = '#050505'; roundRect(ctx, cx - 60 * co, y0 + 40, 120 * co, 34, 17); ctx.fill();
  } else {
    // traseira com câmeras
    ctx.save(); ctx.translate(cx, cy); ctx.scale(Math.abs(co), 1);
    ctx.fillStyle = '#1b1b1f'; roundRect(ctx, -w / 2 + 34, -h / 2 + 34, 190, 190, 46); ctx.fill();
    for (const [lx, ly] of [[-w / 2 + 84, -h / 2 + 84], [-w / 2 + 174, -h / 2 + 84], [-w / 2 + 84, -h / 2 + 174]]) {
      const lg = ctx.createRadialGradient(lx - 10, ly - 10, 4, lx, ly, 38);
      lg.addColorStop(0, '#5b6070'); lg.addColorStop(0.5, '#0b0b0e'); lg.addColorStop(1, '#2a2a30');
      ctx.fillStyle = lg; ctx.beginPath(); ctx.arc(lx, ly, 36, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }
  // brilho que corre com a rotação
  ctx.save(); roundRect(ctx, x0, y0, vw, h, rr); ctx.clip();
  const sh = ctx.createLinearGradient(x0, y0, x0 + vw, y0 + h * 0.4);
  const p = (si + 1) / 2;
  sh.addColorStop(clamp(p - 0.15), 'rgba(255,255,255,0)'); sh.addColorStop(clamp(p), 'rgba(255,255,255,0.18)'); sh.addColorStop(clamp(p + 0.15), 'rgba(255,255,255,0)');
  ctx.fillStyle = sh; ctx.fillRect(x0, y0, vw, h); ctx.restore();
  ctx.restore();
}
function drawReplayIcon(ctx, cx, cy, r, rot, color = '#111', w = 22) {
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot);
  ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = w; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.arc(0, 0, r, -Math.PI * 0.35, Math.PI * 1.45); ctx.stroke();
  const a = -Math.PI * 0.35, ax = Math.cos(a) * r, ay = Math.sin(a) * r;
  ctx.beginPath(); ctx.moveTo(ax + w * 1.6, ay - w * 0.2); ctx.lineTo(ax - w * 0.6, ay - w * 1.5); ctx.lineTo(ax - w * 0.4, ay + w * 1.1); ctx.closePath(); ctx.fill();
  ctx.restore();
}

// ---------- Relógio ----------
function drawClock(ctx, cx, cy, r, minAng, hourAng) {
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.35)'; ctx.shadowBlur = 60; ctx.shadowOffsetX = 28; ctx.shadowOffsetY = 40;
  let g = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
  g.addColorStop(0, '#ffffff'); g.addColorStop(0.45, '#9d9da6'); g.addColorStop(0.55, '#e7e7ec'); g.addColorStop(1, '#6d6d76');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
  g = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, 10, cx, cy, r);
  g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#dcdce2');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, r * 0.9, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.25)'; ctx.lineWidth = 3; ctx.stroke();
  for (let i = 0; i < 60; i++) {
    const a = i / 60 * Math.PI * 2, big = i % 5 === 0, r1 = r * 0.84, r2 = r * (big ? 0.74 : 0.8);
    ctx.strokeStyle = '#1a1a1a'; ctx.lineWidth = big ? 7 : 2.5;
    ctx.beginPath(); ctx.moveTo(cx + Math.sin(a) * r1, cy - Math.cos(a) * r1); ctx.lineTo(cx + Math.sin(a) * r2, cy - Math.cos(a) * r2); ctx.stroke();
  }
  ctx.fillStyle = '#1a1a1a'; ctx.font = `${r * 0.2}px ${FONT_SERIF}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  [['12', 0], ['3', 3], ['6', 6], ['9', 9]].forEach(([t, h]) => { const a = h / 12 * Math.PI * 2; ctx.fillText(t, cx + Math.sin(a) * r * 0.6, cy - Math.cos(a) * r * 0.6); });
  const hand = (ang, len, w, col) => {
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(ang);
    ctx.shadowColor = 'rgba(0,0,0,0.3)'; ctx.shadowBlur = 10; ctx.shadowOffsetX = 6; ctx.shadowOffsetY = 8;
    ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(-w / 2, r * 0.12); ctx.lineTo(-w * 0.18, -len); ctx.lineTo(w * 0.18, -len); ctx.lineTo(w / 2, r * 0.12); ctx.closePath(); ctx.fill();
    ctx.restore();
  };
  hand(hourAng, r * 0.45, 22, '#111');
  hand(minAng, r * 0.7, 14, '#111');
  ctx.fillStyle = '#111'; ctx.beginPath(); ctx.arc(cx, cy, 16, 0, Math.PI * 2); ctx.fill();
  // reflexo do vidro
  ctx.save(); ctx.globalAlpha = 0.5; ctx.strokeStyle = '#fff'; ctx.lineWidth = 10;
  ctx.beginPath(); ctx.arc(cx, cy, r * 0.82, Math.PI * 1.1, Math.PI * 1.45); ctx.stroke(); ctx.restore();
}

// ---------- Card "?" ----------
function drawQuestionCard(ctx, cx, cy, s, alpha = 1) {
  if (s <= 0.01) return;
  ctx.save(); ctx.globalAlpha = alpha; ctx.translate(cx, cy); ctx.scale(s, s);
  ctx.shadowColor = 'rgba(0,0,0,0.4)'; ctx.shadowBlur = 50; ctx.shadowOffsetX = 18; ctx.shadowOffsetY = 30;
  const g = ctx.createRadialGradient(-40, -60, 10, 0, 0, 260);
  g.addColorStop(0, '#3b3b3f'); g.addColorStop(1, '#0a0a0b');
  ctx.fillStyle = g; roundRect(ctx, -180, -180, 360, 360, 56); ctx.fill();
  ctx.shadowColor = 'rgba(255,255,255,0.9)'; ctx.shadowBlur = 40; ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0;
  ctx.fillStyle = '#fff'; ctx.font = `800 260px ${FONT_SANS}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('?', 0, 14);
  ctx.restore();
}

// ---------- Pílula com losango ----------
function drawPill(ctx, x, y, w, h, alpha, diamondFill) {
  ctx.save(); ctx.globalAlpha = alpha;
  ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 24; ctx.shadowOffsetY = 10;
  const g = ctx.createLinearGradient(x, y, x, y + h); g.addColorStop(0, '#34343a'); g.addColorStop(1, '#1f1f23');
  ctx.fillStyle = g; roundRect(ctx, x, y, w, h, h / 2); ctx.fill();
  ctx.shadowColor = 'transparent';
  const dx = x + h * 0.55, dy = y + h / 2, d = h * 0.22;
  ctx.beginPath(); ctx.moveTo(dx, dy - d); ctx.lineTo(dx + d, dy); ctx.lineTo(dx, dy + d); ctx.lineTo(dx - d, dy); ctx.closePath();
  ctx.strokeStyle = '#fff'; ctx.lineWidth = 4; ctx.stroke();
  if (diamondFill > 0) { ctx.globalAlpha = alpha * diamondFill; ctx.fillStyle = '#fff'; ctx.fill(); }
  ctx.restore();
}

// ---------- Cursor ----------
function drawCursor(ctx, x, y, s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s * 2.2, s * 2.2);
  ctx.shadowColor = 'rgba(0,0,0,0.35)'; ctx.shadowBlur = 8; ctx.shadowOffsetX = 3; ctx.shadowOffsetY = 4;
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 34); ctx.lineTo(8, 26); ctx.lineTo(14, 39); ctx.lineTo(19, 37); ctx.lineTo(13, 24); ctx.lineTo(24, 24); ctx.closePath();
  ctx.fillStyle = '#fff'; ctx.fill(); ctx.shadowColor = 'transparent'; ctx.strokeStyle = '#111'; ctx.lineWidth = 2; ctx.stroke();
  ctx.restore();
}

// ---------- Ícone de atalho (seta curva) ----------
function drawShortcutIcon(ctx, cx, cy, r, color = '#111') {
  ctx.save(); ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = r * 0.16; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(cx - r * 0.6, cy + r * 0.35); ctx.bezierCurveTo(cx - r * 0.55, cy - r * 0.55, cx + r * 0.25, cy - r * 0.6, cx + r * 0.42, cy - r * 0.05); ctx.stroke();
  const ax = cx + r * 0.5, ay = cy + r * 0.12;
  ctx.beginPath(); ctx.moveTo(ax + r * 0.18, ay - r * 0.38); ctx.lineTo(ax + r * 0.12, ay + r * 0.22); ctx.lineTo(ax - r * 0.42, ay - r * 0.02); ctx.closePath(); ctx.fill();
  ctx.restore();
}

// ---------- Gráfico da curva do esquecimento ----------
// eixo X em escala raiz (0..14 dias) para caber as revisões
const GRAPH = { x0: 150, x1: 940, y0: 760, y1: 1280, days: 14 };
const gx = t => GRAPH.x0 + (GRAPH.x1 - GRAPH.x0) * Math.sqrt(t / GRAPH.days);
const gy = R => GRAPH.y1 - (GRAPH.y1 - GRAPH.y0) * R;
function drawGraphAxes(ctx, dark, alpha = 1) {
  ctx.save(); ctx.globalAlpha = alpha;
  const col = dark ? 'rgba(255,255,255,' : 'rgba(0,0,0,';
  ctx.strokeStyle = col + '0.10)'; ctx.lineWidth = 2;
  for (let k = 1; k <= 4; k++) { const y = gy(k / 4); ctx.beginPath(); ctx.moveTo(GRAPH.x0, y); ctx.lineTo(GRAPH.x1, y); ctx.stroke(); }
  for (const d of [1, 3, 7, 14]) { const x = gx(d); ctx.beginPath(); ctx.moveTo(x, GRAPH.y0); ctx.lineTo(x, GRAPH.y1); ctx.stroke(); }
  ctx.strokeStyle = col + '0.75)'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(GRAPH.x0, GRAPH.y0 - 30); ctx.lineTo(GRAPH.x0, GRAPH.y1); ctx.lineTo(GRAPH.x1 + 20, GRAPH.y1); ctx.stroke();
  ctx.fillStyle = col + '0.6)'; ctx.font = `600 30px ${FONT_SANS}`;
  ctx.textAlign = 'center';
  [[0, '0'], [1, '1 dia'], [3, '3'], [7, '7'], [14, '14']].forEach(([d, t]) => ctx.fillText(t, gx(d), GRAPH.y1 + 48));
  ctx.textAlign = 'right'; ctx.fillText('dias →', GRAPH.x1 + 20, GRAPH.y1 + 92);
  ctx.save(); ctx.translate(GRAPH.x0 - 30, (GRAPH.y0 + GRAPH.y1) / 2); ctx.rotate(-Math.PI / 2); ctx.textAlign = 'center';
  ctx.fillText('memória', 0, 0); ctx.restore();
  ctx.restore();
}
// segmentos: [{t0, t1, S}] (memória decai como e^{-(t-t0)/S}); revisões trazem de volta a 100%
function curvePoints(segs) {
  const pts = [];
  segs.forEach((s, i) => {
    if (i > 0) pts.push([gx(s.t0), gy(1)]);
    const N = 60;
    for (let k = 0; k <= N; k++) { const q = k / N, t = s.t0 + (s.t1 - s.t0) * (s.t0 === 0 ? q * q : q); pts.push([gx(t), gy(Math.exp(-(t - s.t0) / s.S))]); }
  });
  return pts;
}
function strokeProgress(ctx, pts, p, color, w) {
  if (p <= 0 || pts.length < 2) return null;
  let len = 0; const L = [0];
  for (let i = 1; i < pts.length; i++) { len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); L.push(len); }
  const target = len * p;
  ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = w; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
  let end = pts[0];
  for (let i = 1; i < pts.length; i++) {
    if (L[i] <= target) { ctx.lineTo(pts[i][0], pts[i][1]); end = pts[i]; }
    else { const k = (target - L[i - 1]) / (L[i] - L[i - 1]); end = [lerp(pts[i - 1][0], pts[i][0], k), lerp(pts[i - 1][1], pts[i][1], k)]; ctx.lineTo(end[0], end[1]); break; }
  }
  ctx.stroke(); ctx.restore();
  return end;
}
function dot(ctx, x, y, r, col) { ctx.save(); ctx.fillStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 20; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }

// ---------- Imagens de época (sépia), feitas por código ----------
function sepiaPalette(c) { return c; }
function buildVintage() {
  OBJ.vintage = [];
  const mk = fn => { const cv = mkCanvas(W, H), c = cv.getContext('2d'); fn(c, rng(OBJ.vintage.length + 21)); OBJ.vintage.push(cv); };
  const fog = (c, y, h, a) => { const g = c.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, `rgba(226,210,182,0)`); g.addColorStop(0.5, `rgba(226,210,182,${a})`); g.addColorStop(1, `rgba(226,210,182,0)`); c.fillStyle = g; c.fillRect(0, y, W, h); };

  // 1. rua com prédios e lampião
  mk((c, r) => {
    let g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#d9c7a5'); g.addColorStop(0.55, '#a88d64'); g.addColorStop(1, '#3e2f1d');
    c.fillStyle = g; c.fillRect(0, 0, W, H);
    // prédios em perspectiva
    for (const side of [-1, 1]) {
      for (let i = 0; i < 6; i++) {
        const depth = i / 6, xN = W / 2 + side * (60 + 480 * (1 - depth)), top = 300 + depth * 520, bottom = 1250 - depth * 120;
        const xF = W / 2 + side * (60 + 480 * (1 - (i + 1) / 6));
        c.fillStyle = `rgb(${60 + depth * 90},${44 + depth * 75},${28 + depth * 55})`;
        c.beginPath(); c.moveTo(xN, top); c.lineTo(xF, top + 70); c.lineTo(xF, bottom - 20); c.lineTo(xN, bottom + 80); c.closePath(); c.fill();
        for (let k = 0; k < 6; k++) for (let j = 0; j < 2; j++) {
          const wx = lerp(xN, xF, 0.2 + j * 0.45), wy = lerp(top + 60, bottom - 40, k / 6);
          c.fillStyle = r() < 0.35 ? 'rgba(255,214,140,0.85)' : 'rgba(25,18,10,0.6)';
          c.fillRect(wx - 10, wy, 20 * (1 - depth * 0.6), 34 * (1 - depth * 0.5));
        }
      }
    }
    fog(c, 700, 600, 0.75);
    // calçamento
    c.fillStyle = '#4a3823'; c.beginPath(); c.moveTo(0, 1330); c.lineTo(W, 1330); c.lineTo(W, H); c.lineTo(0, H); c.fill();
    for (let y = 1340; y < H; y += 26 + (y - 1340) * 0.05) for (let x = -40; x < W + 40; x += 50 + (y - 1340) * 0.12) {
      c.fillStyle = `rgba(${150 + r() * 40},${120 + r() * 30},${80 + r() * 20},0.35)`;
      c.beginPath(); c.ellipse(x + (r() - .5) * 10, y, 20 + (y - 1340) * 0.04, 8 + (y - 1340) * 0.02, 0, 0, Math.PI * 2); c.fill();
    }
    // lampião
    c.fillStyle = '#1d150c'; c.fillRect(780, 760, 16, 760); c.fillRect(750, 700, 76, 70);
    g = c.createRadialGradient(788, 735, 5, 788, 735, 260); g.addColorStop(0, 'rgba(255,225,160,0.95)'); g.addColorStop(1, 'rgba(255,200,120,0)');
    c.fillStyle = g; c.fillRect(500, 450, 600, 600);
  });
  // 2. fachada de universidade
  mk((c, r) => {
    let g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#cdbb98'); g.addColorStop(1, '#5a4630');
    c.fillStyle = g; c.fillRect(0, 0, W, H);
    c.fillStyle = '#8c7353'; c.fillRect(60, 620, 960, 900);
    c.fillStyle = '#6f5a40'; c.beginPath(); c.moveTo(40, 640); c.lineTo(540, 330); c.lineTo(1040, 640); c.closePath(); c.fill();
    c.fillStyle = '#a78c66'; c.beginPath(); c.moveTo(110, 610); c.lineTo(540, 380); c.lineTo(970, 610); c.closePath(); c.fill();
    for (let i = 0; i < 6; i++) {
      const x = 120 + i * 160; g = c.createLinearGradient(x, 0, x + 80, 0);
      g.addColorStop(0, '#5e4b34'); g.addColorStop(0.45, '#d8c4a0'); g.addColorStop(1, '#6c5739');
      c.fillStyle = g; c.fillRect(x, 660, 80, 760);
      c.fillStyle = '#4b3b28'; c.fillRect(x - 12, 640, 104, 26); c.fillRect(x - 12, 1410, 104, 26);
    }
    for (let k = 0; k < 6; k++) { c.fillStyle = `rgb(${120 - k * 8},${98 - k * 7},${70 - k * 6})`; c.fillRect(20 - k * 10, 1440 + k * 40, 1040 + k * 20, 40); }
    fog(c, 1100, 600, 0.35);
  });
  // 3. escrivaninha com lamparina
  mk((c, r) => {
    c.fillStyle = '#1b130b'; c.fillRect(0, 0, W, H);
    let g = c.createLinearGradient(0, 1100, 0, H); g.addColorStop(0, '#5a3d22'); g.addColorStop(1, '#2a1b0e');
    c.fillStyle = g; c.beginPath(); c.moveTo(0, 1150); c.lineTo(W, 1080); c.lineTo(W, H); c.lineTo(0, H); c.fill();
    c.strokeStyle = 'rgba(0,0,0,0.25)'; c.lineWidth = 3;
    for (let i = 0; i < 18; i++) { c.beginPath(); c.moveTo(0, 1180 + i * 42); c.bezierCurveTo(300, 1160 + i * 40, 700, 1200 + i * 41, W, 1120 + i * 44); c.stroke(); }
    // livros
    const books = [[120, 820, 300, 70], [140, 890, 280, 80], [110, 970, 320, 90], [100, 1060, 340, 90]];
    books.forEach(([x, y, w, h], i) => { c.fillStyle = ['#6b3b22', '#3f4a33', '#7a5a2e', '#4a2c1c'][i]; c.fillRect(x, y, w, h); c.fillStyle = 'rgba(230,200,140,0.5)'; c.fillRect(x + 20, y + h / 2 - 4, w - 40, 6); });
    // lamparina
    c.fillStyle = '#8a6a32'; c.fillRect(700, 1040, 120, 30); c.fillRect(735, 960, 50, 90);
    g = c.createRadialGradient(760, 880, 4, 760, 880, 90); g.addColorStop(0, 'rgba(255,240,200,1)'); g.addColorStop(1, 'rgba(255,200,120,0.15)');
    c.fillStyle = g; c.beginPath(); c.ellipse(760, 880, 70, 95, 0, 0, Math.PI * 2); c.fill();
    g = c.createRadialGradient(760, 880, 10, 760, 900, 820); g.addColorStop(0, 'rgba(255,190,110,0.55)'); g.addColorStop(1, 'rgba(255,190,110,0)');
    c.fillStyle = g; c.fillRect(0, 0, W, H);
    // folha e pena
    c.save(); c.translate(560, 1300); c.rotate(-0.12); c.fillStyle = '#e4d3ae'; c.fillRect(-180, -110, 360, 230); c.restore();
  });
  // 4. caderno com sílabas (close)
  mk((c, r) => {
    c.fillStyle = '#2a1d10'; c.fillRect(0, 0, W, H);
    drawNotebook(c, 540, 980, 1300, 1700, -0.1, (cc, w, h) => {
      cc.fillStyle = 'rgba(40,28,16,0.85)'; cc.font = `64px ${FONT_SERIF}`;
      const syl = ['DAX', 'BUP', 'ZOL', 'KEF', 'MIV', 'LOT', 'TEB', 'RUS', 'GOK', 'NAF', 'PIM', 'SOV'];
      syl.forEach((s, i) => cc.fillText(s, -w / 2 + 120 + (i % 2) * 230, -h / 2 + 260 + Math.floor(i / 2) * 140));
      syl.slice(0, 8).forEach((s, i) => cc.fillText(s.split('').reverse().join(''), 90 + (i % 2) * 230, -h / 2 + 260 + Math.floor(i / 2) * 140));
    });
    const g = c.createRadialGradient(950, 300, 10, 950, 300, 900); g.addColorStop(0, 'rgba(255,190,110,0.45)'); g.addColorStop(1, 'rgba(255,190,110,0)');
    c.fillStyle = g; c.fillRect(0, 0, W, H);
  });
  // 5. pena escrevendo
  mk((c, r) => {
    let g = c.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#e6d6b4'); g.addColorStop(1, '#a88d64');
    c.fillStyle = g; c.fillRect(0, 0, W, H);
    c.strokeStyle = 'rgba(45,30,15,0.8)'; c.lineWidth = 4; c.lineCap = 'round';
    for (let l = 0; l < 14; l++) {
      const y = 380 + l * 92, len = l === 13 ? 420 : 760 - r() * 160;
      c.beginPath(); c.moveTo(150, y);
      for (let x = 150; x < 150 + len; x += 6) c.lineTo(x, y + Math.sin(x * 0.21 + l) * 10 + Math.sin(x * 0.07) * 6 - (x % 70 < 8 ? 14 : 0));
      c.stroke();
    }
    // pena
    c.save(); c.translate(600, 1600); c.rotate(-0.75);
    g = c.createLinearGradient(0, -40, 0, 40); g.addColorStop(0, '#f8f1e2'); g.addColorStop(1, '#b9a27a');
    c.fillStyle = g; c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(300, -110, 900, -40); c.quadraticCurveTo(320, 60, 0, 0); c.fill();
    c.strokeStyle = 'rgba(90,70,40,0.6)'; c.lineWidth = 3; c.beginPath(); c.moveTo(0, 0); c.lineTo(900, -40); c.stroke();
    c.fillStyle = '#1a120a'; c.beginPath(); c.moveTo(0, 0); c.lineTo(-60, 8); c.lineTo(0, 14); c.fill();
    c.restore();
    g = c.createRadialGradient(150, 200, 10, 150, 200, 900); g.addColorStop(0, 'rgba(255,200,120,0.4)'); g.addColorStop(1, 'rgba(255,200,120,0)');
    c.fillStyle = g; c.fillRect(0, 0, W, H);
  });
}

function buildAll() { buildBackgrounds(); buildBrain(); buildNeuron(); buildHourglass(); buildVintage(); }
