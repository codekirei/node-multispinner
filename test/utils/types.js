/* eslint no-undefined:0 */
'use strict'

let types = {
  undefined,
  null: null,
  string: 'abc',
  boolean: true,
  number: 1,
  function: () => {},
  array: [],
  object: {}
}

/**
 * @function except
 * @param {*} exceptions - types or type to exclude
 * @returns {Object} - types with exceptions excluded
 */
function except(exceptions) {
  // copy types
  let typesCopy = {}
  Object.keys(types).map(key => {
    typesCopy[key] = types[key]
  })

  // remove exceptions
  exceptions instanceof Array
    ? exceptions.map(exception => {
      delete typesCopy[exception]
    })
    : delete typesCopy[exceptions]

  // return modified clone
  return typesCopy
}

/**
 * @function only
 * @param {*} specified - types or type to include
 * @returns {Object} - types or type included
 */
function only(specified) {
  if (specified instanceof Array) {
    return specified.reduce((accum, type) => {
      accum[type] = types[type]
      return accum
    }, {})
  }
  const type = {}
  type[specified] = types[specified]
  return type
}

// exports
module.exports = {
  all: types,
  except,
  only
}
