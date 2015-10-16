'use strict'

//----------------------------------------------------------
// Modules
//----------------------------------------------------------
// NPM
const figures = require('figures')

// Local
const states = require('lib/states')

//----------------------------------------------------------
// Logic
//----------------------------------------------------------
// assign defaults
const defaults = {
  clear: false,
  colors: {},
  delay: 80,
  errorSymbol: figures.cross,
  frames: ['-', '\\', '|', '/'],
  indent: 2,
  successSymbol: figures.tick
}
defaults.colors[states.incomplete] = 'blue'
defaults.colors[states.success] = 'green'
defaults.colors[states.error] = 'red'

/**
 *
 * @param {}
 */
function typeCheckErr(opt, typeText) {
  return `node-multispinner: ${opt} option must be ${typeText}`
}

/**
 *
 * @param {}
 */
function typeCheck(opt, val) {
  switch (opt) {

    // bool
    case 'clear':
      if (typeof val !== 'boolean') {
        throw new Error(typeCheckErr(opt, 'a boolean'))
      }
      break

    // numbers
    case 'delay':
    case 'indent':
      if (typeof val !== 'number') {
        throw new Error(typeCheckErr(opt, 'a number'))
      }
      break

    // strings
    case 'errorSymbol':
    case 'successSymbol':
      if (typeof val !== 'string') {
        throw new Error(typeCheckErr(opt, 'a string'))
      }
      break

    // object
    case 'colors':
      if (!val instanceof Object) {
        throw new Error(typeCheckErr(opt, 'an object'))
      }
      break

    // array of strings
    case 'frames':
      if (!val instanceof Array) {
        throw new Error(typeCheckErr(opt, 'an array'))
      }
      opt.map(entity => {
        if (typeof entity !== 'string') {
          throw new Error(typeCheckErr(opt, 'an array of strings'))
        }
      })
      break
  }
}

/**
 *
 * @param {}
 */
function validateOpts(opts) {
  if (!opts instanceof Object) {
    throw new Error(
      'node-multispinner: opts parameter must be a valid JS object'
    )
  }
  Object.keys(opts).map(opt => {
    // ensure each opt passed is a configurable opt
    if (!defaults.hasOwnProperty(opt)) {
      throw new Error(
        `node-multispinner: ${opt} is not a configurable option`
      )
    }
    if (opt === 'colors') {
      Object.keys(opts.colors).map(state => {
        if (!defaults.colors.hasOwnProperty(state)) {
          throw new Error(
            `node-multispinner: ${state} is not a configurable color state`
          )
        }
      })
    }

    // ensure each opt passed is correct type
    typeCheck(opt, opts[opt])
  })
}

/**
 *
 * @param {} opts
 */
module.exports = function(opts) {
  // iterate over configurable opts; bind to this[opt]
  Object.keys(defaults).map(opt => {
    if (opt === 'colors') {
      this.colors = {}
      Object.keys(defaults[opt]).map(state => {
        this.colors[state] = opts && opts.colors && opts.colors[state]
          ? opts.colors[state]
          : defaults.colors[state]
      })
    } else {
      this[opt] = opts && opts[opt] ? opts[opt] : defaults[opt]
    }
  })

  // check opts for errs
  if (opts) {
    validateOpts(opts)
  }
}
