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
const states = require('./states')
const parseOpts = require('./opts')

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

    // parse opts param; bind opts to this[opt]
    parseOpts.apply(this, [opts])

    // internal (non-configurable) props
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
   * @method _loop
   * @desc Bind animation loop to this.state
   * @returns {undefined}
   */
  _loop() {
    this.state = setInterval(() => {
      // grab current frame of spinner animation
      let animation = this.frames[this.i = ++this.i % this.frameCount]

      // iterate over spinners to check state and build current strings
      Object.keys(this.spinners).map(spinner => {
        switch (this.spinners[spinner].state) {
          case states.incomplete:
            this.spinners[spinner].current = chalk[this.incompleteColor](
              `${this.indentStr}${animation} ${this.spinners[spinner].base}`
            )
            break
          case states.success:
            this.spinners[spinner].current = chalk[this.successColor](
              `${this.indentStr}${this.successIndicator} ` +
              `${this.spinners[spinner].base}`
            )
            break
          case states.error:
            this.spinners[spinner].current = chalk[this.errorColor](
              `${this.indentStr}${this.errorIndicator} ` +
              `${this.spinners[spinner].base}`
            )
            break
        }
      })

      // call update method to apply current strings to terminal
      this._update()

      // kill loop and exit if all spinners are finished
      if (this._allCompleted()) this._clearState()
    }, this.delay)
  }

  /**
   * @method _update
   * @desc Call to log-update made by _loop. Iterates over spinners.
   * @returns {undefined}
   */
  _update() {
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
  _complete(spinner, state) {
    this._clearState()
    this.spinners[spinner].state = state
    this._loop()
  }

  /**
   * 
   * @method
   * @returns
   */
  _allCompleted() {
    return Object.keys(this.spinners).every(spinner => {
      return this.spinners[spinner].state !== states.incomplete
    })
  }

  /**
   * 
   * @method
   * @returns {undefined}
   */
  _clearState() {
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
    this._loop()
  }

  /**
   * 
   * @method
   * @param {} 
   * @returns {undefined}
   */
  success(spinner) {
    this._complete(spinner, states.success)
  }

  /**
   * 
   * @method
   * @param {} 
   * @returns {undefined}
   */
  error(spinner) {
    this._complete(spinner, states.error)
  }
}
