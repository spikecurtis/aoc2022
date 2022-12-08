export {};
const fs = require('fs');

function priority(o: string): number {
    const c = o.charCodeAt(0)
    if (c <= 90 && c >= 65) {
        return c - 38
    }
    if (c <= 122 && c >= 97 ) {
        return c - 96
    }
    console.log("ERROR", c)
    return 0
}

function puzzle(data: string) {
    let rucksacks = data.split("\n")
    let sum1 = 0
    let sum2 = 0
    let e = 0
    let counts = {}
    for (const r of rucksacks) {
        const sz = r.length / 2
        if (sz == 0) {
            continue
        }
        const c1 = r.substring(0, sz)
        const c2 = r.substring(sz)
        //console.log(r, sz, c1, c2)
        let dupe = ""
        for (let i=0; i<c1.length; i++) {
            if (c2.includes(c1[i])) {
                dupe = c1[i]
                break
            }
        }
        console.log(r, dupe)
        sum1 += priority(dupe)

        for (let i=0; i<r.length; i++) {
            const c = r[i]
            if (counts[c] == null) {
                counts[c] = 0
            }
            counts[c] |= 1 << e
        }
        console.log(counts)
        e++
        if (e == 3) {
            for (const b in counts) {
                if (counts[b] == 7) {
                    sum2 += priority(b)
                }
            }
            e = 0
            counts = {}
        }
    }
    
    console.log("Part One:", sum1)
    console.log("Part Two:", sum2)
}

fs.readFile('input03', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  puzzle(data);
});

