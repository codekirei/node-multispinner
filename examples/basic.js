'use strict'

const Multispinner = require('../')
const spinners = ['foo', 'bar', 'baz', 'qux']

const m = new Multispinner(spinners)
m.start()

setTimeout(() => m.success('foo'), 1000)
setTimeout(() => m.error('bar'), 1500)
setTimeout(() => m.success('baz'), 2000)
setTimeout(() => m.error('qux'), 2500)
