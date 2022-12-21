export {};
const fs = require('fs');

const holeWidth = 7
const endLines = 60

function copyStuff(stuff: string[][]): string[][] {
  const out = Array(stuff.length)
  for (let i = 0; i<stuff.length; i++) {
    out[i] = Array.from(stuff[i])
  }
  return out
}

class Sim {
  moveIdx: number
  moves: string[]
  stuff: string[][]
  height: number
  initHeight: number
  rockIdx: number

  constructor(moves: string[], height: number, stuff: string[][]) {

    this.height = height
    this.initHeight = height
    this.moves = moves
    this.moveIdx = 0
    this.stuff = copyStuff(stuff)
    this.rockIdx = 0
  }

  drop() {
    // 3 for rock above stack, 4 for max height of rock itself
    const newHeight = this.height + 3 + 4
    while (this.stuff.length < newHeight) {
      this.stuff.push(Array(holeWidth).fill(" "))
    }
    const rock = new Rock(this.rockIdx++, this.height + 3, this.stuff)
    do {
      let move = this.moves[this.moveIdx++ % this.moves.length]
      rock.lr(move)
    } while (rock.down())
    this.height = Math.max(rock.land(), this.height)
  }

  print() {
    console.log(stuffString(this.stuff))
  }

  sig(): string {
    let s = ""
    s += this.moveIdx % this.moves.length
    s += ","
    s += this.rockIdx % numRockShapes
    let i = Math.max(this.stuff.length - endLines, 0)
    s += stuffString(this.stuff.slice(i))
    return s
  }
}

function stuffString(stuff: string[][]): string {
  let out = ""
  for (let r = stuff.length - 1; r>=0; r--) {
    out += "|" + stuff[r].join("") + "|" + "\n"
  }
  return out
}

const numRockShapes = 5
class Rock {
  shape: string[][]
  x: number
  y: number
  stuff: string[][]

  constructor(index: number, y: number, stuff: string[][]) {
    let shape = ''
    switch (index % numRockShapes) {
      case 0:
        shape = `****`
        break
      case 1:
        shape = ` * 
***
 * `
        break
      case 2:
        shape = `  *
  *
***`
        break
      case 3:
        shape = `*
*
*
*`
        break
      case 4:
        shape = `**
**`
        break
    }
    this.shape = shape.split("\n").map(l => l.split(""))
    this.x = 2
    this.y = y
    this.stuff = stuff
  }

  lr(move: string) {
    if (move == "<" &&
        this.x > 0 &&
        !this.collisionCheck(this.x - 1, this.y)) {
      this.x--
    }
    if (move == ">" &&
        this.x + this.shape[0].length < holeWidth &&
        !this.collisionCheck(this.x+1, this.y)) {
      this.x++
    }
  }

  down() {
    let collision = this.collisionCheck(this.x, this.y - 1)
    if (collision) {
      return false
    }
    this.y--
    return true
  }

  collisionCheck(x: number, y: number): boolean {
    let collision = false
    this.shape.forEach((row, j) => {
      row.forEach((s, i) => {
        if (s == " ") {
          return
        }
        let r = y + this.shape.length - j - 1
        let c = x + i
        if (this.stuff[r][c] != " ") {
          collision = true
          return
        }
      })
    })
    return collision
  }

  land(): number {
    this.shape.forEach((row, j) => {
      row.forEach((s, i) => {
        if (s == " ") {
          return
        }
        let r = this.y + this.shape.length - j - 1
        let c = this.x + i
        this.stuff[r][c] = "█"
      })
    })
    return this.y + this.shape.length
  }
}


function parse(data: string): string[] {
  return data.trim().split("")
}

function puzzle(data: string) {
  const moves = parse(data)
  const floorStuff = [Array(holeWidth).fill("█")]
  let s = new Sim(moves, 1, floorStuff)
  for (let i = 0; i<2022; i++) {
    s.drop()
  }
  //s.print()
  console.log("Num moves:", moves.length)

  console.log("Part One:", s.height - s.initHeight)

  const states = new Map()
  s = new Sim(moves, 1, floorStuff)
  let oldState = undefined
  let sig = ""
  while (s.rockIdx < 1000000000000) {
    s.drop()
    sig = s.sig()
    oldState = states.get(sig)
    if (oldState != undefined) {
      break
    }
    states.set(sig, {height: s.height, rocks: s.rockIdx})
  }
  console.log(oldState)
  const pRocks = s.rockIdx - oldState.rocks
  const pHeight = s.height - oldState.height
  const rocksLeft = 1000000000000 - s.rockIdx
  const periods = Math.floor(rocksLeft / pRocks)
  const rocksToSim = rocksLeft - (pRocks * periods)
  for (let i = 0; i<rocksToSim; i++) {
    s.drop()
  }
  const totalHeight = s.height - s.initHeight + (periods * pHeight)
  console.log("Part Two:", totalHeight)
}

fs.readFile('input17', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  puzzle(data);
});

const td = `>>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>
`

//puzzle(td)
