'use strict'

//----------------------------------------------------------
// Modules
//----------------------------------------------------------
// NPM
const assert = require('chai').assert
const sinon = require('sinon')
const faker = require('faker')
const clone = require('lodash.clonedeep')
const kindOf = require('kind-of')

// Local
const Multispinner = require('../')
const Spinners = require('lib/spinners')
const defaultProps = require('lib/constants').defaultProps
const states = require('lib/constants').states
const validOpts = require('lib/validOpts')

// Test Utils
const genSpinners = require('./utils/genSpinners')
const types = require('./utils/types')

//----------------------------------------------------------
// Tests
//----------------------------------------------------------
describe('errs', () => {
  const spinners = genSpinners.arr(3)
  const spinner = spinners[0]
  describe('validOpts', () => {
    it('throw when opt is not a configurable property', () => {
      const goodOpts = clone(defaultProps)
      assert.doesNotThrow(() => validOpts(goodOpts))
      const badOpt = {a: 'a'}
      assert.throws(() => validOpts(badOpt))
    })
    it('throw when opt is incorrect type', () => {
      const opts = clone(defaultProps)
      // test every opt
      Object.keys(opts).map(opt => {
        const validType = kindOf(opts[opt])
        const invalidTypes = types.except(validType)
        // for every invalid type
        Object.keys(invalidTypes).map(type => {
          const testOpt = {}
          testOpt[opt] = invalidTypes[type]
          assert.throws(() => validOpts(testOpt))
        })
      })
    })
    it('throw when opts param is defined and not an object', () => {
      const testTypes = types.except(['null', 'undefined', 'object'])
      Object.keys(testTypes).map(type => {
        assert.throws(() => validOpts(testTypes[type]))
      })
    })
  })
  describe('spinners', () => {
    it('throw when spinners param is not an object or array')
    it('throw when spinners param is empty')
  })
  describe('complete', () => {
    it('throw when state is not a valid spinner state', () => {
      const m = new Multispinner(spinners, {testing: true})
      assert.throws(() => m.complete(spinner))
      assert.throws(() => m.complete(spinner, 'notValidState'))
      // fixme -- assert doesn't throw if correct state
    })
  })
})
