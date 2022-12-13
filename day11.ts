import {isNumber} from "util";

export {};
const fs = require('fs');

class Monkey {
    items: number[]
    operation: string
    operand: number|"old"
    divisor: number
    trueTarget: number
    falseTarget: number
    inspections: number
    monkeys: Monkey[]
    constructor(t: string) {
        const parts = t.trim().split("\n").map(l => l.trim().split(" "))
        this.items = parts[1].slice(2).map(n => parseInt(n.trim().split(",")[0]))
        this.operation = parts[2][4]
        let o = parts[2][5]
        if (o != "old") {
            this.operand = parseInt(o)
        } else {
            this.operand = o
        }
        this.divisor = parseInt(parts[3][3])
        this.trueTarget = parseInt(parts[4][5])
        this.falseTarget = parseInt(parts[5][5])
        this.inspections = 0
    }
    takeTurn(reduceWorry: (w: number) => number) {
        while (this.items.length > 0) {
            this.inspections ++
            let item = this.items.shift()
            item = this.newWorry(item)
            item = reduceWorry(item)

            let target = (item % this.divisor == 0) ? this.trueTarget : this.falseTarget
            this.monkeys[target].items.push(item)
        }
    }
    newWorry(w: number) {
        let operand = w
        if (this.operand != "old") {
            operand = this.operand
        }
        switch (this.operation) {
            case "*":
                return w * operand
            case "+":
                return w + operand
        }
        throw "unhittable"
    }
}

function puzzle1(data: string) {
    const monkeys = data.trim().split("\n\n").map(m => new Monkey(m))
    monkeys.forEach(m => m.monkeys = monkeys)
    for (let round = 1; round <= 20; round ++) {
        monkeys.forEach(m => m.takeTurn(w => Math.floor(w/3)))
    }
    let inspections = monkeys.map(m => m.inspections)
    inspections.sort((a, b) => b-a)
    console.log("Part One:", inspections[0]*inspections[1])
}

function puzzle2(data: string) {
    const monkeys = data.trim().split("\n\n").map(m => new Monkey(m))
    monkeys.forEach(m => m.monkeys = monkeys)
    // we can reduce worry by taking modulus of a common multiple of all divisors
    // the least common multiple gives the smallest modulus, but any common multiple
    // is fine, so just multiply the divisors
    //
    // this works because addition and multiplication in modular arithmetic
    // correspond to addition and multiplication of the ordinary integers
    const k = monkeys.reduce((a, m) => a * m.divisor, 1)
    for (let round = 1; round <= 10000; round ++) {
        monkeys.forEach(m => m.takeTurn(w => w % k))
    }
    let inspections = monkeys.map(m => m.inspections)
    inspections.sort((a, b) => b-a)
    console.log("Part Two:", inspections[0]*inspections[1])
}

fs.readFile('input11', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  puzzle1(data);
  puzzle2(data);
});
