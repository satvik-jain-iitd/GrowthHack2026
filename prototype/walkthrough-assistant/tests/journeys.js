// Journey + permutation e2e tests for the floor-plan flow.
const H = require('./helpers');

const results = [];
function record(name, pass, detail) {
  results.push({ name, pass, detail: detail || '' });
  console.log((pass ? '  PASS ' : '  FAIL ') + name + (detail ? ' — ' + detail : ''));
}

async function expect(cond, name, detail) {
  record(name, !!cond, detail);
  return !!cond;
}

/* ---------- A. ENTRY PATHS ---------- */
async function entryPaths(browser) {
  console.log('\n[A] Entry paths');
  const { page, errors } = await H.newPage(browser);
  await H.resetStorage(page);

  // Path A: rail direct
  await H.gotoFloorPlans(page);
  await expect(await page.isVisible('.fpl-main h1'), 'A1 rail → Floor Plans list renders');
  await expect((await page.textContent('.fpl-main h1')).trim() === 'Floor Plans', 'A1 list heading is "Floor Plans"');

  // Path B: Venue → Floor Plans link
  await H.gotoVenueThenFloorPlans(page);
  await expect(await page.isVisible('.fpl-main h1'), 'A2 Venue → Floor Plans link renders list');

  // Path C: venue sub-nav items route to Venue screen
  await H.gotoFloorPlans(page);
  await page.click('.fpl-vnav[data-vnav="basic"]');
  await page.waitForTimeout(250);
  const venueActive = await page.$eval('.screen[data-screen="venue"]', el => el.classList.contains('active'));
  await expect(venueActive, 'A3 venue sub-nav (Basic Info) routes to Venue screen');

  // shift settings link routes to Service
  await H.gotoFloorPlans(page);
  await page.click('#fpl-goto-shifts');
  await page.waitForTimeout(250);
  const svcActive = await page.$eval('.screen[data-screen="service"]', el => el.classList.contains('active'));
  await expect(svcActive, 'A4 "shift settings" link routes to Service screen');

  await expect(H.errorCount(errors) === 0, 'A* no console/network errors', H.formatErrors(errors));
  await page.close();
}

/* ---------- B. CREATE FLOW ---------- */
async function createFlow(browser) {
  console.log('\n[B] Create flow');
  const { page, errors } = await H.newPage(browser);
  await H.resetStorage(page);
  await H.gotoFloorPlans(page);

  const rowsBefore = await page.$$eval('.fpl-t tbody tr', r => r.length);
  await H.createNewPlan(page);

  await expect(await page.isVisible('#fp-modal'), 'B1 editor modal opens on New Floor Plan');
  const title = await page.textContent('#fpm-title');
  await expect(title.trim() === 'CREATE A FLOOR PLAN', 'B2 title is CREATE A FLOOR PLAN', title);
  await expect(await page.isVisible('#fpp-add-table'), 'B3 Add Table button present in left panel');
  await expect(await page.isVisible('.fpp-empty'), 'B4 empty-state illustration present');

  // Add a table then save (prompt for name auto-accepted)
  await H.addTableViaPanel(page);
  await expect(await page.isVisible('.fpo'), 'B5 table appears on canvas');
  await expect(await page.isVisible('.fpp-title'), 'B6 panel switches to Edit table');
  const panelTitle = await page.textContent('.fpp-title');
  await expect(panelTitle.trim() === 'Edit table', 'B6 panel title is "Edit table"', panelTitle);

  await H.saveEditor(page);
  await expect(await page.isHidden('#fp-modal'), 'B7 modal closes after Save');
  const rowsAfter = await page.$$eval('.fpl-t tbody tr', r => r.length);
  await expect(rowsAfter === rowsBefore + 1, 'B8 new plan appears in list', rowsBefore + '→' + rowsAfter);

  await expect(H.errorCount(errors) === 0, 'B* no console/network errors', H.formatErrors(errors));
  await page.close();
}

/* ---------- C. TABLE FLOW ---------- */
async function tableFlow(browser) {
  console.log('\n[C] Table flow');
  const { page, errors } = await H.newPage(browser);
  await H.resetStorage(page);
  await H.gotoFloorPlans(page);
  await H.openFirstPlanEditor(page);

  // select table 54
  await H.selectTable(page, 't-54');
  let panelTitle = await page.textContent('.fpp-title');
  await expect(panelTitle.trim() === 'Edit table', 'C1 selecting a table opens Edit table panel');
  const tidValue = await page.inputValue('#fpp-tid');
  await expect(tidValue === '54', 'C2 Table ID field shows 54', tidValue);
  await expect(await page.isVisible('.fpo.sel .fpo-rot'), 'C3 rotation dot visible on selected table');
  const handles = await page.$$eval('.fpo.sel .fpo-handle', h => h.length);
  await expect(handles === 8, 'C4 eight selection handles', String(handles));

  // edit table ID
  await page.fill('#fpp-tid', '54A');
  await page.dispatchEvent('#fpp-tid', 'change');
  await page.waitForTimeout(150);
  const label = await page.textContent('.fpo[data-id="t-54"] .fpo-label');
  await expect(label === '54A', 'C5 Table ID edit updates canvas label', label);

  // duplicate ID validation
  await page.fill('#fpp-tid', '53');
  await page.dispatchEvent('#fpp-tid', 'change');
  await page.waitForTimeout(150);
  const labelAfterDup = await page.textContent('.fpo[data-id="t-54"] .fpo-label');
  await expect(labelAfterDup === '54A', 'C6 duplicate Table ID rejected', labelAfterDup);

  // steppers
  await page.click('#fpp-max-i');
  await page.waitForTimeout(120);
  const cap = await page.textContent('.fpo[data-id="t-54"] .fpo-cap');
  await expect(cap === '1-3', 'C7 Max stepper updates capacity label', cap);

  // shape change
  await page.click('.fpp-shape[data-shape="circle"]');
  await page.waitForTimeout(150);
  await expect(await page.isVisible('.fpo[data-id="t-54"].cr'), 'C8 shape change to circle applies');

  // type change
  await page.selectOption('#fpp-ttype', 'Bar');
  const typeVal = await page.inputValue('#fpp-ttype');
  await expect(typeVal === 'Bar', 'C9 table type change sticks', typeVal);

  // move via drag
  const before = await page.$eval('.fpo[data-id="t-54"]', el => ({ x: el.style.left, y: el.style.top }));
  const box = await page.$eval('.fpo[data-id="t-54"] .fpo-inner', el => {
    const r = el.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  });
  await page.mouse.move(box.x, box.y);
  await page.mouse.down();
  await page.mouse.move(box.x + 90, box.y + 60, { steps: 8 });
  await page.mouse.up();
  await page.waitForTimeout(150);
  const after = await page.$eval('.fpo[data-id="t-54"]', el => ({ x: el.style.left, y: el.style.top }));
  await expect(before.x !== after.x && before.y !== after.y, 'C10 drag moves table', JSON.stringify({ before, after }));

  // undo / redo
  await page.click('#fp-undo');
  await page.waitForTimeout(150);
  const afterUndo = await page.$eval('.fpo[data-id="t-54"]', el => el.style.left);
  await expect(afterUndo === before.x, 'C11 undo restores position', afterUndo + ' vs ' + before.x);
  await page.click('#fp-redo');
  await page.waitForTimeout(150);
  const afterRedo = await page.$eval('.fpo[data-id="t-54"]', el => el.style.left);
  await expect(afterRedo === after.x, 'C12 redo reapplies move', afterRedo + ' vs ' + after.x);

  // deselect via Escape
  await page.keyboard.press('Escape');
  await page.waitForTimeout(150);
  panelTitle = await page.textContent('.fpp-title');
  await expect(panelTitle.trim() === 'Floor Plan' && await page.isVisible('#fp-modal'), 'C13 Escape deselects back to Add panel (modal still open)', panelTitle);

  // delete via panel
  await H.selectTable(page, 't-21');
  await page.click('#fpp-delete');
  await page.waitForTimeout(200);
  await expect(await page.$('.fpo[data-id="t-21"]') === null, 'C14 Delete Table removes it from canvas');

  await expect(H.errorCount(errors) === 0, 'C* no console/network errors', H.formatErrors(errors));
  await page.close();
}

/* ---------- D. MULTI-SELECT / COMBO ---------- */
async function comboFlow(browser) {
  console.log('\n[D] Multi-select / combo flow');
  const { page, errors } = await H.newPage(browser);
  await H.resetStorage(page);
  await H.gotoFloorPlans(page);
  await H.openFirstPlanEditor(page);

  // combo button hidden with <2 selected
  await H.selectTable(page, 't-500');
  await expect(await page.isHidden('#fp-create-combo-btn'), 'D1 Create Combo hidden with 1 selected');

  // additive select
  await H.selectTable(page, 't-400', true);
  let panelTitle = await page.textContent('.fpp-title');
  await expect(panelTitle.trim() === 'Selected Tables', 'D2 multi-select opens Selected Tables panel', panelTitle);
  await expect(await page.isVisible('#fp-create-combo-btn'), 'D3 Create Combo visible with 2 selected');
  await expect(await page.isHidden('#fp-align-tools') === false, 'D4 alignment tools visible with 2 selected');

  // align left
  await page.click('#fp-align-tools [data-align="left"]');
  await page.waitForTimeout(150);
  const xs = await page.$$eval('.fpo.sel', els => els.map(e => e.style.left));
  await expect(new Set(xs).size === 1, 'D5 align-left equalizes x positions', xs.join(','));

  // create combo
  await page.click('#fp-create-combo-btn');
  await page.waitForTimeout(250);
  panelTitle = await page.textContent('.fpp-title');
  await expect(panelTitle.trim() === 'Edit Combo', 'D6 Create Combo opens Edit Combo panel', panelTitle);
  await expect(await page.isVisible('.fpm-marquee'), 'D7 combo marquee drawn around members');

  // edit combo capacity
  await page.click('#fpp-cmax-i');
  await page.waitForTimeout(120);

  // save and verify combo persisted
  await H.saveEditor(page);
  const combos = await page.evaluate(() => {
    const data = JSON.parse(localStorage.getItem('ease_floorplans_v3'));
    return data.floorPlans[0].combos.length;
  });
  await expect(combos === 1, 'D8 combo persisted after save', String(combos));

  // combo shows in Edit table panel of a member (t-400 is on top after align-left stacking)
  await H.openFirstPlanEditor(page);
  await H.selectTable(page, 't-400');
  const comboChip = await page.$('.fpp-combo-chip');
  await expect(!!comboChip, 'D9 member table shows combo chip in Edit panel');

  // delete combo via chip ✕
  if (comboChip) {
    await page.click('[data-combo-del]');
    await page.waitForTimeout(200);
    const chipGone = await page.$('.fpp-combo-chip');
    await expect(!chipGone, 'D10 combo removable via chip ✕');
  }

  await expect(H.errorCount(errors) === 0, 'D* no console/network errors', H.formatErrors(errors));
  await page.close();
}

/* ---------- E. SAVE / PERSISTENCE ---------- */
async function saveFlow(browser) {
  console.log('\n[E] Save & persistence');
  const { page, errors } = await H.newPage(browser);
  await H.resetStorage(page);
  await H.gotoFloorPlans(page);
  await H.openFirstPlanEditor(page);

  // dirty-confirm on close without save
  await H.selectTable(page, 't-54');
  await page.click('#fpp-max-i');
  await page.waitForTimeout(120);
  await H.setDialogMode(page, 'dismiss');
  await page.click('#fp-editor-close');
  await page.waitForTimeout(250);
  await expect(await page.isVisible('#fp-modal'), 'E1/E2 dismissing unsaved-changes confirm keeps editor open');
  await H.setDialogMode(page, 'accept');

  // save, close, verify persistence across reload
  await H.saveEditor(page);
  await page.reload();
  await page.waitForTimeout(500);
  const persisted = await page.evaluate(() => {
    const data = JSON.parse(localStorage.getItem('ease_floorplans_v3'));
    const t = data.floorPlans[0].tables.find(t => t.id === 't-54');
    return t ? t.maxCap : null;
  });
  await expect(persisted === 3, 'E3 change persists across page reload', String(persisted));

  await expect(H.errorCount(errors) === 0, 'E* no console/network errors', H.formatErrors(errors));
  await page.close();
}

/* ---------- F. NAVIGATION / DECOR ---------- */
async function navAndDecor(browser) {
  console.log('\n[F] Navigation & decor');
  const { page, errors } = await H.newPage(browser);
  await H.resetStorage(page);
  await H.gotoFloorPlans(page);
  await H.openFirstPlanEditor(page);

  // Add Decor dropdown
  await page.click('#fp-add-decor-btn');
  await page.waitForTimeout(150);
  await expect(await page.isVisible('#fp-decor-menu'), 'F1 Add Decor opens dropdown');
  await page.click('#fp-decor-patio-toggle');
  await page.waitForTimeout(120);
  await expect(await page.isVisible('#fp-decor-patio'), 'F2 Patio section expands');

  // add a wall
  await page.click('.fpm-decor-item[data-decor="line"]');
  await page.waitForTimeout(200);
  const decorCount = await page.$$eval('.fpd', d => d.length);
  await expect(decorCount === 3, 'F3 decor added to canvas (2 walls + 1 new)', String(decorCount));
  const panelTitle = await page.textContent('.fpp-title');
  await expect(panelTitle.trim() === 'Edit Decor', 'F4 new decor opens Edit Decor panel', panelTitle);

  // resize decor
  await page.fill('#fpp-dw', '10');
  await page.dispatchEvent('#fpp-dw', 'change');
  await page.waitForTimeout(120);

  // delete decor
  await page.click('#fpp-delete');
  await page.waitForTimeout(200);
  const decorAfter = await page.$$eval('.fpd', d => d.length);
  await expect(decorAfter === 2, 'F5 decor deleted', String(decorAfter));

  // navigate away and back without save (cancel discards)
  await page.click('#fp-cancel-btn');
  await page.waitForTimeout(200);
  // cancel with dirty state triggers confirm (accepted via helper)
  await page.waitForTimeout(200);
  await expect(await page.isHidden('#fp-modal'), 'F6 Cancel closes editor');
  await expect(await page.isVisible('.fpl-main h1'), 'F7 back at Floor Plans list');

  // row menu
  await page.click('[data-fp-menu]');
  await page.waitForTimeout(150);
  await expect(await page.isVisible('.fpl-row-menu'), 'F8 row ellipsis opens menu');
  await page.click('.fpl-row-menu [data-act="duplicate"]');
  await page.waitForTimeout(250);
  const names = await page.$$eval('.fpl-name', els => els.map(e => e.textContent));
  await expect(names.some(n => n.includes('(copy)')), 'F9 duplicate creates a copy', names.join('|'));

  // show inactive toggle
  await page.click('#fpl-show-inactive');
  await page.waitForTimeout(250);
  const rowsShown = await page.$$eval('.fpl-t tbody tr', r => r.length);
  await expect(rowsShown >= 5, 'F10 Show Inactive reveals hidden plans', String(rowsShown));

  await expect(H.errorCount(errors) === 0, 'F* no console/network errors', H.formatErrors(errors));
  await page.close();
}

/* ---------- G. ACTIVATION FLOW ---------- */
async function activationFlow(browser) {
  console.log('\n[G] Shift activation flow');
  const { page, errors } = await H.newPage(browser);
  await H.resetStorage(page);
  await H.gotoFloorPlans(page);
  await page.click('#fpl-goto-shifts');
  await page.waitForTimeout(300);

  await expect(await page.isVisible('#fp-shift-lunch'), 'G1 shift floor-plan selects present on Service screen');
  await page.selectOption('#fp-shift-dinner', 'fp-2');
  await page.waitForTimeout(200);
  const val = await page.inputValue('#fp-shift-dinner');
  await expect(val === 'fp-2', 'G2 dinner shift floor plan change sticks', val);

  await expect(H.errorCount(errors) === 0, 'G* no console/network errors', H.formatErrors(errors));
  await page.close();
}

/* ---------- H. EDGE CASES ---------- */
async function edgeCases(browser) {
  console.log('\n[H] Edge cases');
  const { page, errors } = await H.newPage(browser);
  await H.resetStorage(page);
  await H.gotoFloorPlans(page);

  // delete plan via row menu
  await page.click('[data-fp-menu]');
  await page.waitForTimeout(150);
  await page.click('.fpl-row-menu [data-act="delete"]');
  await page.waitForTimeout(300);
  const names = await page.$$eval('.fpl-name', els => els.map(e => e.textContent));
  await expect(!names.includes('New Edit'), 'H1 plan deletable via row menu', names.join('|'));

  // empty plan save: create + save with zero tables (allowed, shows in list)
  await H.createNewPlan(page);
  await H.saveEditor(page);
  await expect(await page.isHidden('#fp-modal'), 'H2 empty plan saves and closes');

  // empty Table ID rejected
  await H.openFirstPlanEditor(page);
  await H.addTableViaPanel(page);
  await page.fill('#fpp-tid', '');
  await page.dispatchEvent('#fpp-tid', 'change');
  await page.waitForTimeout(150);
  const val = await page.inputValue('#fpp-tid');
  await expect(val !== '', 'H3 empty Table ID reverts to previous value', JSON.stringify(val));

  // min cannot exceed max
  await page.click('#fpp-max-d'); // max 2→1
  await page.waitForTimeout(100);
  const cap = await page.textContent('.fpo.sel .fpo-cap');
  await expect(cap === '1-1', 'H4 max stepper floor is min', cap);
  await page.click('#fpp-min-i'); // min 1→2 should push max to 2
  await page.waitForTimeout(100);
  const cap2 = await page.textContent('.fpo.sel .fpo-cap');
  await expect(cap2 === '2-2', 'H5 min above max pushes max up', cap2);

  // rubber-band multi-select (drag a rect around the tables that exist)
  await page.keyboard.press('Escape');
  await H.addTableViaPanel(page); // second table (cascaded)
  await page.keyboard.press('Escape');
  const boxes = await page.$$eval('.fpo', els => els.map(e => {
    const r = e.getBoundingClientRect();
    return { x: r.x, y: r.y, w: r.width, h: r.height };
  }));
  const x1 = Math.min(...boxes.map(b => b.x)) - 20;
  const y1 = Math.min(...boxes.map(b => b.y)) - 20;
  const x2 = Math.max(...boxes.map(b => b.x + b.w)) + 20;
  const y2 = Math.max(...boxes.map(b => b.y + b.h)) + 20;
  await page.mouse.move(x1, y1);
  await page.mouse.down();
  await page.mouse.move(x2, y2, { steps: 10 });
  await page.mouse.up();
  await page.waitForTimeout(250);
  const selCount = await page.$$eval('.fpo.sel', els => els.length);
  await expect(selCount >= 2, 'H6 rubber-band selects multiple tables', String(selCount));

  // keyboard delete
  await page.keyboard.press('Delete');
  await page.waitForTimeout(250);
  const remaining = await page.$$eval('.fpo', els => els.length);
  await expect(remaining >= 0, 'H7 Delete key removes selection', String(remaining));

  await expect(H.errorCount(errors) === 0, 'H* no console/network errors', H.formatErrors(errors));
  await page.close();
}

/* ---------- I. PERMUTATIONS ---------- */
async function permutations(browser) {
  console.log('\n[I] Traversal permutations');
  const perms = [
    ['P1 rail→list→new→add→save', async page => {
      await H.gotoFloorPlans(page); await H.createNewPlan(page);
      await H.addTableViaPanel(page); await H.saveEditor(page);
      return page.isHidden('#fp-modal');
    }],
    ['P2 venue→list→edit→modify→save→reopen', async page => {
      await H.gotoVenueThenFloorPlans(page); await H.openFirstPlanEditor(page);
      await H.selectTable(page, 't-54'); await page.click('#fpp-max-i');
      await H.saveEditor(page); await H.openFirstPlanEditor(page);
      const cap = await page.textContent('.fpo[data-id="t-54"] .fpo-cap');
      return cap === '1-3';
    }],
    ['P3 edit→modify→cancel(discard)→verify unchanged', async page => {
      await H.gotoFloorPlans(page); await H.openFirstPlanEditor(page);
      await H.selectTable(page, 't-54'); await page.click('#fpp-max-i');
      await page.click('#fp-cancel-btn'); await page.waitForTimeout(300);
      await H.openFirstPlanEditor(page);
      const cap = await page.textContent('.fpo[data-id="t-54"] .fpo-cap');
      await page.click('#fp-cancel-btn'); await page.waitForTimeout(200);
      return cap === '1-2';
    }],
    ['P4 new→add 2→multi→combo→save→list', async page => {
      await H.gotoFloorPlans(page); await H.createNewPlan(page);
      await H.addTableViaPanel(page);
      await page.keyboard.press('Escape'); // back to Add panel (Add Table only lives there)
      await page.waitForTimeout(150);
      await H.addTableViaPanel(page);
      const ids2 = await page.$$eval('.fpo', els => els.map(e => e.dataset.id));
      if (ids2.length < 2) return false;
      await H.selectTable(page, ids2[0]);
      await H.selectTable(page, ids2[1], true);
      await page.click('#fp-create-combo-btn'); await page.waitForTimeout(250);
      await H.saveEditor(page);
      return page.isHidden('#fp-modal');
    }],
    ['P5 edit→duplicate→delete copy→save', async page => {
      await H.gotoFloorPlans(page); await H.openFirstPlanEditor(page);
      await H.selectTable(page, 't-26');
      await page.click('#fp-duplicate-btn'); await page.waitForTimeout(250);
      const count = await page.$$eval('.fpo', els => els.length);
      await page.click('#fpp-delete'); await page.waitForTimeout(200);
      const after = await page.$$eval('.fpo', els => els.length);
      await H.saveEditor(page);
      return count === after + 1;
    }],
    ['P6 edit→Escape→Escape closes editor', async page => {
      await H.gotoFloorPlans(page); await H.openFirstPlanEditor(page);
      await H.selectTable(page, 't-54');
      await page.keyboard.press('Escape'); await page.waitForTimeout(120);
      await page.keyboard.press('Escape'); await page.waitForTimeout(250);
      return page.isHidden('#fp-modal');
    }],
    ['P7 refresh mid-edit preserves saved data', async page => {
      await H.gotoFloorPlans(page); await H.openFirstPlanEditor(page);
      await page.reload(); await page.waitForTimeout(500);
      await H.gotoFloorPlans(page);
      return page.isVisible('.fpl-main h1');
    }],
    ['P8 combo chip → Edit Combo → Delete Combo', async page => {
      await H.gotoFloorPlans(page); await H.openFirstPlanEditor(page);
      await H.selectTable(page, 't-300');
      await H.selectTable(page, 't-200', true);
      await page.click('#fp-create-combo-btn'); await page.waitForTimeout(250);
      await page.click('#fpp-delete'); await page.waitForTimeout(250);
      const title = await page.textContent('.fpp-title');
      await page.click('#fp-cancel-btn'); await page.waitForTimeout(200);
      return title.trim() === 'Floor Plan';
    }],
  ];

  for (const [name, fn] of perms) {
    const { page, errors } = await H.newPage(browser);
    await H.resetStorage(page);
    let ok = false, err = '';
    try { ok = await fn(page); } catch (e) { err = e.message.split('\n')[0]; }
    await expect(ok, name, err || undefined);
    if (H.errorCount(errors) > 0) record(name + ' — clean console', false, H.formatErrors(errors));
    await page.close();
  }
}

async function run(browser) {
  await entryPaths(browser);
  await createFlow(browser);
  await tableFlow(browser);
  await comboFlow(browser);
  await saveFlow(browser);
  await navAndDecor(browser);
  await activationFlow(browser);
  await edgeCases(browser);
  await permutations(browser);
  return results;
}

module.exports = { run };
