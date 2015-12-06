'use strict'

//----------------------------------------------------------
// Modules
//----------------------------------------------------------
// NPM
const logUpdate = require('log-update')
const figures = require('figures')

//----------------------------------------------------------
// Constants
//----------------------------------------------------------
const states = {
  incomplete: 'incomplete',
  success: 'success',
  error: 'error'
}

const defaultProps = {
  //----------------------------------------------------------
  // Configurable props
  //----------------------------------------------------------
  // can be overwritten by opts in constructor
  'autoStart': true,
  'clear': false,
  'frames': ['-', '\\', '|', '/'],
  'indent': 2,
  'interval': 80,
  'postText': '',
  'preText': '',
  get color() {
    const colors = {}
    colors[states.incomplete] = 'blue'
    colors[states.success] = 'green'
    colors[states.error] = 'red'
    return colors
  },
  get symbol() {
    const symbols = {}
    // symbols[states.incomplete] = this.frames[0]
    // symbols[states.incomplete] = null
    symbols[states.success] = figures.tick
    symbols[states.error] = figures.cross
    return symbols
  },

  //----------------------------------------------------------
  // Internal props
  //----------------------------------------------------------
  'i': 0,
  'update': logUpdate
}

//----------------------------------------------------------
// Exports
//----------------------------------------------------------
module.exports = {
  states,
  defaultProps
}
