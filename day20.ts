export {};
const fs = require('fs');

class LNum {
    value: number
    prev: LNum|null
    next: LNum|null
    moveNext: LNum|null
    modulus: number


    constructor(value: number, modulus: number) {
        this.value = value
        this.prev = null
        this.next = null
        this.moveNext = null
        this.modulus = modulus
    }

    move(): LNum {
        if (this.value == 0) {
            return this.moveNext
        }
        //extract
        this.prev.next = this.next
        this.next.prev = this.prev

        const amt = ((this.value % this.modulus) + this.modulus) % this.modulus
        let target: LNum = this
        for (let i=0; i<amt; i++) {
            target = target.next
        }
        target.next.prev = this
        this.next = target.next
        this.prev = target
        target.next = this
        return this.moveNext
    }

    toArray(): number[] {
        let out = [this.value]
        let cur: LNum = this.next
        while (cur != this) {
            out.push(cur.value)
            cur = cur.next
        }
        return out
    }

    after(n: number): number {
        let x: LNum = this
        for (let i=0; i<n; i++) {
            x = x.next
        }
        return x.value
    }
}

function parse(data: string, key: number): LNum {
    const nums = data.trim().split("\n").map(s => parseInt(s)*key)
    const first = new LNum(nums[0], nums.length-1)
    let current = first
    for (let i = 1; i<nums.length; i++) {
        let next = new LNum(nums[i], nums.length-1)
        next.prev = current
        current.next = next
        current.moveNext = next
        current = next
    }
    first.prev = current
    current.next = first
    return first
}

function puzzle(data: string) {
    let first = parse(data, 1)
    //console.log(first.toArray().join(","))
    let next = first
    while (next != null) {
        //console.log(next.value)
        next = next.move()
        //console.log(first.toArray().join(","))
    }
    let zero = first
    while (zero.value != 0) {
        zero = zero.next
    }
    const n1000 = zero.after(1000)
    const n2000 = zero.after(2000)
    const n3000 = zero.after(3000)
    console.log("Part One:", n1000, n2000, n3000, n1000+n2000+n3000)

    first = parse(data, 811589153)
    for (let i = 0; i<10; i++) {
        next = first
        while (next != null) {
            //console.log(next.value)
            next = next.move()
            //console.log(first.toArray().join(","))
        }
    }
    zero = first
    while (zero.value != 0) {
        zero = zero.next
    }
    const n10002 = zero.after(1000)
    const n20002 = zero.after(2000)
    const n30002 = zero.after(3000)
    console.log("Part Two:", n10002, n20002, n30002, n10002+n20002+n30002)
}

fs.readFile('input20', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  puzzle(data);
});

const td = `
1
2
-3
3
-2
0
4
`

//puzzle(td)
