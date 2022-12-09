export {};
const fs = require('fs');

function parseMove(s: string): string[] {
    let parts = s.trim().split(" ")
    if (parts.length != 2) {
        throw "Invalid move: " + s
    }
    let steps = parseInt(parts[1])
    if (Number.isNaN(steps)) {
        throw "Invalid steps: " + s
    }
    return Array(steps).fill(parts[0])
}

class Rope {
    x: number[]
    y: number[]
    tailVisited: {add, size}
    constructor(knots: number) {
        this.x = new Array(knots).fill(0)
        this.y = new Array(knots).fill(0);
        this.tailVisited = new Set();
        this.recordTail()
    }

    recordTail() {
        const l = this.x.length - 1
        this.tailVisited.add([this.x[l], this.y[l]].join(","))
    }

    move(m: string) {
        switch (m) {
            case 'R':
                this.x[0]++
                break
            case 'L':
                this.x[0]--
                break
            case 'U':
                this.y[0]++
                break
            case 'D':
                this.y[0]--
                break
        }
        // knot updates
        for (let i = 1; i < this.x.length; i++){
            const dx = this.x[i-1] - this.x[i]
            const dy = this.y[i-1] - this.y[i]
            if (Math.abs(dx) <= 1 && Math.abs(dy) <= 1) {
                return
            }
            this.x[i] += Math.sign(dx)
            this.y[i] += Math.sign(dy)
        }
        this.recordTail()
    }
}

function puzzle(data: string) {
    const moves = data.trim().split("\n").map(parseMove).flat()
    let r = new Rope(2)
    moves.forEach(m => r.move(m))

    console.log("Part One:", r.tailVisited.size)

    let r2 = new Rope(10)
    moves.forEach(m => r2.move(m))

    console.log("Part Two:", r2.tailVisited.size)
}

fs.readFile('input09', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  puzzle(data);
});
