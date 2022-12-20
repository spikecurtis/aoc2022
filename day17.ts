export {};
const fs = require('fs');

const holeWidth = 7

class Sim {
  moveIdx: number
  moves: string[]
  stuff: string[][]
  height: number
  rockIdx: number

  constructor(moves: string[]) {
    this.height = 0
    this.moves = moves
    this.moveIdx = 0
    this.stuff = []
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
    for (let r = this.stuff.length - 1; r>=0; r--) {
      console.log("|" + this.stuff[r].join("") + "|")
    }
    console.log("---------")
  }
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
        if (r < 0) {
          // floor
          collision = true
          return
        }
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
  const s = new Sim(moves)
  for (let i = 0; i<2022; i++) {
    s.drop()
  }
  s.print()

  console.log("Part One:", s.height)
  console.log("Part Two:")
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
