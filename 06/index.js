const fs = require('fs');

fs.readFile('input.txt', 'utf-8', (error, input) => {
  if (error) { throw error; }

  input = input.trim().split('\n').map(s => {
    const parts = s.split(', ');
    return { x: parseFloat(parts[0]), y: parseFloat(parts[1]) };
  });

  const distance = (x1, y1, x2, y2) => Math.abs(x2 - x1) + Math.abs(y2 - y1);

  // Part 1
  function closest(x, y, points) {
    const distances = points.map(p => distance(x, y, p.x, p.y));
    const minDistance = Math.min(...distances);
    const minIndex = distances.reduce((m, p, i) => p < distances[m] ? i : m, 0);
    return distances.filter(i => i == minDistance).length > 1 ? '.' : minIndex;
  }

  const minX = Math.min(...input.map(i => i.x));
  const maxX = Math.max(...input.map(i => i.x));
  const minY = Math.min(...input.map(i => i.y));
  const maxY = Math.max(...input.map(i => i.y));
  const map = [];
  const counts = {};
  for (let y = minY; y <= maxY; y++) {
    let row = [];
    for (let x = minX; x <= maxX; x++) {
      let c = closest(x, y, input);
      row.push(c);
      counts[c] = (counts[c] || 0) + 1;
    }
    map.push(row);
  }
  // console.log(map.map(r => r.map(c => c == '.' ? c : String.fromCharCode(97 + c)).join('')).join('\n'));

  const touchingEdges = {};
  for (let i = 0; i < map[0].length; i++) {
    touchingEdges[map[0][i]] = true;
    touchingEdges[map[map.length - 1][i]] = true;
  }
  for (let i = 0; i < map.length; i++) {
    touchingEdges[map[i][0]] = true;
    touchingEdges[map[i][map[0].length - 1]] = true;
  }

  let maxSize = -Infinity;
  for (let c in counts) {
    if (!counts.hasOwnProperty(c)) { continue; }
    if (c == '.' || touchingEdges[c]) {
      counts[c] = 0;
    }
    if (counts[c] > maxSize) {
      maxSize = counts[c];
    }
  }
  console.log(`Part 1: ${maxSize}`);

  // Part 2
  function totalDistance(x, y, points) {
    return points.reduce((a, p) => a + distance(x, y, p.x, p.y), 0);
  }

  const MAX_TOTAL_DISTANCE = 10000;
  let safeLocations = 0;
  for (let y = minY; y < maxY; y++) {
    for (let x = minX; x < maxX; x++) {
      if (totalDistance(x, y, input) < MAX_TOTAL_DISTANCE) {
        safeLocations++;
      }
    }
  }
  console.log(`Part 2: ${safeLocations}`);
});
