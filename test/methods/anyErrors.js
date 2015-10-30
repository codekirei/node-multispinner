'use strict'

//----------------------------------------------------------
// Modules
//----------------------------------------------------------
// NPM
const assert = require('chai').assert

// Local
const Multispinner = require('../../')

// Test Utils
const genSpinners = require('../utils/genSpinners')

//----------------------------------------------------------
// Tests
//----------------------------------------------------------
module.exports = describe('anyErrors', () => {
  // setup
  const spinners = genSpinners.arr(3)
  let m
  beforeEach(() => {
    m = new Multispinner(spinners, {testing: true})
  })

  it('return empty array if no spinners are in error state', () => {
    assert.deepEqual([], m.anyErrors())
  })

  it('return array of spinners in error state if any', () => {
    const errs = []
    spinners.map(s => {
      m.error(s)
      errs.push(s)
      assert.deepEqual(errs, m.anyErrors())
    })
  })
})
