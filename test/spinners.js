'use strict'

//----------------------------------------------------------
// Modules
//----------------------------------------------------------
// NPM
const assert = require('chai').assert
const sinon = require('sinon')
const faker = require('faker')

// Local
const Spinners = require('../lib/spinners')
const states = require('../lib/constants').states

// Test Utils
const genSpinners = require('./utils/genSpinners')

//----------------------------------------------------------
// Tests
//----------------------------------------------------------
describe('Spinners methods', () => {
  // setup
  const arr = genSpinners.arr(3)
  const preText = faker.fake('{{lorem.words}}')
  const postText = faker.fake('{{lorem.words}}')
  const cases = {
    preText: ['', preText, '', preText],
    preSpace: ['', ' ', '', ' '],
    postText: ['', '', postText, postText],
    postSpace: ['', '', ' ', ' ']
  }

  //----------------------------------------------------------
  // Constructor
  //----------------------------------------------------------
  describe('constructor', () => {
    it('bind props', () => {
      for (let i = 0; i < cases.preText.length; i++) {
        const s = new Spinners(arr, cases.preText[i], cases.postText[i])
        assert.deepEqual(arr, s.rawSpinners)
        Object.keys(cases).map(prop => {
          assert.equal(cases[prop][i], s[prop])
        })
      }
    })
  })
  describe('spinners', () => {
    it('call fromArr method if spinners is an arr', () => {
      const s = new Spinners(arr, '', '')
      const spy = sinon.spy(s, 'fromArr')
      s.spinners()
      assert(spy.called, 'call fromArr method')
      s.fromArr.restore()
    })
    it('call fromObj method if spinners is an obj', () => {
      const obj = genSpinners.obj(3)
      const s = new Spinners(obj, '', '')
      const spy = sinon.spy(s, 'fromObj')
      s.spinners()
      assert(spy.called, 'call fromObj method')
      s.fromObj.restore()
    })
  })

  //----------------------------------------------------------
  // fromArr
  //----------------------------------------------------------
  describe('fromArr method', () => {
    it('build spinners from array', () => {
      const s = new Spinners(arr, '', '')
      const expected = arr.reduce((accum, spinner) => {
        accum[spinner] = {
          state: states.incomplete,
          current: null,
          text: spinner
        }
        return accum
      }, {})
      assert.deepEqual(expected, s.fromArr(arr))
    })
  })

  //----------------------------------------------------------
  // fromObj
  //----------------------------------------------------------
  describe('fromObj method', () => {
    it('build spinners from object', () => {
      const obj = genSpinners.obj(3)
      const s = new Spinners(obj, '', '')
      const expected = Object.keys(obj).reduce((accum, spinner) => {
        accum[spinner] = {
          state: states.incomplete,
          current: null,
          text: obj[spinner]
        }
        return accum
      }, {})
      assert.deepEqual(expected, s.fromObj(obj))
    })
  })

  //----------------------------------------------------------
  // spinnerText
  //----------------------------------------------------------
  describe('spinnerText method', () => {
    it('build text from props and param', () => {
      for (let i = 0; i < cases.preText.length; i++) {
        const s = new Spinners(arr, cases.preText[i], cases.postText[i])
        const spinners = s.spinners()
        const expected = [
          cases.preText[i],
          cases.preSpace[i],
          arr[0],
          cases.postSpace[i],
          cases.postText[i]
        ].join('')
        assert.equal(expected, spinners[arr[0]].text, `i = ${i}`)
      }
    })
  })

  //----------------------------------------------------------
  // spinnerObj
  //----------------------------------------------------------
  describe('spinnerObj method', () => {
    it('build object from params', () => {
      const text = arr[0]
      const s = new Spinners(arr, '', '')
      const expected = {
        state: states.incomplete,
        current: null,
        text
      }
      assert.deepEqual(expected, s.spinners()[text])
    })
  })
})
