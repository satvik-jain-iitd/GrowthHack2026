// Main QA runner: journeys + permutations, broken-interaction audit, visual captures.
// Usage: node run.js
const fs = require('fs');
const path = require('path');
const H = require('./helpers');

(async () => {
  H.ensureDirs();
  const started = Date.now();
  console.log('============================================');
  console.log(' Resy Floor Plan — Browser QA Suite');
  console.log(' ' + H.APP);
  console.log('============================================');

  const browser = await H.launch();
  const all = [];

  const suites = [
    ['journeys', './journeys'],
    ['audit', './audit'],
    ['visual', './visual'],
  ];

  for (const [name, mod] of suites) {
    try {
      const results = await require(mod).run(browser);
      all.push(...results.map(r => ({ suite: name, ...r })));
    } catch (e) {
      const detail = e.message.split('\n').filter(l => l.includes('waiting for') || l.includes('Timeout') || l.includes('Error')).slice(0, 3).join(' | ');
      all.push({ suite: name, name: name + ' suite crashed', pass: false, detail });
      console.log('  FAIL ' + name + ' suite crashed — ' + detail);
    }
  }

  await browser.close();

  const pass = all.filter(r => r.pass);
  const fail = all.filter(r => !r.pass);

  console.log('\n============================================');
  console.log(' QA REPORT');
  console.log('============================================');
  const bySuite = {};
  all.forEach(r => {
    bySuite[r.suite] = bySuite[r.suite] || { pass: 0, fail: 0 };
    bySuite[r.suite][r.pass ? 'pass' : 'fail']++;
  });
  Object.entries(bySuite).forEach(([s, c]) => {
    console.log(' ' + (c.fail === 0 ? 'PASS' : 'FAIL') + ' ' + s.padEnd(12) + c.pass + '/' + (c.pass + c.fail));
  });
  console.log('--------------------------------------------');
  console.log(' TOTAL: ' + pass.length + '/' + all.length + ' passed in ' + ((Date.now() - started) / 1000).toFixed(1) + 's');

  if (fail.length) {
    console.log('\n FAILURES:');
    fail.forEach(f => {
      console.log('  ✗ [' + f.suite + '] ' + f.name);
      if (f.detail) console.log('    ' + f.detail.split('\n').slice(0, 6).join('\n    '));
    });
  }

  const report = {
    when: new Date().toISOString(),
    durationMs: Date.now() - started,
    total: all.length,
    passed: pass.length,
    failed: fail.length,
    results: all,
  };
  const reportPath = path.join(H.ARTIFACTS, 'reports', 'qa-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log('\n Report: ' + reportPath);
  console.log(' Screenshots: ' + H.SHOTS);
  console.log('============================================');

  process.exit(fail.length ? 1 : 0);
})();
