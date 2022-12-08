export {};
const fs = require('fs');

const numStacks = 9

function stackCol(s: number): number {
    return 1 + (s*4)
}

function initStacks(i: number, lines: string[]): string[][] {
    let stacks = [[], [], [], [], [], [], [], [], []]
    for (let j = i; j >= 0; j--) {
        for (let c = 0; c < numStacks; c++) {
            const item = lines[j][stackCol(c)]
            if (item != ' ') {
                stacks[c].push(item)
            }
        }
    }
    return stacks
}

interface action {
    num: number
    from: number
    to: number
}

function parseAction(s: string): action {
    const parts = s.split(' ')
    const num = parseInt(parts[1])
    const from = parseInt(parts[3])
    const to = parseInt(parts[5])
    return {num, from, to}
}

function applyAction(stacks: string[][], a: action) {
    for (let i = 0; i < a.num; i++) {
        const item = stacks[a.from-1].pop()
        stacks[a.to-1].push(item)
    }
}

function applyAction2(stacks: string[][], a: action) {
    const from = stacks[a.from-1]
    const fx = from.length - a.num
    const items = from.slice(fx)
    const rest = from.slice(0, fx)
    const to = stacks[a.to-1]
    stacks[a.to-1] = to.concat(items)
    stacks[a.from-1] = rest
}

function topOfStack(stacks: string[][]): string {
    let tops = ''
    for (let i = 0; i<numStacks; i++) {
        let item = stacks[i][stacks[i].length-1]
        tops += item
    }
    return tops
}

function puzzle(data: string) {
    const lines = data.split('\n')
    const bIdx = lines.findIndex(x => x.length == 0)

    let stacks = initStacks(bIdx-2, lines)

    for (let i = bIdx; i< lines.length; i++) {
        const line = lines[i]
        if (line.length == 0) {
            continue
        }
        const a = parseAction(line)
        applyAction(stacks, a)
    }

    const tops1 = topOfStack(stacks)
    console.log("Part One:", tops1)

    stacks = initStacks(bIdx-2, lines)

    for (let i = bIdx; i< lines.length; i++) {
        const line = lines[i]
        if (line.length == 0) {
            continue
        }
        const a = parseAction(line)
        applyAction2(stacks, a)
    }

    const tops2 = topOfStack(stacks)
    console.log("Part Two:", tops2)
}

fs.readFile('input05', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  puzzle(data);
});

