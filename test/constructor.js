'use strict'

//----------------------------------------------------------
// Modules
//----------------------------------------------------------
// NPM
const assert = require('chai').assert

// Local
const Multispinner = require('../')
const states = require('../states')

//----------------------------------------------------------
// Tests
//----------------------------------------------------------
describe('Constructor', () => {
  it('Throw if spinners param is not an object or array', () => {
    assert.throw(() => new Multispinner())
    assert.throw(() => new Multispinner(undefined))
    assert.throw(() => new Multispinner(null))
    assert.throw(() => new Multispinner('string'))
    assert.throw(() => new Multispinner(true))
    assert.throw(() => new Multispinner(0))
    assert.throw(() => new Multispinner(function(){}))
  })

  it('Construct spinners from object', () => {
    // fixtures
    const spinners = {
      spinner1: 'spinner1 text',
      spinner2: 'spinner2 text'
    }
    const expected = {
      spinner1: {
        state: states.incomplete,
        current: null,
        base: spinners.spinner1
      },
      spinner2: {
        state: states.incomplete,
        current: null,
        base: spinners.spinner2
      }
    }
    let multispinner = new Multispinner(spinners)
    assert.deepEqual(expected, multispinner.spinners)
  })

  it('Construct spinners from array')

  it('Parse opts param')

  it('Assign internal props')
})
