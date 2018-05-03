const _ = require('lodash')
const distinctColors = require('distinct-colors')

const dot = require('./dotHelpers')

const ASSET_DISPLAY_FIELD = 'title'
const ASSET_CT_ID = ':ASSET:'
const NODE_COLORS_ALPHA_HEX = '66' // Alpha value as hex.

function buildGraphDOT ({ contentTypes, entries, assets, locales }) {
  const entities = entries.concat(assets)
  const colorsByCt = buildCtColors(contentTypes)
  const defaultLocale = _.find(locales, { default: true }).code
  const displayFields = _.chain(contentTypes)
    .keyBy('sys.id').mapValues('displayField').value()

  return dot.digraph(_.flatMap(entities,
    (entity) => [ newNodeFromEntity(entity), ...newEdgesFromEntity(entity) ]
  ).join('\n'))

  function newNodeFromEntity (entity) {
    const id = entity.sys.id
    const name = getEntityName(entity)
    const labelDOT = name ? dot.label(name) : dot.UNTITLED
    const ctId = getCt(entity) || ASSET_CT_ID
    const color = colorsByCt[ctId]
    return `${dot.id(id)} [label=${labelDOT} color="${color}"]`
  }

  function getEntityName (entity) {
    const ctId = getCt(entity)
    const displayField = ctId ? displayFields[ctId] : ASSET_DISPLAY_FIELD
    const name = displayField && _.get(entity.fields, [displayField, defaultLocale])
    return name && name.length > 100 ? entity.sys.id : name
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
    return `${dot.id(sourceId)} -> ${dot.id(targetId)} [label=${dot.label(label)}]`
  }
}

function buildCtColors (contentTypes) {
  const colors = distinctColors({
    count: contentTypes.length + 1
  }).map((color) => color.hex() + NODE_COLORS_ALPHA_HEX)

  return contentTypes.reduce((colorsByCt, ct, i) => {
    colorsByCt[ct.sys.id] = colors[i + 1]
    return colorsByCt
  }, { [ASSET_CT_ID]: colors[0] })
}

const getCt = (entity) => _.get(entity, 'sys.contentType.sys.id')

module.exports = buildGraphDOT
