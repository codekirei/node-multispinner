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
  // fixtures
  let spinners = genSpinners.arr(3)

  it('Return false if not all spinners are complete', () => {
    let multispinner = new Multispinner(spinners)
    multispinner.success(spinners[0])
    assert.isFalse(multispinner.allCompleted())
  })

  it('Return true if all spinners are complete', () => {
    let multispinner = new Multispinner(spinners)
    spinners.map(spinner => {
      multispinner.error(spinner)
    })
    assert.isTrue(multispinner.allCompleted())
  })
})
