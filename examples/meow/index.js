'use strict'

//----------------------------------------------------------
// modules
//----------------------------------------------------------
const Multispinner = require('../../')
const meow = require('meow')
const fs = require('fs')
const path = require('path')

//----------------------------------------------------------
// Logic
//----------------------------------------------------------
// grab cli args with meow
const cli = meow(`
  Usage:
    $ node index.js <target directory>
`)

// print usage or run main
cli.input.length !== 1
  ? console.log(cli.help)
  : main(cli.input[0])

// get contents of dir
function dirContents(dir) {
  const s = new Multispinner({s: `Reading ${dir}`})
  s.start()
  const entities = fs.readdirSync(dir)
  s.success('s')
  return entities
}

// filter for files
function filterItems(items, dir) {
  const s = new Multispinner(items, {
    'postText': 'is a file'
  })
  s.start()
  items.reduce((accum, item) => {
    if (fs.statSync(path.join(dir, item)).isFile()) {
      accum.push(item)
      s.success(item)
    } else {
      s.error(item)
    }
    return accum
  }, [])
}

// FIXME: not working because logUpdate overwrites
function main(dir) {
  const items = dirContents(dir)
  const files = filterItems(items, dir)
  return files
}
