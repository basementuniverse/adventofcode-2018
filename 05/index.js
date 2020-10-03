const fs = require('fs');

fs.readFile('input.txt', 'utf-8', (error, input) => {
  if (error) { throw error; }
  input = input.trim().split('');

  const isUpper = c => c.toUpperCase() == c;

  function fullReact(polymer) {
    let l1 = polymer.length, l2 = null;
    while (l1 != l2) {
      l1 = polymer.length;
      polymer = react(polymer);
      l2 = polymer.length;
    }
    return polymer;
  }

  function react(polymer) {
    const result = polymer.slice(0);
    for (let i = 0; i < result.length - 1; i++) {
      if (canReact(result[i], result[i + 1])) {
        result.splice(i, 2);
      }
    }
    return result;
  }

  function canReact(a, b) {
    if (a.toLowerCase() != b.toLowerCase()) {
      return false;
    }
    return (!isUpper(a) && isUpper(b)) || (isUpper(a) && !isUpper(b));
  }

  // Part 1
  console.log(`Part 1: ${fullReact(input).length}`);

  // Part 2
  function remove(polymer, c) {
    const result = [];
    const cl = c.toLowerCase(), cu = c.toUpperCase();
    for (let i = 0; i < polymer.length; i++) {
      if (polymer[i] != cl && polymer[i] != cu) {
        result.push(polymer[i]);
      }
    }
    return result;
  }

  let p2 = null, min = input.length;
  for (let i = 97; i < 123; i++) {
    p2 = fullReact(remove(input, String.fromCharCode(i)));
    if (p2.length < min) {
      min = p2.length;
    }
  }
  console.log(`Part 2: ${min}`);
});
