// const { readdirSync } = require('node:fs')
// const path = require('node:path')

// const modules = {}

// const files = readdirSync(__dirname)

// files.forEach(file => {
//   if (file !== 'index.js') {
//     const module = path.resolve(__dirname, file)
//     const moduleName = path.parse(module).name

//     modules[moduleName] = require(module)
//   }
// })

// module.exports = modules

const fs = require('fs')
const path = require('path')

const wstream = fs.createWriteStream(path.resolve(__dirname, 'test.log'))

wstream.on('writeline', function() {
  console.log(arguments)
})

wstream.write('Hello', function(err) {
  if (err) {
    console.log('err :>> ', err);
  } else {
    const stat = fs.statSync(path.resolve(__dirname, 'test.log'))
    console.log('stat :>> ', stat);
  }
})

wstream.write('\nWorld dgdfgdsfdfgdsgfg sdfg dfg dfg dfg dfsgdf gfds gdf dfg f', function(err) {
  if (err) {
    console.log('err :>> ', err);
  } else {
    const stat = fs.statSync(path.resolve(__dirname, 'test.log'))

    if (stat.size >= 67) {
      fs.truncateSync(path.resolve(__dirname, 'test.log'), 0)
    }
    console.log('stat :>> ', stat);
  }
})