export {};

const fs = require('fs');

function sortDesc(a: Array<number>) {
    a.sort((a,b) => {return b-a})
}

function puzzle(data: string) {
    let elves = data.split("\n\n")
    let max = [0, 0, 0]
    const last = max.length-1
    for (const elf of elves) {
        let items = elf.split("\n")
        let total = 0
        for (const item of items) {
            const calories = parseInt(item)
            total += calories
        }
        if (total > max[last]) {
            max[last] = total
        }
        sortDesc(max)
    }
    console.log("Part One:", max[0])
    console.log("Part Two:", max.reduce((o,n) => {return o+n}))
}

fs.readFile('input', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  puzzle(data);
});

