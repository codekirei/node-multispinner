'use strict'

//----------------------------------------------------------
// Modules
//----------------------------------------------------------
// NPM
const assert = require('chai').assert
const sinon = require('sinon')

// Local
const Multispinner = require('../')
const genSpinners = require('./utils/genSpinners')
const states = require('lib/states')

//----------------------------------------------------------
// Tests
//----------------------------------------------------------
describe.skip('complete method', () => {
  // setup
  const spinners = genSpinners.arr(3)
  const spinner = spinners[0]
  let multispinner
  beforeEach(() => {
    multispinner = new Multispinner(spinners, {debug: true})
    multispinner.start()
  })
  afterEach(() => {
    multispinner.clearState(true)
  })

  it('Throw if incorrect state passed', () => {
    assert.throws(() => multispinner.complete(spinner))
    assert.throws(() => multispinner.complete(spinner, 'notValidState'))
  })

  it('Call clearState method', () => {
    let spy = sinon.spy(multispinner, 'clearState')
    multispinner.complete(spinner, states.success)
    assert(spy.calledOnce, 'call clearState method')
  })

  it('Update spinner with state', () => {
    assert.equal(multispinner.spinners[spinner].state, states.incomplete)
    multispinner.complete(spinner, states.success)
    assert.equal(multispinner.spinners[spinner].state, states.success)
  })

  it('Call loop method', () => {
    let spy = sinon.spy(multispinner, 'loop')
    multispinner.complete(spinner, states.error)
    assert(spy.calledOnce, 'call loop method')
  })

  describe('success method', () => {
    it('Complete spinner and change state to success', () => {
      spinners.map(spinner => {
        multispinner.success(spinner)
        assert.equal(states.success, multispinner.spinners[spinner].state)
      })
    })
  })

  describe('error method', () => {
    it('Complete spinner and change state to error', () => {
      spinners.map(spinner => {
        multispinner.error(spinner)
        assert.equal(states.error, multispinner.spinners[spinner].state)
      })
    })
  })
})
