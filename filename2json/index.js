#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const program = require('commander')

let scan = (dir, done) => {
    let results = []
    fs.readdir(dir, (err, fileList) => {
        let pending = fileList.length

        if (err) {
            console.error(err)
        }

        if (!pending) {
            return done(null, results)
        }

        fileList.forEach((file) => {
            file = path.join(dir, file)
            fs.stat(file, (err, stat) => {

                if (stat && stat.isDirectory()) {

                    scan(file, (err, result) => {
                        results = results.concat(result)

                        if (!--pending) {
                            return done(null, results)
                        }
                    })
                } else {
                    results.push(file)

                    if (!--pending) {
                        return done(null, results)
                    }
                }
            })
        })
    })
}

program
    .usage('<dir> [file]')
    .description('Default output file is data.json.')
    .arguments('<dir> [file]')
    .action((dir, file) => {
        let filename = path.join(process.cwd(), file || 'data.json')
        scan(dir, (err, results) => {
            fs.writeFile(filename, JSON.stringify(results, null, 2), (err) => {
                if (err) {
                    return console.error(err)
                }
            })
        })
    })
    .parse(process.argv)
