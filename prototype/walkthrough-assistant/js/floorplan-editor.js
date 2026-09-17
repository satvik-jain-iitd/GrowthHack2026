/* ============================================================
   Floor Plan Editor — faithful reconstruction of the Resy
   "Floor Plan Web Editor" journey (see assets/resy-reference).
   Vanilla JS, localStorage persistence, zero build.
   ============================================================ */
(function () {
  'use strict';

  const $ = id => document.getElementById(id);

  /* ================= STATE ================= */
  const STORAGE_KEY = 'ease_floorplans_v3';

  const TABLE_TYPES = ['Dining Room', 'Bar', 'Patio', 'High Top'];
  const SHAPES = ['square', 'rect', 'ellipse', 'circle'];
  const SHAPE_CLASS = { square: 'sq', rect: 'rt', ellipse: 'el', circle: 'cr' };
  const SHAPE_SIZE = {
    square: { w: 44, h: 44 },
    rect: { w: 120, h: 52 },
    ellipse: { w: 56, h: 42 },
    circle: { w: 44, h: 44 },
  };
  const CANVAS_W = 1240, CANVAS_H = 820;

  let state = {
    floorPlans: [],
    currentPlanId: null,
    mode: 'edit',            // 'create' | 'edit'
    panel: 'add',            // 'add' | 'edit' | 'multi' | 'combo' | 'decor'
    selection: [],           // table ids
    decorSelection: null,    // decor id
    activeComboId: null,
    dirty: false,
    history: [],
    historyIdx: -1,
    showInactive: false,
  };

  /* ================= PERSISTENCE ================= */
  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.floorPlans) && parsed.floorPlans.length) {
          state.floorPlans = parsed.floorPlans;
          return;
        }
      }
    } catch (e) { /* ignore */ }
    seedDefaultPlans();
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ floorPlans: state.floorPlans }));
    } catch (e) { /* ignore */ }
  }

  function seedDefaultPlans() {
    const sq = (label, x, y, min, max, rot) => ({
      id: 't-' + label, label, type: 'Dining Room', shape: 'square',
      x, y, w: 44, h: 44, rotation: rot || 0, minCap: min, maxCap: max,
    });
    const big = (label, x, y) => ({
      id: 't-' + label, label, type: 'Dining Room', shape: 'rect',
      x, y, w: 120, h: 52, rotation: 0, minCap: 4, maxCap: 6,
    });
state.floorPlans = [
      {
        id: 'fp-1', name: 'Dining Room', active: true,
        createdAt: 'April 23rd, 2026', updatedAt: 'September 12th, 2026',
        appliedTo: { shifts: ['Sun-Thu Dinner', 'Fri-Sat Dinner', 'Tue-Fri Lunch'], singleDayEdits: 5 },
        tables: [
          sq('54', 60, 100, 1, 2), sq('53', 130, 100, 1, 2), sq('52', 200, 100, 1, 2), sq('51', 270, 100, 1, 2),
          sq('64', 60, 190, 3, 4, 45), sq('63', 130, 190, 3, 4, 45), sq('62', 200, 190, 3, 4, 45), sq('61', 270, 190, 3, 4, 45),
          sq('74', 60, 280, 2, 4, 45), sq('73', 130, 280, 2, 4, 45), sq('72', 200, 280, 2, 4, 45), sq('71', 270, 280, 2, 4, 45),
          sq('26', 400, 100, 5, 6), sq('25', 465, 100, 1, 2), sq('24', 530, 100, 1, 2), sq('23', 595, 100, 1, 2), sq('22', 660, 100, 1, 2), sq('21', 725, 100, 1, 2),
          sq('34', 400, 190, 2, 4), sq('33', 510, 190, 2, 4), sq('32', 650, 190, 2, 4), sq('31', 760, 190, 2, 4),
          sq('43', 440, 280, 3, 4), sq('42', 580, 280, 3, 4), sq('41', 700, 280, 3, 4),
          big('500', 60, 460), big('400', 220, 460), big('300', 400, 460), big('200', 560, 460), big('100', 720, 460),
        ],
        decor: [
          { id: 'd-wall-1', kind: 'line', x: 350, y: 80, w: 5, h: 300, rotation: 0 },
          { id: 'd-wall-2', kind: 'line', x: 40, y: 380, w: 300, h: 5, rotation: 0 },
        ],
        combos: [],
      },
      {
        id: 'fp-2', name: 'The Tavern', active: true,
        createdAt: 'April 2nd, 2026', updatedAt: 'September 8th, 2026',
        appliedTo: { shifts: ['Mon-Sun Tavern All-Day'], singleDayEdits: 2 },
        tables: [
          sq('1', 120, 140, 2, 4), sq('2', 200, 140, 2, 4), sq('3', 280, 140, 2, 4),
          sq('4', 120, 230, 2, 4), sq('5', 200, 230, 2, 4), sq('6', 280, 230, 2, 4),
          { id: 't-7', label: '7', type: 'Bar', shape: 'circle', x: 200, y: 330, w: 44, h: 44, rotation: 0, minCap: 2, maxCap: 2 },
        ],
        decor: [{ id: 'd-umb-1', kind: 'umbrella', x: 182, y: 122, w: 40, h: 40, rotation: 0 }],
        combos: [],
      },
      {
        id: 'fp-3', name: 'Private Dining Room', active: true,
        createdAt: 'September 1st, 2026', updatedAt: 'September 1st, 2026',
        appliedTo: { shifts: [], singleDayEdits: 0 },
        tables: [], decor: [], combos: [],
      },
      {
        id: 'fp-4', name: 'Holiday 2025 Layout', active: false,
        createdAt: 'November 18th, 2025', updatedAt: 'January 4th, 2026',
        appliedTo: { shifts: [], singleDayEdits: 0 },
        tables: [sq('1', 120, 140, 2, 4), sq('2', 200, 140, 2, 4)],
        decor: [], combos: [],
      },
    ];
    saveState();
  }

  function getPlan(id) {
    return state.floorPlans.find(p => p.id === (id || state.currentPlanId)) || null;
  }

  function uid(prefix) {
    return (prefix || 'x') + '-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }

  function nextTableLabel(plan) {
    const used = new Set(plan.tables.map(t => parseInt(t.label, 10)).filter(n => !isNaN(n)));
    let n = 1;
    while (used.has(n)) n++;
    return String(n);
  }

  /* ================= TOAST ================= */
  let toastEl = null, toastTimer = null;
  function showToast(msg, type) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'fp-toast';
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.className = 'fp-toast show ' + (type || 'ok');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2200);
  }

  /* ================= HISTORY (undo/redo) ================= */
  function snapshot(plan) {
    return JSON.stringify({ tables: plan.tables, decor: plan.decor, combos: plan.combos });
  }
  function pushHistory() {
    const plan = getPlan();
    if (!plan) return;
    state.history = state.history.slice(0, state.historyIdx + 1);
    state.history.push(snapshot(plan));
    if (state.history.length > 60) state.history.shift();
    state.historyIdx = state.history.length - 1;
    syncHistoryButtons();
  }
  function restoreHistory(idx) {
    const plan = getPlan();
    if (!plan || idx < 0 || idx >= state.history.length) return;
    const snap = JSON.parse(state.history[idx]);
    plan.tables = snap.tables;
    plan.decor = snap.decor;
    plan.combos = snap.combos;
    state.historyIdx = idx;
    state.dirty = true;
    // Preserve selection across undo/redo (drop ids that no longer exist)
    state.selection = state.selection.filter(id => plan.tables.some(t => t.id === id));
    if (state.decorSelection && !plan.decor.some(d => d.id === state.decorSelection)) state.decorSelection = null;
    if (state.activeComboId && !plan.combos.some(c => c.id === state.activeComboId)) state.activeComboId = null;
    state.panel = state.decorSelection ? 'decor'
      : state.activeComboId ? 'combo'
      : state.selection.length === 0 ? 'add'
      : state.selection.length === 1 ? 'edit' : 'multi';
    syncHistoryButtons();
    renderCanvas();
    renderPanel();
    syncChrome();
  }
  function undo() { if (state.historyIdx > 0) restoreHistory(state.historyIdx - 1); }
  function redo() { if (state.historyIdx < state.history.length - 1) restoreHistory(state.historyIdx + 1); }
  function syncHistoryButtons() {
    const u = $('fp-undo'), r = $('fp-redo');
    if (u) u.disabled = state.historyIdx <= 0;
    if (r) r.disabled = state.historyIdx >= state.history.length - 1;
  }

  /* ================= LIST ================= */
  function renderList() {
    const container = $('fp-list-container');
    if (!container) return;

    const plans = state.floorPlans.filter(p => p.active || state.showInactive);
    if (!plans.length) {
      container.innerHTML = '<div class="fpl-empty">No floor plans yet. Click "New Floor Plan" to get started.</div>';
      return;
    }

    let html = '<table class="fpl-t"><thead><tr>' +
      '<th>Floor Plan Name <span class="sort">↑</span></th>' +
      '<th>Tables</th>' +
      '<th>Applied To</th>' +
      '<th>Date Created <span class="sort">↑</span></th>' +
      '<th></th>' +
      '</tr></thead><tbody>';

    plans.forEach(p => {
      const shifts = (p.appliedTo && p.appliedTo.shifts && p.appliedTo.shifts.length)
        ? '<div class="fpl-cell-main"><b>Active Shifts:</b> ' +
          p.appliedTo.shifts.map(s => '<span class="fpl-link" data-goto-shifts>' + s + '</span>').join(', ') + '</div>'
        : '<div class="fpl-cell-main" style="color:#B3B7BE">Not applied to any shifts</div>';
      const sde = p.appliedTo && p.appliedTo.singleDayEdits
        ? '<div class="fpl-cell-sub">Single Day Edits: ' + p.appliedTo.singleDayEdits + '</div>' : '';
      html += '<tr>' +
        '<td><div class="fpl-name">' + esc(p.name) + '</div><div class="fpl-sub">Last edited: ' + p.updatedAt + '</div></td>' +
        '<td><div class="fpl-cell-main fpl-cell-nowrap">Tables: ' + p.tables.length + '</div><div class="fpl-cell-sub fpl-cell-nowrap">Combos: ' + p.combos.length + '</div></td>' +
        '<td>' + shifts + sde + '</td>' +
        '<td><div class="fpl-cell-main fpl-cell-nowrap" style="color:#8A8F98">' + p.createdAt + '</div></td>' +
        '<td class="fpl-row-actions">' +
          '<button class="fpl-icon-btn" data-fp-edit="' + p.id + '" title="Edit floor plan">✎</button>' +
          '<button class="fpl-icon-btn" data-fp-menu="' + p.id + '" title="More options">⋯</button>' +
        '</td>' +
      '</tr>';
    });
    html += '</tbody></table>';
    container.innerHTML = html;

    container.querySelectorAll('[data-fp-edit]').forEach(b => {
      b.onclick = () => openEditor(b.dataset.fpEdit);
    });
    container.querySelectorAll('[data-fp-menu]').forEach(b => {
      b.onclick = e => { e.stopPropagation(); openRowMenu(b, b.dataset.fpMenu); };
    });
    container.querySelectorAll('[data-goto-shifts]').forEach(l => {
      l.onclick = () => gotoShiftSettings();
    });
  }

  let rowMenuEl = null;
  function closeRowMenu() { if (rowMenuEl) { rowMenuEl.remove(); rowMenuEl = null; } }
  document.addEventListener('click', closeRowMenu);

  function openRowMenu(anchorBtn, planId) {
    closeRowMenu();
    const plan = getPlan(planId);
    if (!plan) return;
    const r = anchorBtn.getBoundingClientRect();
    rowMenuEl = document.createElement('div');
    rowMenuEl.className = 'fpl-row-menu';
    rowMenuEl.innerHTML =
      '<button data-act="edit">Edit</button>' +
      '<button data-act="duplicate">Duplicate</button>' +
      '<button data-act="toggle">' + (plan.active ? 'Deactivate' : 'Activate') + '</button>' +
      '<button data-act="delete" class="danger">Delete</button>';
    rowMenuEl.style.left = Math.min(r.left, window.innerWidth - 180) + 'px';
    rowMenuEl.style.top = (r.bottom + 4) + 'px';
    rowMenuEl.style.position = 'fixed';
    document.body.appendChild(rowMenuEl);
    rowMenuEl.querySelectorAll('button').forEach(b => {
      b.onclick = () => {
        const act = b.dataset.act;
        closeRowMenu();
        if (act === 'edit') openEditor(planId);
        else if (act === 'duplicate') duplicatePlan(planId);
        else if (act === 'toggle') { plan.active = !plan.active; saveState(); renderList(); }
        else if (act === 'delete') deletePlan(planId);
      };
    });
  }

  function createFloorPlan() {
    const id = uid('fp');
    const plan = {
      id, name: 'Untitled Floor Plan', active: true,
      createdAt: fmtDate(new Date()), updatedAt: fmtDate(new Date()),
      appliedTo: { shifts: [], singleDayEdits: 0 },
      tables: [], decor: [], combos: [],
    };
    state.floorPlans.unshift(plan);
    saveState();
    openEditor(id, 'create');
  }

  function duplicatePlan(planId) {
    const src = getPlan(planId);
    if (!src) return;
    const copy = JSON.parse(JSON.stringify(src));
    copy.id = uid('fp');
    copy.name = src.name + ' (copy)';
    copy.createdAt = fmtDate(new Date());
    copy.updatedAt = fmtDate(new Date());
    copy.appliedTo = { shifts: [], singleDayEdits: 0 };
    copy.tables.forEach(t => { t.id = uid('t'); });
    copy.decor.forEach(d => { d.id = uid('d'); });
    copy.combos = [];
    state.floorPlans.unshift(copy);
    saveState();
    renderList();
    showToast('Floor plan duplicated', 'ok');
  }

  function deletePlan(planId) {
    const plan = getPlan(planId);
    if (!plan) return;
    if (!confirm('Delete "' + plan.name + '"? This cannot be undone.')) return;
    state.floorPlans = state.floorPlans.filter(p => p.id !== planId);
    saveState();
    renderList();
    showToast('Floor plan deleted', 'ok');
  }

  function fmtDate(d) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const day = d.getDate();
    const suffix = day === 1 || day === 21 || day === 31 ? 'st' : day === 2 || day === 22 ? 'nd' : day === 3 || day === 23 ? 'rd' : 'th';
    return months[d.getMonth()] + ' ' + day + suffix + ', ' + d.getFullYear();
  }

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function gotoShiftSettings() {
    if (window.App) window.App.setScreen('service');
    showToast('Select a floor plan for each shift below', 'ok');
  }

  /* ================= EDITOR OPEN/CLOSE ================= */
  function openEditor(planId, mode) {
    state.currentPlanId = planId;
    state.mode = mode || 'edit';
    state.panel = 'add';
    state.selection = [];
    state.decorSelection = null;
    state.activeComboId = null;
    state.dirty = false;
    state.history = [];
    state.historyIdx = -1;

    const plan = getPlan();
    if (!plan) return;

    // Backup so Cancel can discard in-memory edits
    state.backup = snapshot(plan);

    $('fpm-title').textContent = state.mode === 'create' ? 'CREATE A FLOOR PLAN' : 'EDIT FLOOR PLAN';
    $('fp-modal').hidden = false;
    document.body.style.overflow = 'hidden';

    pushHistory();
    state.dirty = false;
    renderPanel();
    renderCanvas();
    renderTips();
    syncChrome();
  }

  function closeEditor(force, saveChanges) {
    if (!force && state.dirty) {
      if (!confirm('You have unsaved changes. Discard them?')) return;
    }
    if (!saveChanges && state.backup) {
      // Discard: restore the plan to its state when the editor opened
      const plan = getPlan();
      if (plan) {
        const snap = JSON.parse(state.backup);
        plan.tables = snap.tables;
        plan.decor = snap.decor;
        plan.combos = snap.combos;
      }
    }
    state.backup = null;
    $('fp-modal').hidden = true;
    document.body.style.overflow = '';
    state.selection = [];
    state.decorSelection = null;
    renderList();
  }

  function saveEditor() {
    const plan = getPlan();
    if (!plan) return;

    // Validation: unique table IDs
    const labels = plan.tables.map(t => t.label.trim());
    const seen = new Set();
    const dups = new Set();
    labels.forEach(l => { if (seen.has(l)) dups.add(l); seen.add(l); });
    if (dups.size) {
      showToast('Table IDs must be unique: ' + [...dups].join(', '), 'err');
      return;
    }
    if (labels.some(l => !l)) {
      showToast('Table ID cannot be empty', 'err');
      return;
    }

    // Create mode: name the plan
    if (state.mode === 'create' && plan.name === 'Untitled Floor Plan') {
      const name = prompt('Name your floor plan:', 'New Floor Plan');
      if (name && name.trim()) plan.name = name.trim();
    }

    plan.updatedAt = fmtDate(new Date());
    state.dirty = false;
    saveState();
    showToast('Floor plan saved', 'ok');
    closeEditor(true, true);
  }

  /* ================= CHROME (tools bar) ================= */
  function syncChrome() {
    const dup = $('fp-duplicate-btn');
    const comboBtn = $('fp-create-combo-btn');
    const align = $('fp-align-tools');
    const hasSel = state.selection.length > 0 || !!state.decorSelection;
    if (dup) dup.disabled = !hasSel;
    const multi = state.selection.length >= 2;
    if (comboBtn) comboBtn.hidden = !multi;
    if (align) align.hidden = !multi;
  }

  /* ================= PANEL ================= */
  function renderPanel() {
    const panel = $('fp-panel');
    if (!panel) return;
    const plan = getPlan();
    if (!plan) { panel.innerHTML = ''; return; }

    if (state.panel === 'add') return renderPanelAdd(panel, plan);
    if (state.panel === 'edit') return renderPanelEdit(panel, plan);
    if (state.panel === 'multi') return renderPanelMulti(panel, plan);
    if (state.panel === 'combo') return renderPanelCombo(panel, plan);
    if (state.panel === 'decor') return renderPanelDecor(panel, plan);
  }

  function renderPanelAdd(panel, plan) {
    const empty = plan.tables.length === 0 && plan.decor.length === 0;
    panel.innerHTML =
      '<h2 class="fpp-title">Floor Plan</h2>' +
      '<button class="fpp-add-table" id="fpp-add-table">Add Table</button>' +
      (empty
        ? '<div class="fpp-empty"><div class="fpp-empty-illus"></div>' +
          '<h4>Ready to get started with your floor plan?</h4>' +
          '<p>Click "Add Table" above to begin adding tables to your floor plan.</p></div>'
        : '');
    $('fpp-add-table').onclick = addTable;
  }

  function renderPanelEdit(panel, plan) {
    const t = plan.tables.find(t => t.id === state.selection[0]);
    if (!t) { state.panel = 'add'; return renderPanel(); }
    const combosWith = plan.combos.filter(c => c.tableIds.includes(t.id));

    panel.innerHTML =
      '<button class="fpp-back" id="fpp-back">‹ Back</button>' +
      '<h2 class="fpp-title">Edit table</h2>' +
      '<div class="fpp-field">' +
        '<div class="fpp-label">Table ID <span class="fpp-info" title="Must be unique on this floor plan">i</span></div>' +
        '<div class="fpp-input-wrap"><input class="fpp-input" id="fpp-tid" maxlength="40" value="' + esc(t.label) + '">' +
        '<span class="fpp-count" id="fpp-tid-count">' + t.label.length + '/40</span></div>' +
      '</div>' +
      '<div class="fpp-field">' +
        '<div class="fpp-label">Table Type <span class="fpp-info" title="Used as the reservation display name">i</span></div>' +
        '<select class="fpp-select" id="fpp-ttype">' +
          TABLE_TYPES.map(ty => '<option' + (t.type === ty ? ' selected' : '') + '>' + ty + '</option>').join('') +
        '</select>' +
      '</div>' +
      '<div class="fpp-field"><div class="fpp-stepper-row">' +
        '<div class="fpp-stepper-col"><div class="fpp-label">Min</div>' +
          '<div class="fpp-stepper"><button id="fpp-min-d">−</button><span class="val" id="fpp-min-v">' + t.minCap + '</span><button id="fpp-min-i">+</button></div></div>' +
        '<div class="fpp-stepper-col"><div class="fpp-label">Max</div>' +
          '<div class="fpp-stepper"><button id="fpp-max-d">−</button><span class="val" id="fpp-max-v">' + t.maxCap + '</span><button id="fpp-max-i">+</button></div></div>' +
      '</div></div>' +
      '<div class="fpp-field">' +
        '<div class="fpp-label">Shape</div>' +
        '<div class="fpp-shapes">' +
          SHAPES.map(s =>
            '<button class="fpp-shape' + (t.shape === s ? ' on' : '') + '" data-shape="' + s + '" title="' + s + '">' +
            '<span class="sh-' + s + '"></span></button>').join('') +
        '</div>' +
      '</div>' +
      '<div class="fpp-combos"><h4>Combos</h4>' +
        (combosWith.length
          ? combosWith.map(c =>
              '<button class="fpp-combo-chip" data-combo="' + c.id + '">' +
              '<span>' + comboLabel(plan, c) + ' · ' + c.minCap + '-' + c.maxCap + '</span>' +
              '<span class="x" data-combo-del="' + c.id + '">✕</span></button>').join('')
          : '<p>No combos have been created with the table selected.</p><p style="margin-top:6px">Select another table to create a combo.</p>') +
      '</div>' +
      '<button class="fpp-delete" id="fpp-delete">🗑 Delete Table</button>';

    $('fpp-back').onclick = () => { state.selection = []; state.panel = 'add'; renderPanel(); renderCanvas(); syncChrome(); };
    $('fpp-tid').oninput = e => {
      $('fpp-tid-count').textContent = e.target.value.length + '/40';
    };
    $('fpp-tid').onchange = e => {
      const v = e.target.value.trim();
      if (!v) { showToast('Table ID cannot be empty', 'err'); e.target.value = t.label; return; }
      if (plan.tables.some(o => o.id !== t.id && o.label === v)) {
        showToast('Table ID "' + v + '" already exists', 'err'); e.target.value = t.label; return;
      }
      t.label = v; markDirty();
      $('fpp-tid-count').textContent = v.length + '/40';
      renderCanvas();
    };
    $('fpp-ttype').onchange = e => { t.type = e.target.value; markDirty(); };
    $('fpp-min-d').onclick = () => { if (t.minCap > 1) { t.minCap--; markDirty(); renderPanel(); renderCanvas(); } };
    $('fpp-min-i').onclick = () => { if (t.minCap < 40) { t.minCap++; if (t.maxCap < t.minCap) t.maxCap = t.minCap; markDirty(); renderPanel(); renderCanvas(); } };
    $('fpp-max-d').onclick = () => { if (t.maxCap > t.minCap) { t.maxCap--; markDirty(); renderPanel(); renderCanvas(); } };
    $('fpp-max-i').onclick = () => { if (t.maxCap < 40) { t.maxCap++; markDirty(); renderPanel(); renderCanvas(); } };
    panel.querySelectorAll('[data-shape]').forEach(b => {
      b.onclick = () => {
        t.shape = b.dataset.shape;
        const size = SHAPE_SIZE[t.shape];
        t.w = size.w; t.h = size.h;
        markDirty(); renderPanel(); renderCanvas();
      };
    });
    panel.querySelectorAll('[data-combo]').forEach(b => {
      b.onclick = e => {
        if (e.target.dataset.comboDel) return;
        state.activeComboId = b.dataset.combo;
        state.panel = 'combo';
        state.selection = [];
        renderPanel(); renderCanvas(); syncChrome();
      };
    });
    panel.querySelectorAll('[data-combo-del]').forEach(x => {
      x.onclick = e => {
        e.stopPropagation();
        plan.combos = plan.combos.filter(c => c.id !== x.dataset.comboDel);
        markDirty(); renderPanel(); renderCanvas();
        showToast('Combo removed', 'ok');
      };
    });
    $('fpp-delete').onclick = () => deleteSelectedTables();
  }

  function renderPanelMulti(panel, plan) {
    const tables = state.selection.map(id => plan.tables.find(t => t.id === id)).filter(Boolean);
    panel.innerHTML =
      '<button class="fpp-back" id="fpp-back">‹ Back</button>' +
      '<h2 class="fpp-title">Selected Tables</h2>' +
      tables.map(t =>
        '<div class="fpp-member"><span class="mi"></span>' + esc(t.label) +
        '<span class="cap">' + t.minCap + '-' + t.maxCap + '</span></div>').join('') +
      '<div class="fpp-combos"><h4>Combos</h4>' +
        '<p>No combos have been created with all selected tables.</p>' +
      '</div>' +
      '<button class="fpp-delete" id="fpp-delete">🗑 Delete Tables</button>';

    $('fpp-back').onclick = () => { state.selection = []; state.panel = 'add'; renderPanel(); renderCanvas(); syncChrome(); };
    $('fpp-delete').onclick = () => deleteSelectedTables();
  }

  function renderPanelCombo(panel, plan) {
    const combo = plan.combos.find(c => c.id === state.activeComboId);
    if (!combo) { state.panel = 'add'; return renderPanel(); }
    const tables = combo.tableIds.map(id => plan.tables.find(t => t.id === id)).filter(Boolean);

    panel.innerHTML =
      '<button class="fpp-back" id="fpp-back">‹ Back</button>' +
      '<h2 class="fpp-title">Edit Combo</h2>' +
      tables.map(t =>
        '<div class="fpp-member"><span class="mi"></span>' + esc(t.label) +
        '<span class="cap">' + t.minCap + '-' + t.maxCap + '</span></div>').join('') +
      '<div class="fpp-field" style="margin-top:16px">' +
        '<div class="fpp-label">Table Type <span class="fpp-info" title="Used as the reservation display name">i</span></div>' +
        '<select class="fpp-select" id="fpp-ctype">' +
          TABLE_TYPES.map(ty => '<option' + (combo.type === ty ? ' selected' : '') + '>' + ty + '</option>').join('') +
        '</select>' +
      '</div>' +
      '<div class="fpp-field"><div class="fpp-stepper-row">' +
        '<div class="fpp-stepper-col"><div class="fpp-label">Min</div>' +
          '<div class="fpp-stepper"><button id="fpp-cmin-d">−</button><span class="val">' + combo.minCap + '</span><button id="fpp-cmin-i">+</button></div></div>' +
        '<div class="fpp-stepper-col"><div class="fpp-label">Max</div>' +
          '<div class="fpp-stepper"><button id="fpp-cmax-d">−</button><span class="val">' + combo.maxCap + '</span><button id="fpp-cmax-i">+</button></div></div>' +
      '</div></div>' +
      '<button class="fpp-delete" id="fpp-delete">🗑 Delete Combo</button>';

    $('fpp-back').onclick = () => {
      state.activeComboId = null;
      state.panel = 'add';
      renderPanel(); renderCanvas();
    };
    $('fpp-ctype').onchange = e => { combo.type = e.target.value; markDirty(); };
    $('fpp-cmin-d').onclick = () => { if (combo.minCap > 1) { combo.minCap--; markDirty(); renderPanel(); } };
    $('fpp-cmin-i').onclick = () => { if (combo.minCap < 40) { combo.minCap++; if (combo.maxCap < combo.minCap) combo.maxCap = combo.minCap; markDirty(); renderPanel(); } };
    $('fpp-cmax-d').onclick = () => { if (combo.maxCap > combo.minCap) { combo.maxCap--; markDirty(); renderPanel(); } };
    $('fpp-cmax-i').onclick = () => { if (combo.maxCap < 40) { combo.maxCap++; markDirty(); renderPanel(); } };
    $('fpp-delete').onclick = () => {
      plan.combos = plan.combos.filter(c => c.id !== combo.id);
      state.activeComboId = null;
      state.panel = 'add';
      markDirty(); renderPanel(); renderCanvas();
      showToast('Combo deleted', 'ok');
    };
  }

  function renderPanelDecor(panel, plan) {
    const d = plan.decor.find(d => d.id === state.decorSelection);
    if (!d) { state.panel = 'add'; return renderPanel(); }
    panel.innerHTML =
      '<button class="fpp-back" id="fpp-back">‹ Back</button>' +
      '<h2 class="fpp-title">Edit Decor</h2>' +
      '<div class="fpp-field"><div class="fpp-label">Width</div>' +
        '<input class="fpp-input" type="number" id="fpp-dw" min="4" max="800" value="' + d.w + '"></div>' +
      '<div class="fpp-field"><div class="fpp-label">Height</div>' +
        '<input class="fpp-input" type="number" id="fpp-dh" min="4" max="800" value="' + d.h + '"></div>' +
      '<div class="fpp-field"><div class="fpp-label">Rotation</div>' +
        '<input class="fpp-input" type="number" id="fpp-dr" min="0" max="360" step="15" value="' + (d.rotation || 0) + '"></div>' +
      '<button class="fpp-delete" id="fpp-delete">🗑 Delete Decor</button>';

    $('fpp-back').onclick = () => { state.decorSelection = null; state.panel = 'add'; renderPanel(); renderCanvas(); syncChrome(); };
    $('fpp-dw').onchange = e => { d.w = clamp(parseInt(e.target.value) || d.w, 4, 800); markDirty(); renderCanvas(); };
    $('fpp-dh').onchange = e => { d.h = clamp(parseInt(e.target.value) || d.h, 4, 800); markDirty(); renderCanvas(); };
    $('fpp-dr').onchange = e => { d.rotation = clamp(parseInt(e.target.value) || 0, 0, 360); markDirty(); renderCanvas(); };
    $('fpp-delete').onclick = () => {
      plan.decor = plan.decor.filter(x => x.id !== d.id);
      state.decorSelection = null;
      state.panel = 'add';
      markDirty(); renderPanel(); renderCanvas(); syncChrome();
      showToast('Decor deleted', 'ok');
    };
  }

  function comboLabel(plan, combo) {
    return combo.tableIds
      .map(id => { const t = plan.tables.find(t => t.id === id); return t ? t.label : '?'; })
      .join(' + ');
  }

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  function markDirty() {
    state.dirty = true;
    pushHistory();
  }

  /* ================= TIPS ================= */
  function renderTips() {
    const tips = $('fp-tips');
    if (!tips) return;
    const second = state.mode === 'create'
      ? { t: 'Table combos maximize availability', b: 'Optimize your table arrangements and maximize availability. Select two or more adjacent tables and click "Combo Tables" above to set up a combo.' }
      : { t: 'New tables and combos default to in-house availability', b: 'Whenever a new table or combo is added to an existing floor plan applied to an active shift, event, or single day edit, it will default to in-house availability. Edit a new table or combo\'s availability within shift settings.' };
    tips.innerHTML =
      '<div class="fpm-tip"><div class="bulb">💡</div><h4>Quickly duplicate tables</h4>' +
      '<p>Select a table or group of tables, then press Cmd + V. The new tables will have the same properties as the original.</p></div>' +
      '<div class="fpm-tip"><div class="bulb">💡</div><h4>' + second.t + '</h4><p>' + second.b + '</p></div>';
  }

  /* ================= CANVAS ================= */
  function renderCanvas() {
    const canvas = $('fp-canvas');
    if (!canvas) return;
    const plan = getPlan();
    if (!plan) { canvas.innerHTML = ''; return; }

    canvas.innerHTML = '';

    // Combo marquee when editing a combo
    if (state.panel === 'combo' && state.activeComboId) {
      const combo = plan.combos.find(c => c.id === state.activeComboId);
      if (combo) {
        const tables = combo.tableIds.map(id => plan.tables.find(t => t.id === id)).filter(Boolean);
        if (tables.length) {
          const pad = 14;
          const x1 = Math.min(...tables.map(t => t.x)) - pad;
          const y1 = Math.min(...tables.map(t => t.y)) - pad;
          const x2 = Math.max(...tables.map(t => t.x + t.w)) + pad;
          const y2 = Math.max(...tables.map(t => t.y + t.h)) + pad;
          const m = document.createElement('div');
          m.className = 'fpm-marquee';
          m.style.cssText = 'left:' + x1 + 'px;top:' + y1 + 'px;width:' + (x2 - x1) + 'px;height:' + (y2 - y1) + 'px';
          canvas.appendChild(m);
        }
      }
    }

    // Decor
    plan.decor.forEach(d => canvas.appendChild(renderDecor(d)));

    // Tables
    plan.tables.forEach(t => canvas.appendChild(renderTable(t)));
  }

  function renderTable(t) {
    const plan = getPlan();
    const el = document.createElement('div');
    el.className = 'fpo ' + (SHAPE_CLASS[t.shape] || 'sq');
    el.dataset.id = t.id;
    el.style.cssText = 'left:' + t.x + 'px;top:' + t.y + 'px;width:' + t.w + 'px;height:' + t.h + 'px;z-index:3';

    const inCombo = plan.combos.some(c => c.tableIds.includes(t.id));
    if (inCombo) el.classList.add('in-combo');

    const inner = document.createElement('div');
    inner.className = 'fpo-inner';
    inner.style.transform = t.rotation ? 'rotate(' + t.rotation + 'deg)' : '';
    inner.innerHTML = '<span class="fpo-label">' + esc(t.label) + '</span><span class="fpo-cap">' + t.minCap + '-' + t.maxCap + '</span>';
    el.appendChild(inner);

    if (state.selection.includes(t.id)) {
      el.classList.add('sel');
      // 8 handles
      const pos = [
        ['-5px', '-5px'], ['calc(50% - 4px)', '-5px'], ['calc(100% - 3px)', '-5px'],
        ['-5px', 'calc(50% - 4px)'], ['calc(100% - 3px)', 'calc(50% - 4px)'],
        ['-5px', 'calc(100% - 3px)'], ['calc(50% - 4px)', 'calc(100% - 3px)'], ['calc(100% - 3px)', 'calc(100% - 3px)'],
      ];
      pos.forEach(([l, tp]) => {
        const h = document.createElement('div');
        h.className = 'fpo-handle';
        h.style.left = l; h.style.top = tp;
        el.appendChild(h);
      });
      // rotation dot (single selection only)
      if (state.selection.length === 1) {
        const rot = document.createElement('div');
        rot.className = 'fpo-rot';
        rot.dataset.rot = t.id;
        el.appendChild(rot);
      }
    }

    el.addEventListener('pointerdown', e => onTablePointerDown(e, t.id));
    return el;
  }

  function renderDecor(d) {
    const el = document.createElement('div');
    el.className = 'fpd k-' + d.kind;
    el.dataset.id = d.id;
    el.style.cssText = 'left:' + d.x + 'px;top:' + d.y + 'px;width:' + d.w + 'px;height:' + d.h + 'px;z-index:1';
    const inner = document.createElement('div');
    inner.className = 'fpd-inner';
    inner.style.transform = d.rotation ? 'rotate(' + d.rotation + 'deg)' : '';
    el.appendChild(inner);
    if (state.decorSelection === d.id) el.classList.add('sel');
    el.addEventListener('pointerdown', e => onDecorPointerDown(e, d.id));
    return el;
  }

  /* ================= CANVAS INTERACTIONS ================= */
  let drag = null; // {kind:'table'|'decor'|'rotate'|'rubber', ...}

  function onTablePointerDown(e, tableId) {
    e.stopPropagation();
    e.preventDefault();
    const plan = getPlan();
    if (!plan) return;

    const additive = e.metaKey || e.ctrlKey;
    if (additive) {
      if (state.selection.includes(tableId)) {
        state.selection = state.selection.filter(id => id !== tableId);
      } else {
        state.selection = [...state.selection, tableId];
      }
    } else if (!state.selection.includes(tableId)) {
      state.selection = [tableId];
    }
    state.decorSelection = null;
    state.activeComboId = null;
    state.panel = state.selection.length === 0 ? 'add' : state.selection.length === 1 ? 'edit' : 'multi';
    renderPanel();
    renderCanvas();
    syncChrome();

    // Begin drag (non-additive only)
    if (!additive && state.selection.includes(tableId)) {
      const t = plan.tables.find(t => t.id === tableId);
      drag = {
        kind: 'table',
        startX: e.clientX, startY: e.clientY,
        orig: state.selection.map(id => {
          const tb = plan.tables.find(x => x.id === id);
          return { id, x: tb.x, y: tb.y };
        }),
        moved: false,
      };
      window.addEventListener('pointermove', onDragMove);
      window.addEventListener('pointerup', onDragEnd, { once: true });
    }
  }

  function onDecorPointerDown(e, decorId) {
    e.stopPropagation();
    e.preventDefault();
    const plan = getPlan();
    if (!plan) return;
    state.decorSelection = decorId;
    state.selection = [];
    state.activeComboId = null;
    state.panel = 'decor';
    renderPanel();
    renderCanvas();
    syncChrome();

    const d = plan.decor.find(d => d.id === decorId);
    drag = { kind: 'decor', id: decorId, startX: e.clientX, startY: e.clientY, origX: d.x, origY: d.y, moved: false };
    window.addEventListener('pointermove', onDragMove);
    window.addEventListener('pointerup', onDragEnd, { once: true });
  }

  function onCanvasPointerDown(e) {
    if (e.target !== $('fp-canvas')) return;
    // rubber-band select
    const canvas = $('fp-canvas');
    const rect = canvas.getBoundingClientRect();
    drag = {
      kind: 'rubber',
      x0: e.clientX - rect.left, y0: e.clientY - rect.top,
      additive: e.metaKey || e.ctrlKey,
      el: null,
    };
    if (!drag.additive) {
      state.selection = [];
      state.decorSelection = null;
      state.activeComboId = null;
      state.panel = 'add';
      renderPanel();
      renderCanvas();
      syncChrome();
    }
    window.addEventListener('pointermove', onDragMove);
    window.addEventListener('pointerup', onDragEnd, { once: true });
  }

  function onDragMove(e) {
    if (!drag) return;
    const plan = getPlan();
    if (!plan) return;

    if (drag.kind === 'table') {
      const dx = e.clientX - drag.startX;
      const dy = e.clientY - drag.startY;
      if (Math.abs(dx) + Math.abs(dy) > 3) drag.moved = true;
      drag.orig.forEach(o => {
        const t = plan.tables.find(t => t.id === o.id);
        if (!t) return;
        t.x = clamp(o.x + dx, 0, CANVAS_W - t.w);
        t.y = clamp(o.y + dy, 0, CANVAS_H - t.h);
        const el = $('fp-canvas').querySelector('.fpo[data-id="' + t.id + '"]');
        if (el) { el.style.left = t.x + 'px'; el.style.top = t.y + 'px'; }
      });
    } else if (drag.kind === 'decor') {
      const d = plan.decor.find(d => d.id === drag.id);
      if (!d) return;
      d.x = clamp(drag.origX + (e.clientX - drag.startX), 0, CANVAS_W - d.w);
      d.y = clamp(drag.origY + (e.clientY - drag.startY), 0, CANVAS_H - d.h);
      drag.moved = true;
      const el = $('fp-canvas').querySelector('.fpd[data-id="' + d.id + '"]');
      if (el) { el.style.left = d.x + 'px'; el.style.top = d.y + 'px'; }
    } else if (drag.kind === 'rotate') {
      const t = plan.tables.find(t => t.id === drag.id);
      if (!t) return;
      const rect = $('fp-canvas').getBoundingClientRect();
      const cx = rect.left + t.x + t.w / 2;
      const cy = rect.top + t.y + t.h / 2;
      let ang = Math.atan2(e.clientY - cy, e.clientX - cx) * 180 / Math.PI + 90;
      ang = Math.round(ang / 15) * 15;
      t.rotation = ((ang % 360) + 360) % 360;
      drag.moved = true;
      const inner = $('fp-canvas').querySelector('.fpo[data-id="' + t.id + '"] .fpo-inner');
      if (inner) inner.style.transform = 'rotate(' + t.rotation + 'deg)';
    } else if (drag.kind === 'rubber') {
      const rect = $('fp-canvas').getBoundingClientRect();
      const x1 = Math.min(drag.x0, e.clientX - rect.left);
      const y1 = Math.min(drag.y0, e.clientY - rect.top);
      const w = Math.abs(e.clientX - rect.left - drag.x0);
      const h = Math.abs(e.clientY - rect.top - drag.y0);
      if (!drag.el) {
        drag.el = document.createElement('div');
        drag.el.className = 'fpm-rubber';
        $('fp-canvas').appendChild(drag.el);
      }
      drag.el.style.cssText = 'left:' + x1 + 'px;top:' + y1 + 'px;width:' + w + 'px;height:' + h + 'px';
      drag.rect = { x1, y1, x2: x1 + w, y2: y1 + h };
    }
  }

  function onDragEnd() {
    window.removeEventListener('pointermove', onDragMove);
    if (!drag) return;
    const plan = getPlan();

    if (drag.kind === 'rubber' && drag.rect && plan) {
      const r = drag.rect;
      const hit = plan.tables
        .filter(t => t.x < r.x2 && t.x + t.w > r.x1 && t.y < r.y2 && t.y + t.h > r.y1)
        .map(t => t.id);
      state.selection = drag.additive ? [...new Set([...state.selection, ...hit])] : hit;
      state.panel = state.selection.length === 0 ? 'add' : state.selection.length === 1 ? 'edit' : 'multi';
      if (drag.el) drag.el.remove();
      renderPanel();
      renderCanvas();
      syncChrome();
    } else if (drag && drag.moved && (drag.kind === 'table' || drag.kind === 'decor' || drag.kind === 'rotate')) {
      markDirty();
      if (drag.kind === 'rotate') renderCanvas();
    }
    drag = null;
  }

  // Rotation dot uses delegated pointerdown
  document.addEventListener('pointerdown', e => {
    if (!e.target.classList || !e.target.classList.contains('fpo-rot')) return;
    e.stopPropagation();
    e.preventDefault();
    drag = { kind: 'rotate', id: e.target.dataset.rot, moved: false };
    window.addEventListener('pointermove', onDragMove);
    window.addEventListener('pointerup', onDragEnd, { once: true });
  }, true);

  /* ================= ACTIONS ================= */
  function addTable() {
    const plan = getPlan();
    if (!plan) return;
    const wrap = $('fp-canvas-wrap');
    const cx = (wrap ? wrap.scrollLeft + wrap.clientWidth / 2 : 600);
    const cy = (wrap ? wrap.scrollTop + wrap.clientHeight / 2 : 300);
    const size = SHAPE_SIZE.square;
    // Cascade so consecutive new tables don't stack on top of each other
    const cascade = (plan.tables.length % 8) * 26;
    const t = {
      id: uid('t'),
      label: nextTableLabel(plan),
      type: 'Dining Room',
      shape: 'square',
      x: clamp(Math.round(cx - size.w / 2) + cascade, 20, CANVAS_W - 40),
      y: clamp(Math.round(cy - size.h / 2) + cascade, 20, CANVAS_H - 40),
      w: size.w, h: size.h,
      rotation: 0, minCap: 1, maxCap: 2,
    };
    plan.tables.push(t);
    state.selection = [t.id];
    state.decorSelection = null;
    state.panel = 'edit';
    markDirty();
    renderPanel();
    renderCanvas();
    syncChrome();
  }

  function deleteSelectedTables() {
    const plan = getPlan();
    if (!plan || !state.selection.length) return;
    const n = state.selection.length;
    plan.tables = plan.tables.filter(t => !state.selection.includes(t.id));
    plan.combos = plan.combos
      .map(c => ({ ...c, tableIds: c.tableIds.filter(id => !state.selection.includes(id)) }))
      .filter(c => c.tableIds.length >= 2);
    state.selection = [];
    state.panel = 'add';
    markDirty();
    renderPanel();
    renderCanvas();
    syncChrome();
    showToast(n === 1 ? 'Table deleted' : n + ' tables deleted', 'ok');
  }

  function duplicateSelection() {
    const plan = getPlan();
    if (!plan) return;
    if (state.decorSelection) {
      const d = plan.decor.find(d => d.id === state.decorSelection);
      if (!d) return;
      const copy = { ...d, id: uid('d'), x: d.x + 24, y: d.y + 24 };
      plan.decor.push(copy);
      state.decorSelection = copy.id;
      markDirty(); renderCanvas(); syncChrome();
      showToast('Decor duplicated', 'ok');
      return;
    }
    if (!state.selection.length) return;
    const newIds = [];
    state.selection.forEach(id => {
      const t = plan.tables.find(t => t.id === id);
      if (!t) return;
      const copy = JSON.parse(JSON.stringify(t));
      copy.id = uid('t');
      copy.label = nextTableLabel(plan);
      copy.x = clamp(t.x + 24, 0, CANVAS_W - t.w);
      copy.y = clamp(t.y + 24, 0, CANVAS_H - t.h);
      plan.tables.push(copy);
      newIds.push(copy.id);
    });
    state.selection = newIds;
    state.panel = newIds.length === 1 ? 'edit' : 'multi';
    markDirty();
    renderPanel();
    renderCanvas();
    syncChrome();
    showToast(newIds.length === 1 ? 'Table duplicated' : newIds.length + ' tables duplicated', 'ok');
  }

  function createCombo() {
    const plan = getPlan();
    if (!plan || state.selection.length < 2) return;
    const tables = state.selection.map(id => plan.tables.find(t => t.id === id)).filter(Boolean);
    const combo = {
      id: uid('c'),
      tableIds: [...state.selection],
      type: 'Dining Room',
      minCap: tables.reduce((s, t) => s + t.minCap, 0),
      maxCap: tables.reduce((s, t) => s + t.maxCap, 0),
    };
    plan.combos.push(combo);
    state.activeComboId = combo.id;
    state.selection = [];
    state.panel = 'combo';
    markDirty();
    renderPanel();
    renderCanvas();
    syncChrome();
    showToast('Combo created — set its type and capacity, then Save', 'ok');
  }

  function alignSelection(mode) {
    const plan = getPlan();
    if (!plan || state.selection.length < 2) return;
    const tables = state.selection.map(id => plan.tables.find(t => t.id === id)).filter(Boolean);
    if (tables.length < 2) return;
    if (mode === 'left') { const v = Math.min(...tables.map(t => t.x)); tables.forEach(t => t.x = v); }
    if (mode === 'right') { const v = Math.max(...tables.map(t => t.x + t.w)); tables.forEach(t => t.x = v - t.w); }
    if (mode === 'hcenter') { const v = (Math.min(...tables.map(t => t.x)) + Math.max(...tables.map(t => t.x + t.w))) / 2; tables.forEach(t => t.x = Math.round(v - t.w / 2)); }
    if (mode === 'top') { const v = Math.min(...tables.map(t => t.y)); tables.forEach(t => t.y = v); }
    if (mode === 'bottom') { const v = Math.max(...tables.map(t => t.y + t.h)); tables.forEach(t => t.y = v - t.h); }
    if (mode === 'vcenter') { const v = (Math.min(...tables.map(t => t.y)) + Math.max(...tables.map(t => t.y + t.h))) / 2; tables.forEach(t => t.y = Math.round(v - t.h / 2)); }
    markDirty();
    renderCanvas();
  }

  function addDecor(kind) {
    const plan = getPlan();
    if (!plan) return;
    const wrap = $('fp-canvas-wrap');
    const cx = wrap ? wrap.scrollLeft + wrap.clientWidth / 2 : 600;
    const cy = wrap ? wrap.scrollTop + wrap.clientHeight / 2 : 300;
    const sizes = { line: { w: 6, h: 200 }, rect: { w: 120, h: 80 }, circle: { w: 80, h: 80 }, umbrella: { w: 56, h: 56 }, plant: { w: 48, h: 48 } };
    const s = sizes[kind] || { w: 80, h: 80 };
    const d = { id: uid('d'), kind, x: Math.round(cx - s.w / 2), y: Math.round(cy - s.h / 2), w: s.w, h: s.h, rotation: 0 };
    plan.decor.push(d);
    state.decorSelection = d.id;
    state.selection = [];
    state.panel = 'decor';
    markDirty();
    renderPanel();
    renderCanvas();
    syncChrome();
    $('fp-decor-menu').hidden = true;
  }

  /* ================= KEYBOARD ================= */
  function onKey(e) {
    if ($('fp-modal').hidden) return;
    const inField = e.target.closest('input, select, textarea');
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z' && !inField) {
      e.preventDefault();
      if (e.shiftKey) redo(); else undo();
      return;
    }
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'v' && !inField) {
      e.preventDefault();
      duplicateSelection();
      return;
    }
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
      e.preventDefault();
      saveEditor();
      return;
    }
    if ((e.key === 'Delete' || e.key === 'Backspace') && !inField) {
      e.preventDefault();
      if (state.decorSelection) {
        const plan = getPlan();
        plan.decor = plan.decor.filter(d => d.id !== state.decorSelection);
        state.decorSelection = null;
        state.panel = 'add';
        markDirty(); renderPanel(); renderCanvas(); syncChrome();
      } else if (state.selection.length) {
        deleteSelectedTables();
      }
      return;
    }
    if (e.key === 'Escape') {
      if (!$('fp-decor-menu').hidden) { $('fp-decor-menu').hidden = true; return; }
      if (state.panel !== 'add') {
        state.selection = [];
        state.decorSelection = null;
        state.activeComboId = null;
        state.panel = 'add';
        renderPanel(); renderCanvas(); syncChrome();
      } else {
        closeEditor();
      }
    }
  }

  /* ================= INIT ================= */
  function init() {
    loadState();

    // List controls
    const newBtn = $('fp-new-btn');
    if (newBtn) newBtn.onclick = createFloorPlan;

    const gotoShifts = $('fpl-goto-shifts');
    if (gotoShifts) gotoShifts.onclick = e => { e.preventDefault(); gotoShiftSettings(); };

    const showInactive = $('fpl-show-inactive');
    if (showInactive) showInactive.onclick = () => {
      state.showInactive = !state.showInactive;
      showInactive.classList.toggle('open', state.showInactive);
      showInactive.firstChild.textContent = state.showInactive ? 'Hide Inactive Floor Plans ' : 'Show Inactive Floor Plans ';
      renderList();
    };

    // Venue sub-nav → other items go to Venue screen
    document.querySelectorAll('.fpl-vnav').forEach(b => {
      if (b.dataset.vnav === 'floorplans') return;
      b.onclick = () => { if (window.App) window.App.setScreen('venue'); };
    });

    // Editor chrome
    $('fp-editor-close').onclick = () => closeEditor();
    $('fp-cancel-btn').onclick = () => closeEditor();
    $('fp-save-btn').onclick = saveEditor;
    $('fp-undo').onclick = undo;
    $('fp-redo').onclick = redo;
    $('fp-duplicate-btn').onclick = duplicateSelection;
    $('fp-create-combo-btn').onclick = createCombo;
    $('fp-add-decor-btn').onclick = e => {
      e.stopPropagation();
      $('fp-decor-menu').hidden = !$('fp-decor-menu').hidden;
    };
    $('fp-decor-patio-toggle').onclick = e => {
      e.stopPropagation();
      $('fp-decor-patio').hidden = !$('fp-decor-patio').hidden;
    };
    document.querySelectorAll('.fpm-decor-item').forEach(b => {
      b.onclick = () => addDecor(b.dataset.decor);
    });
    document.querySelectorAll('#fp-align-tools button').forEach(b => {
      b.onclick = () => alignSelection(b.dataset.align);
    });
    document.addEventListener('click', e => {
      const menu = $('fp-decor-menu');
      if (menu && !menu.hidden && !e.target.closest('.fpm-decor-wrap')) menu.hidden = true;
    });

    // Canvas
    const canvas = $('fp-canvas');
    if (canvas) canvas.addEventListener('pointerdown', onCanvasPointerDown);

    document.addEventListener('keydown', onKey);

    // Intercept app navigation to refresh list
    if (window.App && window.App.setScreen) {
      const orig = window.App.setScreen.bind(window.App);
      window.App.setScreen = name => {
        orig(name);
        if (name === 'floorplan') renderList();
      };
    }

    renderList();

    // Public API (used by walkthrough + tests)
    window.FloorPlanEditor = {
      state,
      getPlan,
      openEditor,
      createFloorPlan,
      saveEditor,
      closeEditor,
      addTable,
      createCombo,
      showToast,
      renderList,
      showList: () => { if (window.App) window.App.setScreen('floorplan'); renderList(); },
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
