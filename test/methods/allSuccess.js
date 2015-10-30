'use strict'

//----------------------------------------------------------
// Modules
//----------------------------------------------------------
// NPM
const assert = require('chai').assert

// Local
const Multispinner = require('../../')

// Test Utils
const genSpinners = require('../utils/genSpinners')

//----------------------------------------------------------
// Tests
//----------------------------------------------------------
module.exports = describe('allSuccess', () => {
  // setup
  const spinners = genSpinners.arr(3)
  let m
  beforeEach(() => {
    m = new Multispinner(spinners, {testing: true})
  })

  it('Return false if any spinners are not in success state', () => {
    spinners.map((spinner, i) => {
      m.success(spinner)
      if (i < spinners.length - 1) assert.isFalse(m.allSuccess())
    })
  })

  it('Return true if all spinners are in success state', () => {
    spinners.map((spinner) => m.success(spinner))
    assert.isTrue(m.allSuccess())
  })
})
