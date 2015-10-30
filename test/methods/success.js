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
module.exports = describe('success', () => {
  it('Call complete method with spinner in success state', () => {
    const spinners = genSpinners.arr(3)
    const m = new Multispinner(spinners, {testing: true})
    const spy = sinon.spy(m, 'complete')
    m.success(spinners[0])
    assert(spy.called, 'call complete method')
    assert(
      spy.calledWith(spinners[0], states.success),
      'call complete method with correct params'
    )
  })
})
