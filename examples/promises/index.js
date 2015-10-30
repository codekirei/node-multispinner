'use strict'

// modules
const Multispinner = require('../../')
const fs = require('fs')
const P = require('bluebird')
P.promisifyAll(fs)
P.promisifyAll(Multispinner)

// read parent dir
const parentSpinner = new Multispinner({s: 'Reading parent dir'})
parentSpinner.start()
// setTimeout(() => {
//   fs.readdirAsync('../').then(console.log)
// }, 80)
// FIXME: this logs before spinner because spinner is delays 80 ms =/
fs.readdirAsync('../').then(console.log)
