// Baseline capture: current implementation state before rebuild.
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const APP = 'file://' + path.resolve(__dirname, '..', 'index.html');
const OUT = path.join(__dirname, 'artifacts', 'baseline');

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('requestfailed', r => errors.push('reqfail: ' + r.url()));

  await page.goto(APP);
  await page.waitForTimeout(600);

  // 1. Timeline (default)
  await page.screenshot({ path: path.join(OUT, '01-timeline.png') });

  // 2. Floor Plan list
  await page.click('[data-screen="floorplan"]');
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(OUT, '02-floorplan-list.png') });

  // 3. Editor (edit first plan)
  const editBtn = await page.$('[data-fp-edit]');
  if (editBtn) {
    await editBtn.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(OUT, '03-editor.png') });

    // 4. Select a table
    const tbl = await page.$('.fpo');
    if (tbl) {
      await tbl.click();
      await page.waitForTimeout(300);
      await page.screenshot({ path: path.join(OUT, '04-table-selected.png') });
    }
  }

  // 5. Service screen (close editor first)
  const closeBtn = await page.$('#fp-editor-close');
  if (closeBtn && await page.isVisible('#fp-modal')) {
    await closeBtn.click();
    await page.waitForTimeout(300);
    // discard-confirm if dirty
    page.on('dialog', d => d.accept());
  }
  await page.click('.rail-item[data-screen="service"]');
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(OUT, '05-service.png') });

  console.log('BASELINE ERRORS (' + errors.length + '):');
  errors.forEach(e => console.log('  ' + e));
  await browser.close();
  console.log('Baseline captures written to ' + OUT);
})();
