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
const defaultProps = require('lib/constants').defaultProps
const states       = require('lib/constants').states
const validOpts    = require('lib/validOpts')
const voidOut      = require('lib/voidOut')
const errs         = require('lib/errs').complete

//----------------------------------------------------------
// Logic
//----------------------------------------------------------
module.exports = class Multispinner {

  //----------------------------------------------------------
  // Constructor
  //----------------------------------------------------------
  /**
   * @constructor
   * @desc Construct Spinner class with spinners and options.
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
    this.spinners = new Spinners(
      spinners,
      this.preText,
      this.postText
    ).spinners()

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
        if (this.clear) setTimeout(() => {this.update.clear()}, this.interval)
      }
    }, this.interval)
  }

  /**
   * @method complete
   * @desc Complete a spinner by changing its state.
   * @param {string} spinner - spinner to complete
   * @param {string} state - state to set spinner to
   * @returns {undefined}
   */
  complete(spinner, state) {
    // throw if state is invalid
    if (!states.hasOwnProperty(state)) errs.invalidState(state)

    this.stop()
    this.spinners[spinner].state = state
    this.start()
  }

  /**
   * @method allCompleted
   * @desc Check if all spinners have been completed.
   * @returns {bool} - true if all spinners are complete, else false
   */
  allCompleted() {
    return Object.keys(this.spinners).every(spinner => {
      return this.spinners[spinner].state !== states.incomplete
    })
  }

  /**
   * @method stop
   * @desc Clear interval bound to this.state by loop method.
   * @returns {undefined}
   */
  stop() {
    clearInterval(this.state)
  }

  //----------------------------------------------------------
  // External methods
  //----------------------------------------------------------
  /**
   * @method start
   * @desc Convenience method to start animation loop.
   * @returns {undefined}
   */
  start() {
    this.loop()
  }

  /**
   * @method success
   * @desc Complete spinner by changing its state to success.
   * @param {string} spinner - spinner to complete
   * @returns {undefined}
   */
  success(spinner) {
    this.complete(spinner, states.success)
  }

  /**
   * @method error
   * @desc Complete spinner by changing its state to error.
   * @param {string} spinner - spinner to complete
   * @returns {undefined}
   */
  error(spinner) {
    this.complete(spinner, states.error)
  }
}
