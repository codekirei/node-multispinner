'use strict'

//----------------------------------------------------------
// Modules
//----------------------------------------------------------
// NPM
const assert = require('chai').assert

// Local
const Multispinner = require('../../')

// Test Utils
const genSpinners = require('../utils/genSpinners')

//----------------------------------------------------------
// Tests
//----------------------------------------------------------
module.exports = describe('stop', () => {
  it('Clear interval bound to this.state', () => {
    const spinners = genSpinners.arr(3)
    const m = new Multispinner(spinners, {testing: true})
    const props = [
      '_onTimeout',
      '_idlePrev',
      '_idleNext',
      '_repeat'
    ]
    m.start()
    m.stop()

    // assertions
    assert.equal(-1, m.state._idleTimeout)
    props.map(prop => {
      assert.isNull(m.state[prop])
    })
  })
})
