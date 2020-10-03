const fs = require('fs');

fs.readFile('input.txt', 'utf-8', (error, input) => {
  if (error) { throw error; }
  input = input.trim().split('\n').map(parse);
  
  function parse(s) {
    const m = s.match(/#(\d+) @ (\d+),(\d+): (\d+)x(\d+)/);
    return { id: m[1], x: +m[2], y: +m[3], w: +m[4], h: +m[5], c: false };
  }

  // Part 1
  const fabric = {};
  let result = 0;
  input.forEach(i => {
    for (let x = i.x; x < i.x + i.w; x++) {
      for (let y = i.y; y < i.y + i.h; y++) {
        fabric[x + '_' + y] = (fabric[x + '_' + y] || 0) + 1;
      }
    }
  });
  for (let i in fabric) {
    if (fabric[i] > 1) {
      result++;
    }
  }
  console.log(`Part 1: ${result}`);

  // Part 2
  const collide_1d = (a1, a2, b1, b2) => (a1 >= b1 && a1 < b2) || (b1 >= a1 && b1 < a2);
  const collide_2d = (a, b) => (
    collide_1d(a.x, a.x + a.w, b.x, b.x + b.w) &&
    collide_1d(a.y, a.y + a.h, b.y, b.y + b.h)
  );
  for (let a = 0; a < input.length; a++) {
    for (let b = a + 1; b < input.length; b++) {
      if (collide_2d(input[a], input[b])) {
        input[a].c = input[b].c = true;
      }
    }
  }
  console.log(`Part 2: ${input.filter(i => !i.c)[0].id}`);
});
