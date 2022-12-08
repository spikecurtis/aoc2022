export {};
const fs = require('fs');

function findUniqueOfSize(data: string, l: number): number {
    for (let i = l; i < data.length; i++) {
        let s = new Set(data.slice(i - l, i))
        if (s.size == l) {
            return i
        }
    }
}

function puzzle(data: string) {
    let p1 = findUniqueOfSize(data, 4)
    console.log("Part One:", p1)

    let p2 = findUniqueOfSize(data, 14)
    console.log("Part Two:", p2)
}

fs.readFile('input06', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  puzzle(data);
});

