'use strict'

//----------------------------------------------------------
// Modules
//----------------------------------------------------------
// NPM
const fs   = require('fs')
const path = require('path')

//----------------------------------------------------------
// Tests
//----------------------------------------------------------
describe('Methods', () => {
  fs.readdir('test/methods', (err, methods) => {
    methods.map(method => {
      require(`./${path.join('methods', method)}`)
    })
  })
})
