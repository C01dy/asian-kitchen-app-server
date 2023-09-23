const { readdirSync } = require('node:fs')
const path = require('node:path')

const modules = {}

const files = readdirSync(__dirname)

files.forEach(file => {
  if (file !== 'index.js') {
    const module = path.resolve(__dirname, file)
    const moduleName = path.parse(module).name

    modules[moduleName] = require(module)
  }
})

module.exports = modules