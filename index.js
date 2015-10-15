'use strict'

//----------------------------------------------------------
// Modules
//----------------------------------------------------------
// NPM
const logUpdate = require('log-update')
const os        = require('os')
const repeat    = require('lodash.repeat')

// Local
const loop      = require('lib/loop')
const parseOpts = require('lib/opts')
const states    = require('lib/states')

//----------------------------------------------------------
// Logic
//----------------------------------------------------------
module.exports = class Multispinner {

  //----------------------------------------------------------
  // Constructor
  //----------------------------------------------------------
  /**
   * @constructor
   * @desc Constructs Spinner class with spinners and options.
   * @param {Object} spinners - Spinners to create
   * @param {Object} opts - Configurable options
   * @example
   * let spinner = new Spinner({
   *   'spinner1': 'Doing thing',
   *   'spinner2': 'Doing other thing'
   * }, {
   *   'delay': 100
   * })
   */
  constructor(spinners, opts) {
    // throw if spinners param is not passed an array or object
    if (typeof spinners !== 'object' || spinners === null) {
      throw new Error(
        'node-multispinner must be instantiated with ' +
        'an object or array as its first parameter'
      )
    }

    // parse opts param; bind each opt to this[opt]
    parseOpts.apply(this, [opts])

    // declare internal (non-configurable) props
    this.state = null
    this.i = 0
    this.frameCount = this.frames.length
    this.spinners = {}
    this.indentStr = repeat(' ', this.indent)

    // parse spinners param
    Object.keys(spinners).map(spinner => {
      this.spinners[spinner] = {
        state: states.incomplete,
        current: null,
        base: spinners[spinner]
      }
    })
  }

  //----------------------------------------------------------
  // Internal methods
  //----------------------------------------------------------
  /**
   * @method loop
   * @desc Bind animation loop to this.state through loop function.
   * @returns {undefined}
   */
  loop() {
    loop.apply(this)
  }

  /**
   * @method update
   * @desc Call to log-update made by loop. Iterates over spinners.
   * @returns {undefined}
   */
  update() {
    logUpdate(
      Object.keys(this.spinners).map(spinner => {
        return this.spinners[spinner].current
      }).join(os.EOL)
    )
  }

  /**
   *
   * @param {}
   * @param {}
   */
  complete(spinner, state) {
    this.clearState()
    this.spinners[spinner].state = state
    this.loop()
  }

  /**
   *
   * @method
   * @returns
   */
  allCompleted() {
    return Object.keys(this.spinners).every(spinner => {
      return this.spinners[spinner].state !== states.incomplete
    })
  }

  /**
   *
   * @method
   * @returns {undefined}
   */
  clearState() {
    clearInterval(this.state)
  }

  //----------------------------------------------------------
  // External methods
  //----------------------------------------------------------
  /**
   * Convenience method to kick off animation loop.
   * @method
   * @returns {undefined}
   */
  start() {
    this.loop()
  }

  /**
   *
   * @method
   * @param {}
   * @returns {undefined}
   */
  success(spinner) {
    this.complete(spinner, states.success)
  }

  /**
   *
   * @method
   * @param {}
   * @returns {undefined}
   */
  error(spinner) {
    this.complete(spinner, states.error)
  }
}
