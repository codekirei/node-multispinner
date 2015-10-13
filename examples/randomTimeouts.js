'use strict'

//----------------------------------------------------------
// Modules
//----------------------------------------------------------
// NPM
let mirror = require('constant-mirror')

// Local
let Multispinner = require('../')

//----------------------------------------------------------
// Logic
//----------------------------------------------------------
// Util funcs
function randTimeout() {
  // returns a number between 1000 and 5999
  return Math.random() * 5000 + 1000
}
function fiftyfifty() {
  // returns true about 50% of the time
  return Math.random() >= 0.5
}

// Spinners to create
const spinners = mirror(
  'spinnerA',
  'spinnerB',
  'spinnerC',
  'spinnerD',
  'spinnerE'
)

// Instantiate with spinners
let multispinner = new Multispinner(spinners)

// Start spinners
multispinner.start()

// Programmatically create timeout funcs
Object.keys(spinners).map(spinner => {
  if (fiftyfifty()) {
    // half the time end with success
    setTimeout(() => {
      multispinner.success(spinner)
    }, randTimeout())
  } else {
    // the other half end with error
    setTimeout(() => {
      multispinner.error(spinner)
    }, randTimeout())
  }
})
