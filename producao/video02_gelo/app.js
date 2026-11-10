// ===== Vídeo 02: "Por que o gelo boia?" — estilo explicativo desenhado à mão =====
const W = 1080, H = 1920, FPS = 30;
const COL = {
  paper: '#FAF6EF', ink: '#2B2B2E', pink: '#E5636B', pinkSoft: '#F4C4C6', grey: '#B9B6B0',
  glass: 'rgba(214,236,245,0.75)', water: '#A9D8EA', waterTop: '#7FC2DB', ice: '#E9F6FB', sea: '#8CCDE3'
};
const F_DISPLAY = '"Luckiest Guy"', F_HAND = '"Patrick Hand"';

// ---------- utilitários ----------
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, t) => a + (b - a) * t;
const prog = (f, a, b) => clamp((f - a) / (b - a));
const easeOut = t => 1 - Math.pow(1 - t, 3);
const easeIn = t => t * t * t;
const easeInOut = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const easeOutBack = t => { const c1 = 1.9, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
function hash(n) { n = (n ^ 61) ^ (n >>> 16); n = n + (n << 3); n = n ^ (n >>> 4); n = Math.imul(n, 0x27d4eb2d); n = n ^ (n >>> 15); return (n >>> 0) / 4294967295; }
function strHash(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619); return h >>> 0; }
function rng(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }

// "boil": o traço muda levemente a cada 4 quadros, como desenho quadro a quadro
let BOIL = 0;

// ---------- desenho com traço de mão ----------
// pts: [[x,y],...]; o: {id, closed, stroke, fill, lw, amp, p (0..1 quanto do traço já foi desenhado), dash}
function sPoly(ctx, pts, o = {}) {
  const amp = o.amp ?? 1.6, step = 16, base = strHash(o.id || 'x') + BOIL * 7919;
  const seg = o.closed ? [...pts, pts[0]] : pts, out = [];
  let k = 0;
  for (let i = 0; i < seg.length - 1; i++) {
    const [x1, y1] = seg[i], [x2, y2] = seg[i + 1], n = Math.max(1, Math.ceil(Math.hypot(x2 - x1, y2 - y1) / step));
    for (let j = 0; j < n; j++, k++) {
      const t = j / n;
      out.push([lerp(x1, x2, t) + (hash(base + k * 2) - .5) * 2 * amp, lerp(y1, y2, t) + (hash(base + k * 2 + 1) - .5) * 2 * amp]);
    }
  }
  if (!o.closed) { const l = seg[seg.length - 1]; out.push([l[0] + (hash(base + k * 2) - .5) * 2 * amp, l[1] + (hash(base + k * 2 + 1) - .5) * 2 * amp]); }
  else out.push(out[0]);
  const p = o.p ?? 1, m = Math.max(2, Math.floor(out.length * p));
  ctx.save();
  ctx.beginPath(); ctx.moveTo(out[0][0], out[0][1]);
  for (let i = 1; i < m; i++) ctx.lineTo(out[i][0], out[i][1]);
  if (o.fill && p >= 1) { ctx.fillStyle = o.fill; ctx.fill(); }
  if (o.stroke !== null) {
    ctx.strokeStyle = o.stroke || COL.ink; ctx.lineWidth = o.lw ?? 4; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    if (o.dash) ctx.setLineDash(o.dash);
    ctx.stroke();
  }
  ctx.restore();
}
const rectPts = (x, y, w, h) => [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
const circlePts = (cx, cy, r, n = 40) => Array.from({ length: n }, (_, i) => [cx + Math.cos(i / n * Math.PI * 2) * r, cy + Math.sin(i / n * Math.PI * 2) * r]);
function roundPts(x, y, w, h, r) {
  const pts = [], arc = (cx, cy, a0) => { for (let i = 0; i <= 6; i++) { const a = a0 + i / 6 * Math.PI / 2; pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); } };
  arc(x + w - r, y + r, -Math.PI / 2); arc(x + w - r, y + h - r, 0); arc(x + r, y + h - r, Math.PI / 2); arc(x + r, y + r, Math.PI);
  return pts;
}
function sArrow(ctx, x1, y1, x2, y2, col, lw, id, p = 1) {
  if (p <= 0) return;
  const xe = lerp(x1, x2, p), ye = lerp(y1, y2, p);
  sPoly(ctx, [[x1, y1], [xe, ye]], { id: id + 'l', stroke: col, lw });
  const a = Math.atan2(ye - y1, xe - x1), s = 26;
  sPoly(ctx, [[xe - Math.cos(a - .5) * s, ye - Math.sin(a - .5) * s], [xe, ye], [xe - Math.cos(a + .5) * s, ye - Math.sin(a + .5) * s]], { id: id + 'h', stroke: col, lw });
}
function text(ctx, str, x, y, o = {}) {
  ctx.save();
  ctx.font = `${o.size || 40}px ${o.font || F_HAND}`; ctx.textAlign = o.align || 'left'; ctx.textBaseline = 'alphabetic';
  ctx.globalAlpha = o.alpha ?? 1;
  if (o.outline) { ctx.lineWidth = o.outline; ctx.strokeStyle = COL.ink; ctx.lineJoin = 'round'; if (o.shadow) { ctx.fillStyle = o.shadow; ctx.fillText(str, x + 5, y + 6); ctx.strokeText(str, x + 5, y + 6); } ctx.strokeText(str, x, y); }
  ctx.fillStyle = o.color || COL.ink; ctx.fillText(str, x, y);
  ctx.restore();
}
// escala de "pop" (entra com mola, sai encolhendo)
function pop(f, inAt, outAt = 1e9, dur = 12) {
  if (f < inAt || f >= outAt + 10) return 0;
  if (f >= outAt) return 1 - easeIn(prog(f, outAt, outAt + 10));
  return easeOutBack(prog(f, inAt, inAt + dur));
}
function withPop(ctx, s, cx, cy, fn) {
  if (s <= 0.01) return;
  ctx.save(); ctx.translate(cx, cy); ctx.scale(s, s); ctx.translate(-cx, -cy); fn(); ctx.restore();
}

// ---------- tempos (quadros) ----------
const STEPS = [
  { at: 75, label: 'ÁGUA' }, { at: 195, label: 'FRIO' }, { at: 315, label: 'CRISTAL' },
  { at: 435, label: 'VOLUME' }, { at: 555, label: 'DENSIDADE' }, { at: 675, label: 'ICEBERG' }
];
const FINALE = 795, TOTAL_FRAMES = 900;
const stepIndex = f => { let k = -1; STEPS.forEach((s, i) => { if (f >= s.at) k = i; }); return f >= FINALE ? 6 : k; };

// ---------- fundo de papel ----------
let PAPER = null;
function buildPaper() {
  PAPER = document.createElement('canvas'); PAPER.width = W; PAPER.height = H;
  const c = PAPER.getContext('2d'); c.fillStyle = COL.paper; c.fillRect(0, 0, W, H);
  const r = rng(5);
  for (let i = 0; i < 9000; i++) { c.fillStyle = `rgba(120,100,70,${(r() * 0.05).toFixed(3)})`; c.fillRect(r() * W, r() * H, 1 + r() * 2, 1 + r() * 2); }
}

// ---------- título ----------
function drawTitle(ctx, f) {
  const move = easeInOut(prog(f, 50, 70));
  const s = lerp(1.35, 1, move), cy = lerp(860, 0, move);
  ctx.save(); ctx.translate(540, cy); ctx.scale(s, s); ctx.translate(-540, 0);
  const l1 = 'POR QUE O', l2 = 'GELO BOIA?';
  const popLetters = (str, y, size, start) => {
    ctx.save(); ctx.font = `${size}px ${F_DISPLAY}`;
    const total = ctx.measureText(str).width; let x = 540 - total / 2;
    for (let i = 0; i < str.length; i++) {
      const ch = str[i], w = ctx.measureText(ch).width, k = easeOutBack(prog(f, start + i * 1.6, start + i * 1.6 + 8));
      if (k > 0.01 && ch !== ' ') {
        const wob = (hash(BOIL * 31 + i) - .5) * 0.04;
        ctx.save(); ctx.translate(x + w / 2, y); ctx.rotate(wob); ctx.scale(k, k);
        text(ctx, ch, 0, 0, { font: F_DISPLAY, size, align: 'center', color: COL.pink, outline: 7, shadow: '#B9474F' });
        ctx.restore();
      }
      x += w;
    }
    ctx.restore();
  };
  popLetters(l1, 150, 66, 2);
  popLetters(l2, 268, 124, 14);
  const sub = 'densidade  ·  empuxo  ·  em 30 segundos', n = Math.floor(sub.length * prog(f, 32, 50));
  text(ctx, sub.slice(0, n), 540, 330, { size: 40, align: 'center', color: '#55525A' });
  ctx.restore();
}

// ---------- copo ----------
const G = { cx: 400, top: 560, bot: 1090, wt: 200, wb: 165 };
const glassX = (y, side) => G.cx + side * lerp(G.wt, G.wb, (y - G.top) / (G.bot - G.top));
const glassPts = () => [[G.cx - G.wt, G.top], [G.cx - G.wb, G.bot], [G.cx + G.wb, G.bot], [G.cx + G.wt, G.top]];
function glassClip(ctx) {
  ctx.beginPath(); ctx.moveTo(G.cx - G.wt + 8, G.top); ctx.lineTo(G.cx - G.wb + 8, G.bot - 22); ctx.lineTo(G.cx + G.wb - 8, G.bot - 22); ctx.lineTo(G.cx + G.wt - 8, G.top); ctx.closePath(); ctx.clip();
}
function drawGlass(ctx, f, opts = {}) {
  const p = opts.p ?? 1;
  if (p >= 1) sPoly(ctx, glassPts(), { id: 'gfill', closed: true, fill: COL.glass, stroke: null });
  if (opts.behind && p >= 1) opts.behind(ctx);
  // conteúdo (água / gelo)
  if (opts.content && p >= 1) { ctx.save(); glassClip(ctx); opts.content(ctx); ctx.restore(); }
  sPoly(ctx, [[G.cx - G.wt, G.top], [G.cx - G.wb, G.bot], [G.cx + G.wb, G.bot], [G.cx + G.wt, G.top]], { id: 'glass', lw: 5, p });
  if (p >= 1) {
    sPoly(ctx, [[G.cx - G.wb + 6, G.bot - 22], [G.cx + G.wb - 6, G.bot - 22]], { id: 'gbase', lw: 3, stroke: 'rgba(43,43,46,0.5)' });
    sPoly(ctx, [[G.cx - G.wt + 34, G.top + 40], [G.cx - G.wt + 28, G.top + 260]], { id: 'ghl', lw: 7, stroke: 'rgba(255,255,255,0.9)' });
    sPoly(ctx, [[G.cx - G.wt + 56, G.top + 50], [G.cx - G.wt + 52, G.top + 130]], { id: 'ghl2', lw: 5, stroke: 'rgba(255,255,255,0.8)' });
    sPoly(ctx, [[G.cx - G.wt, G.top], [G.cx + G.wt, G.top]], { id: 'grim', lw: 3, stroke: 'rgba(43,43,46,0.35)' });
  }
}
function waterFill(ctx, level, color = COL.water, top = COL.waterTop, alpha = 1, id = 'w') {
  ctx.save(); ctx.globalAlpha = alpha;
  ctx.fillStyle = color; ctx.fillRect(0, level, W, H);
  sPoly(ctx, [[G.cx - G.wt - 10, level], [G.cx + G.wt + 10, level]], { id, lw: 4, stroke: top });
  ctx.restore();
}

// ---------- moléculas (lupa) ----------
const MAG = { cx: 830, cy: 640, r: 165, ax: 470, ay: 960 };
let LATTICE = [], LIQUID = [], BONDS = [];
function buildMolecules() {
  const a = 46, pts = [];
  for (let j = -6; j <= 6; j++) for (let i = -6; i <= 6; i++) {
    const cx = i * a * Math.sqrt(3) + (j % 2 ? a * Math.sqrt(3) / 2 : 0), cy = j * a * 1.5;
    for (const ang of [Math.PI / 2, Math.PI / 2 + 2 * Math.PI / 3 * 2]) { // dois vértices por célula → favo de mel
      const x = cx + Math.cos(ang) * a, y = cy - Math.sin(ang) * a;
      if (Math.hypot(x, y) < 128 && !pts.some(p => Math.hypot(p[0] - x, p[1] - y) < 5)) pts.push([x, y]);
    }
  }
  LATTICE = pts;
  const r = rng(77);
  LIQUID = pts.map(([x, y]) => ({ x: x * 0.8 + (r() - .5) * 26, y: y * 0.8 + (r() - .5) * 26, p1: r() * 6.28, p2: r() * 6.28, rot: r() * 6.28, sp: 0.6 + r() * 0.8 }));
  for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) if (Math.abs(Math.hypot(pts[i][0] - pts[j][0], pts[i][1] - pts[j][1]) - a) < 4) BONDS.push([i, j]);
}
function drawMolecule(ctx, x, y, rot, id) {
  for (const s of [-1, 1]) {
    const a = rot + s * 0.91, hx = x + Math.cos(a) * 20, hy = y + Math.sin(a) * 20;
    sPoly(ctx, circlePts(hx, hy, 8, 12), { id: id + s, closed: true, fill: '#fff', lw: 2.5, amp: 0.6 });
  }
  sPoly(ctx, circlePts(x, y, 14, 16), { id, closed: true, fill: COL.pink, lw: 2.5, amp: 0.6 });
}
function drawMagnifier(ctx, f, s, mode) {
  withPop(ctx, s, MAG.cx, MAG.cy, () => {
    sPoly(ctx, [[MAG.ax, MAG.ay], [MAG.cx - MAG.r * 0.7, MAG.cy + MAG.r * 0.7]], { id: 'mag1', lw: 3, stroke: 'rgba(43,43,46,0.6)', dash: [10, 8] });
    sPoly(ctx, circlePts(MAG.ax, MAG.ay, 16, 16), { id: 'mag2', closed: true, lw: 3 });
    sPoly(ctx, circlePts(MAG.cx, MAG.cy, MAG.r, 48), { id: 'mag', closed: true, fill: '#fff', lw: 5 });
    ctx.save(); ctx.beginPath(); ctx.arc(MAG.cx, MAG.cy, MAG.r - 6, 0, Math.PI * 2); ctx.clip();
    const toLat = mode.lattice, amp = mode.amp;
    if (mode.bonds > 0) {
      const nb = Math.floor(BONDS.length * mode.bonds);
      BONDS.slice(0, nb).forEach(([i, j], k) => sPoly(ctx, [[MAG.cx + LATTICE[i][0], MAG.cy + LATTICE[i][1]], [MAG.cx + LATTICE[j][0], MAG.cy + LATTICE[j][1]]], { id: 'b' + k, lw: 3, stroke: '#7FC2DB', dash: [7, 6] }));
    }
    LIQUID.forEach((m, i) => {
      const jx = amp * (Math.sin(f * 0.23 * m.sp + m.p1) * .6 + Math.sin(f * 0.11 + m.p2) * .4);
      const jy = amp * (Math.cos(f * 0.19 * m.sp + m.p2) * .6 + Math.sin(f * 0.13 + m.p1) * .4);
      const x = lerp(m.x + jx, LATTICE[i][0], toLat), y = lerp(m.y + jy, LATTICE[i][1], toLat);
      const rot = lerp(m.rot + f * 0.04 * m.sp * (amp / 16), (i % 2 ? -Math.PI / 2 : Math.PI / 2), toLat);
      drawMolecule(ctx, MAG.cx + x, MAG.cy + y, rot, 'm' + i);
    });
    ctx.restore();
    text(ctx, mode.caption, MAG.cx, MAG.cy - MAG.r - 22, { size: 34, align: 'center', color: '#55525A' });
  });
}

// ---------- termômetro ----------
function drawThermo(ctx, s, temp) {
  const x = 930, y0 = 830, y1 = 1100;
  withPop(ctx, s, x, (y0 + y1) / 2, () => {
    sPoly(ctx, roundPts(x - 17, y0, 34, y1 - y0, 17), { id: 'th', closed: true, fill: '#fff', lw: 4 });
    const lvl = lerp(y1 - 10, y0 + 30, (temp + 5) / 30);
    ctx.fillStyle = COL.pink; ctx.fillRect(x - 7, lvl, 14, y1 - lvl + 10);
    sPoly(ctx, circlePts(x, y1 + 26, 30, 20), { id: 'thb', closed: true, fill: COL.pink, lw: 4 });
    [[20, '20°'], [10, '10°'], [0, '0°']].forEach(([t, l]) => {
      const y = lerp(y1 - 10, y0 + 30, (t + 5) / 30);
      sPoly(ctx, [[x - 30, y], [x - 18, y]], { id: 'tk' + t, lw: 3 });
      text(ctx, l, x - 40, y + 10, { size: 30, align: 'right', color: t === 0 ? COL.pink : COL.ink });
    });
  });
}

// ---------- jarra ----------
function drawJug(ctx, f) {
  const inP = easeOut(prog(f, 80, 92)), outP = easeIn(prog(f, 158, 172));
  if (inP <= 0 || outP >= 1) return null;
  const tilt = 1.15 * easeInOut(prog(f, 92, 104)) * (1 - easeInOut(prog(f, 146, 158)));
  const px = lerp(-200, 175, inP) - outP * 400, py = 430;
  ctx.save(); ctx.translate(px, py); ctx.rotate(tilt);
  sPoly(ctx, [[-70, -110], [70, -110], [85, 110], [-85, 110]], { id: 'jug', closed: true, fill: '#EAF5FA', lw: 4 });
  ctx.save(); ctx.beginPath(); ctx.rect(-90, -20, 180, 140); ctx.clip();
  sPoly(ctx, [[-80, -10], [80, -10], [85, 110], [-85, 110]], { id: 'jugw', closed: true, fill: COL.water, stroke: null }); ctx.restore();
  sPoly(ctx, [[-70, -110], [70, -110], [85, 110], [-85, 110]], { id: 'jug2', closed: true, lw: 4 });
  sPoly(ctx, [[70, -110], [110, -135], [96, -100]], { id: 'spout', lw: 4 });
  sPoly(ctx, [[-72, -70], [-125, -60], [-128, 40], [-80, 55]], { id: 'handle', lw: 6 });
  ctx.restore();
  // ponta do bico em coordenadas da tela
  const sx = px + Math.cos(tilt) * 110 - Math.sin(tilt) * -135, sy = py + Math.sin(tilt) * 110 + Math.cos(tilt) * -135;
  return { sx, sy, pouring: f >= 100 && f < 150 };
}

// ---------- copo com medidor (passo 4) ----------
function drawBeaker(ctx, f, s) {
  const x = 300, y0 = 560, w = 480, h = 520;
  withPop(ctx, s, x + w / 2, y0 + h / 2, () => {
    const lv100 = y0 + h - 330, lv109 = lv100 - 330 * 0.09 * 3; // marca de +9% (exagerada 3x para enxergar)
    const freeze = easeInOut(prog(f, 478, 520));
    const level = lerp(lv100, lv109, freeze);
    sPoly(ctx, rectPts(x, y0, w, h), { id: 'bk', closed: true, fill: COL.glass, stroke: null });
    ctx.save(); ctx.beginPath(); ctx.rect(x + 6, y0, w - 12, h - 6); ctx.clip();
    const col = `rgb(${Math.round(lerp(169, 233, freeze))},${Math.round(lerp(216, 246, freeze))},${Math.round(lerp(234, 251, freeze))})`;
    ctx.fillStyle = col; ctx.fillRect(x, level, w, h);
    sPoly(ctx, [[x, level], [x + w, level]], { id: 'bkl', lw: 4, stroke: freeze > 0.5 ? '#9FD0E3' : COL.waterTop });
    if (freeze > 0.3) {
      ctx.globalAlpha = (freeze - 0.3) / 0.7;
      [[[x + 80, level + 60], [x + 180, level + 140], [x + 150, level + 230]], [[x + 300, level + 40], [x + 260, level + 160], [x + 380, level + 250]], [[x + 200, level + 200], [x + 330, level + 300]]]
        .forEach((p, i) => sPoly(ctx, p, { id: 'crk' + i, lw: 3, stroke: '#9FD0E3' }));
      ctx.globalAlpha = 1;
    }
    ctx.restore();
    sPoly(ctx, [[x, y0 - 10], [x, y0 + h], [x + w, y0 + h], [x + w, y0 - 10]], { id: 'bko', lw: 5 });
    // marcas
    [[lv100, '1,00 L', COL.ink], [lv109, '1,09 L', COL.pink]].forEach(([y, l, c], i) => {
      sPoly(ctx, [[x + w - 70, y], [x + w + 30, y]], { id: 'bm' + i, lw: 3, stroke: c, dash: [10, 7] });
      text(ctx, l, x + w + 42, y + 12, { size: 38, color: c });
    });
    if (freeze > 0.05) {
      sArrow(ctx, x + w / 2, lv100 + 10, x + w / 2, lv109 + 14, COL.pink, 5, 'ar9', easeOut(prog(f, 490, 505)));
      if (f > 505) text(ctx, '+9%', x + w / 2 + 30, lv109 + 70, { font: F_DISPLAY, size: 64, color: COL.pink, outline: 5 });
    }
    text(ctx, freeze < 0.5 ? 'água' : 'gelo', x + w / 2, y0 + h - 40, { size: 44, align: 'center', color: '#55525A' });
  });
}

// ---------- cubo de gelo ----------
function drawCube(ctx, cx, cy, s, rot, id) {
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot);
  sPoly(ctx, roundPts(-s / 2, -s / 2, s, s, 18), { id, closed: true, fill: COL.ice, lw: 4 });
  sPoly(ctx, [[-s / 2 + 22, -s / 2 + 26], [-s / 2 + 22, -s / 2 + 70]], { id: id + 'h', lw: 6, stroke: '#fff' });
  sPoly(ctx, [[-s / 2 + 22, -s / 2 + 22], [-s / 2 + 70, -s / 2 + 22]], { id: id + 'h2', lw: 6, stroke: '#fff' });
  ctx.restore();
}
// cubo cai, afunda, balança e flutua (92% submerso)
const LEVEL5 = 720, CUBE = 150;
function cubeState(f) {
  const t0 = 575, tHit = 597;
  const eqY = LEVEL5 + CUBE / 2 - CUBE * 0.08;
  if (f < t0) return null;
  if (f < tHit) { const k = prog(f, t0, tHit); return { y: lerp(330, LEVEL5 - CUBE / 2 + 4, k * k), rot: 0.25 * (1 - k) }; }
  const t = (f - tHit) / FPS, A = 95;
  return { y: eqY + (LEVEL5 - CUBE / 2 + 4 - eqY) * 0 + A * Math.exp(-t * 2.4) * Math.sin(t * 9) + (LEVEL5 - CUBE / 2 + 4 - eqY) * Math.exp(-t * 6), rot: 0.06 * Math.exp(-t * 2) * Math.sin(t * 7) };
}
function drawSplash(ctx, f) {
  const t = (f - 597) / FPS; if (t < 0 || t > 0.6) return;
  const r = rng(12);
  for (let i = 0; i < 9; i++) {
    const vx = (r() - .5) * 600, vy = -300 - r() * 400;
    const x = G.cx + (r() - .5) * 120 + vx * t, y = LEVEL5 + vy * t + 900 * t * t;
    sPoly(ctx, circlePts(x, y, 7 + r() * 6, 10), { id: 'sp' + i, closed: true, fill: COL.water, lw: 2.5, amp: 0.5 });
  }
}

// ---------- iceberg ----------
function drawIceberg(ctx, f, s) {
  const sea = 760;
  withPop(ctx, s, 540, 900, () => {
    // céu/mar
    const wave = []; for (let x = 100; x <= 980; x += 40) wave.push([x, sea + Math.sin(x * 0.03 + f * 0.08) * 6]);
    sPoly(ctx, [...wave, [980, 1130], [100, 1130]], { id: 'sea', closed: true, fill: COL.sea, stroke: null });
    // iceberg (desenhado inteiro, o mar por cima deixa a parte submersa azulada)
    const bob = Math.sin(f * 0.06) * 5;
    const berg = [[470, sea - 85], [540, sea - 120], [600, sea - 70], [640, sea + 10], [760, sea + 120], [800, sea + 260], [720, sea + 340], [560, sea + 360], [380, sea + 330], [290, sea + 220], [330, sea + 90], [420, sea + 10]].map(([x, y]) => [x, y + bob]);
    sPoly(ctx, berg, { id: 'berg', closed: true, fill: COL.ice, lw: 4 });
    ctx.save(); ctx.beginPath(); ctx.rect(0, sea, W, 600); ctx.clip();
    ctx.globalAlpha = 0.55; sPoly(ctx, [...wave, [980, 1130], [100, 1130]], { id: 'sea2', closed: true, fill: COL.sea, stroke: null }); ctx.restore();
    sPoly(ctx, wave, { id: 'wave', lw: 4, stroke: '#4FA7C6' });
    sPoly(ctx, [[100, 1130], [980, 1130]], { id: 'seab', lw: 3, stroke: 'rgba(43,43,46,0.3)' });
    // rótulos
    const lp = prog(f, 700, 716);
    if (lp > 0) {
      sPoly(ctx, [[620, sea - 70], [860, sea - 70]], { id: 'lb1', lw: 3, stroke: COL.ink, dash: [10, 7], p: lp });
      sPoly(ctx, [[790, sea + 190], [860, sea + 190]], { id: 'lb2', lw: 3, stroke: COL.pink, dash: [10, 7], p: lp });
    }
    if (f > 712) text(ctx, '~10%', 870, sea - 52, { font: F_DISPLAY, size: 52, color: COL.ink });
    if (f > 722) text(ctx, '~90%', 870, sea + 210, { font: F_DISPLAY, size: 52, color: COL.pink, outline: 4 });
  });
}

// ---------- card de passo ----------
const CARDS = [
  { step: 'PASSO 1 DE 6', big: '1,00', unit: 'g/cm³', label: 'ÁGUA', sub: 'líquida: moléculas bem juntinhas', bar: f => prog(f, 100, 150), val: p => `${p.toFixed(1).replace('.', ',')} / 1 L` },
  { step: 'PASSO 2 DE 6', big: '0 °C', label: 'ESFRIA', sub: 'as moléculas vão desacelerando', bar: f => prog(f, 205, 290), val: p => `${Math.round(20 - 20 * p)} °C` },
  { step: 'PASSO 3 DE 6', big: 'HEXÁGONOS', label: 'VIRA CRISTAL', sub: 'elas se travam e deixam espaço vazio', bar: f => prog(f, 320, 410), val: p => p < 1 ? 'travando...' : 'travado!' },
  { step: 'PASSO 4 DE 6', big: '+9%', label: 'MAIS VOLUME', sub: 'a mesma água ocupa mais espaço', bar: f => prog(f, 478, 520), val: p => `${(1 + 0.09 * p).toFixed(2).replace('.', ',')} L` },
  { step: 'PASSO 5 DE 6', big: '0,92', unit: 'g/cm³', label: 'MENOS DENSO', sub: 'o empuxo vence o peso: ele boia', bar: f => prog(f, 575, 650), val: p => p < 1 ? 'afundando...' : 'boiando!' },
  { step: 'PASSO 6 DE 6', big: '~90%', label: 'FICA SUBMERSO', sub: 'a ponta do iceberg é só ~10%', bar: f => prog(f, 700, 730), val: p => p < 1 ? '...' : '10% / 90%' },
  { step: 'ENTÃO É ISSO', big: 'BOIA!', label: 'É FÍSICA', sub: 'gelo 0,92  ·  água 1,00 g/cm³', bar: () => 1, val: () => 'Arquimedes ✓' }
];
function drawCard(ctx, f) {
  const s = pop(f, 62, 1e9, 12); if (s <= 0) return;
  const x = 110, y = 1185, w = 860, h = 380;
  withPop(ctx, s, x + w / 2, y + h / 2, () => {
    sPoly(ctx, roundPts(x + 14, y + 16, w, h, 26), { id: 'cardsh', closed: true, fill: COL.pinkSoft, stroke: null });
    sPoly(ctx, roundPts(x, y, w, h, 26), { id: 'card', closed: true, fill: '#fff', lw: 4 });
    const k = stepIndex(f);
    if (k < 0) { text(ctx, 'vamos ver passo a passo…', x + 50, y + 200, { size: 50, color: '#55525A' }); return; }
    const c = CARDS[k], at = k < 6 ? STEPS[k].at : FINALE, pk = easeOutBack(prog(f, at, at + 9));
    ctx.save(); ctx.translate(x + 50, y + 160); ctx.scale(pk, pk); ctx.translate(-(x + 50), -(y + 160)); ctx.globalAlpha = clamp(pk);
    text(ctx, c.step, x + 50, y + 66, { size: 36, color: COL.pink });
    const bs = c.big.length > 8 ? 92 : 112;
    text(ctx, c.big, x + 46, y + 182, { font: F_DISPLAY, size: bs, color: COL.pink, outline: 6 });
    if (c.unit) { ctx.save(); ctx.font = `${bs}px ${F_DISPLAY}`; const bw = ctx.measureText(c.big).width; ctx.restore(); text(ctx, c.unit, x + 66 + bw, y + 178, { size: 60, color: COL.pink }); }
    text(ctx, c.label, x + 50, y + 252, { font: F_DISPLAY, size: 58, color: COL.ink });
    text(ctx, c.sub, x + 50, y + 302, { size: 38, color: '#55525A' });
    ctx.restore();
    const p = c.bar(f);
    sPoly(ctx, roundPts(x + 50, y + 326, 560, 26, 13), { id: 'bar', closed: true, fill: '#fff', lw: 3 });
    if (p > 0.02) { ctx.save(); ctx.fillStyle = COL.pink; ctx.beginPath(); ctx.roundRect(x + 53, y + 329, 554 * p, 20, 10); ctx.fill(); ctx.restore(); }
    text(ctx, c.val(p), x + 630, y + 348, { size: 34, color: COL.ink });
  });
}

// ---------- trilha de passos ----------
function drawStepper(ctx, f) {
  const s = pop(f, 66, 1e9, 12); if (s <= 0) return;
  const y = 1700, xs = STEPS.map((_, i) => 110 + i * 172), cur = stepIndex(f);
  withPop(ctx, s, 540, y, () => {
    for (let i = 0; i < 5; i++) {
      const done = cur > i, fill = done ? easeOut(prog(f, (i + 1 < 6 ? STEPS[i + 1].at : FINALE), (i + 1 < 6 ? STEPS[i + 1].at : FINALE) + 10)) : 0;
      sPoly(ctx, [[xs[i] + 36, y], [xs[i + 1] - 36, y]], { id: 'sl' + i, lw: 5, stroke: '#D9D5CE' });
      if (fill > 0) sPoly(ctx, [[xs[i] + 36, y], [lerp(xs[i] + 36, xs[i + 1] - 36, fill), y]], { id: 'slp' + i, lw: 5, stroke: COL.pink });
    }
    STEPS.forEach((st, i) => {
      const doneAt = i + 1 < 6 ? STEPS[i + 1].at : FINALE, done = f >= doneAt, current = cur === i;
      if (done) {
        const k = easeOutBack(prog(f, doneAt, doneAt + 8));
        withPop(ctx, k, xs[i], y, () => {
          sPoly(ctx, circlePts(xs[i], y, 34, 24), { id: 'sc' + i, closed: true, fill: COL.pink, lw: 4 });
          sPoly(ctx, [[xs[i] - 14, y + 1], [xs[i] - 3, y + 12], [xs[i] + 16, y - 12]], { id: 'ck' + i, lw: 6, stroke: '#fff', p: prog(f, doneAt + 2, doneAt + 9) });
        });
      } else {
        sPoly(ctx, circlePts(xs[i], y, 34, 24), { id: 'sc' + i, closed: true, fill: '#fff', lw: current ? 5 : 3, stroke: current ? COL.ink : '#C9C5BE' });
        text(ctx, String(i + 1), xs[i], y + 14, { font: F_DISPLAY, size: 40, align: 'center', color: current ? COL.pink : '#C9C5BE' });
      }
      text(ctx, st.label, xs[i], y + 82, { size: 32, align: 'center', color: current ? COL.pink : done ? COL.ink : '#B0ACA5' });
    });
  });
}

// ---------- quadro ----------
const CTX = document.getElementById('c').getContext('2d');
function renderFrame(f) {
  const ctx = CTX; BOIL = Math.floor(f / 4);
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(PAPER, 0, 0);

  // ----- palco -----
  const glassOut = 435, glassBackIn = 555, glassOut2 = 675, glassBackIn3 = FINALE;
  const gScale = f < glassOut ? 1 : f < glassOut + 10 ? 1 - easeIn(prog(f, glassOut, glassOut + 10))
    : f < glassBackIn ? 0 : f < glassOut2 ? pop(f, glassBackIn, glassOut2) : f < glassBackIn3 ? 0 : pop(f, glassBackIn3);
  const drawP = f < 75 ? easeInOut(prog(f, 52, 74)) : 1;

  // nível da água e gelo no copo
  let level = G.bot - 22, freeze = 0, expand = 0;
  if (f < glassOut + 10) {
    level = lerp(G.bot - 22, 700, easeInOut(prog(f, 104, 150)));
    freeze = easeInOut(prog(f, 380, 420)); expand = freeze;
    level -= expand * 22;
  } else level = LEVEL5;

  if (gScale > 0 && f >= 52) withPop(ctx, gScale, G.cx, (G.top + G.bot) / 2, () => {
    const cube = (f >= glassBackIn) ? (f >= FINALE ? { y: LEVEL5 + CUBE / 2 - CUBE * 0.08, rot: 0 } : cubeState(f)) : null;
    drawGlass(ctx, f, {
      p: drawP, behind: c => { if (cube) drawCube(c, G.cx, cube.y, CUBE, cube.rot, 'cube'); }, content: c => {
        if (f < glassOut + 10 && f >= 100) {
          const col = `rgba(${Math.round(lerp(169, 233, freeze))},${Math.round(lerp(216, 246, freeze))},${Math.round(lerp(234, 251, freeze))},${cube ? 0.72 : 1})`;
          waterFill(c, level, col, freeze > 0.5 ? '#9FD0E3' : COL.waterTop);
          if (freeze > 0.3) {
            c.save(); c.globalAlpha = (freeze - 0.3) / 0.7;
            [[[260, 760], [340, 840], [310, 930]], [[460, 740], [420, 860], [520, 960]], [[300, 990], [430, 1040]]].forEach((p, i) => sPoly(c, p, { id: 'gk' + i, lw: 3, stroke: '#9FD0E3' }));
            c.restore();
          }
        } else if (f >= glassBackIn) {
          c.save(); c.globalAlpha = 0.5; waterFill(c, LEVEL5, COL.water, COL.waterTop, 1, 'w5'); c.restore();
          if (cube) { c.save(); c.globalAlpha = 0.55; c.translate(G.cx, cube.y); c.rotate(cube.rot); sPoly(c, roundPts(-CUBE / 2, -CUBE / 2, CUBE, CUBE, 18), { id: 'cube', closed: true, lw: 4 }); c.restore(); }
        }
      }
    });
    // marcas ao lado do copo (como na receita)
    if (f >= 150 && f < glassOut) {
      sPoly(ctx, [[G.cx - G.wt - 50, 700], [G.cx - G.wt - 10, 700]], { id: 'mk1', lw: 3, stroke: COL.pink });
      text(ctx, '1 L', G.cx - G.wt - 58, 712, { size: 34, align: 'right', color: COL.pink });
    }
    if (f >= 400 && f < glassOut) {
      sPoly(ctx, [[G.cx - G.wt - 50, 678], [G.cx - G.wt - 10, 678]], { id: 'mk2', lw: 3, stroke: COL.ink, dash: [8, 6] });
      text(ctx, 'subiu!', G.cx - G.wt - 58, 660, { size: 32, align: 'right', color: COL.ink });
    }
    // setas de força (passo 5 e final)
    if (f >= 640) {
      const cy = (f >= FINALE ? LEVEL5 + CUBE / 2 - CUBE * 0.08 : cubeState(f).y);
      const ap = easeOut(prog(f, f >= FINALE ? FINALE + 5 : 640, (f >= FINALE ? FINALE + 5 : 640) + 12));
      sArrow(ctx, G.cx + 30, cy, G.cx + 30, cy + 170, COL.ink, 7, 'peso', ap);
      sArrow(ctx, G.cx - 30, cy, G.cx - 30, cy - 170, COL.pink, 7, 'empuxo', ap);
      if (ap > 0.8) {
        text(ctx, 'peso', G.cx + 48, cy + 165, { size: 40 });
        text(ctx, 'empuxo', G.cx - 48, cy - 140, { size: 40, align: 'right', color: COL.pink });
      }
    }
  });
  if (f >= 597 && f < 640) drawSplash(ctx, f);

  // jarra despejando
  if (f >= 80 && f < 175) {
    const j = drawJug(ctx, f);
    if (j && j.pouring) sPoly(ctx, [[j.sx, j.sy], [j.sx + 18, j.sy + 50], [j.sx + 24, level]], { id: 'stream', lw: 14, stroke: COL.waterTop });
  }
  // lupa com moléculas
  const magS = pop(f, 150, glassOut);
  if (magS > 0) {
    const amp = f < 205 ? 16 : lerp(16, 5, prog(f, 205, 290));
    const lat = easeInOut(prog(f, 322, 372));
    drawMagnifier(ctx, f, magS, { amp: lerp(amp, 1.5, lat), lattice: lat, bonds: prog(f, 372, 405), caption: lat < 0.5 ? 'água líquida' : 'gelo: favo de mel' });
  }
  // termômetro
  const thS = pop(f, 197, glassOut);
  if (thS > 0) drawThermo(ctx, thS, lerp(20, 0, easeInOut(prog(f, 205, 290))));
  // copo medidor
  const bkS = pop(f, 447, 545);
  if (bkS > 0) drawBeaker(ctx, f, bkS);
  // iceberg
  const igS = pop(f, 680, 785);
  if (igS > 0) drawIceberg(ctx, f, igS);
  // brilhos finais
  if (f >= FINALE + 10) {
    for (let i = 0; i < 8; i++) {
      const a = i / 8 * Math.PI * 2 + 0.3, pulse = 0.5 + 0.5 * Math.sin(f * 0.25 + i);
      const r1 = 300 + pulse * 10, r2 = r1 + 30 + pulse * 20, cx = G.cx, cy = 820;
      sPoly(ctx, [[cx + Math.cos(a) * r1, cy + Math.sin(a) * r1], [cx + Math.cos(a) * r2, cy + Math.sin(a) * r2]], { id: 'spk' + i, lw: 5, stroke: i % 2 ? COL.pink : '#F2B33D' });
    }
  }

  // ----- interface -----
  drawCard(ctx, f);
  drawStepper(ctx, f);
  drawTitle(ctx, f);
}

let READY = false;
(async () => {
  for (const [name, file] of [['Luckiest Guy', 'LuckiestGuy.ttf'], ['Patrick Hand', 'PatrickHand.ttf']]) {
    const ff = new FontFace(name, `url(fonts/${file})`); await ff.load(); document.fonts.add(ff);
  }
  buildPaper(); buildMolecules();
  READY = true;
})();
