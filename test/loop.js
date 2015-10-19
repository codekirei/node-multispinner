'use strict'

//----------------------------------------------------------
// Modules
//----------------------------------------------------------
// NPM
const assert = require('chai').assert
const logUpdate = require('log-update')
const sinon = require('sinon')

// Local
const Multispinner = require('../')
const genSpinners = require('./utils/genSpinners')
const states = require('lib/states')
const loop = require('lib/loop')

//----------------------------------------------------------
// Tests
//----------------------------------------------------------
describe('loop method', () => {
  // setup
  const spinners = genSpinners.arr(3)
  const spinner = spinners[0]
  let multispinner
  beforeEach(() => {
    multispinner = new Multispinner(spinners)
  })

  it('Call loop function', () => {
    const spy = sinon.spy(loop)
    multispinner.loop()
    setTimeout(() => {
      assert(spy.calledOnce)
      multispinner.clearState()
    }, multispinner.interval)
  })

  it('Step through spinner animation frames')

  it('Call logUpdate to apply current spinner strings', () => {
    const spy = sinon.spy(logUpdate)
    multispinner.loop()
    setTimeout(() => {
      assert(spy.calledOnce)
      multispinner.clearState()
    }, multispinner.interval)
  })

  it('Call clearState method if allCompleted is true')

  describe('spinner string', () => {
    it('Set symbol to animation when state is incomplete')
    it('Set symbol to success symbol when state is success')
    it('Set symbol to error symbol when state is error')
    it('Build string from indentStr, symbol, and text')
  })

  describe('start method', () => {
    it('Call loop method', () => {
      const spy = sinon.spy(multispinner, 'loop')
      multispinner.start()
      assert(spy.calledOnce)
      multispinner.clearState()
    })
  })
})
