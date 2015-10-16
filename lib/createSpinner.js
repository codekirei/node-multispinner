'use strict'

//----------------------------------------------------------
// Modules
//----------------------------------------------------------
// Local
const states = require('lib/states')

//----------------------------------------------------------
// Logic
//----------------------------------------------------------
/**
 *
 * @param {}
 */
module.exports = function(spinner, text) {
  // build spinner text
  let aggregate = ''
  if (this.preText.length) aggregate += `${this.preText} `
  text
    ? aggregate += `${text}`
    : aggregate += `${spinner}`
  if (this.postText.length) aggregate += ` ${this.postText}`

  // create spinner object in this.spinners
  this.spinners[spinner] = {
    state: states.incomplete,
    current: null,
    text: aggregate
  }
}
