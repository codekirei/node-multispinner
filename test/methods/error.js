'use strict'

//----------------------------------------------------------
// Modules
//----------------------------------------------------------
// NPM
const assert = require('chai').assert

// Local
const Multispinner = require('../../')
const states = require('lib/constants').states

// Test Utils
const genSpinners = require('../utils/genSpinners')

//----------------------------------------------------------
// Tests
//----------------------------------------------------------
module.exports = describe('success', () => {
  it('Call complete method with spinner in success state', () => {
    const spinners = genSpinners.arr(3)
    const m = new Multispinner(spinners, {testing: true})
    spinners.map(spinner => {
      m.error(spinner)
      assert.equal(states.error, m.spinners[spinner].state)
    })
  })
})
