'use strict'

//----------------------------------------------------------
// Modules
//----------------------------------------------------------
// NPM
const assert    = require('chai').assert
const clone     = require('lodash.clonedeep')
const faker     = require('faker')
const logUpdate = require('log-update')

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
