'use strict'

//----------------------------------------------------------
// Modules
//----------------------------------------------------------
// NPM
const assert = require('chai').assert
const chalk  = require('chalk')
const clone  = require('lodash.clonedeep')
const faker  = require('faker')
const os     = require('os')
const sinon  = require('sinon')

// Local
const Multispinner = require('../')
const Spinners     = require('lib/spinners')
const defaultProps = require('lib/constants').defaultProps
const states       = require('lib/constants').states

// Test Utils
const genSpinners = require('./utils/genSpinners')

//----------------------------------------------------------
// Tests
//----------------------------------------------------------
describe('Multispinner methods', () => {
  // setup
  const spinners = genSpinners.arr(3)
  const spinner = spinners[0]
  let clock
  let m

  beforeEach(() => {
    clock = sinon.useFakeTimers()
    m = new Multispinner(spinners, {autoStart: false})
  })

  afterEach(() => {
    clock.restore()
  })

  //----------------------------------------------------------
  // allCompleted
  //----------------------------------------------------------
  describe('allCompleted', () => {
    it('return false if not all spinners are complete', () => {
      spinners.map((spinner, i) => {
        m.success(spinner)
        if (i < spinners.length - 1) {
          assert.isFalse(m.allCompleted())
        }
      })
    })

    it('return true if all spinners are complete', () => {
      spinners.map(spinner => {
        m.error(spinner)
      })
      assert.isTrue(m.allCompleted())
    })
  })

  //----------------------------------------------------------
  // allSuccess
  //----------------------------------------------------------
  describe('allSuccess', () => {
    it('return false if any spinners are not in success state', () => {
      spinners.map((spinner, i) => {
        m.success(spinner)
        if (i < spinners.length - 1) assert.isFalse(m.allSuccess())
      })
    })

    it('return true if all spinners are in success state', () => {
      spinners.map((spinner) => m.success(spinner))
      assert.isTrue(m.allSuccess())
    })
  })

  //----------------------------------------------------------
  // anyErrors
  //----------------------------------------------------------
  describe('anyErrors', () => {
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

  //----------------------------------------------------------
  // complete
  //----------------------------------------------------------
  describe('complete', () => {
    it('update spinner prop with state param', () => {
      assert.equal(m.spinners[spinner].state, states.incomplete)
      m.complete(spinner, states.success)
      assert.equal(m.spinners[spinner].state, states.success)
      m.complete(spinner, states.error)
      assert.equal(m.spinners[spinner].state, states.error)
    })
  })

  //----------------------------------------------------------
  // constructor
  //----------------------------------------------------------
  describe.skip('constructor', () => {
    it('clone default props', () => {
      // setup
      const clock = sinon.useFakeTimers()
      const m = new Multispinner(spinners)

      // test props
      Object.keys(defaultProps).map(prop => {
        assert.deepEqual(defaultProps[prop], m[prop])
      })

      // clean up
      // logUpdate.clear()
    })

    it('merge opts into props', () => {
      const opts = {
        autoStart: false,
        clear: true,
        frames: ['v', '<', '^', '>'],
        indent: 4,
        postText: faker.fake('{{lorem.words}}'),
        preText: faker.fake('{{lorem.words}}'),
        color: {
          incomplete: 'yellow',
          success: 'cyan',
          error: 'magenta'
        },
        symbol: {
          incomplete: null,
          success: 'o',
          error: 'x'
        }
      }
      const m = new Multispinner(spinners, opts)
      Object.keys(opts).map(prop => {
        assert.deepEqual(opts[prop], m[prop])
      })
    })

    it('handle partially configured property object', () => {
      const opts = {
        autoStart: false,
        color: {
          incomplete: 'yellow'
        }
      }

      // build expected color object
      const expected = clone(defaultProps.color)
      expected.incomplete = 'yellow'

      // instantiate and test
      const m = new Multispinner(spinners, opts)
      assert.deepEqual(expected, m.color)
    })

    describe('compute and bind computed props', () => {
      it('frames and frameCount', () => {
        const frames = ['x', '+']
        const m = new Multispinner(spinners, {
          frames,
          autoStart: false
        })
        assert.equal(2, m.frameCount)
        assert.equal(frames, m.frames)
      })

      it('indentStr', () => {
        const m = new Multispinner(spinners, {
          autoStart: false,
          indent: 4
        })
        assert.equal(' '.repeat(4), m.indentStr)
      })
    })

    it('props do not leak between instances', () => {
      const m = new Multispinner(spinners, {autoStart: false})
      const spinners2 = genSpinners.arr(3)
      const m2 = new Multispinner(spinners2, {autoStart: false})
      spinners.map(spinner => {
        assert.isFalse(m2.spinners.hasOwnProperty(spinner))
      })
    })

    it('instantiate spinners', () => {
      const m = new Multispinner(spinners, {autoStart: false})
      const s = new Spinners(spinners, m.preText, m.postText).spinners()
      assert.deepEqual(m.spinners, s)
    })

    it('start loop if testing is false', () => {
      const clock = sinon.useFakeTimers()
      const m = new Multispinner(spinners)
      const spy = sinon.spy(m, 'loop')
      clock.tick(m.interval)
      assert(spy.called, 'call loop method')
      // logUpdate.clear()
      m.loop.restore()
      clock.restore()
    })
  })

  //----------------------------------------------------------
  // error
  //----------------------------------------------------------
  describe('error', () => {
    it('call complete method with spinner in error state', () => {
      const spinners = genSpinners.arr(3)
      const m = new Multispinner(spinners, {autoStart: false})
      const spy = sinon.spy(m, 'complete')
      m.error(spinners[0])
      assert(spy.called, 'call complete method')
      assert(
        spy.calledWith(spinners[0], states.error),
        'call complete method with correct params'
      )
    })
  })

  //----------------------------------------------------------
  // loop
  //----------------------------------------------------------
  describe.skip('loop', () => {
    const spinners = genSpinners.arr(3)
    const spinner = spinners[0]
    let clock
    let m

    beforeEach(() => {
      clock = sinon.useFakeTimers()
      m = new Multispinner(spinners)
    })

    afterEach(() => {
      clock.restore()
      m.update.clear()
    })

    it('step through spinner animation frames and update prop', () => {
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

    describe('update current spinner strings', () => {
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

      it('states.incomplete', () => testCase(states.incomplete))
      it('states.success', () => testCase(states.success, m.success(spinner)))
      it('states.error', () => testCase(states.error, m.error(spinner)))
    })

    // fixme : stub m.update to something that doesn't write to console
    it.skip('call logUpdate with newline-joined current strings', () => {
      const spy = sinon.spy(m, 'update')
      clock.tick(m.interval)

      const expected = spinners.map(s => {
        return m.spinners[s].current
      }).join(os.EOL)

      assert(spy.calledWith(expected), 'call logUpdate with strings')
      m.update.restore()
    })

    describe('if allCompleted is true', () => {
      beforeEach(() => {
        const stub = sinon
          .stub(m, 'allCompleted')
          .returns(true)
      })

      afterEach(() => {
        m.allCompleted.restore()
      })

      it('call update.clear if this.clear is true', () => {
        m.clear = true
        const spy = sinon.spy(m.update, 'clear')
        clock.tick(m.interval)
        assert(spy.calledOnce, 'call clear method')
        m.update.clear.restore()
        // m.update.clear()
      })

      it('call logUpdate.done')

      it.skip('emit "done"', () => {
        let eventEmitted = false
        m.on('done', () => eventEmitted = true)
        clock.tick(m.interval)
        assert.isTrue(eventEmitted)
      })

      it.skip('emit "success" if allSuccess is true', () => {
        const allSuccessStub = sinon
          .stub(m, 'allSuccess')
          .returns(true)
        let eventEmitted = false
        m.on('success', () => eventEmitted = true)
        clock.tick(m.interval)
        assert.isTrue(eventEmitted)
        allSuccessStub.restore()
      })

      it.skip('emit "err" if allSuccess is false', () => {
        let eventEmitted = false
        m.on('err', () => eventEmitted = true)
        m.error(spinner)
        clock.tick(m.interval)
        assert.isTrue(eventEmitted)
      })

      it.skip('emit multiple "errs" if anyErrors().length > 1', () => {
        let eventCount = 0
        m.on('err', () => eventCount++)
        m.error(spinners[0])
        m.error(spinners[1])
        clock.tick(m.interval)
        assert.equal(2, eventCount)
      })
    })

    describe('if allCompleted is false', () => {
      it('increment this.i', () => {
        assert.equal(0, m.i)
        clock.tick(m.interval)
        assert.equal(1, m.i)
        clock.tick(m.interval)
        assert.equal(2, m.i)
      })

      it('loop again', () => {
        const spy = sinon.spy(m, 'loop')
        clock.tick(m.interval)
        assert(spy.calledOnce, 'call loop once')
        clock.tick(m.interval)
        assert(spy.calledTwice, 'call loop again')
        m.loop.restore()
      })
    })
  })

  //----------------------------------------------------------
  // start
  //----------------------------------------------------------
  describe('start', () => {
    it('call loop method', () => {
      const spy = sinon.spy(m, 'loop')
      const stub = sinon.stub(m, 'update')
      m.start()
      assert(spy.called, 'loop method called')
      m.loop.restore()
      stub.restore()
    })
  })

  //----------------------------------------------------------
  // success
  //----------------------------------------------------------
  describe('success', () => {
    it('call complete method with spinner in success state', () => {
      const spy = sinon.spy(m, 'complete')
      m.success(spinner)
      assert(spy.called, 'call complete method')
      assert(
        spy.calledWith(spinner, states.success),
        'call complete method with correct params'
      )
      m.complete.restore()
    })
  })
})
