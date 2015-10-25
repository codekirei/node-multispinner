/* eslint no-undefined:0 */
'use strict'

let types = {
  undefined,
  null: null,
  string: 'abc',
  boolean: true,
  number: 1,
  function: function() {},
  array: [],
  object: {}
}

/**
 * @function except
 * @desc Allows use of modified types object with specific types excluded
 * @param {string|undefined|null|[]} exceptions - types or type to exclude
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

module.exports = {
  all: types,
  except
}
