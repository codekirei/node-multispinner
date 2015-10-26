'use strict'

//----------------------------------------------------------
// Modules
//----------------------------------------------------------
// NPM
const assert = require('chai').assert
const clone = require('lodash.clonedeep')
const kindOf = require('kind-of')

// Local
const Multispinner = require('../')
const Spinners = require('lib/spinners')
const defaultProps = require('lib/constants').defaultProps
const validOpts = require('lib/validOpts')

// Test Utils
const genSpinners = require('./utils/genSpinners')
const types = require('./utils/types')

//----------------------------------------------------------
// Tests
//----------------------------------------------------------
describe('errs', () => {
  //----------------------------------------------------------
  // validOpts errs
  //----------------------------------------------------------
  describe('validOpts', () => {
    it('throw when opt is not a configurable property', () => {
      const goodOpts = clone(defaultProps)
      assert.doesNotThrow(() => validOpts(goodOpts))
      const badOpt = {a: 'a'}
      assert.throws(() => validOpts(badOpt))
    })

    it('throw when opt is incorrect type', () => {
      /**
       * @function invalidTypes
       * @param {object} opts - default opts
       * @param {string} opt - key of relevant opt
       * @returns {object} types opt is not
       */
      function invalidTypes(opts, opt) {
        const validType = kindOf(opts[opt])
        return types.except(validType)
      }

      /**
       * @function testTypes
       * @param {string} opt - key of relevant opt
       * @param {object} typesToTest - types opt is not
       * @returns {undefined}
       */
      function testTypes(opt, typesToTest) {
        Object.keys(typesToTest).map(type => {
          testType(opt, typesToTest[type])
        })
      }

      /**
       * @function testType
       * @param {string} opt - key of opt in question
       * @param {*} type - typed entity to test
       * @returns {undefined}
       */
      function testType(opt, type) {
        const testObj = {}
        testObj[opt] = type
        assert.throws(() => validOpts(testObj))
      }

      /**
       * @function testOpts
       * @param {object} opts - opts to test
       * @returns {undefined}
       */
      function testOpts(opts) {
        Object.keys(opts).map(opt => {
          testTypes(opt, invalidTypes(opts, opt))
        })
      }

      testOpts(clone(defaultProps))
    })

    it('throw when opts param is defined and not an object', () => {
      const testTypes = types.except(['null', 'undefined', 'object'])
      Object.keys(testTypes).map(type => {
        assert.throws(() => validOpts(testTypes[type]))
      })
    })
  })

  //----------------------------------------------------------
  // spinners errs
  //----------------------------------------------------------
  describe('spinners', () => {
    it('throw when spinners param is not an object or array', () => {
      const invalidTypes = types.except(['object', 'array'])
      Object.keys(invalidTypes).map(type => {
        assert.throws(() => new Spinners(invalidTypes[type], '', '').spinners())
      })
    })
    it('throw when spinners param is empty', () => {
      const errs = [{}, []]
      errs.map(err => {
        assert.throws(() => new Spinners(err, '', '').spinners())
      })
    })
  })

  //----------------------------------------------------------
  // complete errs
  //----------------------------------------------------------
  describe('complete', () => {
    it('throw when state is not a valid spinner state', () => {
      const spinners = genSpinners.arr(3)
      const spinner = spinners[0]
      const m = new Multispinner(spinners, {testing: true})
      assert.throws(() => m.complete(spinner))
      assert.throws(() => m.complete(spinner, 'notValidState'))
    })
  })
})
