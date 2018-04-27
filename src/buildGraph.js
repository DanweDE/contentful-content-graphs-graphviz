const _ = require('lodash')

const DOT_UNTITLED = '<<i>Untitled</i>>'
const ASSET_DISPLAY_FIELD = 'title'

function buildGraphDOT ({ contentTypes, entries, assets, locales }) {
  const entities = entries.concat(assets)
  const defaultLocale = _.find(locales, { default: true }).code
  const displayFields = _.chain(contentTypes)
    .keyBy('sys.id').mapValues('displayField').value()

  // TODO: Add references of `entities` as edges.
  return dotGraph(entities.map(newNodeFromEntity).join('\n'))

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
}

const dotLabel = (label) => `"${_.escape(label.replace(/\\/g, '\\\\'))}"`
const dotGraph = (dot) => `digraph {\n${dot}\n}`

module.exports = buildGraphDOT
