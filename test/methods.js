'use strict'

//----------------------------------------------------------
// Modules
//----------------------------------------------------------
// NPM
const assert = require('chai').assert
const sinon = require('sinon')
const logUpdate = require('log-update')
const faker = require('faker')
const clone = require('lodash.clonedeep')
const path = require('path')

// Local
const Multispinner = require('../')
const Spinners = require('lib/spinners')
const defaultProps = require('lib/constants').defaultProps
const states = require('lib/constants').states
const validOpts = require('lib/validOpts')

// Test Utils
const types = require('./utils/types')
const genSpinners = require('./utils/genSpinners')

//----------------------------------------------------------
// Tests
//----------------------------------------------------------
describe('Methods', () => {
  const methods = [
    'constructor',
    'loop',
    'complete',
    'success',
    'error',
    'allCompleted'
  ]
  methods.map(method => {
    require(`./${path.join('methods', method)}`)
  })
  //----------------------------------------------------------
  // start
  //----------------------------------------------------------
  describe('start', () => {
    it('Call loop method', () => {
      const spy = sinon.spy(multispinner, 'loop')
      multispinner.start()
      assert(spy.calledOnce, 'loop method called')
      multispinner.clearState()
    })
  })

  //----------------------------------------------------------
  // stop
  //----------------------------------------------------------
  describe('stop', () => {
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
})
