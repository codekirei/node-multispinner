'use strict'

//----------------------------------------------------------
// Modules
//----------------------------------------------------------
const figures = require('figures')

//----------------------------------------------------------
// Logic
//----------------------------------------------------------
const defaults = {
  delay: 80,
  errorColor: 'red',
  errorIndicator: figures.cross,
  frames: ['-', '\\', '|', '/'],
  incompleteColor: 'blue',
  indent: 2,
  successColor: 'green',
  successIndicator: figures.tick
}

/**
 * 
 * @param {} 
 */
function typeCheck(opt, val) {
  switch (opt) {

    // numbers
    case 'delay':
    case 'indent':
      if (typeof val !== 'number') {
        throw new Error(
          `node-multispinner: ${opt} option requires a number value`
        )
      }
      break

    // strings
    case 'errorColor':
    case 'errorIndicator':
    case 'incompleteColor':
    case 'successColor':
    case 'successIndicator':
      if (typeof val !== 'string') {
        throw new Error(
          `node-multispinner: ${opt} option requires a string value`
        )
      }
      break

    // array of strings
    case 'frames':
      if (!val instanceof Array) {
        throw new Error(
          `node-multispinner: ${opt} option requires an array value`
        )
      }
      opt.map(entity => {
        if (typeof entity !== 'string') {
          throw new Error(
            `node-multispinner: ${opt} option requires an array of strings`
          )
        }
      })
      break
  }
}

/**
 * 
 * @param {} opts
 */
module.exports = function(opts) {
  // iterate over configurable opts; bind to this[opt]
  Object.keys(defaults).map(opt => {
    this[opt] = opts && opts[opt] ? opts[opt] : defaults[opt]
  })

  // check for errs
  if (opts) {
    Object.keys(opts).map(opt => {
      // ensure each opt passed is a configurable opt
      if (!defaults.hasOwnProperty(opt)) {
        throw new Error(
          `node-multispinner: ${opt} is not a configurable option`
        )
      }

      // ensure each opt passed is correct type
      typeCheck(opt, opts[opt])
    })
  }
}
