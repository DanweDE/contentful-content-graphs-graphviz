#!/usr/bin/env node

const argv = require('minimist')(process.argv.slice(2), {
  boolean: ['nodrafts'],
  default: {
    file: 'space.json',
    nodrafts: false
  }
})
delete argv._
console.log(argv)
console.log()

require('contentful-export')({
  managementHost: argv.host || undefined,
  managementToken: argv.token,
  spaceId: argv.space,
  environmentId: argv.environment || undefined,
  contentFile: argv.file,
  includeDrafts: !argv.nodrafts,
  skipContentModel: false,
  skipContent: false,
  skipRoles: true,
  skipWebhooks: true
})
