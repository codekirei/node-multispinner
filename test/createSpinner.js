'use strict'

//----------------------------------------------------------
// Modules
//----------------------------------------------------------
// NPM
const assert = require('chai').assert
const faker  = require('faker')

// Local
const Multispinner = require('../')
const states = require('lib/states')

//----------------------------------------------------------
// Tests
//----------------------------------------------------------
describe('createSpinner function', () => {
  it('Create spinners from object', () => {
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

    // instantiate and test
    let multispinner = new Multispinner(spinners)
    assert.deepEqual(expected, multispinner.spinners)
  })

  it('Create spinners from array', () => {
    // fixtures
    const spinners = [
      'spinner1',
      'spinner2'
    ]
    const expected = {
      spinner1: {
        state: states.incomplete,
        current: null,
        text: spinners[0]
      },
      spinner2: {
        state: states.incomplete,
        current: null,
        text: spinners[1]
      }
    }

    // instantiate and test
    let multispinner = new Multispinner(spinners)
    assert.deepEqual(expected, multispinner.spinners)
  })

  it('Build spinner text without pre and post text')

  it('Build spinner text with preText')

  it('Build spinner text with postText')

  it('Build spinner text with pre and post text')
})
