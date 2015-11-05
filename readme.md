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

#### Spinners (required)

An array or object of spinners to create.
Once created, spinners are stored in the `multispinner.spinners` object.

```js
// example spinner in spinners object
{
  'foo': {      // unique spinner ID
    'state':    // incomplete, success, or error
    'text':     // base spinner text plus preText and postText
    'current':  // colorized symbol and text (what is drawn on screen)
  }
}
```

**Array**

An array of strings.
Each string becomes a spinner.
Each spinner gets its text and ID from the given string.
Because these strings are used as IDs, they must be unique.
`multispinner` will `throw` if it finds duplicate strings in its spinner array.

```js
var multispinner = new Multispinner([
  'Foo',
  'Bar',
  'Baz'
])
```

**Object**

Given spinner `key: val`, `val` is the text and `key` is the ID.

```js
var multispinner = new Multispinner({
  'Foo': 'Downloading Foo',
  'Bar': 'Transpiling Bar',
  'Baz': 'Writing Baz'
})
```

#### Options (optional)

Configurable options object.

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

Text to append after spinner text.

**color**

```js
{
  incomplete: 'blue',
  success: 'green',
  error: 'red'
}
```

Colors used for spinners in each possible state.
[Chalk](https://github.com/chalk/chalk) is used for colorization, so any chalk-compatible color values are acceptable.
Individual colors can be customized without customizing the whole color object.

```js
var multispinner = new Multispinner(['Foo', 'Bar'], {
  color: {
    incomplete: 'yellow'
  }
})
```

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
If `autoStart` is `true` (the default), this `start` method should *not* be called -- it would start the spinners twice, giving the appearance of double speed (and dropped frames)!

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

`node-multispinner` emits completion events with `EventEmitter`.

**done**

Emitted when all spinners are complete, irrespective of their completion state (success or error).

```js
multspinner.on('done', () => {
  // do something now that the spinners are all done
})
```

**success**

Emitted when all spinners are complete and in the success state.
If any spinners were completed with `multispinner.error(spinner)`, this event will not fire.

**err**

Emitted after all spinners are complete and any spinner was completed with `multispinner.error(spinner)`.
If multiple spinners were completed with `error`, this event will fire once for each of them.
Emits the ID of the spinner with the `err` event.

Note that this event is `err` and not `error`, so it doesn't *have* to be handled.
This is intentional; ending a spinner with `multispinner.error(spinner)` does not have to mean an `Error` occured in the traditional sense.
Emitting `error` is similar to a `throw` (which always requires handling), so `err` is used instead.
In short, this event is meant to supplement, not preclude, traditional `Error` handling.

```js
multispinner.on('err', (spinner) => {
  console.log(`spinner ${spinner} had an error`)
})
```

## Examples

## Attribution

Thanks to [sindresorhus](https://sindresorhus.com/hi/) for his [log-update](https://github.com/sindresorhus/log-update) module, which was a major inspiration for and is used extensively in this module.
Log-update is [MIT licensed](https://raw.githubusercontent.com/sindresorhus/log-update/master/license).

## License

[MIT](license)
