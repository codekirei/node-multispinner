'use strict'

//----------------------------------------------------------
// Modules
//----------------------------------------------------------
// NPM
const assert = require('chai').assert
const sinon = require('sinon')
const logUpdate = require('log-update')
const faker = require('faker')
const clone = require('lodash.clonedeep')

// Local
const Multispinner = require('../')
const Spinners = require('lib/spinners')
const defaultProps = require('lib/constants').defaultProps
const states = require('lib/constants').states
const validOpts = require('lib/validOpts')

// Test Utils
const types = require('./utils/types')
const genSpinners = require('./utils/genSpinners')

//----------------------------------------------------------
// Tests
//----------------------------------------------------------
describe('Methods', () => {
  //----------------------------------------------------------
  // Constructor
  //----------------------------------------------------------
  describe('constructor', () => {
    const spinners = genSpinners.arr(3)

    it('Clone default props', () => {
      const m = new Multispinner(spinners)
      Object.keys(defaultProps).map(prop => {
        assert.deepEqual(defaultProps[prop], m[prop])
      })
    })

    it('Merge opts into props', () => {
      const opts = {
        clear: true,
        frames: ['v', '<', '^', '>'],
        indent: 4,
        postText: faker.fake("{{lorem.words}}"),
        preText: faker.fake("{{lorem.words}}"),
        testing: true,
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

    it('Handle partially configured property object', () => {
      const opts = {
        testing: true,
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

    it('Props do not leak between instances', () => {
      const m = new Multispinner(spinners, {testing: true})
      const spinners2 = genSpinners.arr(3)
      const m2 = new Multispinner(spinners2, {testing: true})
      spinners.map(spinner => {
        assert.isFalse(m2.spinners.hasOwnProperty(spinner))
      })
    })

    it('Instantiate spinners', () => {
      const m = new Multispinner(spinners, {testing: true})
      const s = new Spinners(spinners, m.preText, m.postText)
      assert.deepEqual(m.spinners, s)
    })

    it('LogUpdate to stream if testing is true', () => {
      const m = new Multispinner(spinners, {testing: true})
      assert.deepEqual(
        logUpdate.create().toString(),
        m.update.toString()
      )
    })
  })

  //----------------------------------------------------------
  // loop
  //----------------------------------------------------------
  describe('loop', () => {
    // setup
    const spinners = genSpinners.arr(3)
    const spinner = spinners[0]
    let multispinner
    beforeEach(() => {
      multispinner = new Multispinner(spinners, {debug: true})
    })

    it('Step through spinner animation frames and update prop', () => {
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

    it('Update current strings in spinners prop based on spinner states')

    it('Call update method with newline-joined current strings')

    it('Do not print output if this.testing is true')
    // it('Call logUpdate to apply current spinner strings')
    // it('Call update to apply current spinner strings', () => {
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

    it('Call stop method if allCompleted is true', () => {
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
      assert(spy.called, 'clearState method called')

      // clean up
      multispinner.clearState.restore()
      clock.restore()
      stub.restore()
      multispinner.clearState(true)
    })

    it('Call clear method of update method if clear prop is true')
  })

  //----------------------------------------------------------
  // complete
  //----------------------------------------------------------
  describe('complete', () => {
    // setup
    const spinners = genSpinners.arr(3)
    const spinner = spinners[0]
    let m
    beforeEach(() => {
      m = new Multispinner(spinners, {debug: true})
      m.start()
    })

    it('Throw if undefined or invalid state param passed', () => {
      assert.throws(() => m.complete(spinner))
      assert.throws(() => m.complete(spinner, 'notValidState'))
    })

    it('Call stop method', () => {
      let spy = sinon.spy(m, 'stop')
      m.complete(spinner, states.success)
      assert(spy.calledOnce, 'call stop method')
      m.stop.restore()
    })

    it('Update spinner prop with state param', () => {
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
  })

  //----------------------------------------------------------
  // success
  //----------------------------------------------------------
  describe('success', () => {
    it('Call complete method with spinner in success state', () => {
      spinners.map(spinner => {
        m.success(spinner)
        assert.equal(states.success, m.spinners[spinner].state)
      })
    })
  })

  //----------------------------------------------------------
  // error
  //----------------------------------------------------------
  describe('error', () => {
    it('Call complete method with spinner in error state', () => {
      spinners.map(spinner => {
        m.error(spinner)
        assert.equal(states.error, m.spinners[spinner].state)
      })
    })
  })

  //----------------------------------------------------------
  // allCompleted
  //----------------------------------------------------------
  describe('allCompleted', () => {
    // setup
    const spinners = genSpinners.arr(3)
    let m
    beforeEach(() => {
      m = new Multispinner(spinners, {debug: true})
    })

    it('Return false if not all spinners are complete', () => {
      let i = 0
      const lastSpinner = spinners.length - 1
      for (i; i < lastSpinner; i++) {
        m.success(spinners[i])
        assert.isFalse(m.allCompleted())
      }
    })

    it('Return true if all spinners are complete', () => {
      spinners.map(spinner => {
        m.error(spinner)
      })
      assert.isTrue(m.allCompleted())
    })
  })

  //----------------------------------------------------------
  // start
  //----------------------------------------------------------
  describe('start', () => {
    it('Call loop method', () => {
      const spy = sinon.spy(multispinner, 'loop')
      multispinner.start()
      assert(spy.calledOnce, 'loop method called')
      multispinner.clearState()
    })
  })

  //----------------------------------------------------------
  // stop
  //----------------------------------------------------------
  describe('stop', () => {
    // setup
    const spinners = genSpinners.arr(3)
    let m
    beforeEach(() => {
      m = new Multispinner(spinners, {debug: true})
      m.start()
    })
    afterEach(() => {
      m.cleanUp()
    })

    it('Clear interval bound to this.state', () => {
      // setup
      m.stop()

      // assertions
      assert.equal(-1, m.state._idleTimeout)
    })
  })
})
