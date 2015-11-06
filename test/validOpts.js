'use strict'

//----------------------------------------------------------
// Modules
//----------------------------------------------------------
// NPM
const assert = require('chai').assert
const clone = require('lodash.clonedeep')

// Local
const validOpts = require('../lib/validOpts')
const defaultProps = require('../lib/constants').defaultProps

//----------------------------------------------------------
// Tests
//----------------------------------------------------------
describe('validOpts', () => {
  it('return false when no opts passed', () => {
    assert.isFalse(validOpts())
  })
  it('return true when valid opts passed', () => {
    const opts = clone(defaultProps)
    assert.isTrue(validOpts(opts))
  })
})
