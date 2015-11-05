![node-multispinner](extras/multispinner.gif)
---

<b>[About](#about)</b> | 
<b>[Installation](#installation)</b> | 
<b>[API](#api)</b> | 
<b>[Examples](#examples)</b> | 
<b>[Attribution](#attribution)</b> | 
<b>[License](#license)</b> | 

## About

`node-multispinner` is a [Node.js](https://nodejs.org/) module for managing multiple progress indicators (spinners) in CLI apps.
This module is especially useful for apps with async tasks, as it enables completion of individual spinners, in any order, while other spinners continue spinning.
Node.js 4.0 or newer is required.

![demo-gif](extras/demo.gif)


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

### new Multispinner(spinners, options)

#### Spinners

An array of or object of spinner titles. Required.

**Array**

With an array of spinners, the displayed text and the string IDs for interacting with spinners are the same.

```js
var multispinner = new Multispinner([
  'Foo',
  'Bar',
  'Baz'
])
```

**Object**

Given object `{key: val}`, `val` is the spinner text while `key` is the string ID used to complete the spinner with the `success` or `error` method.

```js
var multispinner = new Multispinner({
  'Foo': 'Downloading Foo',
  'Bar': 'Transpiling Bar',
  'Baz': 'Writing Baz'
})
```

#### Options

Configurable options object. Optional.

```js
var multispinner = new Multispinner(['foo', 'bar', 'baz'], {
  autoStart: false,
  clear: true
)
```

**autoStart**

```js
{ autoStart: true }
```

If `true`, automatically start spinners after instantiating the `Multispinner` class.
If `false`, remember to start the spinners later with `multispinner.start()`.

**clear**

```js
{ clear: false }
```

If `true`, clear output with `logUpdate.clear()` after all spinners have finished.
If `false`, output persists.

**frames**

```js
{ frames: ['-', '\\', '|', '/'] }
```

Array of spinner frames.
These are cycled to create the spinner animation.
Note that frames needn't only be one character -- see the custom spinner example.

**indent**

```js
{ indent: 2 }
```

Number of character widths to indent spinners.

**interval**

```js
{ interval: 80 }
```

Number of milliseconds between animation frames.

**preText**

```js
{ preText: '' }
```

Text to insert before spinner text (but after spinner animation).
Example:

```js
var multispinner = new Multispinner(['foo', 'bar'], {
  preText: 'Completing'
})

/**
 * First frame of spinners would look like this:
 *
 * - Completing foo
 * - Completing bar
 */
```

**postText**

```js
{ postText: '' }
```

Text to append after spinner text. See `preText` example.

**color**

```js
{
  incomplete: 'blue',
  success: 'green',
  error: 'red'
}
```
Colors used for spinners in each available state.
This module uses [chalk](https://github.com/chalk/chalk) for colorization, so any chalk-compatible color values are acceptable.
Individual colors can be customized without customizing the whole color object (e.g. `{ color.incomplete: 'yellow' }`)

**symbol**

```js
{
  success: figures.tick,
  error: figures.cross
}
```
Symbols to use in place of the spinner animation for spinners that have completed.
[Figures](https://github.com/sindresorhus/figures) is used by default for some nice unicode symbols, but any strings are acceptable.
Like colors, individual symbols can be customized without customizing the entire symbol object.

### multispinner.start()

Start the spinners.
This is only necessary if the `autoStart` option is manually set to `false`.
If `autoStart` is `true` (the default), this `start` method should *not* be called -- it would start the spinners twice, giving the appearance of double speed!

### multispinner.success(spinner)

Complete a successful spinner.
Changes the spinner's symbol to `symbol.success` and color to `color.success`.

```js
/**
 * NOTES:
 * - This is es6.
 * - Only the 'foo' spinner is completed in this code, so 'bar' would continue
 *   spinning indefinitely. Generally, you want to complete all your spinners.
 * - For a more complete demo, check out the cli-with-promises example.
 */

// make a promise
const fooTask = new Promise((resolve, reject) => {
  // async stuff to do here
})

// instantiate multispinner
const multispinner = new Multispinner(
  ['foo', 'bar'],
  { preText: 'Downloading' }
)

// fulfill the promise
fooTask
  .then((res) => {
    // complete spinner successfully
    multispinner.success('foo')

    // possibly do stuff with res here
  })
  .catch((err) => {
    // complete spinner with error
    multispinner.error('foo')

    // possibly do stuff with err here
  })

```

### multispinner.error(spinner)

Complete a spinner that ended in an error.
Changes the spinner's symbol to `symbol.error` and color to `color.error`.
See the `success` example above -- `error` is also used.

### Events

## Examples

## Attribution

Thanks to [sindresorhus](https://sindresorhus.com/hi/) for his [log-update](https://github.com/sindresorhus/log-update) module, which was a major inspiration for and is used extensively in this module.
Log-update is [MIT licensed](https://raw.githubusercontent.com/sindresorhus/log-update/master/license).

## License

[MIT](license)
