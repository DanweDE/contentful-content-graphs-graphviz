const { escape } = require('lodash')
const wrap = require('word-wrap')

const UNTITLED = '<<i>Untitled</i>>'

/**
 * Formats an ID to be used with dot. A dot ID can't start with a numeric character.
 *
 * @param {string} id
 * @returns {string}
 */
function id (id) {
  return `"${id}"`
}

/**
 * Guard against `escString` type special escape sequences like `\G`.
 *
 * @param {string} label
 * @returns {string}
 */
function label (label) {
  return '"' + wrap(label, {
    width: 25,
    indent: '',
    escape: (string) => escape(string.replace(/\\/g, '\\\\'))
  }) + '"'
}

function digraph (dot) {
  return `digraph {
graph [pack=true rankdir=TD bgcolor=transparent fontname=Helvetica fontcolor=blue fontsize=6]
node [shape=circle width=0.3 fixedsize=shape margin=0 style=filled fontname=Helvetica color="#23a6db66" fontsize=6]
edge [fontname=Helvetica color="#999999" fontcolor="#999999" fontsize=6]
${dot}
}`
}

module.exports = { id, label, digraph, UNTITLED }
