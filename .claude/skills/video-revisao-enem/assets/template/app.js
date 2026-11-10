// ===== Vídeo 03: Revisão ENEM (2º dia, Matemática) — Média, mediana e moda =====
// 1080x1920, 30 fps, 60 s. Usa o estilo desenhado à mão de common.js.

const STEPS = [
  { at: 90, label: 'MÉDIA' }, { at: 480, label: 'MEDIANA' }, { at: 900, label: 'MODA' },
  { at: 1200, label: 'PEGADINHA' }, { at: 1560, label: 'RESUMO' }
];
const FINALE = 1720, TOTAL_FRAMES = 1800;
const stepIndex = f => { let k = -1; STEPS.forEach((s, i) => { if (f >= s.at) k = i; }); return f >= FINALE ? STEPS.length : k; };
const easeOutBounce = t => { const n = 7.5625, d = 2.75; if (t < 1 / d) return n * t * t; if (t < 2 / d) return n * (t -= 1.5 / d) * t + .75; if (t < 2.5 / d) return n * (t -= 2.25 / d) * t + .9375; return n * (t -= 2.625 / d) * t + .984375; };

let PAPER = null;
function buildPaper() {
  PAPER = document.createElement('canvas'); PAPER.width = W; PAPER.height = H;
  const c = PAPER.getContext('2d'); c.fillStyle = COL.paper; c.fillRect(0, 0, W, H);
  const r = rng(5);
  for (let i = 0; i < 9000; i++) { c.fillStyle = `rgba(120,100,70,${(r() * 0.05).toFixed(3)})`; c.fillRect(r() * W, r() * H, 1 + r() * 2, 1 + r() * 2); }
}

// ---------- título ----------
function popLetters(ctx, f, str, cx, y, size, start, color = COL.pink, gap = 1.4) {
  ctx.save(); ctx.font = `${size}px ${F_DISPLAY}`;
  const total = ctx.measureText(str).width; let x = cx - total / 2;
  for (let i = 0; i < str.length; i++) {
    const ch = str[i], w = ctx.measureText(ch).width, k = easeOutBack(prog(f, start + i * gap, start + i * gap + 8));
    if (k > 0.01 && ch !== ' ') {
      ctx.save(); ctx.translate(x + w / 2, y); ctx.rotate((hash(BOIL * 31 + i) - .5) * 0.04); ctx.scale(k, k);
      text(ctx, ch, 0, 0, { font: F_DISPLAY, size, align: 'center', color, outline: size > 70 ? 7 : 5, shadow: color === COL.pink ? '#B9474F' : null });
      ctx.restore();
    }
    x += w;
  }
  ctx.restore();
}
function drawTitle(ctx, f) {
  const move = easeInOut(prog(f, 62, 84));
  const s = lerp(1.3, 1, move), cy = lerp(800, 0, move);
  ctx.save(); ctx.translate(540, cy); ctx.scale(s, s); ctx.translate(-540, 0);
  // selo "REVISÃO ENEM"
  const k = easeOutBack(prog(f, 0, 10));
  withPop(ctx, k, 540, 128, () => {
    sPoly(ctx, roundPts(330, 82, 420, 70, 35), { id: 'selo', closed: true, fill: COL.ink, stroke: null });
    text(ctx, 'REVISÃO ENEM · 2º DIA', 540, 132, { font: F_DISPLAY, size: 40, align: 'center', color: '#fff' });
  });
  popLetters(ctx, f, 'MÉDIA, MEDIANA', 540, 250, 88, 8);
  popLetters(ctx, f, 'E MODA', 540, 340, 88, 28);
  const sub = 'matemática  ·  estatística  ·  em 1 minuto', n = Math.floor(sub.length * prog(f, 40, 60));
  text(ctx, sub.slice(0, n), 540, 398, { size: 38, align: 'center', color: '#55525A' });
  ctx.restore();
}
const TITLE_BOTTOM = 420;

// ---------- elementos comuns ----------
function tile(ctx, x, y, v, size, o = {}) {
  const s = size;
  sPoly(ctx, roundPts(x - s / 2 + 8, y - s / 2 + 10, s, s, 22), { id: 'tsh' + o.id, closed: true, fill: o.hi ? '#B9474F' : '#D9D5CE', stroke: null });
  sPoly(ctx, roundPts(x - s / 2, y - s / 2, s, s, 22), { id: 't' + o.id, closed: true, fill: o.hi ? COL.pink : '#fff', lw: 4 });
  text(ctx, String(v), x, y + s * 0.2, { font: F_DISPLAY, size: s * 0.52, align: 'center', color: o.hi ? '#fff' : COL.ink });
}
function hand(ctx, str, x, y, size, o = {}) { text(ctx, str, x, y, { size, ...o }); }
function writeOn(ctx, f, str, x, y, a, b, o = {}) {
  const n = Math.floor(str.length * prog(f, a, b)); if (n <= 0) return;
  text(ctx, str.slice(0, n), x, y, o);
}

// ---------- PASSO 1: MÉDIA ----------
const NOTAS = [['Ana', 6], ['Bia', 8], ['Caio', 5], ['Duda', 9], ['Edu', 7]];
function sceneMedia(ctx, f, s) {
  const base = 1110, unit = 46, bw = 112, gap = 38, x0 = 540 - (5 * bw + 4 * gap) / 2;
  withPop(ctx, s, 540, 800, () => {
    // eixo
    sPoly(ctx, [[x0 - 40, base], [x0 + 5 * bw + 4 * gap + 30, base]], { id: 'axm', lw: 4 });
    hand(ctx, 'notas da prova', 540, base + 96, 34, { align: 'center', color: '#55525A' });
    const level = easeInOut(prog(f, 310, 370));
    NOTAS.forEach(([name, v], i) => {
      const x = x0 + i * (bw + gap), g = easeOutBack(prog(f, 100 + i * 10, 112 + i * 10));
      if (g <= 0) return;
      const hv = lerp(v, 7, level), hpx = hv * unit * g;
      const hl = f >= 190 + i * 10 && f < 300;
      sPoly(ctx, rectPts(x, base - hpx, bw, hpx), { id: 'bar' + i, closed: true, fill: hl ? COL.pink : (i % 2 ? '#A9D8EA' : '#BFE3F0'), lw: 4 });
      text(ctx, level > 0.5 ? '7' : String(v), x + bw / 2, base - hpx - 16, { font: F_DISPLAY, size: 46, align: 'center', color: COL.ink });
      hand(ctx, name, x + bw / 2, base + 46, 36, { align: 'center' });
    });
    // fórmulas
    const terms = NOTAS.map(n => n[1]);
    let line = '';
    terms.forEach((t, i) => { if (f >= 190 + i * 10) line += (i ? ' + ' : '') + t; });
    if (f >= 240) line += ' = 35';
    if (line) text(ctx, line, 540, f >= 372 ? -999 : 515, { font: F_DISPLAY, size: 64, align: 'center', color: COL.ink });
    if (f >= 262) {
      const k = easeOutBack(prog(f, 262, 272));
      withPop(ctx, k, 540, 580, () => text(ctx, '35 ÷ 5 = 7', 540, 600, { font: F_DISPLAY, size: 76, align: 'center', color: COL.pink, outline: 5 }));
    }
    // linha da média
    if (f >= 372) {
      const y = base - 7 * unit;
      sPoly(ctx, [[x0 - 40, y], [lerp(x0 - 40, x0 + 5 * bw + 4 * gap + 30, easeOut(prog(f, 372, 388))), y]], { id: 'lm', lw: 5, stroke: COL.pink, dash: [14, 10] });
      if (f >= 388) hand(ctx, 'todo mundo "igual" = média', 540, 700, 40, { align: 'center', color: COL.pink });
    }
  });
}

// ---------- PASSO 2: MEDIANA ----------
function sceneMediana(ctx, f, s) {
  withPop(ctx, s, 540, 800, () => {
    const vals = [6, 8, 5, 9, 7], sorted = [...vals].sort((a, b) => a - b);
    const xAt = i => 540 + (i - 2) * 168, y = 560;
    hand(ctx, '1º  coloque em ordem', 540, 470, 42, { align: 'center', color: '#55525A' });
    const sp = easeInOut(prog(f, 530, 590));
    vals.forEach((v, i) => {
      const k = easeOutBack(prog(f, 486 + i * 5, 498 + i * 5)); if (k <= 0) return;
      const j = sorted.indexOf(v), x = lerp(xAt(i), xAt(j), sp), yy = y - Math.sin(Math.PI * sp) * (i === j ? 0 : 90 + (i % 2) * 40);
      withPop(ctx, k, x, yy, () => tile(ctx, x, yy, v, 132, { id: 'md' + i, hi: j === 2 && f >= 606 }));
    });
    if (f >= 606) {
      sArrow(ctx, xAt(2), y + 175, xAt(2), y + 85, COL.pink, 6, 'amd', easeOut(prog(f, 606, 616)));
      if (f >= 614) { hand(ctx, 'o do meio!', xAt(2), y + 222, 42, { align: 'center', color: COL.pink }); }
      if (f >= 630) {
        const k = easeOutBack(prog(f, 630, 640));
        withPop(ctx, k, 540, 850, () => text(ctx, 'mediana = 7', 540, 862, { font: F_DISPLAY, size: 64, align: 'center', color: COL.ink }));
      }
    }
    // caso par
    if (f >= 690) {
      const ev = [3, 5, 7, 11], xe = i => 540 + (i - 1.5) * 150, ye = 1000;
      writeOn(ctx, f, 'quantidade par? média dos 2 do meio', 540, 945, 690, 720, { size: 38, align: 'center', color: '#55525A' });
      ev.forEach((v, i) => {
        const k = easeOutBack(prog(f, 715 + i * 5, 727 + i * 5)); if (k <= 0) return;
        withPop(ctx, k, xe(i), ye + 30, () => tile(ctx, xe(i), ye + 30, v, 108, { id: 'ev' + i, hi: (i === 1 || i === 2) && f >= 750 }));
      });
      if (f >= 775) {
        const k = easeOutBack(prog(f, 775, 787));
        withPop(ctx, k, 540, 1160, () => text(ctx, '(5 + 7) ÷ 2 = 6', 540, 1172, { font: F_DISPLAY, size: 52, align: 'center', color: COL.pink, outline: 4 }));
      }
    }
  });
}

// ---------- PASSO 3: MODA ----------
function sceneModa(ctx, f, s) {
  withPop(ctx, s, 540, 800, () => {
    const base = 1080, cols = [38, 39, 40, 41, 42], xc = v => 220 + cols.indexOf(v) * 160;
    hand(ctx, 'número do tênis da turma', 540, 480, 42, { align: 'center', color: '#55525A' });
    if (f >= 1060) {
      const k = easeOutBack(prog(f, 1060, 1072));
      withPop(ctx, k, xc(40), base - 130, () => sPoly(ctx, roundPts(xc(40) - 62, base - 300, 124, 300, 30), { id: 'hl40', closed: true, fill: '#FDE3E4', lw: 4, stroke: COL.pink }));
    }
    sPoly(ctx, [[140, base], [940, base]], { id: 'axd', lw: 4 });
    cols.forEach(v => text(ctx, String(v), xc(v), base + 60, { font: F_DISPLAY, size: 46, align: 'center', color: v === 40 && f >= 1060 ? COL.pink : COL.ink }));
    const data = [38, 40, 40, 39, 40, 42], count = {};
    data.forEach((v, i) => {
      const t0 = 920 + i * 22; if (f < t0) return;
      const n = count[v] = (count[v] || 0) + 1, yEnd = base - 46 - (n - 1) * 80;
      const yy = lerp(560, yEnd, easeOutBounce(prog(f, t0, t0 + 16)));
      sPoly(ctx, circlePts(xc(v), yy, 34, 20), { id: 'dot' + i, closed: true, fill: v === 40 && f >= 1060 ? COL.pink : '#A9D8EA', lw: 4 });
    });
    if (f >= 1074) {
      const k = easeOutBack(prog(f, 1074, 1086));
      withPop(ctx, k, xc(40), 700, () => text(ctx, 'moda = 40', xc(40), 720, { font: F_DISPLAY, size: 64, align: 'center', color: COL.pink, outline: 5 }));
    }
    writeOn(ctx, f, 'pode ter 2 modas (bimodal)… ou nenhuma!', 540, 1180, 1110, 1150, { size: 40, align: 'center', color: '#55525A' });
  });
}

// ---------- PASSO 4: PEGADINHA (valor extremo) ----------
function scenePegadinha(ctx, f, s) {
  withPop(ctx, s, 540, 800, () => {
    const base = 1110, unit = 14, bw = 100, gap = 40, x0 = 180, vals = [2, 2, 3, 3, 40];
    hand(ctx, 'salários de uma empresa (mil R$)', 540, 480, 40, { align: 'center', color: '#55525A' });
    sPoly(ctx, [[x0 - 30, base], [x0 + 5 * bw + 4 * gap + 20, base]], { id: 'axp', lw: 4 });
    vals.forEach((v, i) => {
      const x = x0 + i * (bw + gap);
      const g = i < 4 ? easeOutBack(prog(f, 1210 + i * 8, 1222 + i * 8)) : easeOut(prog(f, 1290, 1330));
      if (g <= 0) return;
      const hpx = v * unit * g, shake = i === 4 && f >= 1290 && f < 1340 ? Math.sin(f * 2.3) * 4 : 0;
      sPoly(ctx, rectPts(x + shake, base - hpx, bw, hpx), { id: 'pb' + i, closed: true, fill: i === 4 ? COL.pink : '#BFE3F0', lw: 4 });
      text(ctx, String(Math.round(v * g)), x + bw / 2 + shake, base - hpx - 14, { font: F_DISPLAY, size: 42, align: 'center' });
    });
    const xr = x0 + 5 * bw + 4 * gap + 20;
    // média: 2,5 antes do valor extremo, 10 depois
    if (f >= 1250) {
      const m = lerp(2.5, 10, easeInOut(prog(f, 1335, 1375))), y = base - m * unit;
      sPoly(ctx, [[x0 - 30, y], [xr, y]], { id: 'pm', lw: 5, stroke: COL.pink, dash: [14, 10] });
      text(ctx, 'média = ' + m.toFixed(1).replace('.0', '').replace('.', ','), x0 - 30, y - 14, { size: 40, color: COL.pink });
    }
    if (f >= 1390) {
      const y = base - 3 * unit - 2;
      sPoly(ctx, [[x0 - 30, y], [lerp(x0 - 30, xr, easeOut(prog(f, 1390, 1404))), y]], { id: 'pmd', lw: 5, stroke: COL.ink, dash: [6, 8] });
      if (f >= 1404) text(ctx, 'mediana = 3', x0 - 30, y - 50, { size: 40 });
    }
    if (f >= 1340) {
      const k = easeOutBack(prog(f, 1340, 1352));
      withPop(ctx, k, 300, 620, () => {
        text(ctx, 'o chefe!', 330, 600, { font: F_DISPLAY, size: 54, color: COL.pink, outline: 4 });
        sArrow(ctx, 520, 590, 700, 620, COL.pink, 5, 'chefe', 1);
      });
    }
    if (f >= 1430) writeOn(ctx, f, 'a média sobe muito… a mediana quase nem mexe!', 540, 1190, 1430, 1470, { size: 38, align: 'center', color: COL.ink });
  });
}

// ---------- PASSO 5: RESUMO ----------
function sceneResumo(ctx, f, s) {
  withPop(ctx, s, 540, 800, () => {
    const notes = [
      ['MÉDIA', 'soma tudo ÷ quantidade', '#FFF4C9', 1572],
      ['MEDIANA', 'o do meio (em ordem!)', '#FDE3E4', 1600],
      ['MODA', 'o que mais se repete', '#E1F1F7', 1628]
    ];
    notes.forEach(([t, d, c, at], i) => {
      const k = easeOutBack(prog(f, at, at + 12)); if (k <= 0) return;
      const y = 480 + i * 175, rot = (i - 1) * 0.015;
      ctx.save(); ctx.translate(540, y + 70); ctx.rotate(rot); ctx.scale(k, k); ctx.translate(-540, -(y + 70));
      sPoly(ctx, roundPts(118, y + 10, 860, 140, 18), { id: 'nsh' + i, closed: true, fill: 'rgba(0,0,0,0.08)', stroke: null });
      sPoly(ctx, roundPts(110, y, 860, 140, 18), { id: 'n' + i, closed: true, fill: c, lw: 4 });
      text(ctx, t, 150, y + 88, { font: F_DISPLAY, size: 56, color: i === 0 ? COL.ink : i === 1 ? COL.pink : '#2E7FA0' });
      text(ctx, '→ ' + d, 470, y + 86, { size: 44 });
      ctx.restore();
    });
    if (f >= 1670) {
      const k = easeOutBack(prog(f, 1670, 1682));
      withPop(ctx, k, 540, 1050, () => {
        text(ctx, 'DICA ENEM:', 540, 1040, { font: F_DISPLAY, size: 50, align: 'center', color: COL.pink, outline: 4 });
        text(ctx, 'tem valor muito fora da curva? pense na mediana', 540, 1100, { size: 38, align: 'center' });
      });
    }
  });
}

// ---------- card ----------
const CARDS = [
  { step: 'PASSO 1 DE 5', big: '7', label: 'MÉDIA', sub: 'some tudo e divida pela quantidade', bar: f => prog(f, 100, 380), val: p => p < 1 ? 'calculando…' : '35 ÷ 5 = 7' },
  { step: 'PASSO 2 DE 5', big: 'O DO MEIO', label: 'MEDIANA', sub: 'coloque em ordem antes!', bar: f => prog(f, 490, 790), val: p => p < 0.45 ? 'ordenando…' : p < 1 ? 'mediana = 7' : 'par: = 6' },
  { step: 'PASSO 3 DE 5', big: '40', label: 'MODA', sub: 'o valor que mais se repete', bar: f => prog(f, 920, 1086), val: p => p < 1 ? 'contando…' : '40 apareceu 3x' },
  { step: 'PASSO 4 DE 5', big: 'CUIDADO!', label: 'VALOR EXTREMO', sub: 'puxa a média, não a mediana', bar: f => prog(f, 1250, 1410), val: p => p < 1 ? '…' : 'média 10 · mediana 3' },
  { step: 'PASSO 5 DE 5', big: 'RESUMO', label: 'PRA NÃO ESQUECER', sub: 'média · mediana · moda', bar: f => prog(f, 1572, 1690), val: p => `${Math.round(p * 3)} / 3` },
  { step: 'REVISÃO ENEM', big: 'BOA PROVA!', label: 'MATEMÁTICA · 2º DIA', sub: 'salva pra revisar antes da prova', bar: () => 1, val: () => 'revisado ✓' }
];
function drawCard(ctx, f) {
  const s = pop(f, 74, 1e9, 12); if (s <= 0) return;
  const x = 110, y = 1250, w = 860, h = 360;
  withPop(ctx, s, x + w / 2, y + h / 2, () => {
    sPoly(ctx, roundPts(x + 14, y + 16, w, h, 26), { id: 'cardsh', closed: true, fill: COL.pinkSoft, stroke: null });
    sPoly(ctx, roundPts(x, y, w, h, 26), { id: 'card', closed: true, fill: '#fff', lw: 4 });
    const k = stepIndex(f);
    if (k < 0) { text(ctx, 'bora revisar em 1 minuto…', x + 50, y + 195, { size: 50, color: '#55525A' }); return; }
    const c = CARDS[k], at = k < STEPS.length ? STEPS[k].at : FINALE, pk = easeOutBack(prog(f, at, at + 9));
    ctx.save(); ctx.translate(x + 50, y + 150); ctx.scale(pk, pk); ctx.translate(-(x + 50), -(y + 150)); ctx.globalAlpha = clamp(pk);
    text(ctx, c.step, x + 50, y + 62, { size: 36, color: COL.pink });
    text(ctx, c.big, x + 46, y + 170, { font: F_DISPLAY, size: c.big.length > 7 ? 92 : 112, color: COL.pink, outline: 6 });
    text(ctx, c.label, x + 50, y + 236, { font: F_DISPLAY, size: 54, color: COL.ink });
    text(ctx, c.sub, x + 50, y + 284, { size: 38, color: '#55525A' });
    ctx.restore();
    const p = c.bar(f);
    sPoly(ctx, roundPts(x + 50, y + 308, 500, 26, 13), { id: 'bar', closed: true, fill: '#fff', lw: 3 });
    if (p > 0.02) { ctx.save(); ctx.fillStyle = COL.pink; ctx.beginPath(); ctx.roundRect(x + 53, y + 311, 494 * p, 20, 10); ctx.fill(); ctx.restore(); }
    text(ctx, c.val(p), x + 570, y + 330, { size: 34, color: COL.ink });
  });
}

// ---------- trilha ----------
function drawStepper(ctx, f) {
  const s = pop(f, 78, 1e9, 12); if (s <= 0) return;
  const y = 1735, xs = STEPS.map((_, i) => 140 + i * 200), cur = stepIndex(f);
  const doneAt = i => i + 1 < STEPS.length ? STEPS[i + 1].at : FINALE;
  withPop(ctx, s, 540, y, () => {
    for (let i = 0; i < STEPS.length - 1; i++) {
      sPoly(ctx, [[xs[i] + 36, y], [xs[i + 1] - 36, y]], { id: 'sl' + i, lw: 5, stroke: '#D9D5CE' });
      const fill = easeOut(prog(f, doneAt(i), doneAt(i) + 10));
      if (fill > 0) sPoly(ctx, [[xs[i] + 36, y], [lerp(xs[i] + 36, xs[i + 1] - 36, fill), y]], { id: 'slp' + i, lw: 5, stroke: COL.pink });
    }
    STEPS.forEach((st, i) => {
      const done = f >= doneAt(i), current = cur === i;
      if (done) {
        const k = easeOutBack(prog(f, doneAt(i), doneAt(i) + 8));
        withPop(ctx, k, xs[i], y, () => {
          sPoly(ctx, circlePts(xs[i], y, 34, 24), { id: 'sc' + i, closed: true, fill: COL.pink, lw: 4 });
          sPoly(ctx, [[xs[i] - 14, y + 1], [xs[i] - 3, y + 12], [xs[i] + 16, y - 12]], { id: 'ck' + i, lw: 6, stroke: '#fff', p: prog(f, doneAt(i) + 2, doneAt(i) + 9) });
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
function renderFrame(f, boilFrame) {
  const ctx = CTX; BOIL = Math.floor((boilFrame ?? f) / 4); f = Math.round(f * 100) / 100;
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(PAPER, 0, 0);
  const scenes = [[sceneMedia, 90, 470], [sceneMediana, 480, 890], [sceneModa, 900, 1190], [scenePegadinha, 1200, 1550], [sceneResumo, 1560, 1e9]];
  scenes.forEach(([fn, a, b]) => { const s = pop(f, a, b); if (s > 0) fn(ctx, f, s); });
  // brilhos no final
  if (f >= FINALE + 6) {
    for (let i = 0; i < 10; i++) {
      const a = i / 10 * Math.PI * 2 + 0.2, pl = 0.5 + 0.5 * Math.sin(f * 0.25 + i), r1 = 470 + pl * 12, r2 = r1 + 34 + pl * 20;
      sPoly(ctx, [[540 + Math.cos(a) * r1, 1430 + Math.sin(a) * r1 * 0.5], [540 + Math.cos(a) * r2, 1430 + Math.sin(a) * r2 * 0.5]], { id: 'spk' + i, lw: 5, stroke: i % 2 ? COL.pink : '#F2B33D' });
    }
  }
  drawCard(ctx, f);
  drawStepper(ctx, f);
  drawTitle(ctx, f);
}

let READY = false;
(async () => {
  for (const [name, file] of [['Luckiest Guy', 'LuckiestGuy.ttf'], ['Patrick Hand', 'PatrickHand.ttf']]) {
    const ff = new FontFace(name, `url(fonts/${file})`); await ff.load(); document.fonts.add(ff);
  }
  buildPaper();
  READY = true;
})();
