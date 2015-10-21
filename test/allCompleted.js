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
  let m
  beforeEach(() => {
    m = new Multispinner(spinners, {debug: true})
  })
  afterEach(() => {
    m.cleanUp()
  })

  it('Return false if not all spinners are complete', () => {
    let i = 0
    const lastSpinner = spinners.length - 1
    for (i; i < lastSpinner; i++) {
      m.success(spinners[i])
      assert.isFalse(m.allCompleted())
    }
  })

  it('Return true if all spinners are complete', () => {
    spinners.map(spinner => {
      m.error(spinner)
    })
    assert.isTrue(m.allCompleted())
  })
})
