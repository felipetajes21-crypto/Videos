const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  for (const o of ['A', 'B', 'C']) {
    const p = await b.newPage({ viewport: { width: 1080, height: 1080 } });
    p.on('pageerror', e => console.error(e.message));
    await p.goto('file://' + path.join(__dirname, 'avatar.html') + '#' + o);
    await p.waitForFunction(() => READY === true);
    await p.locator('#c').screenshot({ path: path.join(__dirname, `foto_perfil_${o}.png`) });
  }
  await b.close();
})();
