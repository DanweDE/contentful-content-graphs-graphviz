const _ = require('lodash')

const DOT_UNTITLED = '<<i>Untitled</i>>'
const ASSET_DISPLAY_FIELD = 'title'

function buildGraphDOT ({ contentTypes, entries, assets, locales }) {
  const entities = entries.concat(assets)
  const defaultLocale = _.find(locales, { default: true }).code
  const displayFields = _.chain(contentTypes)
    .keyBy('sys.id').mapValues('displayField').value()

  return dotGraph(_.flatMap(entities,
    (entity) => [ newNodeFromEntity(entity), ...newEdgesFromEntity(entity) ]
  ).join('\n'))

  function newNodeFromEntity (entity) {
    const id = entity.sys.id
    const name = getEntityName(entity)
    const labelDOT = name ? dotLabel(name) : DOT_UNTITLED
    return `"${id}" [label=${labelDOT}]`
  }

  function getEntityName (entity) {
    const ctId = _.get(entity, 'sys.contentType.sys.id')
    const displayField = ctId ? displayFields[ctId] : ASSET_DISPLAY_FIELD
    return displayField && _.get(entity.fields, [displayField, defaultLocale])
  }

  function newEdgesFromEntity (entity) {
    return _.flatMap(entity.fields, (field, fieldName) => {
      return _.chain(field[defaultLocale])
        .castArray() // Multiple refs is {Array<Object>}, single ref {Object}
        .filter({ sys: { type: 'Link' } })
        .map((link) => newEdge(entity.sys.id, link.sys.id, fieldName))
        .value()
    })
  }

  function newEdge (sourceId, targetId, label) {
    return `"${sourceId}" -> "${targetId}" [label=${dotLabel(label)}]`
  }
}

const dotLabel = (label) => `"${_.escape(label.replace(/\\/g, '\\\\'))}"`
const dotGraph = (dot) => `digraph {
graph [pack=true rankdir=TD bgcolor=transparent fontname=Helvetica fontcolor=blue fontsize=6]
node [shape=circle width=0.3 fixedsize=shape margin=0 style=filled fontname=Helvetica color="#23a6db66" fontsize=6]
edge [fontname=Helvetica color="#999999" fontcolor="#999999" fontsize=6]
${dot}
}`

module.exports = buildGraphDOT
