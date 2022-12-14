export {};
const fs = require('fs');

class Sim {
  stuff: string[][]
  minX: number
  sand: number
  floorY: number
  constructor(maxX, maxY) {
    this.floorY = maxY + 2
    this.stuff = new Array(this.floorY).fill(0).
      map(_ => new Array(500+this.floorY+1).fill(" "))
    this.stuff[0][500] = "+"
    this.stuff.push(new Array(500+this.floorY+1).fill("="))
    this.minX = maxX - 10
    this.sand = 0
  }

  rockPath(path: number[][]) {
    for (let i=0; i<path.length-1; i++) {
      this.rockPathSegment(path[i], path[i+1])
    }
  }
  rockPathSegment(start: number[], stop: number[]) {
    let dx = Math.sign(stop[0] - start[0])
    let dy = Math.sign(stop[1] - start[1])
    let x = start[0]
    let y = start[1]
    do {
      if (x < this.minX) {
        this.minX = x - 1
      }
      this.stuff[y][x] = "█"
      x += dx
      y += dy
    } while (x != stop[0] || y != stop[1])
    this.stuff[y][x] = "█"
  }
  print() {
    const cols = Array.from({length: this.stuff[0].length},(_, i) => i)
    console.log("   ", cols.map(i => (Math.floor(i/100) % 10 ).toString()).slice(this.minX).join(""))
    console.log("   ", cols.map(i => (Math.floor(i/10) % 10 ).toString()).slice(this.minX).join(""))
    console.log("   ", cols.map(i => (i % 10).toString()).slice(this.minX).join(""))

    console.log(this.stuff.map((row, i) => {
      return (Math.floor(i/100) % 10 ).toString() +
          (Math.floor(i/10) % 10 ).toString() +
          (i % 10).toString() +  " " +
      row.slice(this.minX).join("")
    }).join("\n"))
  }

  dropOne(part: number): boolean {
    let x = 500
    let y = 0
    while (y < this.floorY-1) {
      if (this.stuff[y+1][x] == " ") {
        y++
        continue
      }
      if (this.stuff[y+1][x-1] == " ") {
        y++
        x--
        continue
      }
      if (this.stuff[y+1][x+1] == " ") {
        y++
        x++
        continue
      }
      // blocked
      this.stuff[y][x] = "o"
      this.sand++
      // is sand entirely blocked?
      return y != 0
    }
    // landed on floor
    if (part == 1) {
      return false
    }
    this.stuff[y][x] = "o"
    this.sand++
    return true
  }
}

function parse(data: string) {
  let coords = data.trim().split("\n").map(line => {
    return line.trim().split(" -> ").map(pair => {
      let pl = pair.trim().split(",").map(i => {
        return parseInt(i)
      })
      return pl
    })
  })
  let maxx = 0
  let maxy = 0
  for (const pair of coords.flat(1)) {
    if (pair[0]> maxx) {
      maxx = pair[0]
    }
    if (pair[1]> maxy) {
      maxy = pair[1]
    }
  }
  let sim = new Sim(maxx, maxy)
  for (const path of coords) {
    sim.rockPath(path)
  }
  return sim
}

function puzzle(data: string) {
  let sim = parse(data)
  while(sim.dropOne(1)) {
    //sim.print()
  }
  sim.print()
  console.log("Part One:", sim.sand)

  sim = parse(data)
  while(sim.dropOne(2)) {
    //sim.print()
  }
  sim.print()
  console.log("Part Two:", sim.sand)
}

fs.readFile('input14', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  puzzle(data);
});
