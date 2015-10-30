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

  beforeEach(() => {
    m = new Multispinner(spinners, {testing: true})
  })

  it('Step through spinner animation frames and update prop', () => {
    // freeze time
    const clock = sinon.useFakeTimers()
    m.loop()

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

    // unfreeze time
    clock.restore()
  })

  it('Call update method with newline-joined current strings', () => {
    const spy = sinon.spy(m, 'update')
    m.loop()

    const expected = spinners.map(s => {
      return m.spinners[s].current
    }).join(os.EOL)

    assert(spy.calledWith(expected), 'call update method with strings')
    m.update.restore()
  })

  describe('build spinners[spinner].current', () => {
    // have to use beforeEach because its used in upper scope
    beforeEach(() => {
      m.loop()
    })

    // freeze time
    const clock = sinon.useFakeTimers()

    /**
     * Test case boilerplate
     * @param {string} state - state to test
     * @param {function} action - action to take
     * @returns {bool} result of assertion
     */
    function testCase(state, action) {
      // perform stated action
      if (action) action()

      // time leap to next loop
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

    it('call logUpdate.clear if this.clear is true', () => {
      m.clear = true
      const spy = sinon.spy(m.update, 'clear')
      m.loop()
      assert(spy.calledOnce, 'call clear method')
      m.update.clear.restore()
    })

    it('emit "done"')
    it('emit "success" if allSuccess is true')
    it('emit "err" if allSuccess is false')
    it('emit multiple "errs" if anyErrors().length > 1')
  })

  describe('if allCompleted is false', () => {
    it('increment this.i')
    it('loop again')
  })
})
