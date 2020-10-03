const fs = require('fs');

fs.readFile('input.txt', 'utf-8', (error, input) => {
  if (error) { throw error; }
  input = input.trim().split('\n');

  // Part 1
  function hasN(s, n) {
    const chars = [];
    s.split('').forEach(c => { chars[c] = (chars[c] || 0) + 1; });
    for (let c in chars) {
      if (chars[c] === n) {
        return true;
      }
    }
    return false;
  }
  console.log(`Part 1: ${input.filter(i => hasN(i, 2)).length * input.filter(i => hasN(i, 3)).length}`);

  // Part 2
  function diffByOne(a, b) {
    let d = 0;
    let j = 0;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) {
        d++;
        j = i;
      }
      if (d > 1) {
        return false;
      }
    }
    return d == 1 ? j : false;
  }
  let d = null;
  for (let i = 0; i < input.length; i++) {
    for (let j = i + 1; j < input.length; j++) {
      if ((d = diffByOne(input[i], input[j])) !== false) {
        const result = input[i].split('');
        result.splice(d, 1);
        console.log(`Part 2: ${result.join('')}`);
        break;
      }
    }
  }
});
