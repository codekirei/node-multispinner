'use strict'

//----------------------------------------------------------
// Modules
//----------------------------------------------------------
// NPM
const repeat = require('lodash.repeat')
const figures = require('figures')
const logUpdate = require('log-update')

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

  //----------------------------------------------------------
  // Configurable props
  //----------------------------------------------------------
  // can be overwritten by opts in constructor
  clear: false,
  frames: ['-', '\\', '|', '/'],
  indent: 2,
  interval: 80,
  postText: '',
  preText: '',
  testing: false,
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

  //----------------------------------------------------------
  // Internal props
  //----------------------------------------------------------
  state: null,
  i: 0,
  update: logUpdate,
  get frameCount() {
    return this.frames.length
  },
  get indentStr() {
    return repeat(' ', this.indent)
  }
}