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

// Local
const Multispinner = require('../../')

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

  // consume promises
  Promise.all(
    // array of promises to download urls
    input.reduce((accum, url) => {
      accum.push(download(url, url, spinners))
      return accum
    }, [])
  )
  .then(data => {
    spinners.on('done', () => print(data))
  })
  .catch(err => {
    throw err
  })
}

function download(url, spinner, spinners) {
  // prepend http if not provided
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return download(`http://${url}`, spinner, spinners)
  }

  // GET request
  return axios.get(url)
    .then((res) => {
      // success; complete spinner and return result
      spinners.success(spinner)
      return res
    })
    .catch((err) => {
      // 30X error; retry with redirected URL
      if (300 < err.status && err.status < 400) {
        return download(err.headers.location, spinner, spinners)
      }
      // error; complete spinner and return error
      spinners.error(spinner)
      return err
    })
}

//----------------------------------------------------------
// Print Functions
//----------------------------------------------------------
function print(pages) {
  pages.map(page => {
    if (page.status !== 200) {
      page instanceof Error
        ? printHeader('red', page.host)
        : printHeader('red', page.headers.location)
      console.log(page)
    } else {
      printHeader('green', page.config.url)
      printHtml(page.data)
    }
  })
}

function printHeader(color, text) {
  console.log(chalk[color](`
╔${'═'.repeat(text.length + 2)}╗
║ ${text} ║
╚${'═'.repeat(text.length + 2)}╝
  `))
}

function printHtml(html) {
  console.log(
    h2t
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
      // split lines with newly inserted \n into multiple lines
      .reduce((accum, line) => {
        if (line.includes('\n')) {
          line.split('\n').map(part => accum.push(part))
        } else {
          accum.push(line)
        }
        return accum
      }, [])
      // format long lines with hanging indent
      .map(line => {
        return hangingIndent(line)
      })
      // reconnect lines into string
      .join('\n')
  )
}

//----------------------------------------------------------
// CLI integration
//----------------------------------------------------------
// bind cli args; define helpstring
const cli = meow(chalk.blue(
  `Call with one or more URLs:
      $ node index.js <url> <url>`
))

cli.input.length === 0
  // print helpstring
  ? console.log(cli.help)
  // run with cli args
  : main(cli.input)
