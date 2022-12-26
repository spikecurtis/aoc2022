export {};
const fs = require('fs');

const Ore = 0
const Clay = 1
const Obsidian = 2
const Geode = 3
const numResources = 4
let endTime = 24

interface Blueprint {
    id: number
    cost: number[][]
}

function parseBlueprint(line: string): Blueprint {
    const words = line.trim().split(" ")
    const id = parseInt(words[1].split(":")[0])
    const oreRobot = Array.of(parseInt(words[6]), 0, 0, 0)
    const clayRobot = Array.of(parseInt(words[12]), 0, 0, 0)
    const obsidianRobot = Array.of(
        parseInt(words[18]),
        parseInt(words[21]),
        0,
        0
    )
    const geodeRobot = Array.of(
        parseInt(words[27]),
        0,
        parseInt(words[30]),
        0
    )
    const cost = new Array(numResources)
    cost[Ore] = oreRobot
    cost[Clay] = clayRobot
    cost[Obsidian] = obsidianRobot
    cost[Geode] = geodeRobot
    return {id, cost}
}

const timeLimit = 24

function nonnegative(a: number[]): boolean {
    return a.every(e => e >= 0)
}

function sub(a: number[], b: number[]): number[] {
    const out = Array.from(a)
    b.forEach((n, i) => out[i] -= n)
    return out
}

function add(a: number[], b: number[]): number[] {
    const out = Array.from(a)
    b.forEach((n, i) => out[i] += n)
    return out
}

function scalarMult(a: number[], s: number): number[] {
    return a.map(e => e*s)
}

function canBuy(robots: number[], cost: number[]): boolean {
    return cost.every((c, i) => {
        if (c == 0) {
            return true
        }
        return robots[i] != 0;
    })
}

function turnsUntil(robots: number[], resources: number[], cost: number[]): number {
    let turns = 0
    let r = Array.from(resources)
    while (true) {
        if (nonnegative(sub(r, cost))) {
            return turns
        }
        r = add(r, robots)
        turns++
    }
}

class Node {
    blueprint: Blueprint
    minute: number
    resources: number[]
    robots: number[]
    buys: number[]
    constructor(blueprint: Blueprint,
                minute: number,
                resources: number[],
                robots: number[],
                buys: number[],
    ) {
        this.blueprint = blueprint
        this.minute = minute
        this.resources = resources
        this.robots = robots
        this.buys = buys
    }

    next(): Node[] {
        const children = []
        for (let rt = numResources-1; rt >= 0; rt--) {
            const cost = this.blueprint.cost[rt]
            if (canBuy(this.robots, cost)) {
                let turns = turnsUntil(this.robots, this.resources, cost) + 1
                const minute = this.minute + turns
                if (minute > endTime) {
                    continue
                }
                const resources = sub(add(this.resources, scalarMult(this.robots, turns)), cost)
                const robots = Array.from(this.robots)
                robots[rt] += 1
                const buys = Array.from(this.buys)
                buys.push(rt)
                const node = new Node(this.blueprint, minute, resources, robots, buys)
                children.push(node)
            }
        }
        return children
    }

    confirmedGeodes(): number {
        return this.resources[Geode] + ((endTime - this.minute) * this.robots[Geode])
    }

    maxGeodes(): number {
        let g = this.resources[Geode]
        let robots = this.robots[Geode]
        for (let m = this.minute + 1; m <= endTime; m++) {
            g += robots++
        }
        return g
    }

    explore(best: number): number {
        best = Math.max(best, this.confirmedGeodes())
        for (const child of this.next()) {
            if (child.maxGeodes() <= best) {
                continue
            }
            const cBest = child.explore(best)
            best = Math.max(best, cBest)
        }
        return best
    }
}

function puzzle(data: string) {
    const blueprints = data.trim().split("\n").map(l => parseBlueprint(l))
    let totalQuality = 0
    for (const bp of blueprints) {
        const n = new Node(bp, 0, Array.of(0, 0, 0, 0), Array.of(1, 0, 0, 0), [])
        const best = n.explore(0)
        console.log(bp.id, best)
        totalQuality += bp.id * best
    }
    console.log("Part One:", totalQuality)

    endTime = 32
    let qp = 1
    for (const bp of blueprints.slice(0,3)) {
        const n = new Node(bp, 0, Array.of(0, 0, 0, 0), Array.of(1, 0, 0, 0), [])
        const best = n.explore(0)
        console.log(bp.id, best)
        qp *= best
    }

    console.log("Part Two:", qp)
}

fs.readFile('input19', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  puzzle(data);
});

const td = `Blueprint 1: Each ore robot costs 4 ore. Each clay robot costs 2 ore. Each obsidian robot costs 3 ore and 14 clay. Each geode robot costs 2 ore and 7 obsidian.
Blueprint 2: Each ore robot costs 2 ore. Each clay robot costs 3 ore. Each obsidian robot costs 3 ore and 8 clay. Each geode robot costs 3 ore and 12 obsidian.
`

//puzzle(td)
