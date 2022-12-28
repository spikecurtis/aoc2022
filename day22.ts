export {};
const fs = require('fs');

type Move = number|"L"|"R"

function parseBoard(s: string): string[][] {
    const lines = s.split("\n")
    const width = lines.reduce((p, l) => Math.max(p, l.length), 0)
    return lines.map(l => {
        const row = new Array(width).fill(" ")
        l.split("").forEach((b, i) => row[i] = b)
        return row
    })
}

function parseMoves(s: string): Move[] {
    const moves = []
    let i = 0
    let j = 1
    while (j<s.length) {
        let m = s.slice(i,j)
        if (m == "L" || m == "R") {
            moves.push(m)
            i=j++
            continue
        }
        if (s[j] == "L" || s[j] == "R") {
            moves.push(parseInt(m))
            i=j++
            continue
        }
        j++
    }
    let m = s.slice(i,j)
    if (m == "L" || m == "R") {
        moves.push(m)
    } else {
        moves.push(parseInt(m))
    }
    return moves
}

const Step = [
    [0,1], // Right
    [1,0], // Down
    [0,-1], // Left
    [-1,0], // Up
]

class Gamestate {
    board: string[][]
    pos: number[]
    dir: number
    oobMap: (pos: number[], dir: number) => {pos: number[], dir: number}

    constructor(board: string[][], oobMap: (pos: number[], dir: number) => {pos: number[], dir: number}) {
        this.board = board
        this.oobMap = oobMap
        this.dir = 0 // right
        this.pos = [0, 50]
        //this.pos = this.stepWrap(pos, Step[this.dir])
    }

    at(pos: number[]): string {
        return this.board[pos[0]][pos[1]]
    }

    stepWrap(pos: number[], dir: number): {pos: number[], dir: number} {
        const step = Step[dir]
        let row = pos[0] + step[0]
        let col = pos[1] + step[1]
        pos = [row, col]
        if (row >=0 && row < this.board.length
            && col >=0 && col < this.board[0].length
            && this.at(pos) != " ") {
            return {pos, dir}
        }
        return this.oobMap(pos, dir)
    }

    move(m: Move) {
        if (m == "R") {
            this.dir = (this.dir + 1) % Step.length
            return
        }
        if (m == "L") {
            this.dir = (this.dir - 1 + Step.length) % Step.length
            return
        }
        for (let i=0; i<m; i++) {
            let {pos, dir} = this.stepWrap(this.pos, this.dir)
            if (this.at(pos) == "#") {
                return
            }
            this.pos = pos
            this.dir = dir
        }
    }
}


function parse(data: string): {board, moves} {
    const parts = data.split("\n\n")
    const board = parseBoard(parts[0])
    const moves = parseMoves(parts[1])
    return {board, moves}
}


function puzzle(data: string, oobMap) {
    const {board, moves} = parse(data)
    const gs = new Gamestate(board, oobMap)
    moves.forEach(m => gs.move(m))
    const p1 = 1000*(gs.pos[0]+1) + 4*(gs.pos[1]+1) + gs.dir
    console.log("Part One:", p1)
    console.log("Part Two:",)
}

fs.readFile('input22', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  puzzle(data, oobR2);
});

const td = `        ...#
        .#..
        #...
        ....
...#.......#
........#...
..#....#....
..........#.
        ...#....
        .....#..
        .#......
        ......#.

10R5L5R10L4R5L5
`

function oobR2(pos: number[], dir: number): {pos: number[], dir: number} {
    const faceSize = 50
    const fPos = pos.map(c => {
        if (c >= 0) {
            return Math.floor(c/faceSize)
        }
        return -1
    })
    const fR = pos.map(c => {
        if (c >=0) {
            return c % faceSize
        }
        return -1
    })
    if (fPos[0] == 0 && fPos[1] == 0) {
        let row = 3 * faceSize - fR[0] - 1
        let col = 0
        let dir = 0
        return {pos: [row, col], dir}
    }
    if (fPos[0] == 0 && fPos[1] == 3) {
        let row = 3 * faceSize - fR[0] - 1
        let col = 2 * faceSize - 1
        let dir = 2
        return {pos: [row, col], dir}
    }
    if (fPos[0] == -1 && fPos[1] == 1) {
        let row = 3 * faceSize + fR[1]
        let col = 0
        let dir = 0
        return {pos: [row, col], dir}
    }
    if (fPos[0] == -1 && fPos[1] == 2) {
        let row = 4*faceSize - 1
        let col = fR[1]
        let dir = 3
        return {pos: [row, col], dir}
    }
    if (fPos[0] == 1 && fPos[1] == 0 && dir == 2) {
        let row = 2*faceSize
        let col = fR[0]
        let dir = 1
        return {pos: [row, col], dir}
    }
    if (fPos[0] == 1 && fPos[1] == 0 && dir == 3) {
        let row = faceSize + fR[1]
        let col = faceSize
        let dir = 0
        return {pos: [row, col], dir}
    }
    if (fPos[0] == 1 && fPos[1] == 2 && dir == 0) {
        let row = faceSize - 1
        let col = 2*faceSize + fR[0]
        let dir = 3
        return {pos: [row, col], dir}
    }
    if (fPos[0] == 1 && fPos[1] == 2 && dir == 1) {
        let row = faceSize + fR[1]
        let col = 2*faceSize - 1
        let dir = 2
        return {pos: [row, col], dir}
    }
    if (fPos[0] == 2 && fPos[1] == 2) {
        let row = faceSize - fR[0] - 1
        let col = 3*faceSize - 1
        let dir = 2
        return {pos: [row, col], dir}
    }
    if (fPos[0] == 3 && fPos[1] == 1 && dir == 1) {
        let row = 3*faceSize + fR[1]
        let col = faceSize - 1
        let dir = 2
        return {pos: [row, col], dir}
    }
    if (fPos[0] == 3 && fPos[1] == 1 && dir == 0) {
        let row = 3*faceSize - 1
        let col = faceSize + fR[0]
        let dir = 3
        return {pos: [row, col], dir}
    }
    if (fPos[0] == 4 && fPos[1] == 0) {
        let row = 0
        let col = 2*faceSize + fR[1]
        let dir = 1
        return {pos: [row, col], dir}
    }
    if (fPos[0] == 3 && fPos[1] == -1) {
        let row = 0
        let col = faceSize + fR[0]
        let dir = 1
        return {pos: [row, col], dir}
    }
    if (fPos[0] == 2 && fPos[1] == -1) {
        let row = faceSize - fR[0] - 1
        let col = faceSize
        let dir = 0
        return {pos: [row, col], dir}
    }
    throw "error"
}

//puzzle(td)
