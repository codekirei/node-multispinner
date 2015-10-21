'use strict'

//----------------------------------------------------------
// Modules
//----------------------------------------------------------
// NPM
const chalk     = require('chalk')
const logUpdate = require('log-update')
const os        = require('os')
const Writable  = require('stream').Writable
const kindOf    = require('kind-of')

// Local
const errs = require('lib/errs').index
const createSpinner = require('lib/createSpinner')
const validOpts     = require('lib/validOpts')
const states        = require('lib/states')
const defaultProps  = require('lib/defaultProps')

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
    // throw if spinners param is not an array or object
    const spinnersType = kindOf(spinners)
    if (spinnersType !== 'object' && spinnersType !== 'array') {
      errs.spinnersType()
    }

    // throw if opts param is not an object
    const optsType = kindOf(opts)
    if (optsType !== 'object') errs.optsType()

    // assign default props
    Object.keys(defaultProps).map(prop => {
      this[prop] = defaultProps[prop]
    })

    // validate opts and overwrite default props
    if (validOpts(opts)) {
      Object.keys(opts).map(prop => {
        this[prop] = opts[prop]
      })
    }

    // parse spinners param
    spinnersType === 'array'
      ? spinners.map(spinner => createSpinner.apply(this, [spinner]))
      : Object.keys(spinners).map(spinner => {
        createSpinner.apply(this, [spinner, spinners[spinner]])
      })

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
      if (this.allCompleted()) this.cleanUp()
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

  /**
   *
   * @method
   * @param {}
   */
  cleanUp() {
    // clear interval
    // FIXME: should this be a conditional call?
    this.stop()

    // maybe delete logged output
    if (this.clear) logUpdate.clear()

    // delete props assigned in constructor
    Object.keys(defaultProps).map(prop => {
      delete this[prop]
    })
    delete this.spinners
    delete this.update
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
