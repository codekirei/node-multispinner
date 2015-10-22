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
  frames: ['-', '\\', '|', '/'],
  indent: 2,
  interval: 80,
  postText: '',
  preText: '',
  get color() {
    const colors = {}
    colors[states.incomplete] = 'blue'
    colors[states.success] = 'green'
    colors[states.error] = 'red'
    return colors
  },
  get symbol() {
    const symbols = {}
    symbols[states.incomplete] = null
    symbols[states.success] = figures.tick
    symbols[states.error] = figures.cross
    return symbols
  },

  // internal
  state: null,
  i: 0,
  get frameCount() {
    return this.frames.length
  },
  get indentStr() {
    return repeat(' ', this.indent)
  }
}
