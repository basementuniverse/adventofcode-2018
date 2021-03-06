const INPUT = 5535;
const SIZE = 300;

const ind = (x, y) => x + y * SIZE;
const pos = i => ({ x: i % SIZE, y: Math.floor(i / SIZE) });

function calculateGrid(size, input) {
  const result = [];
  for (let x = 1; x <= size; x++) {
    for (let y = 1; y <= size; y++) {
      result[ind(x, y)] = powerLevel(x, y, input);
    }
  }
  return result;
}

function powerLevel(x, y, input) {
  const rackId = x + 10;
  let power = rackId * y;
  power += input;
  power *= rackId;
  power = Math.floor((power % 1000) / 100);
  power -= 5;
  return power;
}

// test powerLevel calculation
console.assert(powerLevel(3, 5, 8) === 4);
console.assert(powerLevel(122, 79, 57) === -5);
console.assert(powerLevel(217, 196, 39) === 0);
console.assert(powerLevel(101, 153, 71) === 4);

function totalPower(x, y, grid, gridSize, squareSize) {
  if (squareSize > gridSize) {
    throw new Error('square size larger than grid size');
  }
  if ((x + squareSize - 1) > gridSize || (y + squareSize - 1) > gridSize) {
    throw new Error('square out of bounds');
  }
  let total = 0;
  for (let dx = 0; dx < squareSize; dx++) {
    for (let dy = 0; dy < squareSize; dy++) {
      total += grid[ind(x + dx, y + dy)];
    }
  }
  return total;
}

function findMaxPower(grid, gridSize, squareSize) {
  let max = { power: -Infinity, x: -1, y: -1 };
  for (let x = 1; x <= gridSize - (squareSize - 1); x++) {
    for (let y = 1; y <= gridSize - (squareSize - 1); y++) {
      const total = totalPower(x, y, grid, gridSize, squareSize);
      if (total > max.power) {
        max.power = total;
        max.x = x;
        max.y = y;
      }
    }
  }
  return max;
}

function solvePart1(grid, size) {
  return findMaxPower(grid, size, 3);
}

function solvePart2(grid, size) {
  let max = solvePart1(grid, size);
  // Brute force...
  for (let s = 3; s <= size; s++) {
    const current = findMaxPower(grid, size, s);
    if (current.power > max.power) {
      max.power = current.power;
      max.x = current.x;
      max.y = current.y;
      max.size = s;
    }
    // Exit early if the max starts getting smaller...
    if (current.power < max.power) {
      break;
    }
  }
  return max;
}

const grid = calculateGrid(SIZE, INPUT);
console.log(`Part 1: ${JSON.stringify(solvePart1(grid, SIZE))}`);
console.log(`Part 2: ${JSON.stringify(solvePart2(grid, SIZE))}`);
