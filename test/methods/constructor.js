'use strict'

//----------------------------------------------------------
// Modules
//----------------------------------------------------------
// NPM
const assert    = require('chai').assert
const clone     = require('lodash.clonedeep')
const faker     = require('faker')
const logUpdate = require('log-update')
const sinon     = require('sinon')

// Local
const Multispinner = require('../../')
const Spinners     = require('lib/spinners')
const defaultProps = require('lib/constants').defaultProps
const genSpinners  = require('../utils/genSpinners')

//----------------------------------------------------------
// Tests
//----------------------------------------------------------
module.exports = describe('constructor', () => {
  const spinners = genSpinners.arr(3)

  it('Clone default props', () => {
    // setup
    const clock = sinon.useFakeTimers()
    const m = new Multispinner(spinners)

    // test props
    Object.keys(defaultProps).map(prop => {
      assert.deepEqual(defaultProps[prop], m[prop])
    })

    // clean up
    m.update.clear()
  })

  it('Merge opts into props', () => {
    const opts = {
      autoStart: false,
      clear: true,
      frames: ['v', '<', '^', '>'],
      indent: 4,
      postText: faker.fake('{{lorem.words}}'),
      preText: faker.fake('{{lorem.words}}'),
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
      autoStart: false,
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

  describe('compute and bind computed props', () => {
    it('frames and frameCount', () => {
      const frames = ['x', '+']
      const m = new Multispinner(spinners, {
        frames,
        autoStart: false,
        testing: true
      })
      assert.equal(2, m.frameCount)
      assert.equal(frames, m.frames)
    })

    it('indentStr', () => {
      const m = new Multispinner(spinners, {
        autoStart: false,
        testing: true,
        indent: 4
      })
      assert.equal(' '.repeat(4), m.indentStr)
    })
  })

  it('Props do not leak between instances', () => {
    const m = new Multispinner(spinners, {testing: true, autoStart: false})
    const spinners2 = genSpinners.arr(3)
    const m2 = new Multispinner(spinners2, {testing: true, autoStart: false})
    spinners.map(spinner => {
      assert.isFalse(m2.spinners.hasOwnProperty(spinner))
    })
  })

  it('Instantiate spinners', () => {
    const m = new Multispinner(spinners, {testing: true, autoStart: false})
    const s = new Spinners(spinners, m.preText, m.postText).spinners()
    assert.deepEqual(m.spinners, s)
  })

  it('Start loop if testing is false', () => {
    const clock = sinon.useFakeTimers()
    const m = new Multispinner(spinners)
    const spy = sinon.spy(m, 'loop')
    clock.tick(m.interval)
    m.update.clear()
    assert(spy.called, 'call loop method')
    m.loop.restore()
    clock.restore()
  })
})
