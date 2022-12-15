export {};
const fs = require('fs');

interface Pointlike {
  coords: number[]
  mapKey: () => string
  manhattanDistance: (other: Pointlike) => number
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
}

function overlapAtY(sensor: Pointlike, dist: number, y: number): number[] {
  const dy = Math.abs(sensor.coords[1] - y)
  const ov = dist - dy
  if (ov < 0) {
    // no overlap
    return [0, 0]
  }
  return [sensor.coords[0]-ov, sensor.coords[0]+ov+1]
}

function mergeOverlaps(overlaps: number[][]) {
  overlaps.sort((a, b) => a[0]-b[0])
  for (let i = 0; i< overlaps.length-1; i++) {

    while (true) {
      if (i==overlaps.length-1 || overlaps[i][1] < overlaps[i+1][0]) {
        break
      }
      overlaps[i][1] = Math.max(overlaps[i][1], overlaps[i+1][1])
      overlaps.splice(i+1, 1)
    }
  }
}

function parse(data: string): {sensors: Pointlike[], beacons: Pointlike[]} {
  let sensors = []
  let beacons = []
  data.trim().split("\n").forEach(line => {
    const words = line.trim().split(" ")

    const sx = words[2]
    const sxi = parseInt(sx.slice(2, sx.length-1))
    const sy = words[3]
    const syi = parseInt(sy.slice(2, sy.length-1))
    sensors.push(new Point(sxi, syi))

    const bx = words[8]
    const bxi = parseInt(bx.slice(2, bx.length-1))
    const by = words[9]
    const byi = parseInt(by.slice(2))
    beacons.push(new Point(bxi, byi))
  })
  return {sensors, beacons}
}

function checkFree(
    lStart: number, lEnd: number,
    sensors: Pointlike[], dist: number[],
    xEnd,
) {
  for (let y = lStart; y<=lEnd; y++) {
    let o2 = sensors.map((s, i) => overlapAtY(s, dist[i], y))
    mergeOverlaps(o2)
    if (o2.length == 0) {
      // found, trivially
      return new Point(0, y)
    }
    if (o2[0][0] > 0) {
      // first overlap starts greater than x=0
      return new Point(0, y)
    }
    for (let j = 0; j < o2.length; j++) {
      if (o2[j][1] >= 0 && o2[j][1] <= xEnd) {
        // overlap ends in range
        return new Point(o2[j][1], y)
      }
    }
  }
  return null
}

function puzzle(data: string, y1: number, x2, y2) {
  const {sensors, beacons} = parse(data)
  const dist = sensors.map((s, i) => s.manhattanDistance(beacons[i]))
  let overlaps = sensors.map((s, i) => overlapAtY(s, dist[i], y1))
  mergeOverlaps(overlaps)
  const clear = overlaps.reduce((prev, o) => prev + o[1] - o[0], 0)
  let yBeacons = new Set()
  for (const b of beacons) {
    if (b.coords[1] == y1) {
      yBeacons.add(b.coords[0])
    }
  }
  console.log("Part One:", clear - yBeacons.size)

  const distress = checkFree(0, y2, sensors, dist, x2)
  console.log("Part 2:", 4000000*distress.coords[0] + distress.coords[1])
}

fs.readFile('input15', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  puzzle(data, 2000000, 4000000, 4000000);
});

const td = `Sensor at x=2, y=18: closest beacon is at x=-2, y=15
Sensor at x=9, y=16: closest beacon is at x=10, y=16
Sensor at x=13, y=2: closest beacon is at x=15, y=3
Sensor at x=12, y=14: closest beacon is at x=10, y=16
Sensor at x=10, y=20: closest beacon is at x=10, y=16
Sensor at x=14, y=17: closest beacon is at x=10, y=16
Sensor at x=8, y=7: closest beacon is at x=2, y=10
Sensor at x=2, y=0: closest beacon is at x=2, y=10
Sensor at x=0, y=11: closest beacon is at x=2, y=10
Sensor at x=20, y=14: closest beacon is at x=25, y=17
Sensor at x=17, y=20: closest beacon is at x=21, y=22
Sensor at x=16, y=7: closest beacon is at x=15, y=3
Sensor at x=14, y=3: closest beacon is at x=15, y=3
Sensor at x=20, y=1: closest beacon is at x=15, y=3
`

//puzzle(td, 10, 20, 20)
