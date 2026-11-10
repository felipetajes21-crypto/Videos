// Uso:
//   node render.js stills out_dir 0,30,90,...   -> salva quadros PNG para conferência
//   node render.js video out.mp4 [inicio] [fim] -> renderiza o vídeo (sem áudio)
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

(async () => {
  const [mode, out, a, b] = process.argv.slice(2);
  const browser = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  page.on('console', m => console.log('[page]', m.text()));
  page.on('pageerror', e => { console.error('[pageerror]', e.message); process.exitCode = 1; });
  await page.goto('file://' + path.join(__dirname, 'index.html'));
  await page.waitForFunction(() => window.READY === true || (typeof READY !== 'undefined' && READY), null, { timeout: 60000 });
  const total = await page.evaluate(() => TOTAL_FRAMES);

  const grab = async (f, type) => {
    const url = await page.evaluate(([f, type]) => { renderFrame(f); return document.getElementById('c').toDataURL(type, 0.93); }, [f, type]);
    return Buffer.from(url.split(',')[1], 'base64');
  };

  if (mode === 'stills') {
    fs.mkdirSync(out, { recursive: true });
    for (const f of a.split(',').map(Number)) fs.writeFileSync(path.join(out, `f${String(f).padStart(4, '0')}.png`), await grab(f, 'image/png'));
  } else {
    const start = Number(a ?? 0), end = Number(b ?? total);
    const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', '30', '-c:v', 'mjpeg', '-i', '-',
      '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
    const t0 = Date.now();
    for (let f = start; f < end; f++) {
      const buf = await grab(f, 'image/jpeg');
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      if (f % 60 === 0) console.log(`quadro ${f}/${end}  (${((Date.now() - t0) / 1000).toFixed(0)} s)`);
    }
    ff.stdin.end();
    await new Promise(r => ff.on('close', r));
  }
  await browser.close();
})();
