// Renderiza o vídeo sincronizado com a narração: cada quadro de saída (30 fps) é mapeado
// para um "quadro original" pelas âncoras de sync.json, e o áudio é juntado no final.
// Uso: node render_sync.js ../saida/saida.mp4   |   node render_sync.js stills DIR 7.4,12.4 (segundos)
const { chromium } = require('playwright'); const { spawn } = require('child_process');
const path = require('path'); const fs = require('fs');
const cfg = JSON.parse(fs.readFileSync(path.join(__dirname, 'sync.json')));
const A = cfg.ancoras;
for (let i = 1; i < A.length; i++) if (A[i][0] < A[i - 1][0] || A[i][1] <= A[i - 1][1]) throw new Error('âncoras fora de ordem em ' + i);
function warp(t) {
  if (t <= A[0][1]) return A[0][0];
  for (let i = 1; i < A.length; i++) if (t <= A[i][1]) { const k = (t - A[i - 1][1]) / (A[i][1] - A[i - 1][1]); return A[i - 1][0] + k * (A[i][0] - A[i - 1][0]); }
  return A[A.length - 1][0] - 0.01;
}
(async () => {
  const args = process.argv.slice(2);
  const b = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  const page = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  page.on('pageerror', e => { console.error('[pageerror]', e.message); process.exitCode = 1; });
  await page.goto('file://' + path.join(__dirname, 'index.html'));
  await page.waitForFunction(() => typeof READY !== 'undefined' && READY);
  const grab = async (k, type) => {
    const f = Math.min(warp(k / 30), 1799.99);
    const url = await page.evaluate(([f, k, type]) => { renderFrame(f, k); return document.getElementById('c').toDataURL(type, 0.93); }, [f, k, type]);
    return Buffer.from(url.split(',')[1], 'base64');
  };
  if (args[0] === 'stills') {
    fs.mkdirSync(args[1], { recursive: true });
    for (const s of args[2].split(',').map(Number)) fs.writeFileSync(path.join(args[1], `t${s.toFixed(1)}.png`), await grab(Math.round(s * 30), 'image/png'));
  } else {
    const out = args[0], N = Math.round(cfg.duracao * 30);
    const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', '30', '-c:v', 'mjpeg', '-i', '-',
      '-i', path.join(__dirname, cfg.audio), '-map', '0:v', '-map', '1:a',
      '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
    for (let k = 0; k < N; k++) {
      const buf = await grab(k, 'image/jpeg');
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      if (k % 300 === 0) console.log(`quadro ${k}/${N}`);
    }
    ff.stdin.end(); await new Promise(r => ff.on('close', r));
  }
  await b.close();
})();
