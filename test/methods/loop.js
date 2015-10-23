'use strict'

//----------------------------------------------------------
// Modules
//----------------------------------------------------------
// NPM
const assert = require('chai').assert
const sinon = require('sinon')
const chalk = require('chalk')
const os = require('os')

// Local
const Multispinner = require('../../')
const states = require('lib/constants').states

// Test Utils
const genSpinners = require('../utils/genSpinners')

//----------------------------------------------------------
// Tests
//----------------------------------------------------------
module.exports = describe('loop', () => {
  const spinners = genSpinners.arr(3)
  const spinner = spinners[0]
  let m
  let clock

  beforeEach(() => {
    clock = sinon.useFakeTimers()
    m = new Multispinner(spinners, {testing: true})
    m.loop()
  })

  afterEach(() => {
    clock.restore()
  })

  it('Bind interval to state prop', () => {
    assert.isNotNull(m.state)
  })

  it('Step through spinner animation frames and update prop', () => {
    // time leap in intervals to each animation frame and test
    let i = 0
    while (i < m.frameCount) {
      assert.equal(
        m.symbol[states.incomplete],
        m.frames[i]
      )
      clock.tick(m.interval)
      i++
    }
  })

  it('Call update method with newline-joined current strings', () => {
    const spy = sinon.spy(m, 'update')
    clock.tick(m.interval)

    const strings = spinners.map(s => {
      return m.spinners[s].current
    }).join(os.EOL)

    assert(spy.calledWith(strings), 'call update method with strings')
    m.update.restore()
  })

  describe('build spinners[spinner].current', () => {
    /**
     * Test case boilerplate
     * @param {string} state - state to test
     * @param {function} action - action to take
     * @returns {bool} result of assertion
     */
    function testCase(state, action) {
      if (action) action()
      clock.tick(m.interval)

      const expected = chalk[m.color[state]]([
        m.indentStr,
        m.symbol[state],
        ' ',
        m.spinners[spinner].text
      ].join(''))

      assert.equal(expected, m.spinners[spinner].current)
    }

    it('for states.incomplete', () => testCase(states.incomplete))
    it('for states.success', () => testCase(states.success, m.success(spinner)))
    it('for states.error', () => testCase(states.error, m.error(spinner)))
  })

  describe('if allCompleted is true', () => {
    let stub
    beforeEach(() => {
      stub = sinon
        .stub(m, 'allCompleted')
        .returns(true)
    })
    afterEach(() => {
      stub.restore()
    })

    it('Call stop method', () => {
      const spy = sinon.spy(m, 'stop')
      clock.tick(m.interval)
      assert(spy.calledOnce, 'call stop method')
      m.stop.restore()
    })

    it('Call clear method of update method if clear prop is true', () => {
      m.clear = true
      const spy = sinon.spy(m.update, 'clear')
      clock.tick(m.interval)
      assert(spy.calledOnce, 'call clear method')
      m.update.clear.restore()
    })
  })
})
