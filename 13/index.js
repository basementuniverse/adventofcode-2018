const fs = require('fs');

const MAX_ITERATIONS = 100000;
const directionNames = ['north', 'east', 'south', 'west'];
const directionIndices = { "^": 0, ">": 1, "v": 2, "<": 3 };

const at = (a, i) => {
  const l = a.length;
  return a[i < 0 ? l - (Math.abs(i + 1) % l) - 1 : i % l];
};

class Cart {
  constructor(id, x, y, direction) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.direction = direction;
    this.turn = -1;  // -1 = left, 0 = straight, 1 = right
    this.disposed = false;
  }
  north() {
    this.direction = '^';
    this.y--;
  }
  south() {
    this.direction = 'v';
    this.y++;
  }
  east() {
    this.direction = '>';
    this.x++;
  }
  west() {
    this.direction = '<';
    this.x--;
  }
  junction() {
    this[at(directionNames, directionIndices[this.direction] + this.turn++)]();
    if (this.turn > 1) {
      this.turn = -1;
    }
  }
  move(tracks) {
    const track = tracks[this.y][this.x];
    if (track === '+') {
      this.junction();
    } else {
      switch (this.direction) {
        case '>':
          switch (track) {
            case '\\': this.south(); break;
            case '/': this.north(); break;
            default: this.east(); break;
          }
          break;
        case '<':
          switch (track) {
            case '\\': this.north(); break;
            case '/': this.south(); break;
            default: this.west(); break;
          }
          break;
        case '^':
          switch (track) {
            case '\\': this.west(); break;
            case '/': this.east(); break;
            default: this.north(); break;
          }
          break;
        case 'v':
          switch (track) {
            case '\\': this.east(); break;
            case '/': this.west(); break;
            default: this.south(); break;
          }
          break;
      }
    }
  }
}

function initialise(input) {
  const tracks = input.split('\n');
  const carts = [];
  for (let y = 0; y < tracks.length; y++) {
    for (let x = 0; x < tracks[y].length; x++) {
      let d = tracks[y][x];
      if (['<', '>', '^', 'v'].includes(d)) {
        carts.push(new Cart(carts.length, x, y, d));
      }
    }
  }
  return { tracks, carts };
}

function checkCollisions(carts, handleCollision) {
  for (let a = 0; a < carts.length; a++) {
    for (let b = a + 1; b < carts.length; b++) {
      if (carts[a].disposed || carts[b].disposed) {
        continue;
      }
      if (carts[a].x === carts[b].x && carts[a].y === carts[b].y) {
        return handleCollision(carts[a], carts[b]);
      }
    }
  }
  return null;
}

function part1(input) {
  const { tracks, carts } = initialise(input);
  let count = 0;
  let collision = null;
  while (collision === null && count++ < MAX_ITERATIONS) {
    carts.sort((a, b) => {
      if (a.y === b.y) {
        return a.x - b.x;
      }
      return a.y - b.y;
    });
    let collisionPosition = null;
    for (let cart of carts) {
      cart.move(tracks);
      collision = checkCollisions(carts, (a, b) => ({ x: a.x, y: a.y }));
    }
  }
  if (collision !== null) {
    console.log(`Part 1: ${collision.x},${collision.y}`);
  } else {
    console.error('Max iterations reached!');
  }
}

function part2(input) {
  let { tracks, carts } = initialise(input);
  let count = 0;
  while (carts.length > 1 && count++ < MAX_ITERATIONS) {
    carts.sort((a, b) => {
      if (a.y === b.y) {
        return a.x - b.x;
      }
      return a.y - b.y;
    });
    for (let cart of carts) {
      cart.move(tracks);
      checkCollisions(carts, (a, b) => {
        a.disposed = true;
        b.disposed = true;
      });
    }
    carts = carts.filter(cart => !cart.disposed);
  }
  if (carts.length === 1) {
    console.log(`Part 2: ${carts[0].x},${carts[0].y}`);
  } else {
    console.error('Max iterations reached!');
  }
}

fs.readFile('input.txt', 'utf-8', (error, input) => {
  if (error) {
    throw error;
  }
  part1(input);
  part2(input);
});
