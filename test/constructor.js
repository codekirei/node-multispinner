'use strict'

//----------------------------------------------------------
// Modules
//----------------------------------------------------------
// NPM
const assert = require('chai').assert
const sinon = require('sinon')

// Local
const Multispinner = require('../')
const validOpts = require('lib/validOpts')
const types = require('./utils/types')
const genSpinners = require('./utils/genSpinners')

//----------------------------------------------------------
// Tests
//----------------------------------------------------------
describe('Constructor', () => {
  describe('errs', () => {
    it('Throw when spinners param is not an object or array', () => {
      const relevantTypes = types.except(['object', 'array'])
      Object.keys(relevantTypes).map(type => {
        assert.throw(() => new Multispinner(relevantTypes[type]))
      })
    })

    it('Throw when opts param is not an object')
  })

  describe('props', () => {
    it('Assign default props')

    it('Validate options with validOpts function', (cb) => {
      const spinners = genSpinners.arr(3)
      const spy = sinon.spy(validOpts)
      const m = new Multispinner(spinners, {debug: true})
      setTimeout(() => {
        assert(spy.called, 'validOpts function called')
        cb()
      }, m.interval)
    })

    it('Overwrite default props with opts')

    it('Create spinners with createSpinner function')

    describe('update prop', () => {
      it('Assign writable stream when debug is true')
      it('Assign log-update when debug is false')
    })
  })
})
