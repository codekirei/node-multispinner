'use strict'

//----------------------------------------------------------
// Modules
//----------------------------------------------------------
const Writable = require('stream').Writable
const logUpdate = require('log-update')

//----------------------------------------------------------
// Logic
//----------------------------------------------------------
/**
 * @func voidOut
 * @desc Create a writable stream for logUpdate that silently eats its output.
 * @returns {function} logUpdate and associated methods
 */
module.exports = function() {
  // create writable stream
  const stream = new Writable()

  // ignore (do not print) chunk, just call next
  stream._write = (chunk, enc, next) => { next() }

  // use this stream for logUpdate calls
  return logUpdate.create(stream)
}
