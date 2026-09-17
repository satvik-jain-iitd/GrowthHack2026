// Broken-interaction audit: scans every screen + the editor for dead controls,
// bad hrefs, broken images, and console/network failures.
const H = require('./helpers');

const results = [];
function record(name, pass, detail) {
  results.push({ name, pass, detail: detail || '' });
  console.log((pass ? '  PASS ' : '  FAIL ') + name + (detail ? ' — ' + detail : ''));
}

async function auditDom(page, scopeName) {
  return page.evaluate(scope => {
    const problems = [];
    const root = document;

    // links with href="#"
    root.querySelectorAll('a[href="#"]').forEach(a => {
      const hasHandler = a.id || a.dataset.guide || a.onclick;
      if (!hasHandler) problems.push(scope + ': <a href="#"> without id/handler: "' + a.textContent.trim().slice(0, 40) + '"');
    });

    // buttons with no id, no data-*, no class hook — likely dead
    root.querySelectorAll('button').forEach(b => {
      if (b.disabled) return;
      const identifiable = b.id || b.dataset.screen || b.dataset.tool || b.dataset.action ||
        b.dataset.guide || b.dataset.markbtn || b.dataset.wstep || b.dataset.fpEdit ||
        b.dataset.fpMenu || b.dataset.vnav || b.dataset.decor || b.dataset.align ||
        b.dataset.shape || b.dataset.combo || b.dataset.comboDel || b.className;
      if (!identifiable) problems.push(scope + ': anonymous <button>: "' + b.textContent.trim().slice(0, 40) + '"');
    });

    // images
    const imgs = [...root.querySelectorAll('img')];
    const broken = imgs.filter(i => i.complete && i.naturalWidth === 0);
    broken.forEach(i => problems.push(scope + ': broken <img>: ' + (i.src || '').slice(0, 80)));

    // selects with no options
    root.querySelectorAll('select').forEach(s => {
      if (s.options.length === 0) problems.push(scope + ': empty <select> #' + s.id);
    });

    return { problems, counts: {
      buttons: root.querySelectorAll('button').length,
      links: root.querySelectorAll('a').length,
      inputs: root.querySelectorAll('input').length,
      selects: root.querySelectorAll('select').length,
      images: imgs.length,
    }};
  }, scopeName);
}

async function run(browser) {
  console.log('\n[Audit] Broken-interaction audit');
  const { page, errors } = await H.newPage(browser);
  await H.resetStorage(page);

  const totals = { buttons: 0, links: 0, inputs: 0, selects: 0, images: 0 };
  const allProblems = [];

  // every app screen
  const screens = ['timeline', 'floorplan', 'service', 'guests', 'venue', 'analytics', 'users', 'golive', 'docs'];
  for (const s of screens) {
    await page.click('.rail-item[data-screen="' + s + '"]');
    await page.waitForTimeout(300);
    const r = await auditDom(page, 'screen:' + s);
    allProblems.push(...r.problems);
    Object.keys(totals).forEach(k => totals[k] += r.counts[k]);
  }

  // editor: add-panel state
  await H.gotoFloorPlans(page);
  await H.openFirstPlanEditor(page);
  let r = await auditDom(page, 'editor:add');
  allProblems.push(...r.problems);
  Object.keys(totals).forEach(k => totals[k] += r.counts[k]);

  // editor: edit-table state
  await H.selectTable(page, 't-54');
  r = await auditDom(page, 'editor:edit-table');
  allProblems.push(...r.problems);

  // editor: multi state
  await H.selectTable(page, 't-53', true);
  r = await auditDom(page, 'editor:multi');
  allProblems.push(...r.problems);

  // editor: combo state
  await page.click('#fp-create-combo-btn');
  await page.waitForTimeout(250);
  r = await auditDom(page, 'editor:combo');
  allProblems.push(...r.problems);

  // editor: decor menu open
  await page.click('#fp-add-decor-btn');
  await page.waitForTimeout(150);
  r = await auditDom(page, 'editor:decor-menu');
  allProblems.push(...r.problems);

  // shift wizard dialog
  await page.click('#fp-cancel-btn');
  await page.waitForTimeout(300);
  await page.click('.rail-item[data-screen="service"]');
  await page.waitForTimeout(250);
  await page.click('#shift-new');
  await page.waitForTimeout(300);
  r = await auditDom(page, 'dialog:shift-wizard');
  allProblems.push(...r.problems);
  await page.click('#wizard-cancel');
  await page.waitForTimeout(200);

  // user modal
  await page.click('.rail-item[data-screen="users"]');
  await page.waitForTimeout(250);
  await page.click('#users-add');
  await page.waitForTimeout(250);
  r = await auditDom(page, 'dialog:add-user');
  allProblems.push(...r.problems);
  await page.click('#user-cancel');
  await page.waitForTimeout(200);

  // assistant panel
  await page.click('#assist-launch');
  await page.waitForTimeout(300);
  r = await auditDom(page, 'assistant');
  allProblems.push(...r.problems);

  record('audit: DOM control scan (' + totals.buttons + ' buttons, ' + totals.links + ' links, ' +
    totals.inputs + ' inputs, ' + totals.selects + ' selects, ' + totals.images + ' images)',
    allProblems.length === 0, allProblems.length ? allProblems.slice(0, 10).join(' | ') : totals.buttons + ' buttons verified');

  record('audit: zero console errors', errors.console.length === 0, errors.console.slice(0, 5).join(' | '));
  record('audit: zero page exceptions', errors.pageerror.length === 0, errors.pageerror.slice(0, 5).join(' | '));
  record('audit: zero failed requests', errors.requestfailed.length === 0, errors.requestfailed.slice(0, 5).join(' | '));
  record('audit: zero HTTP 4xx/5xx', errors.badResponses.length === 0, errors.badResponses.slice(0, 5).join(' | '));

  // walkthrough anchors self-check
  const missing = await page.evaluate(() => window.selfcheck ? window.selfcheck() : ['selfcheck-missing']);
  record('audit: walkthrough anchors resolve', Array.isArray(missing) && missing.length === 0,
    Array.isArray(missing) ? missing.join(',') : String(missing));

  await page.close();
  return results;
}

module.exports = { run };
