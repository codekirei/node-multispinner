'use strict'

//----------------------------------------------------------
// Modules
//----------------------------------------------------------
// NPM
const chalk = require('chalk')
const logUpdate = require('log-update')
const mirror = require('constant-mirror')
const os = require('os')

//----------------------------------------------------------
// Logic
//----------------------------------------------------------
const states = mirror(
  'incomplete',
  'success',
  'error'
)

module.exports = class Spinner {

  //----------------------------------------------------------
  // Constructor
  //----------------------------------------------------------
  /**
   * @constructor
   * @desc Constructs Spinner class with spinners and options.
   * @param {Object} spinners - Spinners to create
   * @param {Object} opts - Initialization options
   * @example
   * let spinner = new Spinner({
   *   'spinner1': 'Doing thing',
   *   'spinner2': 'Doing other thing'
   * }, {
   *   'delay': 100
   * })
   */
  constructor(spinners, opts) {
    this.state = null
    this.delay = 80
    this.i = 0
    this.frames = ['-', '\\', '|', '/']
    this.frameCount = this.frames.length
    this.spinners = {}
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
   * @desc Kicks off animation loop:
   *  - attach to this.state for access from other methods
   *  - get current frame of spinner animation
   *  - check state of each spinner initialized in constructor
   *      and update this.spinners[spinner].current accordingly
   *      (which is what will be displayed in terminal)
   *  - call _update method to apply changes
   *  - if all spinners are complete, kill loop and exit
   * @returns {undefined}
   */
  _loop() {
    this.state = setInterval(() => {
      let animation = this.frames[this.i = ++this.i % this.frameCount]
      Object.keys(this.spinners).map(spinner => {
        switch (this.spinners[spinner].state) {
          case states.incomplete:
            this.spinners[spinner].current = chalk.red(
              `  x ${this.spinners[spinner].base}`
            )
            break
          case states.success:
            this.spinners[spinner].current = chalk.green(
              `  ✓ ${this.spinners[spinner].base}`
            )
            break
          case states.error:
            this.spinners[spinner].current = chalk.blue(
              `  ${animation} ${this.spinners[spinner].base}`
            )
            break
        }
      })
      this._update()
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
