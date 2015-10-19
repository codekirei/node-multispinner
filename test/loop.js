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

  it('Step through spinner animation frames', () => {
    // setup
    const clock = sinon.useFakeTimers()
    let i = 0

    // start loop
    multispinner.loop()

    // time leap in intervals to each animation frame and test
    while (i < multispinner.frameCount) {
      assert.equal(multispinner.currentFrame, multispinner.frames[i])
      clock.tick(multispinner.interval)
      i++
    }

    // cleanup
    multispinner.clearState(true)
    clock.restore()
  })

  it('Call logUpdate to apply current spinner strings')
  // it('Call logUpdate to apply current spinner strings', () => {
  //   // setup
  //   const spy = sinon.spy(logUpdate)
  //   const clock = sinon.useFakeTimers()

  //   // start loop
  //   multispinner.loop()

  //   // time leap and test
  //   clock.tick(multispinner.interval)
  //   assert(spy.called)

  //   // clean up
  //   multispinner.clearState(true)
  //   clock.restore()

  //   // setTimeout(() => {
  //   //   assert(spy.called)
  //   // }, multispinner.interval)
  //   // multispinner.clearState(true)
  // })

  it('Call clearState method if allCompleted is true', () => {
    // setup
    const spy = sinon.spy(multispinner, 'clearState')
    const stub = sinon
      .stub(multispinner, 'allCompleted')
      .returns(true)
    const clock = sinon.useFakeTimers()

    // start loop
    multispinner.loop()

    // time leap and test
    clock.tick(multispinner.interval)
    assert(spy.called)

    // clean up
    multispinner.clearState.restore()
    clock.restore()
    stub.restore()
    multispinner.clearState(true)
  })

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
