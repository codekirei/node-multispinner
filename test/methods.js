'use strict'

//----------------------------------------------------------
// Modules
//----------------------------------------------------------
// NPM
const path = require('path')

//----------------------------------------------------------
// Tests
//----------------------------------------------------------
describe('Methods', () => {
  const methods = [
    'constructor',
    'loop',
    'complete',
    'success',
    'error',
    'allCompleted',
    'start',
    'stop'
  ]
  methods.map(method => {
    require(`./${path.join('methods', method)}`)
  })
})
