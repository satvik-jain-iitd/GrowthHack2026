// Visual captures: reproduce each of the 7 reference states and screenshot them.
const H = require('./helpers');

const results = [];
function record(name, pass, detail) {
  results.push({ name, pass, detail: detail || '' });
  console.log((pass ? '  PASS ' : '  FAIL ') + name + (detail ? ' — ' + detail : ''));
}

async function run(browser) {
  console.log('\n[Visual] Reference-state captures');
  const { page, errors } = await H.newPage(browser);
  await H.resetStorage(page);

  // V1 — Floor Plan list (ref 03f8decc / 00a25330)
  await H.gotoFloorPlans(page);
  await H.shot(page, 'v1-floor-plan-list');
  record('V1 floor plan list captured', await page.isVisible('.fpl-t'));

  // V2 — Create flow: empty editor (ref 976162ea top)
  await H.createNewPlan(page);
  await H.shot(page, 'v2-create-empty-editor');
  record('V2 create-empty editor captured', await page.isVisible('.fpp-empty'));
  await page.click('#fp-cancel-btn');
  await page.waitForTimeout(300);

  // V3 — Edit table selected (ref 976162ea bottom)
  await H.gotoFloorPlans(page);
  await page.click('[data-fp-edit="fp-1"]');
  await page.waitForTimeout(400);
  await H.selectTable(page, 't-51');
  await H.shot(page, 'v3-edit-table-selected');
  record('V3 edit-table state captured', (await page.textContent('.fpp-title')).trim() === 'Edit table');

  // V4 — Full editor with many tables (ref 993184e1)
  await page.keyboard.press('Escape');
  await page.waitForTimeout(150);
  await H.shot(page, 'v4-editor-full-layout');
  record('V4 full-layout editor captured', (await page.$$('.fpo')).length >= 25);

  // V5 — Add Decor dropdown open (ref c9a38677)
  await page.click('#fp-add-decor-btn');
  await page.waitForTimeout(150);
  await page.click('#fp-decor-patio-toggle');
  await page.waitForTimeout(120);
  await H.shot(page, 'v5-add-decor-open');
  record('V5 add-decor dropdown captured', await page.isVisible('#fp-decor-menu'));
  await page.click('#fp-add-decor-btn');
  await page.waitForTimeout(120);

  // V6 — Multi-select / Create Combo (ref 644e7c83)
  await H.selectTable(page, 't-500');
  await H.selectTable(page, 't-400', true);
  await H.shot(page, 'v6-create-combo-multiselect');
  record('V6 multi-select state captured', (await page.textContent('.fpp-title')).trim() === 'Selected Tables');

  // V7 — Edit Combo (ref e46a2234)
  await page.click('#fp-create-combo-btn');
  await page.waitForTimeout(250);
  await H.shot(page, 'v7-edit-combo');
  record('V7 edit-combo state captured', (await page.textContent('.fpp-title')).trim() === 'Edit Combo');

  await page.click('#fp-cancel-btn');
  await page.waitForTimeout(300);

  record('V* zero console errors during captures', errors.console.length === 0, errors.console.slice(0, 3).join(' | '));
  await page.close();
  return results;
}

module.exports = { run };
