'use strict'

//----------------------------------------------------------
// Modules
//----------------------------------------------------------
// NPM
const kindOf = require('kind-of')

// Local
const errs = require('./errs').validOpts
const defaultProps = require('./constants').defaultProps

//----------------------------------------------------------
// Logic
//----------------------------------------------------------
/**
 * @func validOpts
 * @desc Check validity of options object.
 * @param {object} opts - options to check
 * @returns {bool} true if opts are valid; else false
 */
module.exports = function(opts) {
  if (opts) {
    // throw if opts is not an object
    if (kindOf(opts) !== 'object') errs.optsType()

    Object.keys(opts).map(opt => {
      // throw if opt is not a configurable prop
      if (!defaultProps.hasOwnProperty(opt)) errs.configurable(opt)

      // throw if opt is not correct type
      const optType = kindOf(opts[opt])
      const defaultType = kindOf(defaultProps[opt])
      if (optType !== defaultType) errs.optType(opt, defaultType)

      // throw if opt is negative number
      if (optType === 'number' && opts[opt] < 0) errs.negative(opt)
    })

    // opts are valid => return true
    return true
  }

  // no opts passed => return false
  return false
}
