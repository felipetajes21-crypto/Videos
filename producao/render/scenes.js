// ===== Cenas do Roteiro 01: "Amanhã você vai esquecer este vídeo" =====
// Quadros a 30 fps. Cada cena desenha com "lf" = quadro local (0 = início da cena).

const T = (o) => o; // açúcar para legibilidade

const SCENES = [
  // ---------- ATO 1: GANCHO ----------
  { // Cena 1: "Amanhã você vai esquecer quase tudo deste vídeo."
    name: 'gancho', start: 0, end: 60, entry: 'none', base: C.ice,
    draw(ctx, lf) {
      bgIce(ctx, lf);
      drawNeuron(ctx, 990, 170, 0.9, 0.3 + lf * 0.002, 6);
      drawNeuron(ctx, 70, 1720, 1.1, 2.2 - lf * 0.002, 9);
      // linha curva cinza atravessando o topo
      ctx.save(); ctx.strokeStyle = 'rgba(150,148,158,0.55)'; ctx.lineWidth = 34; ctx.filter = 'blur(10px)';
      const sw = easeOut(prog(lf, 8, 26));
      ctx.beginPath(); ctx.arc(540, 1400, 1250, Math.PI * 1.18, Math.PI * (1.18 + 0.66 * sw)); ctx.stroke(); ctx.restore();

      const cx = 540, cy = 930;
      // medalhão escuro nasce atrás do cérebro
      const mr = 250 * easeOutBack(prog(lf, 3, 9));
      drawMedallion(ctx, cx, cy, mr);
      drawDashedRing(ctx, cx, cy, 292, easeOut(prog(lf, 4, 20)), lf * 0.06);
      // cérebro começa grande e borrado e encolhe
      const k = easeOut(prog(lf, 0, 6));
      const P = 0.55 * easeIn(prog(lf, 24, 46));
      drawBrain(ctx, cx, cy + 4, lerp(1000, 430, k), P, (1 - k) * 26);

      drawText(ctx, lf, T({ text: 'Amanhã você vai', font: 'sans', size: 66, x: 100, y: 420, start: 1, mode: 'letters', fpl: 0.7, dy: -30 }));
      drawText(ctx, lf, T({ text: 'esquecer', font: 'serif', size: 176, x: 92, y: 590, start: 16, fpl: 1.5 }));
      drawText(ctx, lf, T({ text: 'quase tudo', font: 'sans', size: 62, x: 540, y: 1335, align: 'center', start: 36 }));
      drawText(ctx, lf, T({ text: 'deste vídeo', font: 'sans', size: 62, x: 540, y: 1410, align: 'center', start: 42 }));
    }
  },
  { // Cena 2: "E não é culpa sua." (painel preto sobe + estrobo)
    name: 'culpa', start: 60, end: 90, entry: 'none', exit: 'none', base: C.ice,
    draw(ctx, lf) {
      bgIce(ctx, lf + 60);
      const top = lerp(H + 60, 1010, easeOut(prog(lf, 0, 10)));
      ctx.save(); ctx.fillStyle = C.black;
      ctx.shadowColor = 'rgba(0,0,0,0.35)'; ctx.shadowBlur = 40;
      ctx.beginPath(); ctx.moveTo(0, top + 50); ctx.lineTo(W, top - 50); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath(); ctx.fill(); ctx.restore();
      drawText(ctx, lf, T({ text: 'E não é', font: 'sans', size: 92, x: 540, y: 760, align: 'center', start: 1 }));
      drawText(ctx, lf, T({ text: 'culpa sua.', font: 'serif', size: 170, x: 540, y: 1430, align: 'center', start: 7, fpl: 1.3, color: '#fff' }));
    },
    post(ctx, lf) { if (lf >= 20 && lf <= 24 && lf % 2 === 0) invertScreen(ctx); }
  },

  // ---------- ATO 2: A HISTÓRIA ----------
  { // Cena 3: "Em 1885, um psicólogo alemão" (montagem sépia)
    name: '1885', start: 90, end: 156, entry: 'none', base: '#fff',
    draw(ctx, lf) {
      const idx = Math.min(4, Math.floor(lf / 13)), li = lf - idx * 13;
      const img = OBJ.vintage[idx], s = 1 + 0.06 * (li / 13);
      ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(s, s); ctx.translate(-W / 2, -H / 2);
      ctx.filter = 'sepia(0.55) contrast(1.05)'; ctx.drawImage(img, 0, 0); ctx.restore();
      vignette(ctx, 0.6);
      grain(ctx, lf, 0.22);
      // "1885" cromado, fixo
      ctx.save();
      ctx.font = `800 330px ${FONT_SANS}`; ctx.textAlign = 'center';
      const g = ctx.createLinearGradient(0, 760, 0, 1000);
      g.addColorStop(0, '#ffffff'); g.addColorStop(0.42, '#b5c3d3'); g.addColorStop(0.5, '#6f7f93'); g.addColorStop(0.6, '#eef3f8'); g.addColorStop(1, '#8796aa');
      ctx.shadowColor = 'rgba(255,255,255,0.55)'; ctx.shadowBlur = 40;
      ctx.fillStyle = g; ctx.fillText('1885', 540, 990);
      ctx.shadowColor = 'transparent'; ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(255,255,255,0.8)'; ctx.strokeText('1885', 540, 990);
      ctx.restore();
      drawText(ctx, lf, T({ text: 'Em', font: 'sans', size: 58, x: 160, y: 700, start: 1, color: '#fff' }));
      drawText(ctx, lf, T({ text: 'um psicólogo alemão', font: 'sans', size: 60, x: 540, y: 1130, align: 'center', start: 22, mode: 'letters', fpl: 0.8, color: '#fff' }));
    },
    post(ctx, lf) {
      // abertura: flash branco que "expõe" a imagem
      const a = lf === 0 ? 1 : 1 - prog(lf, 0, 6);
      if (a > 0) { ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H); ctx.restore(); }
      // clique de troca: 1 quadro mais claro
      if (lf % 13 === 0 && lf > 0) { ctx.save(); ctx.globalAlpha = 0.25; ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H); ctx.restore(); }
    }
  },
  { // Cenas 4 + 5: caderno com sílabas → "O resultado?"
    name: 'caderno', start: 156, end: 246, exit: 'none', base: C.ice,
    draw(ctx, lf) {
      bgIce(ctx, lf);
      const nbBlur = 14 * easeOut(prog(lf, 66, 74));
      ctx.save(); if (nbBlur > 0.3) ctx.filter = `blur(${nbBlur.toFixed(1)}px)`;
      drawNotebook(ctx, 540, 1000, 900, 600, -0.06, (c, w, h) => {
        const syl = ['DAX', 'BUP', 'ZOL', 'KEF', 'MIV', 'LOT', 'TEB', 'RUS', 'GOK', 'NAF'];
        c.font = `62px ${FONT_SERIF}`; c.fillStyle = '#2b2118';
        syl.forEach((s, i) => {
          const col = i % 2, row = Math.floor(i / 2);
          const appear = prog(lf, 6 + i * 3.5, 10 + i * 3.5);
          const fade = 1 - prog(lf, 46 + (9 - i) * 1.6, 56 + (9 - i) * 1.6); // desbota de baixo para cima
          const a = appear * (0.15 + 0.85 * fade);
          if (a <= 0) return;
          c.globalAlpha = a;
          const x = (col === 0 ? -w / 2 + 90 : 80) + (row % 2) * 40, y = -h / 2 + 120 + row * 98;
          c.fillText(s, x, y);
        });
        c.globalAlpha = 1;
      });
      ctx.restore();
      // texto (some de uma vez no quadro 64: troca de frase sem trocar o plano)
      if (lf < 64) {
        drawText(ctx, lf, T({ text: 'decorou sílabas', font: 'sans', size: 64, x: 100, y: 400, start: 1, mode: 'letters', fpl: 0.8 }));
        drawText(ctx, lf, T({ text: 'sem sentido', font: 'serif', size: 150, x: 92, y: 560, start: 14, fpl: 1.4 }));
        drawText(ctx, lf, T({ text: 'e mediu quanto', font: 'sans', size: 64, x: 100, y: 1440, start: 32, mode: 'letters', fpl: 0.8 }));
        drawText(ctx, lf, T({ text: 'esquecia', font: 'serif', size: 150, x: 92, y: 1600, start: 44, fpl: 1.4 }));
      }
      // "O resultado?" + card que cresce
      if (lf >= 66) {
        const s = lf < 82 ? easeOutBack(prog(lf, 66, 73)) : 1 + 9 * easeIn(prog(lf, 82, 90));
        drawQuestionCard(ctx, 540, 930, s);
        if (lf < 84) {
          drawText(ctx, lf, T({ text: 'O', font: 'sans', size: 70, x: 540, y: 1250, align: 'center', start: 70 }));
          drawText(ctx, lf, T({ text: 'resultado?', font: 'serif', size: 160, x: 540, y: 1420, align: 'center', start: 72, fpl: 1.1 }));
        }
      }
    }
  },
  { // Cena 6: "Em um dia, ele já tinha perdido cerca de dois terços."
    name: 'curva', start: 246, end: 312, entry: 'focus', base: C.black,
    draw(ctx, lf) {
      bgBlack(ctx, lf);
      // ampulheta desfocada no canto
      ctx.save(); ctx.filter = 'blur(6px)'; ctx.translate(950 - lf * 0.3, 260 + lf * 0.2); ctx.rotate(0.35); ctx.globalAlpha = 0.9;
      ctx.drawImage(OBJ.hourglass, -170, -260); ctx.restore();
      drawGraphAxes(ctx, true, easeOut(prog(lf, 2, 8)));
      const pts = curvePoints([{ t0: 0, t1: 14, S: 0.9 }]);
      strokeProgress(ctx, pts, easeIn(prog(lf, 8, 30)) * 0.999, '#fff', 8);
      if (lf >= 32) {
        const x = gx(1), y = gy(Math.exp(-1 / 0.9));
        dot(ctx, x, y, 14, C.yellow); drawPulseRing(ctx, x, y, 22, lf, 32);
        yellowLight(ctx, x, y, 220, 0.18 * prog(lf, 32, 38));
      }
      drawText(ctx, lf, T({ text: 'Em um dia', font: 'sans', size: 64, x: 120, y: 360, start: 2, color: '#fff' }));
      const info = drawText(ctx, lf, T({ text: '⅔', font: 'sans', weight: 800, size: 250, x: 110, y: 640, start: 14, color: '#fff' }));
      const word = drawText(ctx, lf, T({ text: 'esquecido', font: 'serif', size: 140, x: 420, y: 600, start: 20, fpl: 1.4, color: C.yellow, glow: 'rgba(245,224,42,0.8)' }));
      if (lf >= 20) yellowLight(ctx, 700, 560, 420, 0.16 * prog(lf, 20, 30));
    }
  },

  // ---------- ATO 3: QUEBRA DE EXPECTATIVA ----------
  { // Cena 7: "E não era falta de inteligência. Nem de foco. Nem de esforço."
    name: 'lista', start: 312, end: 408, exit: 'none', base: C.black,
    draw(ctx, lf) {
      bgBlack(ctx, lf, { gridAlpha: 0.5 });
      const lift = -40 * easeOut(prog(lf, 18, 26)) - 40 * easeOut(prog(lf, 40, 48)) - 40 * easeOut(prog(lf, 62, 70));
      ctx.save(); ctx.translate(0, lift + 60);
      drawText(ctx, lf, T({ text: 'E não era', font: 'sans', size: 66, x: 120, y: 560, start: 1, color: '#fff' }));
      drawText(ctx, lf, T({ text: 'falta de', font: 'serif', size: 160, x: 112, y: 730, start: 7, fpl: 1.4, color: '#fff' }));
      const items = [['Inteligência', 18], ['Foco', 40], ['Esforço', 62]];
      items.forEach(([t, st], i) => {
        if (lf < st) return;
        const k = easeOut(prog(lf, st, st + 8)), y = 860 + i * 150 + (1 - k) * 60;
        ctx.save(); if (k < 1) ctx.filter = `blur(${((1 - k) * 14).toFixed(1)}px)`;
        const o = { text: t, font: 'serif', size: 70, x: 230, y: y + 78, start: st + 3, fpl: 1, color: '#fff' };
        const tw = measure(ctx, o);
        const done = prog(lf, st + 3 + t.length, st + 6 + t.length);
        drawPill(ctx, 120, y, tw + 170, 112, k, done);
        ctx.restore();
        const info = drawText(ctx, lf, o);
        strike(ctx, info, prog(lf, 76 + i * 3, 84 + i * 3), '#fff', 6);
      });
      ctx.restore();
    },
    post(ctx, lf) {
      // íris branca que abre para a cena seguinte
      if (lf >= 84) {
        const r = 1250 * easeIn(prog(lf, 84, 96));
        ctx.save(); ctx.fillStyle = C.ice; ctx.shadowColor = 'rgba(255,255,255,0.9)'; ctx.shadowBlur = 80;
        ctx.beginPath(); ctx.arc(540, 960, r, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      }
    }
  },
  { // Cena 8: "O cérebro apaga o que não se repete."
    name: 'apaga', start: 408, end: 474, entry: 'none', base: C.ice,
    draw(ctx, lf) {
      bgIce(ctx, lf + 408);
      drawNeuron(ctx, 1000, 260, 0.8, 1 + lf * 0.003, 7);
      const cx = 540, cy = 980;
      drawMedallion(ctx, cx, cy, 230);
      drawDashedRing(ctx, cx, cy, 270, 1, lf * 0.06);
      drawBrain(ctx, cx, cy + 4, 400, 0.5 + 0.06 * Math.sin(lf * 0.1), 0);
      drawText(ctx, lf, T({ text: 'O cérebro', font: 'sans', size: 64, x: 110, y: 420, start: 1 }));
      // "apaga" dentro de seleção tracejada, riscada e encolhida até sobrar "_____"
      const o = { text: 'apaga', font: 'serif', size: 168, x: 120, y: 600, start: 7, fpl: 1.6 };
      const tw = measure(ctx, o);
      const shrink = easeIn(prog(lf, 30, 38));
      if (lf >= 7) {
        ctx.save(); ctx.strokeStyle = '#111'; ctx.lineWidth = 3; ctx.setLineDash([12, 8]);
        ctx.globalAlpha = 1 - shrink; ctx.strokeRect(100, 440, tw + 40, 200); ctx.restore();
      }
      ctx.save(); ctx.translate(0, 600); ctx.scale(1, 1 - shrink * 0.98); ctx.translate(0, -600);
      const info = drawText(ctx, lf, o);
      strike(ctx, info, prog(lf, 24, 29), '#111', 8);
      ctx.restore();
      if (shrink > 0) { ctx.save(); ctx.fillStyle = '#111'; ctx.fillRect(120, 596, tw * shrink, 8); ctx.restore(); }
      drawText(ctx, lf, T({ text: 'o que não se', font: 'sans', size: 64, x: 110, y: 1380, start: 36 }));
      drawText(ctx, lf, T({ text: 'repete', font: 'serif', size: 168, x: 120, y: 1560, start: 44, fpl: 1.5, highlight: C.yellow }));
    }
  },

  // ---------- ATO 4: A REVELAÇÃO ----------
  { // Cena 9: "Mas existe um atalho:"
    name: 'atalho', start: 474, end: 528, base: C.black,
    draw(ctx, lf) {
      bgBlack(ctx, lf, { gridAlpha: 0.35 });
      const cx = 540, cy = 1040;
      // feixe de luz vindo de cima
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      const g = ctx.createLinearGradient(0, 0, 0, cy);
      g.addColorStop(0, 'rgba(255,255,255,0.0)'); g.addColorStop(1, 'rgba(255,255,255,0.13)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(470, 0); ctx.lineTo(610, 0); ctx.lineTo(cx + 260, cy); ctx.lineTo(cx - 260, cy); ctx.closePath(); ctx.fill(); ctx.restore();
      // ondas de radar
      for (let i = 0; i < 4; i++) {
        const r = 220 + ((i * 120 + lf * 3) % 480);
        ctx.save(); ctx.strokeStyle = `rgba(255,255,255,${0.12 * (1 - (r - 220) / 480)})`; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
      }
      const s = easeOutBack(prog(lf, 4, 11));
      drawMedallion(ctx, cx, cy, 170 * s, 1, true);
      if (s > 0.3) drawShortcutIcon(ctx, cx, cy, 120 * s);
      ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,0.9)'; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(cx, cy, 200 * s, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
      drawPulseRing(ctx, cx, cy, 200, lf, 24, '#fff', 5);
      drawText(ctx, lf, T({ text: 'Mas existe um', font: 'sans', size: 70, x: 540, y: 560, align: 'center', start: 2, color: '#fff' }));
      const info = drawText(ctx, lf, T({ text: '“atalho”', font: 'serif', size: 180, x: 540, y: 1470, align: 'center', start: 18, fpl: 1.4, color: C.yellow, glow: 'rgba(245,224,42,0.8)' }));
      if (lf >= 18) yellowLight(ctx, 540, 1410, 460, 0.15 * prog(lf, 18, 30));
    }
  },
  { // Cenas 10–12: gráfico interativo, intervalos e "a memória dura mais"
    name: 'revisao', start: 528, end: 810, base: C.ice, push: 0.006,
    draw(ctx, lf) {
      bgIce(ctx, lf, { bokeh: false, grid: true });
      // câmera: snap zoom nos números (cena 11) e zoom-out final (cena 12)
      const zo = easeInOut(prog(lf, 180, 204));
      let snap = 0;
      for (const s of [90, 120, 150]) if (lf >= s && lf < s + 7) snap = 0.1 * (1 - easeOut((lf - s) / 7));
      const sc = lerp(1, 0.66, zo) * (1 + snap);
      ctx.save();
      ctx.translate(540, lerp(1020, 740, zo)); ctx.scale(sc, sc); ctx.translate(-540, -1020);
      drawGraphAxes(ctx, false);
      // segmentos: base (0–1 dia), depois revisões em 1, 4 e 11 dias
      const segs = [{ t0: 0, t1: 1, S: 0.9 }, { t0: 1, t1: 4, S: 2.6 }, { t0: 4, t1: 11, S: 7 }, { t0: 11, t1: 14, S: 30 }];
      const draws = [[0, 14], [48, 60], [96, 118], [126, 148], [156, 175]];
      // curva antiga (sem revisão) fica como "fantasma"
      ctx.save(); ctx.globalAlpha = 0.18 * prog(lf, 50, 60);
      strokeProgress(ctx, curvePoints([{ t0: 0, t1: 14, S: 0.9 }]), 0.999, '#111', 5); ctx.restore();
      strokeProgress(ctx, curvePoints([segs[0]]), easeIn(prog(lf, 0, 14)) * 0.999, '#111', 8);
      // salto da revisão 1 (clique)
      if (lf >= 46) {
        ctx.save(); ctx.strokeStyle = C.yellow; ctx.lineWidth = 8; ctx.lineCap = 'round';
        const y1 = gy(Math.exp(-1 / 0.9)), y2 = lerp(y1, gy(1), easeOut(prog(lf, 46, 52)));
        ctx.beginPath(); ctx.moveTo(gx(1), y1); ctx.lineTo(gx(1), y2); ctx.stroke(); ctx.restore();
      }
      strokeProgress(ctx, curvePoints([segs[1]]), easeOut(prog(lf, 52, 120)) * 0.999, '#111', 8);
      if (lf >= 120) strokeProgress(ctx, [[gx(4), gy(Math.exp(-3 / 2.6))], [gx(4), gy(1)]], easeOut(prog(lf, 120, 125)), C.yellow, 8);
      strokeProgress(ctx, curvePoints([segs[2]]), easeOut(prog(lf, 126, 150)) * 0.999, '#111', 8);
      if (lf >= 150) strokeProgress(ctx, [[gx(11), gy(Math.exp(-7 / 7))], [gx(11), gy(1)]], easeOut(prog(lf, 150, 155)), C.yellow, 8);
      strokeProgress(ctx, curvePoints([segs[3]]), easeOut(prog(lf, 156, 176)) * 0.999, '#111', 8);
      // pontos amarelos das revisões
      [[46, 1], [120, 4], [150, 11]].forEach(([st, d]) => {
        if (lf < st) return; dot(ctx, gx(d), gy(1), 13, '#d8c21c'); drawPulseRing(ctx, gx(d), gy(1), 20, lf, st, '#d8c21c', 5);
      });
      // cursor arrasta até "quase esquecendo" e clica
      if (lf >= 18 && lf < 70) {
        const t = easeInOut(prog(lf, 18, 44));
        const tx = gx(1), ty = gy(Math.exp(-1 / 0.9));
        const x = lerp(1000, tx, t), y = lerp(1500, ty, t);
        const click = lf >= 44 && lf <= 48 ? 0.85 : 1;
        if (lf >= 44) drawPulseRing(ctx, tx, ty, 24, lf, 44, '#111', 4);
        drawCursor(ctx, x, y, click);
      }
      ctx.restore();

      // ---- textos ----
      if (lf < 88) {
        drawText(ctx, lf, T({ text: 'revisar bem na', font: 'sans', size: 62, x: 110, y: 380, start: 1, mode: 'letters', fpl: 0.7 }));
        drawText(ctx, lf, T({ text: 'hora', font: 'serif', size: 160, x: 104, y: 550, start: 12, fpl: 1.6 }));
        drawText(ctx, lf, T({ text: 'em que você está quase', font: 'sans', size: 56, x: 110, y: 1430, start: 28, mode: 'letters', fpl: 0.6 }));
        drawText(ctx, lf, T({ text: 'esquecendo', font: 'serif', size: 150, x: 104, y: 1590, start: 44, fpl: 1.3 }));
      } else if (lf < 180) {
        // uma palavra por vez, no centro, substituindo a anterior
        const words = [['1 dia', 90], ['3 dias', 120], ['1 semana', 150]];
        const cur = words.filter(w => lf >= w[1]).pop();
        if (cur) {
          drawText(ctx, lf, T({ text: cur[0], font: 'serif', size: 190, x: 540, y: 560, align: 'center', start: cur[1], mode: 'whole', entryDur: 4, highlight: C.yellow }));
        }
      } else {
        drawText(ctx, lf, T({ text: 'A cada revisão, a', font: 'sans', size: 62, x: 540, y: 330, align: 'center', start: 186 }));
        drawText(ctx, lf, T({ text: 'memória', font: 'serif', size: 170, x: 540, y: 500, align: 'center', start: 194, fpl: 1.4 }));
        // cérebro volta inteiro (partículas se juntam)
        const k = easeOut(prog(lf, 196, 206));
        drawMedallion(ctx, 540, 1300, 190 * k);
        drawDashedRing(ctx, 540, 1300, 225, easeOut(prog(lf, 198, 214)), lf * 0.06);
        if (k > 0) drawBrain(ctx, 540, 1304, 330, 0.6 * (1 - easeOut(prog(lf, 204, 246))), 0, k);
        drawText(ctx, lf, T({ text: 'dura', font: 'sans', size: 64, x: 330, y: 1640, start: 238 }));
        drawText(ctx, lf, T({ text: 'mais', font: 'serif', size: 170, x: 500, y: 1650, start: 244, fpl: 1.6, highlight: C.yellow }));
      }
    },
    post(ctx, lf) {
      for (const s of [90, 120, 150]) if (lf === s || lf === s + 1) { ctx.save(); ctx.globalAlpha = lf === s ? 0.7 : 0.3; ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H); ctx.restore(); }
    }
  },

  // ---------- ATO 5: FRASE FINAL ----------
  { // Cena 13: "Aprender não é ver mais vezes."
    name: 'aprender', start: 810, end: 918, base: C.ice,
    draw(ctx, lf) {
      bgIce(ctx, lf + 810);
      const ang = Math.PI * (1 + easeOut(prog(lf, 0, 32)));
      drawPhone(ctx, 540, 1110, 400, 820, ang, (c, w, h) => {
        drawReplayIcon(c, 0, -40, 110, lf * 0.12, '#111', 26);
        c.fillStyle = '#999'; c.font = `600 34px ${FONT_SANS}`; c.textAlign = 'center';
        c.fillText(`assistido ${Math.min(12, Math.max(1, Math.floor(lf / 7)))}x`, 0, 160);
      });
      drawText(ctx, lf, T({ text: 'Aprender não é', font: 'sans', size: 66, x: 540, y: 380, align: 'center', start: 4 }));
      const info = drawText(ctx, lf, T({ text: 'ver mais vezes', font: 'serif', size: 140, x: 540, y: 540, align: 'center', start: 20, fpl: 1.2 }));
      if (info) {
        const o = { text: 'ver ', font: 'serif', size: 140 }; const off = measure(ctx, o);
        strike(ctx, { x: info.x + off, w: info.w - off, y: info.y, size: 140 }, prog(lf, 86, 98), '#111', 9);
      }
    }
  },
  { // Cena 14: "É ver na hora certa." + CTA, corte seco no fim
    name: 'final', start: 918, end: 1050, exit: 'none', base: C.ice,
    draw(ctx, lf) {
      bgIce(ctx, lf + 918);
      const m = lerp(-Math.PI * 0.75, 0, easeInOut(prog(lf, 8, 60)));
      drawClock(ctx, 540, 1130, 300, m, Math.PI * 0.35);
      drawPulseRing(ctx, 540, 1130, 320, lf, 62, '#d8c21c', 8);
      drawText(ctx, lf, T({ text: 'É ver na', font: 'sans', size: 70, x: 540, y: 420, align: 'center', start: 3 }));
      drawText(ctx, lf, T({ text: 'hora certa', font: 'serif', size: 180, x: 540, y: 620, align: 'center', start: 18, fpl: 1.5, highlight: C.yellow }));
      if (lf >= 96) {
        const a = easeOut(prog(lf, 96, 104));
        ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = '#555'; ctx.font = `600 44px ${FONT_SANS}`; ctx.textAlign = 'center';
        ctx.fillText('salva e revê amanhã', 510, 1590); ctx.restore();
        ctx.save(); ctx.globalAlpha = a; drawReplayIcon(ctx, 760, 1575, 20, lf * 0.1, '#555', 6); ctx.restore();
      }
    }
  },
];

const TOTAL_FRAMES = SCENES[SCENES.length - 1].end;
let READY = false;
const MAIN = document.getElementById('c').getContext('2d');

function renderFrame(f) {
  const sc = SCENES.find(s => f >= s.start && f < s.end) || SCENES[SCENES.length - 1];
  compose(MAIN, sc, f - sc.start);
}

(async () => {
  const ff = new FontFace('PlayfairItalic', 'url(../fonts/f1.ttf)');
  await ff.load(); document.fonts.add(ff);
  await document.fonts.load(`700 60px "Inter"`); await document.fonts.load(`800 60px "Inter"`);
  await new Promise(res => { const im = new Image(); im.onload = () => { window.BRAIN_IMG = im; res(); }; im.onerror = () => res(); im.src = '../assets/01_cerebro.png'; });
  buildAll();
  READY = true;
})();
