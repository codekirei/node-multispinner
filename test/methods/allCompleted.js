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
module.exports = describe('allCompleted', () => {
  // setup
  const spinners = genSpinners.arr(3)
  let m
  beforeEach(() => {
    m = new Multispinner(spinners, {testing: true})
  })

  it('Return false if not all spinners are complete', () => {
    spinners.map((spinner, i) => {
      m.success(spinner)
      if (i < spinners.length - 1) {
        assert.isFalse(m.allCompleted())
      }
    })
  })

  it('Return true if all spinners are complete', () => {
    spinners.map(spinner => {
      m.error(spinner)
    })
    assert.isTrue(m.allCompleted())
  })
})
