export {};
const fs = require('fs');
const Hash = require('heap')

function parse(data): {start, end, height} {
  const letters = data.trim().split("\n").map(l => l.trim().split(''))
  let start = {}
  let end = {}
  let height = []
  for (let y=0; y<letters.length; y++) {
    let row = []
    for (let x=0; x<letters[0].length; x++) {
      let l = letters[y][x]
      if (l == "S") {
        start = {x, y}
        row.push(0)
        continue
      }
      if (l == "E") {
        end = {x, y}
        row.push(25)
        continue
      }
      row.push(l.charCodeAt(0)-"a".charCodeAt(0))
    }
    height.push(row)
  }
  return {start, end, height}
}

function blockDistance(n, end): number {
  return Math.abs(n.x - end.x) + Math.abs(n.y - end.y)
}

function canReach(f, t, height) {
  return (height[t.y][t.x] - height[f.y][f.x]) <= 1
}

function neighbors(item, end, height, h) {
  let out = []
  const cost = item.cost + 1
  const nnodes = [
    {x: item.node.x - 1, y: item.node.y},
    {x: item.node.x + 1, y: item.node.y},
    {x: item.node.x, y: item.node.y - 1},
    {x: item.node.x, y: item.node.y + 1},
  ]
  nnodes.forEach(n => {
    if (
        (n.x >=0) &&
        (n.x < height[0].length) &&
        (n.y >=0) &&
        (n.y < height.length) &&
        canReach(item.node, n, height)
    ){
      out.push({
        node: n,
        cost: cost,
        estimate: cost + h(n)
      })
    }
  })
  return out
}

function setKey(n: {x, y}): string {
  return [n.x, n.y].join(",")
}

function solve(start, end, height) {
  let h = node => blockDistance(node, end)
  let open = new Hash((a,b) => a.estimate - b.estimate)
  open.push({node: start, cost: 0, estimate: h(start)})
  let closed = new Set()
  while (!open.empty()) {
    let item = open.pop()

    // is this the goal?
    if (item.cost == item.estimate) {
      return item.cost
    }

    for (const neighbor of neighbors(item, end, height, h)) {
      if (closed.has(setKey(neighbor.node))) {
        continue
      }
      open.push(neighbor)
    }
    closed.add(setKey(item.node))
  }
}

function puzzle(data: string) {
  let p = parse(data)
  const steps = solve(p.start, p.end, p.height)
  console.log("Part One:", steps)

  let bestSteps = steps
  for (let x = 0; x<p.height[0].length; x++) {
    for (let y = 0; y < p.height.length; y++) {
      if (p.height[y][x] != 0) {
        continue
      }
      const s = solve({x, y}, p.end, p.height)
      if (s<bestSteps) {
        bestSteps = s
      }
    }
  }
  console.log("Part Two:", bestSteps)
}

fs.readFile('input12', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  puzzle(data);
});
