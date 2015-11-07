'use strict'

//----------------------------------------------------------
// Modules
//----------------------------------------------------------
// NPM
const axios = require('axios')
const chalk = require('chalk')
const h2t = require('html-to-text')
const hangingIndent = require('hanging-indent')
const meow = require('meow')
const uri = require('uri-js')

// Local
const Multispinner = require('../../../')

//----------------------------------------------------------
// Main Logic
//----------------------------------------------------------
/**
 * @function main
 * @param {string[]} input - arr of inputs from cli
 * @returns {undefined}
 */
function main(input) {
  // instantiate spinners
  const spinners = new Multispinner(input, {
    preText: 'Downloading'
  })

  /**
   * consume promises (simultaneously)
   * note: then's error cb is unused because download() doesn't rethrow in its
   *   catch statement; its errs are intentionally returned to be formatted and
   *   printed later
   */
  Promise
    .all(
      // generate array of promises to download urls
      input.reduce((accum, url) => {
        accum.push(download(url, url, spinners))
        return accum
      }, [])
    )
    .then(results => spinners.on('done', () => print(results)))
    .catch(err => { throw err })
}

/**
 * @function download
 * @desc promise-based GET request
 * @param {string} url - url to GET from
 * @param {string} spinnerID - spinner associated with this request
 * @param {object} spinners - multispinner instance
 * @returns {array} spinnerID and result of GET
 */
function download(url, spinnerID, spinners) {
  // if url scheme is undetected, slap an http in front and retry
  if (!uri.parse(url).scheme) {
    return download('http://' + url, spinnerID, spinners)
  }

  // GET request promise
  return axios
    .get(url)
    .then(success => {
      spinners.success(spinnerID)
      return [spinnerID, success]
    })
    .catch(err => {
      // follow redirects
      if (300 < err.status && err.status < 400) {
        return download(err.headers.location, spinnerID, spinners)
      }
      spinners.error(spinnerID)
      return [spinnerID, err]
    })
}

//----------------------------------------------------------
// Print Functions
//----------------------------------------------------------
/**
 * @function print
 * @desc formats and prints results
 * @param {array} results - 2D array of results
 * @returns {undefined}
 */
function print(results) {
  results.map(page => {
    if (page[1] instanceof Error) {
      printHeader('red', page[0])
      console.log(page[1].toString())
    } else {
      page[1].status > 200
        ? printHeader('red', page[0])
        : printHeader('green', page[0])
      printHtml(page[1].data)
    }
  })
}

/**
 * @function printHeader
 * @desc formats and prints header text
 * @param {string} color - chalk color to use
 * @param {string} text - text to print
 * @returns {undefined}
 */
function printHeader(color, text) {
  const fill = '═'.repeat(text.length)
  console.log(chalk[color](
`
╔═${fill}═╗
║ ${text} ║
╚═${fill}═╝
`
  ))
}

/**
 * @function printHtml
 * @desc converts HTML to text and prints
 * @param {string} html - raw HTML to convert
 * @returns {undefined}
 */
function printHtml(html) {
  console.log(
    h2t
      // html-to-text method
      .fromString(html, {
        ignoreImage: true,
        tables: true,
        wordwrap: false
      })
      // split into array of lines
      .split('\n')
      // trim whitespace
      .map(line => {
        return line.trim()
      })
      // remove duplicate consecutive lines
      .reduce((accum, line, i) => {
        if (line !== accum.slice(-1)[0]) accum.push(line)
        return accum
      }, [])
      // replace all links with [link]
      .map(line => {
        return line.replace(/\[.*?\]/g, `[${chalk.blue('link')}]`)
      })
      // replace multiple consecutive spaces with newlines
      .map(line => {
        return line.replace(/\s{2,}/g, '\n')
      })
      // resplit lines with newly inserted \n into multiple array entities
      .reduce((accum, line) => {
        if (line.includes('\n')) {
          line.split('\n').map(part => accum.push(part))
        } else {
          accum.push(line)
        }
        return accum
      }, [])
      // wrap long lines with hanging indent
      .map(line => {
        return hangingIndent(line)
      })
      // reconnect lines into one string for printing
      .join('\n')
  )
}

//----------------------------------------------------------
// CLI integration
//----------------------------------------------------------
// bind cli args and define helpstring
const cli = meow(chalk.blue(
  `Call with one or more URLs:
      $ node index.js <url> <url>`
))

cli.input.length === 0
  // print helpstring
  ? console.log(cli.help)
  // run with cli args
  : main(cli.input)
