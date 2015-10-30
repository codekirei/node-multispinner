'use strict'

//----------------------------------------------------------
// Modules
//----------------------------------------------------------
// NPM
const assert = require('chai').assert

// Local
const Multispinner = require('../../')
const states = require('lib/constants').states

// Test Utils
const genSpinners = require('../utils/genSpinners')

//----------------------------------------------------------
// Tests
//----------------------------------------------------------
module.exports = describe('complete', () => {
  // setup
  const spinners = genSpinners.arr(3)
  const spinner = spinners[0]
  let m
  beforeEach(() => {
    m = new Multispinner(spinners, {testing: true})
  })

  it('Update spinner prop with state param', () => {
    assert.equal(m.spinners[spinner].state, states.incomplete)
    m.complete(spinner, states.success)
    assert.equal(m.spinners[spinner].state, states.success)
    m.complete(spinner, states.error)
    assert.equal(m.spinners[spinner].state, states.error)
  })
})
