'use strict'

//----------------------------------------------------------
// Modules
//----------------------------------------------------------
// NPM
const kindOf = require('kind-of')

// Local
const states = require('./constants').states
const errs = require('./errs').spinners

//----------------------------------------------------------
// Logic
//----------------------------------------------------------
module.exports = class Spinners {
  /**
   * @constructor
   * @param {array|object} spinners - spinners to create
   * @param {string} preText - text that precedes spinner text
   * @param {string} postText - text that follows spinner text
   * @returns {undefined}
   */
  constructor(spinners, preText, postText) {
    // bind props
    this.preText = preText
    this.postText = postText
    this.preSpace = preText.length ? ' ' : ''
    this.postSpace = postText.length ? ' ' : ''
    this.rawSpinners = spinners
  }

  /**
   * @method spinners
   * @desc Build and return formatted spinners object.
   * @returns {object} formatted spinners
   */
  spinners() {
    switch (kindOf(this.rawSpinners)) {
      case 'array':
        if (this.rawSpinners.length === 0) errs.spinnersEmpty()
        return this.fromArr(this.rawSpinners)
      case 'object':
        if (Object.keys(this.rawSpinners).length === 0) errs.spinnersEmpty()
        return this.fromObj(this.rawSpinners)
      default:
        errs.spinnersType()
    }
  }

  /**
   * @method fromArr
   * @desc Construct spinners object from raw input array.
   * @param {array} arr - input array
   * @returns {object} formatted spinners
   */
  fromArr(arr) {
    return arr.reduce((accum, spinner) => {
      // throw if there are duplicates
      if (accum.hasOwnProperty(spinner)) errs.unique(spinner)

      // build spinner and assign to accumulator
      accum[spinner] = this.spinnerObj(spinner)
      return accum
    }, {})
  }

  /**
   * @method fromObj
   * @desc Construct spinners object from raw input object.
   * @param {object} obj - input object
   * @returns {object} formatted spinners
   */
  fromObj(obj) {
    return Object.keys(obj).reduce((accum, spinner) => {
      accum[spinner] = this.spinnerObj(obj[spinner])
      return accum
    }, {})
  }

  /**
   * @method spinnerText
   * @desc Constructs text string for spinner.
   * @param {string} text - spinner text to include
   * @returns {string} - combined strings
   */
  spinnerText(text) {
    return [
      this.preText,
      this.preSpace,
      text,
      this.postSpace,
      this.postText
    ].join('')
  }

  /**
   * @method spinnerObj
   * @param {string} text - spinner text to include
   * @returns {object} - spinner object props
   */
  spinnerObj(text) {
    return {
      state: states.incomplete,
      current: null,
      text: this.spinnerText(text)
    }
  }
}
