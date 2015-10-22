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
/**
 *
 * @param {}
 */
function configurable(opt) {
  throw new Error(
    `${name}: ${opt} is not a configurable property`
  )
}

/**
 *
 * @param {}
 */
function optType(opt, type) {
  throw new Error(
    `${name}: ${opt} option must have a value of type ${type}`
  )
}

/**
 *
 * @param {}
 */
function optsType() {
  throw new Error(
    `${name}: opts param must be an object`
  )
}

//----------------------------------------------------------
// spinners errs
//----------------------------------------------------------
/**
 *
 * @param {}
 */
function spinnersType() {
  throw new Error(
    `${name}: spinners param is not an object or array`
  )
}

/**
 *
 * @param {}
 */
function spinnersEmpty() {
  throw new Error(
    `${name}: object or array of spinners is empty`
  )
}

//----------------------------------------------------------
// validOpts errs
//----------------------------------------------------------

//----------------------------------------------------------
// Export
//----------------------------------------------------------
module.exports = {
  validOpts: {
    configurable,
    optType,
    optsType
  },
  spinners: {
    spinnersType,
    spinnersEmpty
  }
}
