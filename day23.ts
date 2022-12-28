export {};
const fs = require('fs');

class Point {
    coords: number[]
    constructor(...coords: number[]) {
        this.coords = Array.from(coords)
    }

    mapKey(): string {
        return this.coords.join(",")
    }

    toString(): string {
        return "(" + this.mapKey() + ")"
    }

    plus(other: Point): Point {
        return new Point(...this.coords.map((v, i) => v+other.coords[i]))
    }
}

const Checks = [
    [[-1, 0], [-1,-1], [-1, 1]], // N
    [[ 1, 0], [ 1,-1], [ 1, 1]], // S
    [[ 0,-1], [ 1,-1], [-1,-1]], // W
    [[ 0, 1], [ 1, 1], [-1, 1]], // E
]

class Elf {
    current: Point
    next: Point|null

    constructor(p: Point) {
        this.current = p
        this.next = null
    }

    propose(idx: number, current: Set<string>, moveMap: Map<string, number>) {
        this.next = null
        let passed = []
        for (let i=0; i<4; i++) {
            let checks = Checks[(idx+i)%4]
            passed.push(checks.every(coords => {
                let p = new Point(...coords)
                let n = this.current.plus(p)
                return !current.has(n.mapKey())
            }))
        }
        if (passed.reduce((p, t) => p && t)) {
            // all ok
            return
        }
        for (let i=0; i<4; i++) {
            if (passed[i]) {
                this.next = this.current.plus(new Point(...Checks[(idx+i)%4][0]))
                let m = moveMap.get(this.next.mapKey())
                if (m == undefined) {
                    m = 0
                }
                moveMap.set(this.next.mapKey(), m+1)
                return
            }
        }
    }

    resolve(moveMap: Map<string, number>): boolean {
        if (this.next == null) {
            return true
        }
        if (moveMap.get(this.next.mapKey()) > 1) {
            return true
        }
        this.current = this.next
        return false
    }

}

function round(elves: Elf[], idx: number): boolean {
    const cur: Set<string> = new Set()
    const moveMap = new Map()
    elves.forEach(elf => {
        if (cur.has(elf.current.mapKey())) {
            throw "dupe"
        }
        cur.add(elf.current.mapKey())
    })
    elves.forEach(elf => elf.propose(idx, cur, moveMap))
    const done = elves.map(elf => elf.resolve(moveMap))
    return done.reduce((p, t) => p&&t)
}

function bboxCount(elves: Elf[]) {
    let cMin = Infinity
    let cMax = -Infinity
    let rMin = Infinity
    let rMax = -Infinity
    for (const elf of elves) {
        cMin = Math.min(cMin, elf.current.coords[1])
        cMax = Math.max(cMax, elf.current.coords[1])
        rMin = Math.min(rMin, elf.current.coords[0])
        rMax = Math.max(rMax, elf.current.coords[0])
    }
    return (rMax-rMin+1)*(cMax-cMin+1) - elves.length
}

function logBbox(elves: Elf[]) {
    let cMin = Infinity
    let cMax = -Infinity
    let rMin = Infinity
    let rMax = -Infinity
    for (const elf of elves) {
        cMin = Math.min(cMin, elf.current.coords[1])
        cMax = Math.max(cMax, elf.current.coords[1])
        rMin = Math.min(rMin, elf.current.coords[0])
        rMax = Math.max(rMax, elf.current.coords[0])
    }
    console.log(rMin, rMax, cMin, cMax)
}

function logBoard(elves: Elf[]) {
    let cMin = Infinity
    let cMax = -Infinity
    let rMin = Infinity
    let rMax = -Infinity
    let eSet = new Set()
    for (const elf of elves) {
        cMin = Math.min(cMin, elf.current.coords[1])
        cMax = Math.max(cMax, elf.current.coords[1])
        rMin = Math.min(rMin, elf.current.coords[0])
        rMax = Math.max(rMax, elf.current.coords[0])
        eSet.add(elf.current.mapKey())
    }
    for (let r = rMin; r<=rMax; r++) {
        let row = []
        for (let c = cMin; c<=cMax; c++) {
            let k = "" + r + "," + c
            if (eSet.has(k)) {
                row.push("█")
                continue
            }
            row.push(" ")
        }
        console.log(row.join(""))
    }
}

function parse(data: string): Elf[] {
    let elves = []
    data.trim().split("\n").forEach(
        (line,row) => line.trim().split("").forEach((s, col) =>{
            if (s == "#") {
                elves.push(new Elf(new Point(row, col)))
            }
        }))
    return elves
}


function puzzle(data: string) {
    const elves = parse(data)
    let idx = 0
    for (let i=0; i<10; i++) {
        round(elves, idx)
        //console.log("Round:", i+1, "Idx:", idx)
        //logBoard(elves)
        idx = (idx+1) % 4
    }
    const p1 = bboxCount(elves)
    console.log("Part One:", p1)
    let i = 10
    while (!round(elves, idx)) {
        i++
        idx = (idx+1) % 4
        // if (i%10==0) {
        //     let moved = elves.map(elf => elf.next != null).reduce((p, t) => p+(t?1:0), 0)
        //     console.log("Round:", i+1, moved, "/", elves.length)
        //     logBbox(elves)
        //     console.log("Round:", i+1, "Idx:", idx)
        //     logBoard(elves)
        // }
    }
    console.log("Part Two:", i+1)
}

fs.readFile('input23', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  puzzle(data);
});

const td = `....#..
..###.#
#...#.#
.#...##
#.###..
##.#.##
.#..#..`

//puzzle(td)
