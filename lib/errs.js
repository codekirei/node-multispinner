'use strict'

//----------------------------------------------------------
// Modules
//----------------------------------------------------------

//----------------------------------------------------------
// Setup
//----------------------------------------------------------
const name = 'node-multispinner'

//----------------------------------------------------------
// validOpts errs
//----------------------------------------------------------
function configurable(opt) {
  throw new Error(
    `${name}: ${opt} is not a configurable property`
  )
}
function optType(opt, type) {
  throw new Error(
    `${name}: ${opt} option must have a value of type ${type}`
  )
}

//----------------------------------------------------------
// index errs
//----------------------------------------------------------
function spinnersType() {
  throw new Error(
    `${name}: must instantiate class with object or array of spinners`
  )
}

function optsType() {
  throw new Error(
    `${name}: opts param must be an object`
  )
}

//----------------------------------------------------------
// Export
//----------------------------------------------------------
module.exports = {
  validOpts: {
    configurable,
    optType
  },
  index: {
    spinnersType,
    optsType
  }
}
