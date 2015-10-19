'use strict'

//----------------------------------------------------------
// Modules
//----------------------------------------------------------
// NPM
const chalk     = require('chalk')
const logUpdate = require('log-update')
const os        = require('os')
const repeat    = require('lodash.repeat')

// Local
const createSpinner = require('lib/createSpinner')
const parseOpts     = require('lib/parseOpts')
const states        = require('lib/states')

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
   *   'interval': 100
   * })
   */
  constructor(spinners, opts) {
    // throw if spinners param is not passed an array or object
    if (
      spinners instanceof Array === false &&
      typeof spinners !== 'object' ||
      spinners === null
    ) {
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
    // FIXME write test for this prop
    this.currentFrame = this.frames[this.i]
    this.frameCount = this.frames.length
    this.spinners = {}
    this.indentStr = repeat(' ', this.indent)

    // parse spinners param
    spinners instanceof Array
      ? spinners.map(spinner => createSpinner.apply(this, [spinner]))
      : Object.keys(spinners).map(spinner => {
        createSpinner.apply(this, [spinner, spinners[spinner]])
      })
  }

  //----------------------------------------------------------
  // Internal methods
  //----------------------------------------------------------
  /**
   * @method loop
   * @desc Bind animation loop to this.state.
   * @returns {undefined}
   */
  loop() {
    this.state = setInterval(() => {
      // update current frame of spinner animation
      this.currentFrame = this.frames[this.i = ++this.i % this.frameCount]

      // iterate over spinners to check state and build current strings
      Object.keys(this.spinners).map(spinner => {
        let state = this.spinners[spinner].state
        let symbol
        switch (state) {
          case states.incomplete:
            symbol = this.currentFrame
            break
          case states.success:
            symbol = this.successSymbol
            break
          case states.error:
            symbol = this.errorSymbol
            break
        }
        this.spinners[spinner].current = chalk[this.colors[state]](
          `${this.indentStr}${symbol} ${this.spinners[spinner].text}`
        )
      })

      // call logUpdate to apply current strings to terminal
      logUpdate(
        Object.keys(this.spinners).map(spinner => {
          return this.spinners[spinner].current
        }).join(os.EOL)
      )

      // kill loop and exit if all spinners are finished
      if (this.allCompleted()) this.clearState(this.clear)
    }, this.interval)
  }

  /**
   *
   * @param {}
   * @param {}
   */
  complete(spinner, state) {
    if (!states.hasOwnProperty(state)) {
      throw new Error(
        'node-multispinner: complete method must pass valid state param'
      )
    }
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
   * @param {} removeOutput
   * @returns {undefined}
   */
  clearState(removeOutput) {
    clearInterval(this.state)
    if (removeOutput) logUpdate.clear()
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
