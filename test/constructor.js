'use strict'

//----------------------------------------------------------
// Modules
//----------------------------------------------------------
// NPM
const assert = require('chai').assert

// Local
const Multispinner = require('../')
const states = require('lib/states')
const types = require('./utils/types')

//----------------------------------------------------------
// Tests
//----------------------------------------------------------
describe('Constructor', () => {
  let relTypes = types.except(['object', 'array'])
  Object.keys(relTypes).map(type => {
    it(`Throw when spinners param is type ${type}`, () => {
      assert.throw(() => new Multispinner(relTypes[type]))
    })
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
        text: spinners.spinner1
      },
      spinner2: {
        state: states.incomplete,
        current: null,
        text: spinners.spinner2
      }
    }
    let multispinner = new Multispinner(spinners)
    assert.deepEqual(expected, multispinner.spinners)
  })

  it('Construct spinners from array')

  it('Parse opts param')

  it('Assign internal props')
})
