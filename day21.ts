export {};
const fs = require('fs');

class Monkey {
    name: string
    map: Map<string, Monkey>
    num: number
    operation: string
    operands: string[]

    constructor(map: Map<string, Monkey>, line: string) {
        this.map = map
        const words = line.trim().split(" ")
        this.name = words[0].split(":")[0]
        if (words.length == 2) {
            this.num = parseInt(words[1])
        } else {
            this.operation = words[2]
            this.operands = [words[1], words[3]]
        }
        map.set(this.name, this)
    }

    compute(pt: number): number {
        if (this.name == "humn" && pt == 2) {
            return NaN
        }
        if (this.num != undefined) {
            return this.num
        }
        const op0 = this.map.get(this.operands[0]).compute(pt)
        const op1 = this.map.get(this.operands[1]).compute(pt)
        switch (this.operation) {
            case "+":
                return op0+op1
            case "-":
                return op0-op1
            case "*":
                return op0*op1
            case "/":
                return op0/op1
        }
    }

    find(x: number): number {
        if (this.name == "humn") {
            return x
        }
        const m0 = this.map.get(this.operands[0])
        const op0 = m0.compute(2)
        const m1 = this.map.get(this.operands[1])
        const op1 = m1.compute(2)
        if (this.name == "root") {
            if (Number.isNaN(op0) && !Number.isNaN(op1)) {
                return m0.find(op1)
            }
            if (!Number.isNaN(op0) && Number.isNaN(op1)) {
                return m1.find(op0)
            }
            throw "error"
        }
        switch (this.operation) {
            case "+":
                if (Number.isNaN(op0) && !Number.isNaN(op1)) {
                    return m0.find(x - op1)
                }
                if (!Number.isNaN(op0) && Number.isNaN(op1)) {
                    return m1.find(x - op0)
                }
                throw "error"
            case "-":
                if (Number.isNaN(op0) && !Number.isNaN(op1)) {
                    return m0.find(x + op1)
                }
                if (!Number.isNaN(op0) && Number.isNaN(op1)) {
                    return m1.find(op0 - x)
                }
                throw "error"
            case "*":
                if (Number.isNaN(op0) && !Number.isNaN(op1)) {
                    return m0.find(x / op1)
                }
                if (!Number.isNaN(op0) && Number.isNaN(op1)) {
                    return m1.find(x / op0)
                }
                throw "error"
            case "/":
                if (Number.isNaN(op0) && !Number.isNaN(op1)) {
                    return m0.find(x * op1)
                }
                if (!Number.isNaN(op0) && Number.isNaN(op1)) {
                    return m1.find(op0 / x)
                }
                throw "error"
        }
    }
}

function parse(data: string): Map<string, Monkey> {
    const map = new Map()
    data.trim().split("\n").forEach(line => new Monkey(map, line))
    return map
}

function puzzle(data: string) {
    const map = parse(data)
    const root = map.get("root")
    const rnum = root.compute(1)
    console.log("Part One:", rnum)
    const map2 = parse(data)
    const root2 = map2.get("root")
    const r2 = root2.find(0)
    console.log("Part Two:", r2)
}

fs.readFile('input21', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  puzzle(data);
});

const td = `
root: pppw + sjmn
dbpl: 5
cczh: sllz + lgvd
zczc: 2
ptdq: humn - dvpt
dvpt: 3
lfqf: 4
humn: 5
ljgn: 2
sjmn: drzm * dbpl
sllz: 4
pppw: cczh / lfqf
lgvd: ljgn * ptdq
drzm: hmdt - zczc
hmdt: 32
`

//puzzle(td)
