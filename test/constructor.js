'use strict'

//----------------------------------------------------------
// Modules
//----------------------------------------------------------
// NPM
const assert = require('chai').assert
const faker  = require('faker')

// Local
const Multispinner = require('../')
const states = require('lib/states')
const types = require('./utils/types')
const genSpinners = require('./utils/genSpinners')

//----------------------------------------------------------
// Tests
//----------------------------------------------------------
describe('Constructor', () => {

  it('Throw when spinners param is not an object or array', () => {
    const relevantTypes = types.except(['object', 'array'])
    Object.keys(relevantTypes).map(type => {
      assert.throw(() => new Multispinner(relevantTypes[type]))
    })
  })

  it('Assign internal props according to defaults', () => {
    const spinners = genSpinners.arr(3)
    let multispinner = new Multispinner(spinners)
    assert.equal(null, multispinner.state)
    assert.equal(0, multispinner.i)
    assert.equal(4, multispinner.frameCount)
    assert.equal('  ', multispinner.indentStr)
  })

  describe('update prop', () => {
    it('Assign writable stream when debug is true')
    it('Assign log-update when debug is false')
  })
})
