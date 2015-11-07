'use strict'

//----------------------------------------------------------
// Modules
//----------------------------------------------------------
// NPM
const Emitter = require('events').EventEmitter
const chalk   = require('chalk')
const clone   = require('lodash.clonedeep')
const merge   = require('lodash.merge')
const os      = require('os')

// Local
const Spinners     = require('./lib/spinners')
const defaultProps = require('./lib/constants').defaultProps
const states       = require('./lib/constants').states
const validOpts    = require('./lib/validOpts')
const errs         = require('./lib/errs').index

//----------------------------------------------------------
// Logic
//----------------------------------------------------------
module.exports = class Multispinner extends Emitter {
  /**
   * @constructor
   * @desc Construct Spinner class with spinners and options.
   * @param {Object} spinners - Spinners to create
   * @param {Object} opts - Configurable options
   */
  constructor(spinners, opts) {
    // call parent constructor to enable 'this'
    super(spinners, opts)

    // clone defaults
    let props = clone(defaultProps)

    // validate and merge opts
    validOpts(opts)
    merge(props, opts)

    // bind props
    Object.keys(props).map(prop => {
      this[prop] = props[prop]
    })

    // overwrite frames in case opts.frames.length < default
    if (opts && opts.frames) this.frames = opts.frames

    // compute remaining props
    this.frameCount = this.frames.length
    this.indentStr = ' '.repeat(this.indent)

    // instantiate spinners
    this.spinners = new Spinners(
      spinners,
      this.preText,
      this.postText
    ).spinners()

    // start loop
    if (this.autoStart) this.start()
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
    // update current frame of spinner animation
    this.symbol[states.incomplete] = this.frames[this.i % this.frameCount]

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

    // call logUpdate
    this.update(
      Object.keys(this.spinners).map(spinner => {
        return this.spinners[spinner].current
      }).join(os.EOL)
    )

    // check if all spinners are complete
    if (this.allCompleted()) {
      // clear if directed
      if (this.clear) this.update.clear()

      // call logUpdate.done to reset its prevLineCount
      this.update.done()

      // emit completion events
      this.emit('done')
      this.allSuccess()
        ? this.emit('success')
        : this.anyErrors().map(s => this.emit('err', s))
    } else {
      // loop again
      setTimeout(() => {
        this.i++
        this.loop()
      }, this.interval)
    }
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

    // set state of spinner
    this.spinners[spinner].state = state
  }

  /**
   * @method allCompleted
   * @desc Check if all spinners have been completed.
   * @returns {bool} - true if all spinners are complete
   */
  allCompleted() {
    return Object.keys(this.spinners).every(spinner => {
      return this.spinners[spinner].state !== states.incomplete
    })
  }

  /**
   * @method allSuccess
   * @desc Check if all spinners are in success state.
   * @returns {bool} - true if all spinners are in success state
   */
  allSuccess() {
    return Object.keys(this.spinners).every(spinner => {
      return this.spinners[spinner].state === states.success
    })
  }

  /**
   * @method anyErrors
   * @returns {string[]} - array of all spinner names in error state
   */
  anyErrors() {
    return Object.keys(this.spinners).reduce((accum, spinner) => {
      if (this.spinners[spinner].state === states.error) {
        accum.push(spinner)
      }
      return accum
    }, [])
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
