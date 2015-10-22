'use strict'

//----------------------------------------------------------
// Modules
//----------------------------------------------------------
// NPM
const chalk = require('chalk')
const clone = require('lodash.clonedeep')
const merge = require('lodash.merge')
const os    = require('os')

// Local
const Spinners     = require('lib/spinners')
const defaultProps = require('lib/defaultProps')
const states       = require('lib/states')
const validOpts    = require('lib/validOpts')
const voidOut      = require('lib/voidOut')

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
    // clone defaults
    let props = clone(defaultProps)

    // merge in opts
    if (validOpts(opts)) merge(props, opts)

    // bind props to this
    Object.keys(props).map(prop => {
      this[prop] = props[prop]
    })

    // instantiate spinners
    this.spinners = new Spinners(spinners, this.preText, this.postText)

    // void output if testing
    if (this.testing) this.update = voidOut()
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
      this.symbol[states.incomplete] = this.frames[
        this.i = ++this.i % this.frameCount
      ]

      // iterate over spinners + update current strings based on state
      Object.keys(this.spinners).map(spinner => {
        let state = this.spinners[spinner].state
        this.spinners[spinner].current = chalk[this.color[state]]([
          this.indentStr,
          this.symbol[state],
          ' ',
          this.spinners[spinner].text
        ].join(''))
      })

      // call update to print newline-joined current strings
      this.update(
        Object.keys(this.spinners).map(spinner => {
          return this.spinners[spinner].current
        }).join(os.EOL)
      )

      // stop loop and maybe clear if done
      if (this.allCompleted()) {
        this.stop()
        if (this.clear) this.update.clear()
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
   * Convenience method to start animation loop.
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
