'use strict'

//----------------------------------------------------------
// Modules
//----------------------------------------------------------
// NPM
const chalk = require('chalk')

// Local
const states = require('lib/states')

//----------------------------------------------------------
// Logic
//----------------------------------------------------------
/**
 * 
 * @param {} 
 */
module.exports = function() {
  this.state = setInterval(() => {
    // grab current frame of spinner animation
    let animation = this.frames[this.i = ++this.i % this.frameCount]

    // iterate over spinners to check state and build current strings
    Object.keys(this.spinners).map(spinner => {
      let state = this.spinners[spinner].state
      let symbol
      switch (state) {
        case states.incomplete:
          symbol = animation
          break
        case states.success:
          symbol = this.successSymbol
          break
        case states.error:
          symbol = this.errorSymbol
          break
      }
      this.spinners[spinner].current = chalk[this.colors[state]](
        `${this.indentStr}${symbol} ${this.spinners[spinner].base}`
      )
    })

    // call update method to apply current strings to terminal
    this.update()

    // kill loop and exit if all spinners are finished
    if (this.allCompleted()) this.clearState()
  }, this.delay)
}
