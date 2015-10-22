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
 *
 * @param {}
 */
module.exports = function() {
  // create writable stream
  const stream = new Writable()

  // ignore (do not print) chunk, just call next
  stream._write = (chunk, enc, next) => { next() }

  // use this stream for logUpdate calls
  return logUpdate.create(stream)
}
