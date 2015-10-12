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
    this.actions = {}
    Object.keys(obj).map(action => {
      this.actions[action] = {
        complete: false,
        error: false,
        current: null,
        base: obj[action]
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
   *  - get current frame of spinner
   *  - check state of each spinner initialized in constructor
   *      and set this.actions[action].current accordingly
   *      (which is what will be displayed in terminal)
   *  - call _update method to apply changes
   *  - if all spinners are complete, kill loop and exit
   * @returns {undefined}
   */
  _loop() {
    this.state = setInterval(() => {
      let spinner = this.frames[this.i = ++this.i % this.frameCount]
      Object.keys(this.actions).map(action => {
        this.actions[action].current = this.actions[action].complete
          ? this.actions[action].error
            ? chalk.red(`  x ${this.actions[action].base}`)
            : chalk.green(`  ✓ ${this.actions[action].base}`)
          : chalk.blue(`  ${spinner} ${this.actions[action].base}`)
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
      Object.keys(this.actions).map(action => {
        return this.actions[action].current
      }).join('\n')
    )
  }

  /**
   * 
   * @method
   * @returns
   */
  _allCompleted() {
    return Object.keys(this.actions).every(action => {
      return this.actions[action].complete === true
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
  finish(action) {
    this._clearState()
    this.actions[action].complete = true
    this._loop()
  }

  /**
   * 
   * @method
   * @param {} 
   * @returns {undefined}
   */
  error(action) {
    this._clearState()
    this.actions[action].complete = true
    this.actions[action].error = true
    this._loop()
  }
}
