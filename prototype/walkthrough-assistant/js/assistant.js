const Assistant = {
  started: false,

  el: function (id) { return document.getElementById(id); },

  init: function () {
    this.el('assist-launch').onclick = () => this.toggle();
    this.el('assist-close').onclick = () => this.toggle();
    const input = this.el('assist-input');
    this.el('assist-send').onclick = () => { const v = input.value.trim(); if (v) { this.ask(v); input.value = ''; } };
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') { const v = input.value.trim(); if (v) { this.ask(v); input.value = ''; } }
    });
  },

  toggle: function () {
    const p = this.el('assist-panel');
    const open = p.classList.toggle('hidden');
    this.el('assist-launch').textContent = open ? '?' : '\u00d7';
    if (!open && !this.started) {
      this.started = true;
      this.bot('Hey! How can we assist you today? These are the most asked questions by our restaurant partners — tap one or type your own.');
    }
  },

  bot: function (html) { this.msg(html, 'bot'); },
  user: function (text) { this.msg(this.esc(text), 'user'); },

  esc: function (t) {
    return t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  },

  msg: function (html, who) {
    const box = this.el('assist-msgs');
    const d = document.createElement('div');
    d.className = 'msg ' + who;
    d.innerHTML = html;
    box.appendChild(d);
    box.scrollTop = box.scrollHeight;
  },

  ask: function (text) {
    this.user(text);
    this.typing();
    MockAPI.ask(text).then(it => {
      this.typing(true);
      if (!it) {
        this.bot('I could not match that one. For anything I miss, email resysupport@resy.com or hit the chat bubble — a real person will take it from here.');
        return;
      }
      let html = this.esc(it.answer);
      if (it.action) {
        html += '<div class="act-row"><button class="btn btn-primary btn-sm" data-act>' + this.esc(it.action.label) + '</button></div>';
      }
      this.bot(html);
      const act = this.el('assist-msgs').lastElementChild.querySelector('[data-act]');
      if (act) act.onclick = () => this.act(it.action);
    });
  },

  act: function (a) {
    if (a.type === 'journey') {
      this.toggle();
      setTimeout(() => Walkthrough.launch(a.value), 120);
    } else if (a.type === 'screen') {
      App.setScreen(a.value);
      App.toast('Opened ' + a.value);
    } else if (a.type === 'doc') {
      App.setScreen('docs');
      Docs.open(a.value);
    }
  },

  typing: function (clear) {
    if (clear) {
      const t = this.el('assist-msgs').querySelector('.typing');
      if (t) t.remove();
      return;
    }
    const d = document.createElement('div');
    d.className = 'msg bot typing';
    d.textContent = '\u2026';
    this.el('assist-msgs').appendChild(d);
  }
};
