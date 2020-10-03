const fs = require('fs');

fs.readFile('input.txt', 'utf-8', (error, input) => {
  if (error) { throw error; }
  input = input.trim().split('\n').map(Number);

  // Part 1
  console.log(`Part 1: ${input.reduce((a, c) => a + c, 0)}`);

  // Part 2
  const seen = {};
  let f = 0;
  let i = 0;
  while (true) {
    f += input[i];
    if (seen[f]) {
      console.log(`Part 2: ${f}`);
      break;
    }
    seen[f] = true;
    i = (i + 1) % input.length;
  }
});
