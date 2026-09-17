// Shared helpers for the floor-plan QA suite.
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const APP = 'file://' + path.resolve(__dirname, '..', 'index.html');
const ARTIFACTS = path.join(__dirname, 'artifacts');
const SHOTS = path.join(ARTIFACTS, 'screenshots');

function ensureDirs() {
  fs.mkdirSync(SHOTS, { recursive: true });
  fs.mkdirSync(path.join(ARTIFACTS, 'reports'), { recursive: true });
}

async function launch() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  return browser;
}

async function newPage(browser, opts) {
  const page = await browser.newPage(Object.assign({ viewport: { width: 1440, height: 900 } }, opts));
  const errors = { console: [], pageerror: [], requestfailed: [], badResponses: [] };
  page.on('console', m => { if (m.type() === 'error') errors.console.push(m.text()); });
  page.on('pageerror', e => errors.pageerror.push(e.message));
  page.on('requestfailed', r => errors.requestfailed.push(r.url() + ' :: ' + ((r.failure() || {}).errorText || '')));
  page.on('response', r => { if (r.status() >= 400) errors.badResponses.push(r.status() + ' ' + r.url()); });
  page.on('dialog', async d => { await d.accept(); });
  page._dialogMode = 'accept';
  await page.goto(APP);
  await page.waitForTimeout(500);
  return { page, errors };
}

// Switch how native dialogs (confirm/prompt) are handled
async function setDialogMode(page, mode) {
  page._dialogMode = mode;
  // remove all existing dialog listeners, add the mode-appropriate one
  page.removeAllListeners('dialog');
  if (mode === 'dismiss') page.on('dialog', async d => { await d.dismiss(); });
  else page.on('dialog', async d => { await d.accept(); });
}

async function resetStorage(page) {
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForTimeout(500);
}

async function shot(page, name) {
  await page.screenshot({ path: path.join(SHOTS, name + '.png') });
}

// Navigate via rail
async function gotoFloorPlans(page) {
  await page.click('.rail-item[data-screen="floorplan"]');
  await page.waitForTimeout(300);
}

async function gotoVenueThenFloorPlans(page) {
  await page.click('.rail-item[data-screen="venue"]');
  await page.waitForTimeout(250);
  await page.click('#venue-to-floorplans');
  await page.waitForTimeout(300);
}

async function openFirstPlanEditor(page) {
  await page.click('[data-fp-edit]');
  await page.waitForTimeout(400);
}

async function createNewPlan(page) {
  await page.click('#fp-new-btn');
  await page.waitForTimeout(400);
}

async function addTableViaPanel(page) {
  await page.click('#fpp-add-table');
  await page.waitForTimeout(250);
}

// Click a canvas table by its data-id
async function selectTable(page, id, additive) {
  if (additive) await page.keyboard.down('Meta');
  await page.click('.fpo[data-id="' + id + '"]');
  if (additive) await page.keyboard.up('Meta');
  await page.waitForTimeout(150);
}

async function saveEditor(page) {
  await page.click('#fp-save-btn');
  await page.waitForTimeout(400);
}

async function closeEditor(page) {
  await page.click('#fp-editor-close');
  await page.waitForTimeout(300);
}

function errorCount(errors) {
  return errors.console.length + errors.pageerror.length + errors.requestfailed.length + errors.badResponses.length;
}

function formatErrors(errors) {
  const out = [];
  errors.console.forEach(e => out.push('  [console.error] ' + e));
  errors.pageerror.forEach(e => out.push('  [pageerror] ' + e));
  errors.requestfailed.forEach(e => out.push('  [requestfailed] ' + e));
  errors.badResponses.forEach(e => out.push('  [http] ' + e));
  return out.join('\n');
}

module.exports = {
  APP, ARTIFACTS, SHOTS,
  ensureDirs, launch, newPage, resetStorage, shot, setDialogMode,
  gotoFloorPlans, gotoVenueThenFloorPlans, openFirstPlanEditor,
  createNewPlan, addTableViaPanel, selectTable, saveEditor, closeEditor,
  errorCount, formatErrors,
};
