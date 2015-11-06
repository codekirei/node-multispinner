'use strict'

//----------------------------------------------------------
// Modules
//----------------------------------------------------------
// NPM
const faker = require('faker')

// Local

//----------------------------------------------------------
// Logic
//----------------------------------------------------------
/**
 * @func arrayOfSpinners
 * @param {number} count - number of spinners to generate
 * @returns {array} an array of spinners
 */
function arrayOfSpinners(count) {
  let arr = []
  let i = 0
  while (i < count) {
    arr.push(faker.fake('{{name.firstName}}'))
    i++
  }
  return arr
}

/**
 * @func objectOfSpinners
 * @param {number} count - number of spinners to generate
 * @returns {object} an object of spinners with lorem text
 */
function objectOfSpinners(count) {
  let obj = {}
  let i = 0
  while (i < count) {
    obj[faker.fake('{{name.firstName}}')] = faker.fake('{{lorem.sentence}}')
    i++
  }
  return obj
}

//----------------------------------------------------------
// Exports
//----------------------------------------------------------
module.exports = {
  arr: arrayOfSpinners,
  obj: objectOfSpinners
}
