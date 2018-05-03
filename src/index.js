#!/usr/bin/env node

const fs = require('fs')
const minimist = require('minimist')

const buildGraphDOT = require('./buildGraph')

const argv = minimist(process.argv.slice(2), {
  default: {
    _: [ 'space.json' ]
  }
})
const file = argv._[0]

const spaceData = JSON.parse(fs.readFileSync(file, 'utf8'))
console.log(buildGraphDOT(spaceData))
