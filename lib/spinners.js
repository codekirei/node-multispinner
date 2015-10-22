'use strict'

//----------------------------------------------------------
// Modules
//----------------------------------------------------------
// NPM
const kindOf = require('kind-of')

// Local
const states = require('lib/states')
const errs = require('lib/errs').createSpinners

//----------------------------------------------------------
// Logic
//----------------------------------------------------------
module.exports = class Spinners {
  /**
   *
   * @param {}
   */
  constructor(spinners, preText, postText) {
    // bind props for spinnerText method
    this.preText = preText
    this.postText = postText
    this.preSpace = preText.length ? ' ' : ''
    this.postSpace = postText.length ? ' ' : ''

    // build and return spinners object or throw
    switch (kindOf(spinners)) {
      case 'array':
        return this.fromArr(spinners)
      case 'object':
        return this.fromObj(spinners)
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
