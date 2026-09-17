const Recorder = {
  KEY: 'resy_howtos',

  load: function () {
    try {
      return JSON.parse(localStorage.getItem(this.KEY) || '[]');
    } catch (e) { return []; }
  },

  save: function (doc) {
    const list = this.load();
    const rec = {
      id: doc.id + '-' + Date.now(),
      title: doc.title,
      author: 'Parivar Bistro · recorded',
      read: Math.max(1, Math.round(doc.steps.length * 0.5)) + ' min',
      updated: 'Recorded just now',
      fromRecording: true,
      intro: 'Recorded live from the Resy OS Dashboard while walking through this guide.',
      steps: doc.steps,
      tip: 'Tip: replay this guide anytime by typing the same question in the assistant.'
    };
    list.push(rec);
    localStorage.setItem(this.KEY, JSON.stringify(list));
    return rec;
  },

  remove: function (id) {
    localStorage.setItem(this.KEY, JSON.stringify(this.load().filter(d => d.id !== id)));
  }
};
