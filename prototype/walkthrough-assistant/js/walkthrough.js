const Walkthrough = {
  j: null,
  idx: 0,
  el: null,
  advancing: false,

  el_: function (id) { return document.getElementById(id); },
  target: function (anchor) { return document.querySelector('[data-guide="' + anchor + '"]'); },

  launch: function (journeyId) {
    const j = intents.JOURNEYS[journeyId];
    if (!j) return;
    this.j = j;
    this.idx = 0;
    this.el = null;
    this.advancing = false;
    this.build();
    this.show();
  },

  build: function () {
    const dims = document.createElement('div');
    dims.id = 'spot-dims';
    dims.className = 'spot-dims';
    const hole = document.createElement('div');
    hole.id = 'spot-hole';
    hole.className = 'spot-hole';
    const ring = document.createElement('div');
    ring.className = 'spot-ring';
    hole.appendChild(ring);
    const b = document.createElement('div');
    b.id = 'balloon';
    b.className = 'balloon';
    b.innerHTML =
      '<div class="balloon-head"><span class="title"></span><button id="b-x" class="balloon-x" aria-label="End guide">&times;</button></div>' +
      '<div class="balloon-body"><div class="stepx"></div><h4></h4><p></p></div>' +
      '<div class="balloon-dots"></div>' +
      '<div class="balloon-actions"><div class="l"><button class="btn btn-ghost btn-sm" id="b-prev">Back</button></div>' +
      '<div class="r"><button class="btn btn-ghost btn-sm" id="b-next">Next</button></div></div>';
    document.body.append(dims, hole, b);
    this.el_('b-x').onclick = () => this.end();
    this.el_('b-prev').onclick = () => this.prev();
    this.el_('b-next').onclick = () => this.next();
  },

  show: function () {
    const step = this.j.steps[this.idx];
    App.quiet = true;
    if (step.screen) App.setScreen(step.screen);
    if (step.open === 'wizard' && !window.WizardOpen) App.openWizard(step.wstep != null ? step.wstep : 0);
    if (step.open === 'usermodal' && !window.UserModalOpen) App.openUserModal();
    if (step.open === 'wizard' && step.wstep != null) Wizard.goto(step.wstep);
    App.quiet = false;
    this.el = this.target(step.anchor);
    if (this.el) {
      this.el.scrollIntoView({ block: 'center', behavior: 'smooth' });
      setTimeout(() => this.position(), 220);
    } else {
      this.position();
    }
    const total = this.j.steps.length;
    this.el_('balloon').querySelector('.title').textContent = this.j.title;
    this.el_('balloon').querySelector('.stepx').textContent = 'Step ' + (this.idx + 1) + ' of ' + total;
    this.el_('balloon').querySelector('h4').textContent = step.title;
    this.el_('balloon').querySelector('p').textContent = step.body;
    const dots = this.el_('balloon').querySelector('.balloon-dots');
    dots.innerHTML = this.j.steps.map((s, i) => '<i class="' + (i <= this.idx ? 'on' : '') + '"></i>').join('');
    this.el_('b-next').textContent = this.idx === total - 1 ? 'Done' : 'Next';
    this.el_('b-prev').style.visibility = this.idx === 0 ? 'hidden' : 'visible';
    this.attach(this.el, step);
  },

  position: function () {
    if (!this.j) return;
    const dims = this.el_('spot-dims');
    const hole = this.el_('spot-hole');
    const b = this.el_('balloon');
    dims.style.display = 'block';
    if (this.el) {
      const r = this.el.getBoundingClientRect();
      const pad = 8;
      hole.style.display = 'block';
      hole.style.left = (r.left - pad) + 'px';
      hole.style.top = (r.top - pad) + 'px';
      hole.style.width = (r.width + pad * 2) + 'px';
      hole.style.height = (r.height + pad * 2) + 'px';
      const space = r.top - 16;
      if (space > 300) {
        b.style.left = Math.max(12, Math.min(r.left + r.width / 2 - 165, innerWidth - 342)) + 'px';
        b.style.top = (r.top - b.offsetHeight - 14) + 'px';
      } else {
        b.style.left = Math.max(12, Math.min(r.left + r.width / 2 - 165, innerWidth - 342)) + 'px';
        b.style.top = (r.bottom + 16) + 'px';
      }
    } else {
      hole.style.display = 'none';
      b.style.left = (innerWidth / 2 - 165) + 'px';
      b.style.top = (innerHeight / 2 - 120) + 'px';
    }
    b.style.display = 'block';
  },

  attach: function (el, step) {
    this.advancing = false;
    if (!el) return;
    const adv = () => {
      if (!this.j || this.idx >= this.j.steps.length) return;
      this.next();
    };
    if (step.type === 'click') el.addEventListener('click', adv, { once: true });
    else if (step.type === 'fill' || step.type === 'toggle') el.addEventListener('input', adv, { once: true });
  },

  next: function () {
    if (!this.j) return;
    if (this.idx < this.j.steps.length - 1) {
      this.idx++;
      this.show();
    } else {
      this.finish();
    }
  },

  prev: function () {
    if (this.idx > 0) { this.idx--; this.show(); }
  },

  finish: function () {
    const j = this.j;
    const steps = j.steps.map(s => ({ title: s.title, note: s.body }));
    this.end();
    MockAPI.save({ id: j.id, title: j.title, steps: steps }).then(() => {
      const markIdx = [];
      j.steps.forEach(s => { if (s.mark) markIdx.push(s.mark); });
      if (markIdx.length) App.markReviewed(markIdx);
      App.toast('Guide complete — recording saved to How-to guides', true);
      Docs.render();
    });
  },

  end: function () {
    this.el_('spot-dims').style.display = 'none';
    this.el_('spot-hole').style.display = 'none';
    this.el_('balloon').style.display = 'none';
    this.advancing = false;
    this.j = null;
  },

  checkAnchors: function () {
    const missing = [];
    Object.keys(intents.JOURNEYS).forEach(id => {
      intents.JOURNEYS[id].steps.forEach(s => {
        if (!document.querySelector('[data-guide="' + s.anchor + '"]')) missing.push(id + ':' + s.anchor);
      });
    });
    return missing;
  }
};
