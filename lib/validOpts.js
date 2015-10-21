'use strict'

//----------------------------------------------------------
// Modules
//----------------------------------------------------------
// NPM
const kindOf = require('kind-of')

// Local
const errs = require('lib/errs').validOpts
const defaultProps = require('lib/defaultProps')

//----------------------------------------------------------
// Logic
//----------------------------------------------------------
/**
 *
 * @param {}
 */
module.exports = function(opts) {
  if (opts) {
    Object.keys(opts).map(opt => {
      // throw if opt is not a configurable prop
      if (!defaultProps.hasOwnProperty(opt)) errs.configurable(opt)

      // throw if opt it not correct type
      const optType = kindOf(opts[opt])
      const defaultType = kindOf(defaultProps[opt])
      if (optType !== defaultType) errs.optType(opt, defaultType)
    })

    // opts are valid => return true
    return true
  }

  // no opts passed => return false
  return false
}
