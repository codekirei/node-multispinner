'use strict'

//----------------------------------------------------------
// Modules
//----------------------------------------------------------
// NPM
const assert = require('chai').assert
const logUpdate = require('log-update')
const sinon = require('sinon')

// Local
const voidOut = require('lib/voidOut')

//----------------------------------------------------------
// Tests
//----------------------------------------------------------
describe('voidOut', () => {
  it('create stream with logUpdate', () => {
    const spy = sinon.spy(logUpdate, 'create')
    voidOut()
    assert(spy.called, 'call logUpdate.create()')
    logUpdate.create.restore()
  })
})
