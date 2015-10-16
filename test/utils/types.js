/* eslint no-undefined:0 */
'use strict'

let types = {
  undefined,
  null: null,
  string: '',
  boolean: true,
  number: 0,
  function: () => {},
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
  // clone types
  let typesClone = {}
  Object.keys(types).map(key => {
    typesClone[key] = types[key]
  })

  // remove exceptions
  exceptions instanceof Array
    ? exceptions.map(exception => {
      delete typesClone[exception]
    })
    : delete typesClone[exceptions]

  // return modified clone
  return typesClone
}

module.exports = {
  all: types,
  except
}
