'use strict'

//----------------------------------------------------------
// Modules
//----------------------------------------------------------
// NPM
const Writable  = require('stream').Writable
const chalk     = require('chalk')
const clone     = require('lodash.clonedeep')
const kindOf    = require('kind-of')
const logUpdate = require('log-update')
const merge     = require('lodash.merge')
const os        = require('os')

// Local
const Spinners       = require('lib/spinners')
const defaultProps   = require('lib/defaultProps')
const states         = require('lib/states')
const validOpts      = require('lib/validOpts')

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
   */
  constructor(spinners, opts) {
    // bind props from defaults and opts
    let props = clone(defaultProps)
    if (validOpts(opts)) merge(props, opts)
    Object.keys(props).map(prop => {
      this[prop] = props[prop]
    })

    // instantiate spinners
    this.spinners = new Spinners(spinners, this.preText, this.postText)

    // assign this.update based on debug param
    if (this.debug) {
      // eat the logupdate output instead of logging to stdout
      // so it doesn't leak into test reports
      const stream = new Writable()
      stream._write = (chunk, enc, next) => { next() }
      const logUpdateDebug = logUpdate.create(stream)
      this.update = logUpdateDebug
    } else {
      this.update = logUpdate
    }
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
        let color
        let symbol
        switch (state) {
          case states.incomplete:
            color = this.incompleteColor
            symbol = this.currentFrame
            break
          case states.success:
            color = this.successColor
            symbol = this.successSymbol
            break
          case states.error:
            color = this.errorColor
            symbol = this.errorSymbol
            break
        }
        this.spinners[spinner].current = chalk[color](
          `${this.indentStr}${symbol} ${this.spinners[spinner].text}`
        )
      })

      // call update to apply current strings
      this.update(
        Object.keys(this.spinners).map(spinner => {
          return this.spinners[spinner].current
        }).join(os.EOL)
      )

      // kill loop and exit if all spinners are finished
      if (this.allCompleted()) {
        this.stop()
        if (this.clear) logUpdate.clear()
      }
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
    this.stop()
    this.spinners[spinner].state = state
    this.start()
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
  stop() {
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
