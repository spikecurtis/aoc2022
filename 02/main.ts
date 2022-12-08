export {};
const fs = require('fs');

// In order to make the win/lose/draw
// easy to compute, we'll assign numbers
// to rock, paper, scissors
const Rock = 0
const Paper = 1
const Scissors = 2

enum result {
    win,
    lose,
    draw
}

interface round {
    them: number
    me: number
}

function getScore(r: round): number {
    let score = moveScore(r.me)
    //console.log("moveScore", score)
    const u = getResult(r)
    //console.log("result", u)
    switch (u) {
        case result.win:
            score += 6
            break
        case result.draw:
            score += 3
            break
        case result.lose:
            break
    }
    return score
}

function moveScore(m: number): number {
    return m + 1
}

function getResult(r: round): result {
    let d = r.me - r.them
    if (d < 0) {
        d += 3
    }
    switch (d) {
        case 0:
            return result.draw
        case 1:
            return result.win
        case 2:
            return result.lose
    }
    // unhittable
    return result.draw
}

function parseRound2(s: string): round {
    let them = 0
    switch (s[0]) {
        case "A":
            them = Rock
            break
        case "B":
            them = Paper
            break
        case "C":
            them = Scissors
            break
    }
    let r = result.draw
    switch (s[2]) {
        case "X":
            r = result.lose
            break
        case "Y":
            r = result.draw
            break
        case "Z":
            r = result.win
            break
    }
    for (let i=0; i<3; i++) {
        const rnd = {them: them, me: i}
        if (getResult(rnd) === r) {
            return rnd
        }
    }
    console.log("ERROR")
    return {them, me: 0}
}

function parseRound1(s: string): round {
    let them = 0
    switch (s[0]) {
        case "A":
            them = Rock
            break
        case "B":
            them = Paper
            break
        case "C":
            them = Scissors
            break
    }
    let me = 0
    switch (s[2]) {
        case "X":
            me = Rock
            break
        case "Y":
            me = Paper
            break
        case "Z":
            me = Scissors
            break
    }
    return {them, me}
}


function puzzle(data: string) {
    let rounds = data.split("\n")
    let score1 = 0
    let score2 = 0
    for (const rs of rounds) {
        if (rs.length == 0) {
            continue
        }
        let r1 = parseRound1(rs)
        let roundScore1 = getScore(r1)
        score1 += roundScore1

        let r2 = parseRound2(rs)
        let roundScore2 = getScore(r2)
        //console.log(rs, r1, roundScore1, r2, roundScore2)
        score2 += roundScore2
    }
    console.log("Part One:", score1)
    console.log("Part Two:", score2)
}

fs.readFile('input', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  puzzle(data);
});

// puzzle(`A Y
// B X
// C Z`)