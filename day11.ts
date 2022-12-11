import {isNumber} from "util";

export {};
const fs = require('fs');

class Item {
    init: number
    mods: {set, get, forEach}

    constructor(n: number) {
        this.init = n
        this.mods = new Map()
    }

    setMods(mods: number[]) {
        mods.forEach(m => this.mods.set(m, this.init % m))
    }

    addN(n: number) {
        this.mods.forEach((v, k, map) => {
            map.set(k, (v+n) % k)
        })
    }

    multN(n: number) {
        this.mods.forEach((v, k, map) => {
            map.set(k, (v*n) % k)
        })
    }

    addOld() {
        this.mods.forEach((v, k, map) => {
            map.set(k, (v+v) % k)
        })
    }

    multOld() {
        this.mods.forEach((v, k, map) => {
            map.set(k, (v*v) % k)
        })
    }

    divisibleBy(k: number) {
        return this.mods.get(k) == 0
    }
}

class Monkey {
    items: Item[]
    operation: string
    operand: number|"old"
    divisor: number
    trueTarget: number
    falseTarget: number
    inspections: number
    monkeys: Monkey[]
    constructor(t: string) {
        const parts = t.trim().split("\n").map(l => l.trim().split(" "))
        this.items = parts[1].slice(2).map(n => new Item(parseInt(n.trim().split(",")[0])))
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
    takeTurn() {
        while (this.items.length > 0) {
            this.inspections ++
            let item = this.items.shift()
            this.newWorry(item)
            //item = Math.floor(item/3)

            let target = item.divisibleBy(this.divisor) ? this.trueTarget : this.falseTarget
            this.monkeys[target].items.push(item)
        }
    }
    newWorry(w: Item) {
        switch (this.operation) {
            case "*":
                if (this.operand != "old") {
                    w.multN(this.operand)
                } else {
                    w.multOld()
                }
                return
            case "+":
                if (this.operand != "old") {
                    w.addN(this.operand)
                } else {
                    w.addOld()
                }
                return
        }
        throw "unhittable"
    }
}

function puzzle(data: string) {
    const monkeys = data.trim().split("\n\n").map(m => new Monkey(m))
    const divisors = monkeys.map(m => m.divisor)
    monkeys.forEach(m => {
        m.monkeys = monkeys
        m.items.forEach(i => i.setMods(divisors))
    })
    for (let round = 1; round <= 10000; round ++) {
        monkeys.forEach(m => m.takeTurn())
    }
    let inspections = monkeys.map(m => m.inspections)
    inspections.sort((a, b) => b-a)
    console.log(inspections[0]*inspections[1])
}

fs.readFile('input11', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  puzzle(data);
});

const tc = `addx 15
addx -11
addx 6
addx -3
addx 5
addx -1
addx -8
addx 13
addx 4
noop
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx -35
addx 1
addx 24
addx -19
addx 1
addx 16
addx -11
noop
noop
addx 21
addx -15
noop
noop
addx -3
addx 9
addx 1
addx -3
addx 8
addx 1
addx 5
noop
noop
noop
noop
noop
addx -36
noop
addx 1
addx 7
noop
noop
noop
addx 2
addx 6
noop
noop
noop
noop
noop
addx 1
noop
noop
addx 7
addx 1
noop
addx -13
addx 13
addx 7
noop
addx 1
addx -33
noop
noop
noop
addx 2
noop
noop
noop
addx 8
noop
addx -1
addx 2
addx 1
noop
addx 17
addx -9
addx 1
addx 1
addx -3
addx 11
noop
noop
addx 1
noop
addx 1
noop
noop
addx -13
addx -19
addx 1
addx 3
addx 26
addx -30
addx 12
addx -1
addx 3
addx 1
noop
noop
noop
addx -9
addx 18
addx 1
addx 2
noop
noop
addx 9
noop
noop
noop
addx -1
addx 2
addx -37
addx 1
addx 3
noop
addx 15
addx -21
addx 22
addx -6
addx 1
noop
addx 2
addx 1
noop
addx -10
noop
noop
addx 20
addx 1
addx 2
addx 2
addx -6
addx -11
noop
noop
noop
`
//puzzle(tc)