'use strict'

//----------------------------------------------------------
// Modules
//----------------------------------------------------------

//----------------------------------------------------------
// Setup
//----------------------------------------------------------
const name = 'node-multispinner'

//----------------------------------------------------------
// validateOpts errs
//----------------------------------------------------------
function configurable(opt) {
  throw new Error(
    `${name}: ${opt} is not a configurable property`
  )
}
function typeErr(opt, type) {
  throw new Error(
    `${name}: ${opt} option must have a value of type ${type}`
  )
}

//----------------------------------------------------------
// Export
//----------------------------------------------------------
module.exports = {
  validateOpts: {
    configurable,
    typeErr
  }
}
