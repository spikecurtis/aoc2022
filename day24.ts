export {};
const fs = require('fs');
const Heap = require('heap')

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

    manhattanDistance(other: Point): number {
        const oc = other.coords
        if (this.coords.length != oc.length) {
            throw "Points must have same number of dimensions"
        }
        let dist = 0
        for (let d=0; d<this.coords.length; d++) {
            dist += Math.abs(this.coords[d] - oc[d])
        }
        return dist
    }
}

let Moves = [
    new Point(0, 1),
    new Point(0, -1),
    new Point(1, 0),
    new Point(-1, 0)
]

class Blizzards {
    verticals: Blizzard[][]
    horizontals: Blizzard[][]
    rows: number
    cols: number
    constructor(rows, cols) {
        this.rows = rows
        this.cols = cols
        this.verticals = []
        this.horizontals = []
        for (let c = 0; c<cols; c++) {
            this.verticals.push([])
        }
        for (let r = 0; r<rows; r++) {
            this.horizontals.push([])
        }
    }

    blocked(p: Point, time: number): boolean {
        let row = p.coords[0]
        let col = p.coords[1]
        if (row < 0 || row == this.rows) {
            // initial state
            return false
        }
        return (this.horizontals[row].map(b => b.blocked(col, time)).reduce((p,t) => p||t, false) ||
            this.verticals[col].map(b => b.blocked(row, time)).reduce((p, t) => p||t, false))
    }
}

class Blizzard {
    start: number
    sign: number
    modulus: number

    constructor(start, sign, modulus) {
        this.start = start
        this.sign = sign
        this.modulus = modulus
    }

    blocked(square: number, time: number): boolean {
        let k = this.start + (this.sign*time)
        k = ((k % this.modulus) + this.modulus) % this.modulus
        return k == square
    }
}


function parse(data: string): {blizzards: Blizzards, start: Point, end: Point} {
    const lines = data.trim().split("\n")
    const cols = lines[0].length - 2
    const rows = lines.length - 2
    const start = new Point(-1, 0)
    const end = new Point(rows, cols-1)
    const blz = new Blizzards(rows, cols)
    lines.forEach((line, idx) => {
        const row = idx - 1
        line.trim().split("").forEach((s, j) => {
            const col = j - 1
            switch (s) {
                case "<":
                    blz.horizontals[row].push(new Blizzard(col, -1, cols))
                    break
                case ">":
                    blz.horizontals[row].push(new Blizzard(col, 1, cols))
                    break
                case "^":
                    blz.verticals[col].push(new Blizzard(row, -1, rows))
                    break
                case "v":
                    blz.verticals[col].push(new Blizzard(row, 1, rows))
                    break
            }
        })
    })
    return {blizzards: blz, start, end}
}

class Event {
    place: Point
    time: number
    constructor(p: Point, t: number) {
        this.place = p
        this.time = t
    }
    mapKey(): string {
        return this.place.mapKey() + "|" + this.time
    }

    neighbors(bl: Blizzards): Event[] {
        let out = []
        for (const m of Moves) {
            let np = this.place.plus(m)
            if (np.coords[0] < 0 ||
                np.coords[1] < 0 ||
                np.coords[0] >= bl.rows ||
                np.coords[1] >= bl.cols) {
                continue
            }
            let nt = this.time + 1
            if (bl.blocked(np, nt)) {
                continue
            }
            out.push(new Event(np, nt))
        }
        // wait
        if (!bl.blocked(this.place, this.time+1)) {
            out.push(new Event(this.place, this.time+1))
        }
        return out
    }
}

interface Node {
    event: Event
    estimate: number
}

function route(bl: Blizzards, start: Point, end: Point, t: number): number {
    const h = event => event.place.manhattanDistance(end)
    const open = new Heap((a,b) => a.estimate-b.estimate)
    const openSet = new Set()
    let se: Event = new Event(start, t)
    open.push({event: se, estimate: t+h(se)})
    openSet.add(se.mapKey())
    const closed: Set<string> = new Set()
    let mt = 0
    while (!open.empty()) {
        let item: Node = open.pop()
        if (item.event.time > mt) {
            console.log("Max time:", item.event.time, "H(e):", item.estimate-item.event.time)
            mt = item.event.time
        }

        // is this adjacent to the goal?
        if (item.event.time == item.estimate - 1) {
            return item.event.time + 1
        }
        for (const n of item.event.neighbors(bl)) {
            if (closed.has(n.mapKey()) || openSet.has(n.mapKey())) {
                continue
            }
            open.push({event: n, estimate: n.time + h(n)})
            openSet.add(n.mapKey())
        }
        closed.add(item.event.mapKey())
    }
}


function puzzle(data: string) {
    const {blizzards, start, end} = parse(data)
    const p1 = route(blizzards, start, end, 0)
    console.log("Part One:", p1)
    const back = route(blizzards, end, start, p1)
    const p2 = route(blizzards, start, end, back)
    console.log("Part Two:", p2)
}

fs.readFile('input24', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  puzzle(data);
});

const td = `#.######
#>>.<^<#
#.<..<<#
#>v.><>#
#<^v^^>#
######.#`

//puzzle(td)
