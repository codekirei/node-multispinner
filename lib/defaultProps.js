'use strict'

//----------------------------------------------------------
// Modules
//----------------------------------------------------------
// NPM
const repeat = require('lodash.repeat')
const figures = require('figures')

// Local
const states = require('lib/states')

//----------------------------------------------------------
// Logic
//----------------------------------------------------------
/**
 *
 * @param {}
 */
module.exports = {

  // configurable
  clear: false,
  debug: false,
  errorColor: 'red',
  errorSymbol: figures.cross,
  frames: ['-', '\\', '|', '/'],
  incompleteColor: 'blue',
  indent: 2,
  interval: 80,
  postText: '',
  preText: '',
  successColor: 'green',
  successSymbol: figures.tick,

  // internal
  state: null,
  i: 0,
  spinners: {},
  get currentFrame() {
    return this.frames[this.i]
  },
  get frameCount() {
    return this.frames.length
  },
  get indentStr() {
    return repeat(' ', this.indent)
  }
}
