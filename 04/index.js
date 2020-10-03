const fs = require('fs');

fs.readFile('input.txt', 'utf-8', (error, input) => {
  if (error) { throw error; }
  input = input.trim().split('\n').map(parse);

  function parse(s) {
    const m = s.match(/\[(.*)\] (.*)/);
    return {
      d: new Date(m[1]),
      i: m[2]
    };
  }
  input.sort((a, b) => a.d - b.d);

  let guard = null;
  const guards = {};
  for (let i = 0; i < input.length; i++) {
    let j = input[i].i.indexOf(' begins shift');
    if (j > -1) {
      let id = parseFloat(input[i].i.substr(7, j));
      if (!guards[id]) {
        guards[id] = {
          id: id,
          naps: []
        };
      }
      guard = guards[id];
    } else {
      if (input[i].i == 'falls asleep') {
        guard.naps.push({
          start: input[i].d.getMinutes(),
          end: input[i + 1].d.getMinutes(),
          total: input[i + 1].d - input[i].d
        });
      }
    }
  }

  // Part 1
  let sleepiestGuard = null, maxSleepTime = -Infinity;
  for (let g in guards) {
    if (!guards.hasOwnProperty(g)) { continue; }
    guards[g].total = guards[g].naps.reduce((a, v) => a + v.total, 0) / 60000;
    if (guards[g].total > maxSleepTime) {
      maxSleepTime = guards[g].total;
      sleepiestGuard = guards[g];
    }
  }

  const maxIndex = a => a.reduce((m, x, i) => x > a[m] ? i : m, 0);
  function sleepiestMinute(g) {
    const minutes = new Array(60).fill(0);
    g.naps.forEach(n => {
      for (let m = n.start; m < n.end; m++) {
        minutes[m] = (minutes[m] || 0) + 1;
      }
    });
    return maxIndex(minutes);
  }
  console.log(`Part 1: ${sleepiestMinute(sleepiestGuard) * sleepiestGuard.id}`);

  // Part 2
  const minutes = [];
  for (let m = 0; m < 60; m++) {
    minutes.push({
      count: 0,
      guards: {}
    });
  }
  for (let g in guards) {
    if (!guards.hasOwnProperty(g)) { continue; }
    guards[g].naps.forEach(n => {
      for (let m = n.start; m < n.end; m++) {
        minutes[m].count++;
        if (!minutes[m].guards[guards[g].id]) {
          minutes[m].guards[guards[g].id] = 0;
        }
        minutes[m].guards[guards[g].id]++;
      }
    });
  }
  let k = -Infinity;
  let g2 = null;
  let m2 = null;
  for (let m in minutes) {
    if (!minutes.hasOwnProperty(m)) { continue; }
    for (let g in minutes[m].guards) {
      if (!minutes[m].guards.hasOwnProperty(g)) { continue; }
      if (minutes[m].guards[g] > k) {
        k = minutes[m].guards[g];
        g2 = g;
        m2 = m;
      }
    }
  }
  // console.log(g2, m2, g2 * m2);
  console.log(`Part 2: ${g2 * m2}`);
});
