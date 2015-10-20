'use strict'

//----------------------------------------------------------
// Modules
//----------------------------------------------------------
// NPM
const assert = require('chai').assert
const sinon = require('sinon')
const logUpdate = require('log-update')

// Local
const Multispinner = require('../')
const genSpinners = require('./utils/genSpinners')

//----------------------------------------------------------
// Tests
//----------------------------------------------------------
describe('clearState method', () => {
  // fixtures
  const spinners = genSpinners.arr(3)
  let multispinner
  beforeEach(() => {
    multispinner = new Multispinner(spinners, {
      debug: true,
      clear: true
    })
    multispinner.start()
  })

  it('Clear interval bound to this.state', () => {
    multispinner.clearState()
    assert.equal(-1, multispinner.state._idleTimeout)
  })

  it('Call log-update.clear() when this.clear is true', () => {
    let spy = sinon.spy(logUpdate, 'clear')
    multispinner.clearState(multispinner.clear)
    assert(spy.calledOnce, 'log-update clear method called')
  })
})
