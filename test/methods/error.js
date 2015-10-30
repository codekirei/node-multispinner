'use strict'

//----------------------------------------------------------
// Modules
//----------------------------------------------------------
// NPM
const assert = require('chai').assert
const sinon = require('sinon')

// Local
const Multispinner = require('../../')
const states = require('lib/constants').states

// Test Utils
const genSpinners = require('../utils/genSpinners')

//----------------------------------------------------------
// Tests
//----------------------------------------------------------
module.exports = describe('error', () => {
  it('Call complete method with spinner in error state', () => {
    const spinners = genSpinners.arr(3)
    const m = new Multispinner(spinners, {testing: true})
    const spy = sinon.spy(m, 'complete')
    m.error(spinners[0])
    assert(spy.called, 'call complete method')
    assert(
      spy.calledWith(spinners[0], states.error),
      'call complete method with correct params'
    )
  })
})
