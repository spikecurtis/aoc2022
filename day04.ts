export {};
const fs = require('fs');

interface assignment {
    start: number
    end: number
}

function parseAssignment(s: string): assignment {
    const num = s.split("-")
    const start = parseInt(num[0])
    const end = parseInt(num[1])
    return {start, end}
}

function overlapFull(a: assignment, b: assignment): boolean {
    if (a.start <= b.start && a.end >= b.end) {
        return true
    }
    if (b.start <= a.start && b.end >= a.end) {
        return true
    }
    return false
}

function overlap(a: assignment, b: assignment): boolean {
    if (a.end < b.start) {
        return false
    }
    if (b.end < a.start) {
        return false
    }
    return true
}

function puzzle(data: string) {
    let pairs = data.split("\n")
    let fullOverlaps = 0
    let overlaps = 0

    for (const p of pairs) {
        if (p.length == 0) {
            continue
        }
        const as = p.split(",").map(parseAssignment)
        if (overlapFull(as[0], as[1])) {
            fullOverlaps +=1
        }
        if (overlap(as[0], as[1])) {
            overlaps += 1
        }
    }
    console.log("Part One:", fullOverlaps)
    console.log("Part Two:", overlaps)
}

fs.readFile('input04', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  puzzle(data);
});

