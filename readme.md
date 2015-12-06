![node-multispinner](https://raw.githubusercontent.com/codekirei/node-multispinner/master/extras/multispinner.gif)
---
[![Build Status][1]][2]
[![Coverage Status][3]][4]

<b>[About](#about)</b> | 
<b>[Installation](#installation)</b> | 
<b>[API](#api)</b> | 
<b>[Examples](#examples)</b> | 
<b>[Attribution](#attribution)</b> | 
<b>[License](#license)</b>

## About

`node-multispinner` is a [Node.js](https://nodejs.org/) module for managing multiple progress indicators (spinners) in CLI apps.
This module is especially useful for apps that benefit from simultaneous async task execution (e.g. with `Promise.all[]`), as it enables live updating individual spinners, in any order, while other spinners continue spinning.
Node.js 4.0 or newer is required.

![demo-gif](https://raw.githubusercontent.com/codekirei/node-multispinner/master/extras/demo.gif)

## Installation

Install and require as a standard Node module.

**Install**

```
  $ npm install --save multispinner
```

**Require**

```js
  var Multispinner = require('multispinner')
```

## API

Full documentation available [here](https://github.com/codekirei/node-multispinner/blob/master/extras/api.md).

## Examples

The examples discussed below can be found [here](https://github.com/codekirei/node-multispinner/tree/master/extras/examples).
Run them in a terminal with node:

```
$ node <example>
```

**Example:** `events.js`

Creates four spinners from an array, then completes them in succession with staggered `setTimeout` functions.
Responds to the `success` and `err` completion events.

**Example:** `customAnimation.js`

Creates a custom spinner animation with the `frames` option.

**Example:** `randomInfiniteLoop.js`

Creates three to seven spinners with random lorem text and completes them randomly in less than five seconds in an infinite loop.
Stubs out the `logUpdate.done()` function to overwrite the previous output with every loop.

It's kind of mesmerising.

**Example:** `cli-with-promises`

A CLI application that reads URLs and parses HTML into text to display in a terminal.
Uses [meow](https://github.com/sindresorhus/meow) for CLI support, [html-to-text](https://github.com/werk85/node-html-to-text) for parsing, and [axios](https://github.com/mzabriskie/axios) for Promise-based HTTP requests.
Creates spinners for each URL, and uses `Promise.all()` to execute the GET requests in parallel.

There are certainly edge cases that this example doesn't account for; it is not meant to be a "real" application.
Despite that, the code should be illustrative of how `node-multispinner` could potentially be used in a real application.

This example is unique in that it requires modules not used in `node-multispinner`.
Before running it, `cd` into its directory and install the additional requirements from its `package.json` with `npm install`.

## Attribution

Thanks to [sindresorhus](https://sindresorhus.com/hi/) for his [log-update](https://github.com/sindresorhus/log-update) module, which was a major inspiration for and is used extensively in this module.
Log-update is [MIT licensed](https://raw.githubusercontent.com/sindresorhus/log-update/master/license).

## License

[MIT](https://github.com/codekirei/node-multispinner/blob/master/license)

[1]: https://img.shields.io/travis/codekirei/node-multispinner.svg?style=flat-square
[2]: https://travis-ci.org/codekirei/node-multispinner
[3]: http://img.shields.io/coveralls/codekirei/node-multispinner.svg?style=flat-square
[4]: https://coveralls.io/github/codekirei/node-multispinner?branch=master
