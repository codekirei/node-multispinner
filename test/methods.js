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
// dynamically include all methods in methods dir
fs.readdir('test/methods', (err, methods) => {
  describe('Methods', () => {
    methods.map(method => {
      require(`./${path.join('methods', method)}`)
    })
  })
})
