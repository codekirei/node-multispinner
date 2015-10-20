'use strict'

//----------------------------------------------------------
// Modules
//----------------------------------------------------------
// NPM
const kindOf = require('kind-of')

// Local
const errs = require('lib/errs').validateOpts
const defaultProps = require('lib/defaultProps')

//----------------------------------------------------------
// Logic
//----------------------------------------------------------
/**
 *
 * @param {}
 */
module.exports = function(opts) {
  Object.keys(opts).map(opt => {
    // ensure opt is a configurable prop
    if (!defaultProps.hasOwnProperty(opt)) errs.configurable(opt)

    // ensure opt is the correct type
    const optType = kindOf(opts[opt])
    const defaultType = kindOf(defaultProps[opt])
    if (optType !== defaultType) errs.typeErr(opt, defaultType)
  })
}
