/* eslint no-undefined:0 */
'use strict'

//----------------------------------------------------------
// Modules
//----------------------------------------------------------
// NPM
const assert = require('chai').assert

// Local
const Multispinner = require('../')
const states = require('lib/states')

//----------------------------------------------------------
// Tests
//----------------------------------------------------------
describe('Constructor', () => {
  let types = {
    undefined,
    null: null,
    'a string': '',
    'a bool': true,
    'an int': 0,
    'a function': () => {}
  }
  Object.keys(types).map(type => {
    it(`Throw when spinners param is ${type}`, () => {
      assert.throw(() => new Multispinner(types[type]))
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
