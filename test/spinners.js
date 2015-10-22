'use strict'

//----------------------------------------------------------
// Modules
//----------------------------------------------------------
// NPM
const assert = require('chai').assert
const faker = require('faker')

// Local
const Multispinner = require('../')
const states = require('lib/states')
const genSpinners = require('./utils/genSpinners')

//----------------------------------------------------------
// Tests
//----------------------------------------------------------
describe('Spinners methods', () => {
  //----------------------------------------------------------
  // Constructor
  //----------------------------------------------------------
  describe('Constructor', () => {
    // it('Create spinners from object', () => {
    //   // build spinners and expected
    //   const spinners = genSpinners.obj(5)
    //   const expected = {}
    //   Object.keys(spinners).map(spinner => {
    //     expected[spinner] = {
    //       state: states.incomplete,
    //       current: null,
    //       text: spinners[spinner]
    //     }
    //   })

    //   // instantiate and test
    //   const multispinner = new Multispinner(spinners)
    //   assert.deepEqual(expected, multispinner.spinners)
    // })

    // it('Create spinners from array', () => {
    //   // build spinners and expected
    //   const spinners = genSpinners.arr(5)
    //   const expected = {}
    //   spinners.map(spinner => {
    //     expected[spinner] = {
    //       state: states.incomplete,
    //       current: null,
    //       text: spinner
    //     }
    //   })

    //   // instantiate and test
    //   const multispinner = new Multispinner(spinners)
    //   assert.deepEqual(expected, multispinner.spinners)
    // })

    // describe('preText and postText', () => {
    //   const spinners = genSpinners.arr(3)
    //   const preText = faker.fake('{{lorem.words}}')
    //   const postText = faker.fake('{{lorem.words}}')

    //   it('Build spinner text with preText', () => {
    //     const multispinner = new Multispinner(spinners, {preText})
    //     spinners.map(spinner => {
    //       const expected = `${preText} ${spinner}`
    //       assert.equal(expected, multispinner.spinners[spinner].text)
    //     })
    //   })

    //   it('Build spinner text with postText', () => {
    //     const multispinner = new Multispinner(spinners, {postText})
    //     spinners.map(spinner => {
    //       const expected = `${spinner} ${postText}`
    //       assert.equal(expected, multispinner.spinners[spinner].text)
    //     })
    //   })

    //   it('Build spinner text with pre and post text', () => {
    //     const multispinner = new Multispinner(spinners, {preText, postText})
    //     spinners.map(spinner => {
    //       const expected = `${preText} ${spinner} ${postText}`
    //       assert.equal(expected, multispinner.spinners[spinner].text)
    //     })
    //   })
    // })
  })

  //----------------------------------------------------------
  // fromArr
  //----------------------------------------------------------
  describe('fromArr method', () => {
    
  })

  //----------------------------------------------------------
  // fromObj
  //----------------------------------------------------------
  describe('fromObj method', () => {
    
  })

  //----------------------------------------------------------
  // spinnerText
  //----------------------------------------------------------
  describe('spinnerText method', () => {
    
  })

  //----------------------------------------------------------
  // spinnerObj
  //----------------------------------------------------------
  describe('spinnerObj method', () => {
    
  })
})
