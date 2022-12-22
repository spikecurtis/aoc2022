export {};
const fs = require('fs');

interface Pointlike {
  coords: number[]
  mapKey: () => string
  manhattanDistance: (other: Pointlike) => number
  neighbors: () => Pointlike[]
}

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

  manhattanDistance(other: Pointlike): number {
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

  neighbors(): Pointlike[] {
    const n = []
    for (let d = 0; d<this.coords.length; d++) {
      const up = Array.from(this.coords)
      up[d] += 1
      n.push(new Point(...up))
      const down = Array.from(this.coords)
      down[d] -= 1
      n.push(new Point(...down))
    }
    return n
  }
}

interface Setlike {
  has
  add
}

class Classifier {
  maxBounds: number[]
  minBounds: number[]
  solidSet: Setlike
  interiorSet: Setlike
  exteriorSet: Setlike

  constructor(solid: Pointlike[]) {
    this.minBounds = new Array(solid[0].coords.length).fill(Infinity)
    this.maxBounds = new Array(solid[0].coords.length).fill(-Infinity)
    this.solidSet = new Set()
    for (const p of solid) {
      this.solidSet.add(p.mapKey())
      for (let d = 0; d<p.coords.length; d++) {
        this.minBounds[d] = Math.min(this.minBounds[d], p.coords[d])
        this.maxBounds[d] = Math.max(this.maxBounds[d], p.coords[d])
      }
    }
    this.interiorSet = new Set()
    this.exteriorSet = new Set()
  }

  getClass(p: Pointlike): string {
    if (this.solidSet.has(p.mapKey())) {
      return "solid"
    }
    if (this.interiorSet.has(p.mapKey())) {
      return "interior"
    }
    if (this.exteriorSet.has(p.mapKey())) {
      return "exterior"
    }
    for (let d = 0; d < p.coords.length; d++) {
      if (p.coords[d] > this.maxBounds[d]) {
        return "exterior"
      }
      if (p.coords[d] < this.minBounds[d]) {
        return "exterior"
      }
    }
    return "unknown"
  }
  isExterior(p: Pointlike): boolean {
    const cls = this.getClass(p)
    if (cls == "exterior") {
      return true
    }
    if (cls != "unknown") {
      return false
    }

    // within bounds, but we haven't seen the point before.
    // search to see if we can get to an interior
    // or exterior point
    const open = []
    open.push(p)
    const closed = []

    while (open.length > 0) {
      let pnt = open.pop()
      for (const n of pnt.neighbors()) {
        if (closed.find(c => c.mapKey() == n.mapKey())) {
          continue
        }
        let ncls = this.getClass(n)
        if (ncls == "solid") {
          continue
        }
        if (ncls == "exterior") {
          this.exteriorSet.add(n.mapKey())
          this.exteriorSet.add(pnt.mapKey())
          closed.forEach(c => this.exteriorSet.add(c.mapKey()))
          open.forEach(o => this.exteriorSet.add(o.mapKey()))
          return true
        }
        if (ncls == "interior") {
          this.interiorSet.add(n.mapKey())
          this.interiorSet.add(pnt.mapKey())
          closed.forEach((c => this.interiorSet.add(c.mapKey())))
          open.forEach(o => this.interiorSet.add(o.mapKey()))
          return false
        }
        open.push(n)
      }
      closed.push(pnt)
    }
    // if we explored everything and didn't get to the outside
    // we are inside
    closed.forEach((c => this.interiorSet.add(c.mapKey())))
    return false
  }
}

function parse(data: string): Pointlike[] {
  return data.trim().split("\n").map(line => {
    let cs = line.trim().split(",")
    let coords = cs.map(p => {
      return parseInt(p)
    })
    return new Point(...coords)
  })
}

function puzzle(data: string) {
  const points = parse(data)
  const pset = new Set()
  for (const p of points) {
    pset.add(p.mapKey())
  }
  let area = 0
  for (const p of points) {
    for (const n of p.neighbors()) {
      if (!pset.has(n.mapKey())) {
        area++
      }
    }
  }
  console.log("Part One:", area)

  const classifier = new Classifier(points)
  area = 0
  for (const p of points) {
    for (const n of p.neighbors()) {
      if (classifier.isExterior(n)) {
        area++
      }
    }
  }
  console.log("Part Two:", area)
}

fs.readFile('input18', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  puzzle(data);
});

const td = `2,2,2
1,2,2
3,2,2
2,1,2
2,3,2
2,2,1
2,2,3
2,2,4
2,2,6
1,2,5
3,2,5
2,1,5
2,3,5
`

//puzzle(td)
