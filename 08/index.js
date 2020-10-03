const fs = require('fs');

class Node {
  constructor() {
    this.metaData = [];
    this.children = [];
  }

  get totalMetaData() {
    let t = this.metaData.reduce((a, b) => a + b, 0);
    for (let i = 0; i < this.children.length; i++) {
      t += this.children[i].totalMetaData;
    }

    return t;
  }

  get value() {
    if (!this.children.length) {
      return this.metaData.reduce((a, b) => a + b, 0);
    }

    let v = 0;
    for (let i = 0; i < this.metaData.length; i++) {
      if (this.metaData[i] > 0 && this.metaData[i] <= this.children.length) {
        v += this.children[this.metaData[i] - 1].value;
      }
    }

    return v;
  }
}

fs.readFile('input.txt', 'utf-8', (error, input) => {
  if (error) { throw error; }

  const parseInput = v => v.trim().split(' ').map(n => +n);
  input = parseInput(input);

  function buildNodes(input) {
    const node = new Node();
    const children = input[j++];
    const metaData = input[j++];

    for (let i = 0; i < children; i++) {
      node.children.push(buildNodes(input));
    }

    for (let i = 0; i < metaData; i++) {
      node.metaData.push(input[j++]);
    }

    return node;
  }

  let j = 0;
  const root = buildNodes(input);

  console.log(`Part 1: ${root.totalMetaData}`);
  console.log(`Part 2: ${root.value}`);
});
