export {};
const fs = require('fs');

const timeLimit = 30

interface Room {
  name: string
  rate: number
  tunnels: string[]
}

interface Node {
  action: (Action|null)[]
  location: Room[]
  rmap: {get: (string) => Room}
  minute: number
  closed: Room[]
  max: number
  min: number
  confirmed: number
}

interface Action {
  open: boolean
  move: string|undefined
}

let explores = 0

class Node {
  action: (Action|null)[]
  location: Room[]
  rmap: {get: (string) => Room}
  minute: number
  actions: Action[][]
  closed: Room[]
  max: number
  min: number
  confirmed: number
  constructor(rmap, confirmed, action, location, minute, closed, actions) {
    this.rmap = rmap
    this.action = action
    this.location = location
    this.minute = minute
    this.actions = actions
    this.closed = closed
    this.confirmed = confirmed
    for (let w = 0; w< action.length; w++) {
      if (action[w] != null && action[w].open) {
        this.confirmed += location[w].rate * (timeLimit - minute)
      }
    }
    this.max = this.getMax(actions.length)
    this.min = this.confirmed
  }
  getMax(workers): number {
    // the next time we could possibly open a valve is 1 minute from
    // now, then 2 minutes after, etc
    let max = this.confirmed
    let closed = Array.from(this.closed).
      sort((a,b) => a.rate - b.rate)
    for (let m = timeLimit - this.minute - 1; m > 0 && closed.length > 0; m -= 2) {
      for (let w = 0; w<workers && closed.length>0; w++) {
        max += closed.pop().rate * m
      }
    }
    return max
  }
  childFromAction(action: Action[]): Node {
    let location = Array.from(this.location)
    const actions = Array.from(this.actions)
    actions.push(action)
    let closed = Array.from(this.closed)
    for (let w=0; w<action.length; w++) {
      if (action[w].open) {
        closed = closed.filter(r => r.name != this.location[w].name)
      } else {
        location[w] = this.rmap.get(action[w].move)
      }
    }
    const minute = this.minute + 1
    return new Node(this.rmap, this.confirmed, action, location, minute, closed, actions)
  }

  getChildren(): Node[] {
    const children = []
    const workerActions = []
    for (let w = 0; w<this.location.length; w++) {
      const actions = this.location[w].tunnels.map(name => {
        return {open: false, move: name}
      })
      if (this.location[w].rate > 0 && this.closed.find(r => r.name == this.location[w].name)) {
        actions.push({open: true, move: ""})
      }
      workerActions.push(actions)
    }
    const combinations = (aa: Action[][]) => {
      if (aa.length == 1) {
        return aa[0].map(a => [a])
      }
      const first = aa[0]
      const rest = aa.slice(1)
      const out = []
      first.forEach(a => {
        combinations(rest).forEach(r => {
          out.push([a].concat(r))
        })
      })
      return out
    }
    combinations(workerActions).forEach(a =>{
      children.push(this.childFromAction(a))
    })
    return children
  }

  explore(bestMin: number) {
    explores++
    if (this.minute == timeLimit) {
      return
    }
    let toExplore = Array.from(this.getChildren()).
      sort((a,b) => a.max - b.max)
    //bestMin = toExplore.reduce((p, c) => Math.max(p, c.min), bestMin)
    toExplore.forEach(c => {
      if (c.min > bestMin) {
        // const oNames = c.actions.map(
        //     (a, i) => (a.open ? "open" : a.move) + " " + (timeLimit -1 -i))
        console.log(c.min, explores)
        bestMin = c.min
      }
    })
    while (toExplore.length > 0) {
      // remove any that can't be better than our best min
      toExplore = toExplore.filter(c => c.max > bestMin)
      if (toExplore.length == 0) {
        break
      }
      let child = toExplore.pop()
      child.explore(bestMin)
      //bestMin = Math.max(bestMin, child.min)
      if (child.min > bestMin) {
        //const oNames = child.opened.map(r => r.name)
        //console.log(child.min, oNames)
        bestMin = child.min
      }
    }
    this.min = Math.max(bestMin, this.min)
  }
}

function parse(data: string): Room[] {
  let rooms = data.trim().split("\n").map(l => {
    let words = l.trim().split(" ")
    const name = words[1]
    const rate = parseInt(words[4].split("=")[1].split(";")[0])
    const tunnels = words.slice(9).map(t => t.split(",")[0])
    let room = {name, rate, tunnels}
    return room
  })
  return rooms
}

function puzzle(data: string) {
  const rooms = parse(data)
  const rmap = new Map()
  rooms.forEach(r => rmap.set(r.name, r))
  const root = new Node(rmap, 0, [null], [rmap.get("AA")], 0, Array.from(rooms), [])
  root.explore(root.min)

  console.log("Part One:", root.min, explores)
  console.log("Part Two:")
}

fs.readFile('input16', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  puzzle(data);
});

const td = `Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
Valve BB has flow rate=13; tunnels lead to valves CC, AA
Valve CC has flow rate=2; tunnels lead to valves DD, BB
Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE
Valve EE has flow rate=3; tunnels lead to valves FF, DD
Valve FF has flow rate=0; tunnels lead to valves EE, GG
Valve GG has flow rate=0; tunnels lead to valves FF, HH
Valve HH has flow rate=22; tunnel leads to valve GG
Valve II has flow rate=0; tunnels lead to valves AA, JJ
Valve JJ has flow rate=21; tunnel leads to valve II
`

//puzzle(td)
