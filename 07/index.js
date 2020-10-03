const fs = require('fs');

fs.readFile('input.txt', 'utf-8', (error, input) => {
  if (error) { throw error; }
  input = input.trim().split('\n');

  const steps = [];
  const dependencies = {};
  input.forEach(i => {
    const m = i.match(/Step ([A-Z]) must be finished before step ([A-Z]) can begin\./);
    if (steps.indexOf(m[1]) == -1) { steps.push(m[1]); }
    if (steps.indexOf(m[2]) == -1) { steps.push(m[2]); }
    if (!dependencies[m[1]]) {
      dependencies[m[1]] = [];
    }
    dependencies[m[2]] = (dependencies[m[2]] || []).concat([m[1]]);
  });
  steps.sort();

  // Part 1
  ((steps, dependencies) => {
    const result = [];

    function step() {
      for (let i = 0; i < steps.length; i++) {
        if (!dependencies[steps[i]].length) {
          result.push(steps[i]);
          resolve(steps[i]);
          return true;
        }
      }
      return false;
    }

    function resolve(s) {
      for (let i in dependencies) {
        if (!dependencies.hasOwnProperty(i)) { continue; }
        let j = dependencies[i].indexOf(s);
        if (j > -1) {
          dependencies[i].splice(j, 1);
        }
      }
      steps.splice(steps.indexOf(s), 1);
    }

    while (step()) { }
    console.log(`Part 1: ${result.join('')}`);
  })(JSON.parse(JSON.stringify(steps)), JSON.parse(JSON.stringify(dependencies)));

  // Part 2
  ((steps, dependencies) => {
    const TIME_OFFSET = 60;
    const WORKERS = 5;
    steps = steps.map(s => ({
      id: s,
      time: TIME_OFFSET + (s.charCodeAt(0) - 64),
      worker: null,
      completed: false
    }));
    const workers = new Array(WORKERS).fill(false);
    const done = [];

    let time = 0;
    let MAX_ITERATIONS = 10000;
    // console.log('Second\t' + workers.map((w, i) => `Worker ${i}`).join('\t') + '\tDone');
    while (true) {
      let allComplete = true;
      steps.forEach(s => {
        if (s.worker !== null) {
          s.time--;
          if (s.time <= 0) {
            done.push(s.id);
            resolve(s);
          }
        }
        if (!s.completed) {
          allComplete = false;
        }
      });
      assignSteps();
      // console.log(time + '\t\t' + workers.map((w, i) => whichStep(i)).join('\t\t\t') + '\t\t\t' + done.join(''));
      if (allComplete || MAX_ITERATIONS-- < 0) {
        break;
      }
      time++;
    }

    function assignSteps() {
      for (let i = 0; i < workers.length; i++) {
        if (!workers[i]) {
          let step = findNextAvailableStep();
          if (step) {
            workers[i] = true;
            step.worker = i;
          }
        }
      }
    }

    function findNextAvailableStep() {
      for (let i = 0; i < steps.length; i++) {
        if (
          !dependencies[steps[i].id].length &&
          steps[i].worker === null &&
          !steps[i].completed
        ) {
          return steps[i];
        }
      }
      return false;
    }

    function resolve(step) {
      for (let i in dependencies) {
        if (!dependencies.hasOwnProperty(i)) { continue; }
        let j = dependencies[i].indexOf(step.id);
        if (j > -1) {
          dependencies[i].splice(j, 1);
        }
      }
      workers[step.worker] = false;
      step.completed = true;
      step.worker = null;
    }

    function whichStep(worker) {
      for (let i = 0; i < steps.length; i++) {
        if (steps[i].worker == worker) {
          return steps[i].id;
        }
      }
      return '.';
    }

    console.log(`Part 2: ${time}`);
  })(JSON.parse(JSON.stringify(steps)), JSON.parse(JSON.stringify(dependencies)));
});
