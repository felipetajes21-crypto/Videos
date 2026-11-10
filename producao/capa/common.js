// ===== Base do estilo desenhado à mão (copiado do vídeo 02) =====
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

