export {};
const fs = require('fs');

function visible(grid: number[][], r: number, c: number): boolean {
    const t = grid[r][c]
    // left
    let visible = true
    for (let x = c-1; x>=0; x--) {
        if (grid[r][x]>=t) {
            visible = false
            break
        }
    }
    if (visible) {
        return true
    }
    // right
    visible = true
    for (let x = c+1; x<grid.length; x++) {
        if (grid[r][x]>=t) {
            visible = false
            break
        }
    }
    if (visible) {
        return true
    }
    // up
    visible = true
    for (let y = r-1; y>=0; y--) {
        if (grid[y][c]>=t) {
            visible = false
            break
        }
    }
    if (visible) {
        return true
    }
    // down
    visible = true
    for (let y = r+1; y<grid[0].length; y++) {
        if (grid[y][c]>=t) {
            visible = false
            break
        }
    }
    return visible
}

function scenicScore(grid: number[][], r: number, c: number): number {
    const t = grid[r][c]
    // left
    let ls = 0
    for (let x = c-1; x>=0; x--) {
        ls++
        if (grid[r][x]>=t) {
            break
        }
    }
    // right
    let rs = 0
    for (let x = c+1; x<grid.length; x++) {
        rs++
        if (grid[r][x]>=t) {
            break
        }
    }
    // up
    let us = 0
    for (let y = r-1; y>=0; y--) {
        us++
        if (grid[y][c]>=t) {
            break
        }
    }
    // down
    let ds = 0
    for (let y = r+1; y<grid[0].length; y++) {
        ds++
        if (grid[y][c]>=t) {
            break
        }
    }
    return ls*rs*us*ds
}

function puzzle(data: string) {
    let grid = []
    data.trim().split("\n").forEach(row => {
        grid.push(row.trim().split('').map(c => parseInt(c)))
    })
    let vt = 0
    let bestScore = 0
    for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[0].length; c++) {
            if (visible(grid, r, c)) {
                vt++
            }
            const ss = scenicScore(grid, r, c)
            if (ss > bestScore) {
                bestScore = ss
            }
        }
    }

    console.log("Part One:", vt)

    console.log("Part Two:", bestScore)
}

fs.readFile('input08', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  puzzle(data);
});
