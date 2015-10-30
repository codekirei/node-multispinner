'use strict'

// setup
const Multispinner = require('../')
const spinners = ['foo', 'bar', 'baz', 'qux']

// instantiate and start spinners
const m = new Multispinner(spinners)
m.start()

// finish spinners in staggered timeouts
setTimeout(() => m.success('foo'), 1000)
setTimeout(() => m.error('bar'), 1500)
setTimeout(() => m.success('baz'), 2000)
setTimeout(() => m.error('qux'), 2500)

// do something on success/error events
m.on('success', () => {
  console.log('done without errors!')
}).on('err', console.log)
