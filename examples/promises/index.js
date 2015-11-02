'use strict'

//----------------------------------------------------------
// Modules
//----------------------------------------------------------
// NPM
const axios = require('axios')
const h2t   = require('html-to-text')
const meow  = require('meow')
const chalk = require('chalk')

// Local
const Multispinner = require('../../')

//----------------------------------------------------------
// Logic
//----------------------------------------------------------
// grab cli args
const cli = meow(`
  Call with one or more URLs:
    $ node index.js <url> <url>
`)

// print usage or run main
cli.input.length === 0
  ? console.log(cli.help)
  : main(cli.input)

/**
 * @function main
 * @param {string[]} input - arr of inputs from cli
 * @returns {}
 */
function main(input) {
  // instantiate and start spinner
  const spinners = new Multispinner(input, {
    preText: 'Downloading'
  })
  spinners.start()

  // consume promises
  Promise.all(
    // array of promises to download urls
    input.reduce((accum, url) => {
      accum.push(download(url, url, spinners))
      return accum
    }, [])
  ).then(data => {
    spinners.on('done', () => print(data))
  })
}

function download(url, spinner, spinners) {
  // prepend http if not provided
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return download('http://' + url, spinner, spinners)
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
      if (301 <= err.status && err.status < 400) {
        return download(err.headers.location, spinner, spinners)
      }
      // error; complete spinner and return error
      spinners.error(spinner)
      return err
    })
}

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
      // split into array
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
      // replace all links
      .map(line => {
        return line.replace(/\[.*?\]/g, `[${chalk.blue('link')}]`)
      })
      // replace duplicate consecutive spaces with newlines
      .map(line => {
        return line.replace(/\s{2,}/g, '\n')
      })
      // format long lines with hanging indent
      // reconnect lines into string
      .join('\n')
  )
}
