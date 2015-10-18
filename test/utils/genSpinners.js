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
 * 
 * @param {} 
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
 * 
 * @param {} 
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
