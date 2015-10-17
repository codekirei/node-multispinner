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
const types = require('./utils/types')

//----------------------------------------------------------
// Tests
//----------------------------------------------------------
describe('Constructor', () => {

  // generate tests for spinner param types other than object or array
  let relTypes = types.except(['object', 'array'])
  Object.keys(relTypes).map(type => {
    it(`Throw when spinners param is type ${type}`, () => {
      assert.throw(() => new Multispinner(relTypes[type]))
    })
  })

  it('Assign internal props according to defaults', () => {
    let multispinner = new Multispinner([faker.fake('{{name.firstName}}')])
    assert.equal(null, multispinner.state)
    assert.equal(0, multispinner.i)
    assert.equal(4, multispinner.frameCount)
    assert.equal('  ', multispinner.indentStr)
  })
})
