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
describe('stop method', () => {
  // setup
  const spinners = genSpinners.arr(3)
  let m
  beforeEach(() => {
    m = new Multispinner(spinners, {debug: true})
    m.start()
  })
  afterEach(() => {
    m.cleanUp()
  })

  it('Clear interval bound to this.state', () => {
    // setup
    m.stop()

    // assertions
    assert.equal(-1, m.state._idleTimeout)
  })
})
