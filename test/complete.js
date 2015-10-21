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
describe('complete method', () => {
  // setup
  const spinners = genSpinners.arr(3)
  const spinner = spinners[0]
  let m
  beforeEach(() => {
    m = new Multispinner(spinners, {debug: true})
    m.start()
  })
  afterEach(() => {
    m.stop()
  })

  it('Throw if incorrect state passed', () => {
    assert.throws(() => m.complete(spinner))
    assert.throws(() => m.complete(spinner, 'notValidState'))
  })

  it('Call stop method', () => {
    let spy = sinon.spy(m, 'stop')
    m.complete(spinner, states.success)
    assert(spy.calledOnce, 'call clearState method')
    m.stop.restore()
  })

  it('Update spinner with state', () => {
    assert.equal(m.spinners[spinner].state, states.incomplete)
    m.complete(spinner, states.success)
    assert.equal(m.spinners[spinner].state, states.success)
  })

  it('Call start method', () => {
    let spy = sinon.spy(m, 'start')
    m.complete(spinner, states.error)
    assert(spy.calledOnce, 'call start method')
    m.start.restore()
  })

  describe('success method', () => {
    it('Complete spinner and change state to success', () => {
      spinners.map(spinner => {
        m.success(spinner)
        assert.equal(states.success, m.spinners[spinner].state)
      })
    })
  })

  describe('error method', () => {
    it('Complete spinner and change state to error', () => {
      spinners.map(spinner => {
        m.error(spinner)
        assert.equal(states.error, m.spinners[spinner].state)
      })
    })
  })
})
