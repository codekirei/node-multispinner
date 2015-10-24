'use strict'

//----------------------------------------------------------
// Modules
//----------------------------------------------------------
// NPM
const kindOf = require('kind-of')

// Local
const states = require('lib/constants').states
const errs = require('lib/errs').spinners

//----------------------------------------------------------
// Logic
//----------------------------------------------------------
module.exports = class Spinners {
  /**
   *
   * @param {}
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
   *
   * @param {}
   */
  spinners() {
    // build and return spinners object or throw
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
   *
   * @param {}
   */
  fromArr(arr) {
    return arr.reduce((accum, spinner) => {
      accum[spinner] = this.spinnerObj(spinner)
      return accum
    }, {})
  }

  /**
   *
   * @param {}
   */
  fromObj(obj) {
    return Object.keys(obj).reduce((accum, spinner) => {
      accum[spinner] = this.spinnerObj(obj[spinner])
      return accum
    }, {})
  }

  /**
   *
   * @param {}
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
   *
   * @param {}
   */
  spinnerObj(text) {
    return {
      state: states.incomplete,
      current: null,
      text: this.spinnerText(text)
    }
  }
}
