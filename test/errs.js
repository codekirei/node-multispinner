'use strict'

//----------------------------------------------------------
// Modules
//----------------------------------------------------------
// NPM
const assert = require('chai').assert
const sinon = require('sinon')
const faker = require('faker')

// Local
const Multispinner = require('../')
const Spinners = require('lib/spinners')
const states = require('lib/constants').states

// Test Utils
const genSpinners = require('./utils/genSpinners')

//----------------------------------------------------------
// Tests
//----------------------------------------------------------
describe('errs', () => {
  const spinners = genSpinners.arr(3)
  const spinner = spinners[0]
  describe('validOpts', () => {
    it('throw when opt is not a configurable property')
    it('throw when opt is incorrect type')
    it('throw when opts param is not an object')
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
