'use strict'

//----------------------------------------------------------
// Modules
//----------------------------------------------------------
// NPM
const chalk = require('chalk')
const logUpdate = require('log-update')

//----------------------------------------------------------
// Logic
//----------------------------------------------------------
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
        complete: false,
        error: false,
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
   *      and set this.spinners[spinner].current accordingly
   *      (which is what will be displayed in terminal)
   *  - call _update method to apply changes
   *  - if all spinners are complete, kill loop and exit
   * @returns {undefined}
   */
  _loop() {
    this.state = setInterval(() => {
      let spinner = this.frames[this.i = ++this.i % this.frameCount]
      Object.keys(this.spinners).map(spinner => {
        this.spinners[spinner].current = this.spinners[spinner].complete
          ? this.spinners[spinner].error
            ? chalk.red(`  x ${this.spinners[spinner].base}`)
            : chalk.green(`  ✓ ${this.spinners[spinner].base}`)
          : chalk.blue(`  ${spinner} ${this.spinners[spinner].base}`)
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
      }).join('\n')
    )
  }

  /**
   * 
   * @method
   * @returns
   */
  _allCompleted() {
    return Object.keys(this.spinners).every(spinner => {
      return this.spinners[spinner].complete === true
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
  finish(spinner) {
    this._clearState()
    this.spinners[spinner].complete = true
    this._loop()
  }

  /**
   * 
   * @method
   * @param {} 
   * @returns {undefined}
   */
  error(spinner) {
    this._clearState()
    this.spinners[spinner].complete = true
    this.spinners[spinner].error = true
    this._loop()
  }
}
