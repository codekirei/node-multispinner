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

  it('Clear interval bound to this.state', () => {
    let multispinner = new Multispinner(spinners)
    multispinner.start()
    multispinner.clearState()
    assert.equal(-1, multispinner.state._idleTimeout)
  })

  it('Call log-update.clear() when this.clear is true', () => {
    let multispinner = new Multispinner(spinners, {clear: true})
    let spy = sinon.spy(logUpdate, 'clear')
    multispinner.start()
    multispinner.clearState(multispinner.clear)
    assert(spy.calledOnce)
  })
})
