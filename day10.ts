export {};
const fs = require('fs');

function parse(data: string): number[] {
    let x = 1
    let signal = []
    data.trim().split("\n").forEach(l => {
        const parts = l.trim().split(" ")
        if (parts[0] == "noop") {
            signal.push(x)
            return
        }
        if (parts[0] == "addx") {
            signal.push(x)
            signal.push(x)
            x += parseInt(parts[1])
            return
        }
        throw "unhittable"
    })
    return signal;
}

function puzzle(data: string) {
    let signal = parse(data);
    const p1 = [20, 60, 100, 140, 180, 220].reduce(
        (s, i) => s + i*signal[i-1], 0)
    console.log("Part One:", p1)

    console.log("Part Two:")
    let output = ""
    for (let i=0; i<240; i++) {
        let pp = i % 40
        output += (Math.abs(signal[i] - pp) <= 1) ? "█" : " "
        if (pp == 39) {
            output += "\n"
        }
    }
    console.log(output)
}

fs.readFile('input10', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  puzzle(data);
});

const tc = `addx 15
addx -11
addx 6
addx -3
addx 5
addx -1
addx -8
addx 13
addx 4
noop
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx -35
addx 1
addx 24
addx -19
addx 1
addx 16
addx -11
noop
noop
addx 21
addx -15
noop
noop
addx -3
addx 9
addx 1
addx -3
addx 8
addx 1
addx 5
noop
noop
noop
noop
noop
addx -36
noop
addx 1
addx 7
noop
noop
noop
addx 2
addx 6
noop
noop
noop
noop
noop
addx 1
noop
noop
addx 7
addx 1
noop
addx -13
addx 13
addx 7
noop
addx 1
addx -33
noop
noop
noop
addx 2
noop
noop
noop
addx 8
noop
addx -1
addx 2
addx 1
noop
addx 17
addx -9
addx 1
addx 1
addx -3
addx 11
noop
noop
addx 1
noop
addx 1
noop
noop
addx -13
addx -19
addx 1
addx 3
addx 26
addx -30
addx 12
addx -1
addx 3
addx 1
noop
noop
noop
addx -9
addx 18
addx 1
addx 2
noop
noop
addx 9
noop
noop
noop
addx -1
addx 2
addx -37
addx 1
addx 3
noop
addx 15
addx -21
addx 22
addx -6
addx 1
noop
addx 2
addx 1
noop
addx -10
noop
noop
addx 20
addx 1
addx 2
addx 2
addx -6
addx -11
noop
noop
noop
`
//puzzle(tc)