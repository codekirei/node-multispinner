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
    // setup
    const m = new Multispinner(spinners, {debug: true})
    m.start()
    m.clearState()

    // assertions
    assert.equal(-1, m.state._idleTimeout)
  })

  it('Call log-update.clear() when this.clear is true', () => {
    // setup
    const spy = sinon.spy(logUpdate, 'clear')
    const m = new Multispinner(spinners, {
      debug: true,
      clear: true
    })
    m.start()
    m.clearState(m.clear)

    // assertions
    assert(spy.calledOnce, 'log-update clear method called')

    // cleanup
  })
})
