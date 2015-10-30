'use strict'

//----------------------------------------------------------
// Modules
//----------------------------------------------------------
// NPM
const assert = require('chai').assert
const clone = require('lodash.clonedeep')
const kindOf = require('kind-of')
const typeIter = require('type-iterator')

// Local
const Multispinner = require('../')
const Spinners = require('lib/spinners')
const defaultProps = require('lib/constants').defaultProps
const validOpts = require('lib/validOpts')

// Test Utils
const genSpinners = require('./utils/genSpinners')

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

      const badOpt = {'a': 'a'}
      assert.throws(() => validOpts(badOpt))
    })

    it('throw when opt is incorrect type', () => {
      const opts = clone(defaultProps)

      Object.keys(opts).map(opt => {
        const optType = kindOf(opts[opt])
        typeIter.exclude(optType, (val) => {
          const testOpt = {}
          testOpt[opt] = val
          assert.throws(() => validOpts(testOpt))
        })
      })
    })

    it('throw when opts param is defined and not an object', () => {
      typeIter.exclude(['null', 'undefined', 'object'], val => {
        assert.throws(() => validOpts(val))
      })
    })
  })

  //----------------------------------------------------------
  // spinners errs
  //----------------------------------------------------------
  describe('spinners', () => {
    it('throw when spinners param is not an object or array', () => {
      typeIter.exclude(['object', 'array'], (val) => {
        assert.throws(() => new Spinners(val, '', '').spinners())
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
  // index errs
  //----------------------------------------------------------
  describe('index', () => {
    it('throw when state is not a valid spinner state', () => {
      const spinners = genSpinners.arr(3)
      const spinner = spinners[0]
      const m = new Multispinner(spinners, {'testing': true})
      assert.throws(() => m.complete(spinner))
      assert.throws(() => m.complete(spinner, 'notValidState'))
    })
    it('build error string for spinner in error state')
  })
})
