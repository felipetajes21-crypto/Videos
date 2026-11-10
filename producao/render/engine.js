// ===== Engine: utilitários, texto animado, fundos e compositor =====
const W = 1080, H = 1920, FPS = 30;
const C = {
  ice: '#F2F1F6', iceEdge: '#E2E0E8', black: '#0B0B0A', ink: '#111111',
  yellow: '#F5E02A', grey: '#8E8C96'
};
const FONT_SANS = '"Inter", "Inter Display", sans-serif';
const FONT_SERIF = '"PlayfairItalic", serif';

const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, t) => a + (b - a) * t;
const prog = (f, a, b) => clamp((f - a) / (b - a));
const easeOut = t => 1 - Math.pow(1 - t, 3);
const easeIn = t => t * t * t;
const easeInOut = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const easeOutBack = t => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };

// PRNG determinístico (mesmo resultado em toda renderização)
function rng(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }

function mkCanvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }

// ---------- Texto animado ----------
// opts: font ('sans'|'serif'), size, weight, color, x, y, align ('left'|'center'), start (quadro),
// mode ('letters'|'whole'), fpl (quadros por letra), glow (cor), highlight (cor do marca-texto),
// dy (deslocamento de entrada), alpha
function fontStr(o) {
  return o.font === 'serif'
    ? `${o.size}px ${FONT_SERIF}`
    : `${o.weight || 700} ${o.size}px ${FONT_SANS}`;
}
function measure(ctx, o, str) { ctx.save(); ctx.font = fontStr(o); const w = ctx.measureText(str ?? o.text).width; ctx.restore(); return w; }

function drawText(ctx, f, o) {
  const lf = f - (o.start ?? 0);
  if (lf < 0) return null;
  const text = o.text;
  ctx.save();
  ctx.font = fontStr(o);
  ctx.textBaseline = 'alphabetic'; ctx.textAlign = 'left';
  const total = ctx.measureText(text).width;
  let x0 = o.x;
  if (o.align === 'center') x0 = o.x - total / 2;
  if (o.align === 'right') x0 = o.x - total;
  const baseAlpha = o.alpha ?? 1;
  const mode = o.mode || (o.font === 'serif' ? 'letters' : 'whole');
  const fpl = o.fpl ?? (o.font === 'serif' ? 1.5 : 0.9);
  const entryDur = o.entryDur ?? 5;
  const n = text.length;
  const doneFrame = mode === 'letters' ? (n - 1) * fpl + entryDur : entryDur;
  const done = clamp(lf / doneFrame);

  // marca-texto (cresce junto com as letras)
  if (o.highlight) {
    const hp = mode === 'letters' ? clamp(lf / ((n - 1) * fpl + 2)) : easeOut(clamp(lf / 6));
    ctx.fillStyle = o.highlight;
    const padX = o.size * 0.08, top = o.y - o.size * 0.78, hh = o.size * 0.98;
    ctx.globalAlpha = baseAlpha;
    ctx.fillRect(x0 - padX, top, (total + padX * 2) * hp, hh);
  }

  if (o.glow) { ctx.shadowColor = o.glow; ctx.shadowBlur = o.size * 0.35; }
  ctx.fillStyle = o.color || C.ink;

  if (mode === 'whole') {
    const t = easeOut(clamp(lf / entryDur));
    const blur = (1 - t) * (o.size * 0.18);
    ctx.globalAlpha = baseAlpha * t;
    if (blur > 0.3) ctx.filter = `blur(${blur.toFixed(1)}px)`;
    ctx.fillText(text, x0, o.y + (1 - t) * (o.dy ?? 0));
    ctx.filter = 'none';
  } else {
    for (let i = 0; i < n; i++) {
      const li = lf - i * fpl;
      if (li < 0) break;
      const t = easeOut(clamp(li / entryDur));
      const xi = x0 + ctx.measureText(text.slice(0, i)).width;
      const blur = (1 - t) * (o.size * 0.16);
      ctx.globalAlpha = baseAlpha * t;
      ctx.filter = blur > 0.3 ? `blur(${blur.toFixed(1)}px)` : 'none';
      ctx.fillText(text[i], xi, o.y + (1 - t) * (o.dy ?? o.size * 0.12));
    }
    ctx.filter = 'none';
  }
  ctx.restore();
  return { x: x0, w: total, y: o.y, size: o.size, done };
}

// risco animado sobre um texto já desenhado
function strike(ctx, info, p, color = C.ink, width = 6) {
  if (!info || p <= 0) return;
  ctx.save();
  ctx.strokeStyle = color; ctx.lineWidth = width; ctx.lineCap = 'round';
  const y = info.y - info.size * 0.3;
  ctx.beginPath(); ctx.moveTo(info.x - 8, y); ctx.lineTo(info.x - 8 + (info.w + 16) * easeOut(p), y); ctx.stroke();
  ctx.restore();
}

// ---------- Fundos ----------
let BOKEH = null, GRID_DARK = null, GRID_LIGHT = null, NOISE = [];
function buildBackgrounds() {
  // bokeh: bolinhas cinzas desfocadas
  BOKEH = mkCanvas(W + 200, H + 200);
  const b = BOKEH.getContext('2d'); const r = rng(7);
  for (let i = 0; i < 20; i++) {
    const rad = 14 + r() * 46, x = r() * (W + 200), y = r() * (H + 200);
    b.filter = `blur(${(4 + r() * 10).toFixed(1)}px)`;
    b.fillStyle = `rgba(150,148,160,${(0.35 + r() * 0.35).toFixed(2)})`;
    b.beginPath(); b.arc(x, y, rad, 0, Math.PI * 2); b.fill();
  }
  b.filter = 'none';
  // grid fino
  const mkGrid = (col, step) => {
    const g = mkCanvas(W, H); const c = g.getContext('2d');
    c.strokeStyle = col; c.lineWidth = 1.5;
    for (let x = 0; x <= W; x += step) { c.beginPath(); c.moveTo(x + .5, 0); c.lineTo(x + .5, H); c.stroke(); }
    for (let y = 0; y <= H; y += step) { c.beginPath(); c.moveTo(0, y + .5); c.lineTo(W, y + .5); c.stroke(); }
    return g;
  };
  GRID_DARK = mkGrid('rgba(255,255,255,0.07)', 90);
  GRID_LIGHT = mkGrid('rgba(0,0,0,0.05)', 90);
  // grão de filme (4 variações)
  for (let k = 0; k < 4; k++) {
    const n = mkCanvas(540, 960); const c = n.getContext('2d');
    const img = c.createImageData(540, 960); const r2 = rng(100 + k);
    for (let i = 0; i < img.data.length; i += 4) { const v = 128 + (r2() - 0.5) * 140; img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255; }
    c.putImageData(img, 0, 0); NOISE.push(n);
  }
}

function bgIce(ctx, f, opts = {}) {
  ctx.fillStyle = C.ice; ctx.fillRect(0, 0, W, H);
  const g = ctx.createRadialGradient(W / 2, H * 0.45, 100, W / 2, H * 0.5, H * 0.75);
  g.addColorStop(0, 'rgba(255,255,255,0.9)'); g.addColorStop(1, 'rgba(205,203,214,0.9)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  if (opts.grid) { ctx.drawImage(GRID_LIGHT, 0, 0); }
  if (opts.bokeh !== false) {
    ctx.save(); ctx.globalAlpha = opts.bokehAlpha ?? 0.8;
    ctx.drawImage(BOKEH, -100 - f * 0.25, -100 - f * 0.6); ctx.restore();
  }
}
function bgBlack(ctx, f, opts = {}) {
  ctx.fillStyle = C.black; ctx.fillRect(0, 0, W, H);
  const g = ctx.createRadialGradient(W / 2, H * 0.48, 50, W / 2, H * 0.5, H * 0.7);
  g.addColorStop(0, 'rgba(48,47,44,1)'); g.addColorStop(1, 'rgba(6,6,5,1)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  if (opts.grid !== false) { ctx.save(); ctx.globalAlpha = opts.gridAlpha ?? 1; ctx.drawImage(GRID_DARK, 0, 0); ctx.restore(); }
}
// brilho amarelo que "ilumina" o grid em volta de uma palavra (fundos escuros)
function yellowLight(ctx, x, y, r, a) {
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, `rgba(245,224,42,${a})`); g.addColorStop(1, 'rgba(245,224,42,0)');
  ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2); ctx.restore();
}
function grain(ctx, f, a = 0.18) {
  ctx.save(); ctx.globalCompositeOperation = 'overlay'; ctx.globalAlpha = a;
  ctx.drawImage(NOISE[f % 4], 0, 0, W, H); ctx.restore();
}
function vignette(ctx, a = 0.55) {
  const g = ctx.createRadialGradient(W / 2, H / 2, H * 0.25, W / 2, H / 2, H * 0.72);
  g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(0,0,0,${a})`);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}

// ---------- Compositor ----------
// Cada cena é desenhada num buffer; o compositor aplica push-in, entrada (desfoque→foco)
// e saída (zoom + desfoque vertical), como nas referências.
const BUF = mkCanvas(W, H), BCTX = BUF.getContext('2d');
const TMP = mkCanvas(W, H), TCTX = TMP.getContext('2d');

function compose(ctx, scene, lf) {
  const dur = scene.end - scene.start;
  BCTX.setTransform(1, 0, 0, 1, 0, 0);
  BCTX.globalAlpha = 1; BCTX.filter = 'none'; BCTX.globalCompositeOperation = 'source-over';
  BCTX.clearRect(0, 0, W, H);
  scene.draw(BCTX, lf, dur);

  let scale = 1 + (scene.push ?? 0.022) * lf / FPS, ty = 0, blur = 0, vblur = 0;
  const entry = scene.entry ?? 'focus', exit = scene.exit ?? 'zoom';
  if (entry === 'focus' && lf < 8) { const t = easeOut(lf / 8); scale *= lerp(1.08, 1, t); blur = (1 - t) * 30; }
  const ex = scene.exitDur ?? 4;
  if (exit === 'zoom' && lf >= dur - ex) {
    const t = easeIn((lf - (dur - ex) + 1) / ex);
    scale *= 1 + 0.22 * t; ty = -90 * t; vblur = 46 * t; blur = Math.max(blur, 7 * t);
  }

  ctx.save();
  ctx.fillStyle = scene.base || '#000'; ctx.fillRect(0, 0, W, H);
  const draw = (dy, a) => {
    ctx.save();
    ctx.globalAlpha = a;
    ctx.translate(W / 2, H / 2 + ty + dy); ctx.scale(scale, scale); ctx.translate(-W / 2, -H / 2);
    if (blur > 0.3) ctx.filter = `blur(${blur.toFixed(1)}px)`;
    ctx.drawImage(BUF, 0, 0);
    ctx.restore();
  };
  if (vblur > 1) {
    const N = 7;
    draw(0, 1);
    for (let i = 0; i < N; i++) draw(((i / (N - 1)) - 0.5) * vblur, 1 / N * 1.6);
  } else draw(0, 1);
  ctx.restore();

  // efeitos de tela inteira definidos pela cena
  if (scene.post) scene.post(ctx, lf, dur);
}

function invertScreen(ctx) {
  ctx.save(); ctx.globalCompositeOperation = 'difference'; ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H); ctx.restore();
}
