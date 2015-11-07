'use strict'

// setup
const Multispinner = require('../../')
const spinners = ['foo', 'bar', 'baz', 'qux']

// instantiate and start spinners
const m = new Multispinner(spinners)

// finish spinners in staggered timeouts
setTimeout(() => m.success('foo'), 1000)
setTimeout(() => m.error('bar'), 1500)
setTimeout(() => m.success('baz'), 2000)
setTimeout(() => m.error('qux'), 2500)

// do something on success/error events
m.on('success', () => {
  // does not fire in this example because m.error is called
  console.log('done without errors!')
}).on('err', (e) => {
  console.log(`${e} spinner finished with an error`)
})
