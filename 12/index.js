const INITIAL = '##.##.#.#...#......#..#.###..##...##.#####..#..###.########.##.....#...#...##....##.#...#.###...#.##';
const RULES = {
  ".###.": "#",
  "###.#": "#",
  "#..#.": "#",
  ".#..#": "#",
  "...##": "#",
  ".####": ".",
  ".#.##": "#",
  "#....": ".",
  "#..##": ".",
  "..#..": ".",
  "#.##.": "#",
  "##.#.": ".",
  "....#": ".",
  "#.#..": "#",
  ".#...": "#",
  ".##.#": "#",
  "..###": ".",
  ".##..": ".",
  "##...": "#",
  "###..": "#",
  "##..#": "#",
  "...#.": ".",
  "..#.#": "#",
  "..##.": ".",
  "#...#": ".",
  ".#.#.": "#",
  "#####": ".",
  "#.#.#": ".",
  "####.": "#",
  "#.###": ".",
  ".....": ".",
  "##.##": "."
};
const TEST_INITIAL = '#..#.#..##......###...###';
const TEST_RULES = {
  "...##": "#",
  "..#..": "#",
  ".#...": "#",
  ".#.#.": "#",
  ".#.##": "#",
  ".##..": "#",
  ".####": "#",
  "#.#.#": "#",
  "#.###": "#",
  "##.#.": "#",
  "##.##": "#",
  "###..": "#",
  "###.#": "#",
  "####.": "#"
};
const PAD = 30;

function initialise(initial, padAmount) {
  const padding = new Array(padAmount).fill('.').join('');
  return `${padding}${initial}${padding}`.split('');
}
function nextGeneration(pots, rules) {
  const next = '..'.split('');
  for (let i = 2; i < pots.length - 2; i++) {
    next[i] = applyRules(pots, i, rules);
  }
  return [...next, '.', '.'];
}
function applyRules(pots, i, rules) {
  return rules[pots.slice(i - 2, i + 3).join('')] || '.';
}
function run(initial, rules, generations, padding, showPots = true, countEach = false) {
  let pots = initialise(initial, padding);
  showPots && printPots(0, pots);
  const counts = [];
  for (let i = 1; i <= generations; i++) {
    pots = nextGeneration(pots, rules);
    showPots && printPots(i, pots);
    (countEach || i === generations) && counts.push(countPots(pots, padding));
  }
  return counts;
}
function printPots(generation, pots) {
  console.log(`${generation}: ${pots.join('')}`);
}
function countPots(pots, padding) {
  return pots.reduce((a, c, i) => a + (c === '#' ? (i - padding) : 0), 0);
}

// Test
console.assert(run(TEST_INITIAL, TEST_RULES, 20, PAD, false)[0] === 325);

// Part 1
console.log(`Part 1: ${run(INITIAL, RULES, 20, PAD, false)[0]}`);

// Part 2
// const counts = run(INITIAL, RULES, 200, 1000, false, true);
// const delta1 = counts.map((c, i, a) => c - (a[i - 1] || 0));
// console.log(counts);
// console.log(delta1);
/*

Generation 183 count: 18655
Every generation after this, the count increases by 96

So, after 50000000000 generations, the count should be:

18655 + (50000000000 - 183) * 96

*/
console.log(`Part 2: ${18655 + (50000000000 - 183) * 96}`);
