#!/usr/bin/env node

const fs = require('fs')
const buildGraphDOT = require('./buildGraph')

const spaceData = JSON.parse(fs.readFileSync('space.json', 'utf8'))
console.log(buildGraphDOT(spaceData))
