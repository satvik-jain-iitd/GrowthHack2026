const MockAPI = {
  delay: function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); },
  ask: function (text) {
    return MockAPI.delay(260).then(function () { return intents.matchIntent(text); });
  },
  save: function (doc) {
    return MockAPI.delay(180).then(function () { return Recorder.save(doc); });
  }
};
