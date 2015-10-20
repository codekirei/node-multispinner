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
  let spinners = genSpinners.arr(3)
  let multispinner
  beforeEach(() => {
    multispinner = new Multispinner(spinners, {debug: true})
  })
  afterEach(() => {
    multispinner.clearState(true)
  })

  it('Return false if not all spinners are complete', () => {
    multispinner.success(spinners[0])
    assert.isFalse(multispinner.allCompleted())
  })

  it('Return true if all spinners are complete', () => {
    spinners.map(spinner => {
      multispinner.error(spinner)
    })
    assert.isTrue(multispinner.allCompleted())
  })
})
