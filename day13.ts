export {};
const fs = require('fs');

function compare(l: any, r: any): number {
  if (typeof l == 'number' && typeof r == 'number') {
    return l - r
  }
  if (typeof l == 'object' && typeof r == 'object') {
    for (let i = 0; i<Math.max(l.length, r.length); i++) {
      if (i == l.length) {
        return -1
      }
      if (i == r.length) {
        return 1
      }
      let ci = compare(l[i], r[i])
      if (ci != 0) {
        return ci
      }
    }
    return 0
  }
  if (typeof l == 'number') {
    return compare([l], r)
  }
  if (typeof r == 'number') {
    return compare(l, [r])
  }
  throw "unhittable"
}

function puzzle(data: string) {
  let ppairs = data.trim().split("\n\n").map(pp =>
      pp.trim().split("\n").map(p => JSON.parse(p)))
  const compares = ppairs.map(pp => compare(pp[0], pp[1]))
  let p1 = 0
  for (let i = 0; i<compares.length; i++) {
    p1 += compares[i]<0 ? i+1 : 0
  }
  console.log("Part One:", p1)

  let packets = ppairs.flat(1)
  packets.push([[2]])
  packets.push([[6]])
  // reverse compare order so we get
  packets.sort(compare)
  const pjson = packets.map(p => JSON.stringify(p))
  const d2 = pjson.indexOf('[[2]]') + 1
  const d6 = pjson.indexOf('[[6]]') + 1
  console.log("Part Two:", d2*d6)
}

fs.readFile('input13', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  puzzle(data);
});
