'use strict'

//----------------------------------------------------------
// Modules
//----------------------------------------------------------
// Local
const Multispinner = require('../../')
const genSpinners = require('../../test/utils/genSpinners')

//----------------------------------------------------------
// Logic
//----------------------------------------------------------
/**
 * @returns {number} random num between 300 and 4999
 */
function randTimeout() {
  return Math.random() * 4700 + 300
}

/**
 * @returns {number} random int between 3 and 7
 */
function randCount() {
  return Math.floor(Math.random() * 5 + 3)
}

/**
 * @returns {bool} true about 50% of the time
 */
function fiftyfifty() {
  return Math.random() >= 0.5
}

/**
 * @desc Main loop
 * @returns {undefined}
 */
function loop() {
  // Generate random count of random spinners
  const spinners = genSpinners.obj(randCount())

  // Instantiate
  const m = new Multispinner(spinners, {autoStart: false})

  // Overwrite logUpdate.done for infinite effect
  m.update.done = () => {}

  // Start spinners
  m.start()

  // Create random timeout funcs
  Object.keys(spinners).map(spinner => {
    setTimeout(() => {
      fiftyfifty()
        ? m.success(spinner)
        : m.error(spinner)
    }, randTimeout())
  })

  // After this loop finishes, start another
  m.on('done', () => {
    setTimeout(() => loop(), 1000)
  })
}

// press start
loop()
