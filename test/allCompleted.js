'use strict'

//----------------------------------------------------------
// Modules
//----------------------------------------------------------
// NPM
const assert = require('chai').assert

// Local
const Multispinner = require('../')
const genSpinners = require('./utils/genSpinners')

//----------------------------------------------------------
// Tests
//----------------------------------------------------------
describe('allCompleted method', () => {
  // setup
  const spinners = genSpinners.arr(3)

  it('Return false if not all spinners are complete', () => {
    const m = new Multispinner(spinners, {debug: true})
    m.success(spinners[0])
    assert.isFalse(m.allCompleted())
  })

  it('Return true if all spinners are complete', () => {
    const m = new Multispinner(spinners, {debug: true})
    spinners.map(spinner => {
      m.error(spinner)
    })
    assert.isTrue(m.allCompleted())
  })
})
