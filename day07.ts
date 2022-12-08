export {};
const fs = require('fs');

interface file {
    name: string
    size: number
}

interface dir {
    name: string
    parent: dir|null
    root: dir
    dirs: dir[]
    files: file[]
    size: number
}

function newDir(name: string, parent: dir|null, root: dir|null): dir {
    let dirs = []
    let files = []
    let d = {name, parent, dirs, files, root, size: 0}
    if (root == null) {
        d.root = d
    }
    return d
}

function parse(wd: dir, l: string): dir {
    const tokens = l.split(' ')
    if (tokens.length <= 1) {
        throw "invalid line"
    }
    switch (tokens[0]) {
        case '$':
            return parseCmd(wd, tokens.slice(1))
        default:
            parseListItem(wd, tokens)
            return wd
    }
}

function parseCmd(wd: dir, tokens: string[]): dir {
    if (tokens.length < 1) {
        throw "invalid cmd"
    }
    switch (tokens[0]) {
        case "cd":
            if (tokens.length != 2) {
                throw "invalid cd"
            }
            switch (tokens[1]) {
                case '..':
                    return wd.parent
                case '/':
                    return wd.root
                default:
                    return wd.dirs.find(d => d.name == tokens[1])
            }
        case "ls":
            if (!(wd.dirs.length == 0 && wd.files.length == 0)) {
                throw "ls on same dir twice"
            }
            return wd
    }
}

function parseListItem(wd: dir, tokens: string[]) {
    if (tokens.length != 2) {
        throw "invalid list item"
    }
    if (tokens[0] == "dir") {
        const d = newDir(tokens[1], wd, wd.root)
        wd.dirs.push(d)
        return
    }
    const sz = parseInt(tokens[0])
    wd.files.push({size: sz, name: tokens[1]})
    let c = wd
    do {
        c.size += sz
        c = c.parent
    }
    while (c != null)
    return
}

function findDirs(root: dir, predicate: (dir) => boolean): dir[] {
    let out = []
    recurseDir(root, predicate, out)
    return out
}

function recurseDir(d: dir, p: (dir) => boolean, a: dir[]) {
    if (p(d)) {
        a.push(d)
    }
    for (const c of d.dirs) {
        recurseDir(c, p, a)
    }
}

function puzzle(data: string) {
    const lines = data.split('\n')
    let root = newDir("/", null, null)
    let wd = root

    for (const l of lines) {
        if (l.length == 0) {
            continue
        }
        wd = parse(wd, l)
    }

    const smallDirs = findDirs(root, d => {
        return d.size <= 100000
    })
    const p1 = smallDirs.reduce((s, d) => s + d.size, 0)

    console.log("Part One:", p1)

    const maxSize = 40000000
    const toDelete = root.size - maxSize
    const bigEnoughDirs = findDirs(root, d => d.size >= toDelete)
    let sm = bigEnoughDirs[0]
    for (const d of bigEnoughDirs) {
        if (d.size < sm.size) {
            sm = d
        }
    }

    console.log("Part Two:", sm.size)
}

fs.readFile('input07', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  puzzle(data);
});

const td = `
$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k
`
