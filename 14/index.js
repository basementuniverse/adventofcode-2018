const input = 880751;

let elf1, elf2, scoreboard;
function initialise() {
    elf1 = 0;
    elf2 = 1;
    scoreboard = [3, 7];
}

function recipe() {
    const combined = scoreboard[elf1] + scoreboard[elf2];
    scoreboard.push(...combined.toString().split('').map(Number));
    elf1 = (elf1 + scoreboard[elf1] + 1) % scoreboard.length;
    elf2 = (elf2 + scoreboard[elf2] + 1) % scoreboard.length;
}

function print() {
    let output = '';
    for (let i = 0; i < scoreboard.length; i++) {
        if (i === elf1 && i === elf2) {
            output += `{${scoreboard[i]}} `;
        } else if (i === elf1) {
            output += `(${scoreboard[i]}) `;
        } else if (i === elf2) {
            output += `[${scoreboard[i]}] `;
        } else {
            output += `${scoreboard[i]} `;
        }
    }
    console.log(output);
}

function part1(n, p = false) {
    initialise();
    p && print();
    while (scoreboard.length < n + 10) {
        recipe();
        p && print();
    }
    return scoreboard.slice(-10).join('');
}

console.assert(part1(9) === '5158916779');
console.assert(part1(18) === '9251071085');
console.assert(part1(2018) === '5941429882');

console.log(`Part 1: ${part1(input)}`);

function part2(s) {
    initialise();
    const MAX_ITERATIONS = 20000000;
    let count = 0;
    while (scoreboard.slice(-s.length - 2).join('').indexOf(s) === -1 && count++ <= MAX_ITERATIONS) {
        if (count === MAX_ITERATIONS) {
            console.error('Max iterations reached!');
            return;
        }
        recipe();
    }
    return scoreboard.length - s.length - 2 + scoreboard.slice(-s.length - 2).join('').indexOf(s);
}

console.assert(part2('51589') === 9);
console.assert(part2('01245') === 5);
console.assert(part2('92510') === 18);
console.assert(part2('59414') === 2018);

console.log(`Part 2: ${part2(input.toString())}`);
