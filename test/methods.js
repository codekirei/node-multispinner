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
const Spinners     = require('../lib/spinners')
const defaultProps = require('../lib/constants').defaultProps
const states       = require('../lib/constants').states

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
      spinners.map((s, i) => {
        m.success(s)
        if (i < spinners.length - 1) {
          assert.isFalse(m.allCompleted())
        }
      })
    })

    it('return true if all spinners are complete', () => {
      spinners.map(s => {
        m.error(s)
      })
      assert.isTrue(m.allCompleted())
    })
  })

  //----------------------------------------------------------
  // allSuccess
  //----------------------------------------------------------
  describe('allSuccess', () => {
    it('return false if any spinners are not in success state', () => {
      spinners.map((s, i) => {
        m.success(s)
        if (i < spinners.length - 1) assert.isFalse(m.allSuccess())
      })
    })

    it('return true if all spinners are in success state', () => {
      spinners.map(s => m.success(s))
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
      // incomplete
      assert.equal(m.spinners[spinner].state, states.incomplete)

      // success
      m.complete(spinner, states.success)
      assert.equal(m.spinners[spinner].state, states.success)

      // error
      m.complete(spinner, states.error)
      assert.equal(m.spinners[spinner].state, states.error)
    })
  })

  //----------------------------------------------------------
  // constructor
  //----------------------------------------------------------
  describe('constructor', () => {
    it('clone default props', () => {
      const otherM = new Multispinner(spinners, {autoStart: false})

      // prep defaults (symbol.incomplete is assigned immediately)
      const defaults = clone(defaultProps)

      // prevent bleed
      defaults.autoStart = false

      // test props
      Object.keys(defaults).map(prop => {
        assert.deepEqual(defaults[prop], otherM[prop])
      })
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
          incomplete: 'v',
          success: 'o',
          error: 'x'
        }
      }

      const customM = new Multispinner(spinners, opts)

      Object.keys(opts).map(prop => {
        assert.deepEqual(opts[prop], customM[prop])
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
      const customM = new Multispinner(spinners, opts)
      assert.deepEqual(expected, customM.color)
    })

    describe('compute and bind computed props', () => {
      it('frames and frameCount', () => {
        const frames = ['x', '+']
        const customM = new Multispinner(spinners, {
          autoStart: false,
          frames
        })
        assert.equal(2, customM.frameCount)
        assert.equal(frames, customM.frames)
      })

      it('indentStr', () => {
        const customM = new Multispinner(spinners, {
          autoStart: false,
          indent: 4
        })
        assert.equal(' '.repeat(4), customM.indentStr)
      })
    })

    it('spinners do not leak between instances', () => {
      const s1 = ['foo', 'bar']
      const m1 = new Multispinner(s1, {autoStart: false})
      const s2 = ['baz', 'qux']
      const m2 = new Multispinner(s2, {autoStart: false})
      const multis = [m1, m2]
      multis.map(m => {
        // stub out update to keep output clean
        m.update = () => {}
        m.start()
      })
      clock.tick(m1.interval)
      s1.map(s => assert.isFalse(m2.spinners.hasOwnProperty(s)))
      s2.map(s => assert.isFalse(m1.spinners.hasOwnProperty(s)))
    })

    it('instantiate spinners', () => {
      const s = new Spinners(spinners, m.preText, m.postText).spinners()
      assert.deepEqual(m.spinners, s)
    })

    it('start loop if autoStart is true', () => {
      const stub = sinon.stub()
      const customM = new Multispinner(spinners, {update: stub})
      const spy = sinon.spy(customM, 'loop')
      clock.tick(customM.interval)
      assert(spy.called, 'call loop method')
      spy.restore()
    })
  })

  //----------------------------------------------------------
  // error
  //----------------------------------------------------------
  describe('error', () => {
    it('call complete method with spinner in error state', () => {
      const spy = sinon.spy(m, 'complete')
      m.error(spinner)
      assert(spy.called, 'call complete method')
      assert(
        spy.calledWith(spinner, states.error),
        'call complete method with correct params'
      )
    })
  })

  //----------------------------------------------------------
  // loop
  //----------------------------------------------------------
  describe('loop', () => {
    const stub = sinon.stub()
    beforeEach(() => {
      // stub out update to keep console clean
      m.update = stub

      // start loop
      m.start()
    })

    it('step through spinner animation frames and update prop', () => {
      // time leap in intervals to each animation frame and test
      let i = 0
      while (i < m.frameCount) {
        assert.equal(
          m.symbol[states.incomplete],
          m.frames[i],
          `frame ${i}`
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

    it('call logUpdate with newline-joined current strings', () => {
      clock.tick(m.interval)

      const expected = spinners.map(s => {
        return m.spinners[s].current
      }).join(os.EOL)

      assert(stub.calledWith(expected), 'call this.update with strings')
    })

    describe('if allCompleted is true', () => {
      // make necessary stubs
      let allCompletedStub
      const clearStub = sinon.stub()
      const doneStub = sinon.stub()
      beforeEach(() => {
        allCompletedStub = sinon
          .stub(m, 'allCompleted')
          .returns(true)
        m.update.clear = clearStub
        m.update.done = doneStub
      })
      afterEach(() => {
        allCompletedStub.restore()
      })

      it('call update.clear if this.clear is true', () => {
        m.clear = true
        clock.tick(m.interval)
        assert(clearStub.called, 'call stubbed clear method')
      })

      it('call logUpdate.done', () => {
        assert(doneStub.called, 'call stubbed done method')
      })

      it('emit "done"', () => {
        let eventEmitted = false
        m.on('done', () => eventEmitted = true)
        clock.tick(m.interval)
        assert.isTrue(eventEmitted)
      })

      it('emit "success" if allSuccess is true', () => {
        const allSuccessStub = sinon
          .stub(m, 'allSuccess')
          .returns(true)
        let eventEmitted = false
        m.on('success', () => eventEmitted = true)
        clock.tick(m.interval)
        assert.isTrue(eventEmitted)
        allSuccessStub.restore()
      })

      it('emit "err" if allSuccess is false', () => {
        let eventEmitted = false
        m.on('err', () => eventEmitted = true)
        m.error(spinner)
        clock.tick(m.interval)
        assert.isTrue(eventEmitted)
      })

      it('emit multiple "errs" if anyErrors().length > 1', () => {
        let eventCount = 0
        m.on('err', () => eventCount++)
        m.error(spinners[0])
        m.error(spinners[1])
        clock.tick(m.interval)
        assert.equal(2, eventCount)
      })

      it('emit spinner with "err"', () => {
        let spinnerEmitted = null
        m.on('err', s => spinnerEmitted = s)
        m.error(spinners[0])
        clock.tick(m.interval)
        assert.equal(spinners[0], spinnerEmitted)
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
