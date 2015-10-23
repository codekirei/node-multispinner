'use strict'

//----------------------------------------------------------
// Modules
//----------------------------------------------------------
// NPM
const assert = require('chai').assert
const sinon = require('sinon')

// Local
const Multispinner = require('../../')

// Test Utils
const genSpinners = require('../utils/genSpinners')

//----------------------------------------------------------
// Tests
//----------------------------------------------------------
module.exports = describe('start', () => {
  it('Call loop method', () => {
    const spinners = genSpinners.arr(3)
    const m = new Multispinner(spinners, {testing: true})
    const spy = sinon.spy(m, 'loop')
    m.start()
    assert(spy.called, 'loop method called')
    m.loop.restore()
  })
})
