const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  p.on('pageerror', e => console.error(e.message));
  await p.goto('file://' + path.join(__dirname, 'capa.html')); await p.waitForFunction(() => READY === true);
  await p.locator('#c').screenshot({ path: path.join(__dirname, 'capa_video03_enem.png') });
  await b.close();
})();
