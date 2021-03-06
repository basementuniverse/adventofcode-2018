// 462 players; last marble is worth 71938 points

/*
10 players; last marble is worth 1618 points: high score is 8317
13 players; last marble is worth 7999 points: high score is 146373
17 players; last marble is worth 1104 points: high score is 2764
21 players; last marble is worth 6111 points: high score is 54718
30 players; last marble is worth 5807 points: high score is 37305
*/

const input1 = {
  players: 462,
  marbles: 71938
};

const input2 = {
  players: input1.players,
  marbles: input1.marbles * 100
};

const testInput1 = {
  players: 10,
  marbles: 1618
};

const testInput2 = {
  players: 13,
  marbles: 7999
};

const testInput3 = {
  players: 17,
  marbles: 1104
};

const testInput4 = {
  players: 21,
  marbles: 6111
};

const testInput5 = {
  players: 30,
  marbles: 5807
};

class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
    this.previous = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
    this.length = 9;
  }

  append(value) {
    this.length++;
    const node = new Node(value);
    if (!this.head) {
      node.next = node.previous = node;
      this.head = node;
      return node;
    }
    const tail = this.head.previous;
    node.next = this.head;
    this.head.previous = node;
    node.previous = tail;
    tail.next = node;
    return node;
  }

  prepend(value) {
    this.length++;
    const node = new Node(value);
    const tail = this.head.previous;
    node.next = this.head;
    node.previous = tail;
    tail.next = this.head.previous = node;
    this.head = node;
    return node;
  }

  find(value) {
    let current = this.head;
    const headValue = this.head.value;
    let i = 0;
    while (current.value != value && (current.value != headValue || i++ == 0)) {
      current = current.next;
    }
    return current;
  }

  insert(value, afterNode) {
    this.length++;
    const node = new Node(value);
    const temp = afterNode.next;
    afterNode.next = node;
    node.previous = afterNode;
    node.next = temp;
    temp.previous = node;
    return node;
  }

  remove(node) {
    this.length--;
    if (this.head.value == node.value) {
      this.head = node.next;
    }
    if (this.length == 1) {
      this.head = null;
    }
    node.previous.next = node.next;
    node.next.previous = node.previous;
    return node;
  }

  // get length() {
  //     if (!this.head) {
  //         return 0;
  //     }
  //     let current = this.head;
  //     const headValue = this.head.value;
  //     let i = 0;
  //     while (current.value != headValue || i == 0) {
  //         i++;
  //         current = current.next;
  //     }
  //     return i;
  // }

  print() {
    const result = [];
    if (!this.head) {
      console.log('empty');
      return;
    }
    let current = this.head;
    const headValue = this.head.value;
    let i = 0;
    while (current.value != headValue || i++ == 0) {
      result.push(current);
      current = current.next;
    }
    console.log('%O; %O', this, result.map(n => n.value).join(', '));
  }
}

class Player {
  constructor(index) {
    this.index = index;
    this.score = 0;
  }
}

function play(input) {
  const players = [...Array(input.players).keys()].map(i => new Player(i));
  const circle = new LinkedList();

  let current = circle.append(0);
  for (let i = 1; i <= input.marbles + 1; i++) {
    let player = players[i % input.players];
    if (i % 23 == 0) {
      current = current.previous.previous.previous.previous.previous.previous.previous;
      player.score += i + current.value;
      current = circle.remove(current).next;
    } else {
      current = circle.insert(i, current.next);
    }
  }

  return players.reduce((a, i) => Math.max(a, i.score), -Infinity);
}

console.log(`Part 1: ${play(input1)}`);
console.log(`Part 2: ${play(input2)}`);
