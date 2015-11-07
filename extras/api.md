## new Multispinner(spinners, options)

### spinners (required)

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

### options (optional)

Configurable options object.

```js
var multispinner = new Multispinner(['foo', 'bar', 'baz'], {
  autoStart: false,
  clear: true
)
```

Each option below is shown with its default value.

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
Note that frames needn't only be one character -- see the custom animation example.

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

## multispinner.start()

Start the spinners.
This is only necessary if the `autoStart` option is manually set to `false`.
If `autoStart` is `true` (the default), this `start` method should *not* be called -- it would start the spinners twice, giving the appearance of double speed (and dropped frames)!

## multispinner.success(spinner)

Complete a spinner and change its state to `success`.
`spinner` is the (string) ID of the spinner to complete.
The spinner's symbol and color are updated to indicate the `success` state.

## multispinner.error(spinner)

Complete a spinner and change its state to `error`.
`spinner` is the (string) ID of the spinner to complete.
The spinner's symbol and color are updated to indicate the `error` state.

```js
/**
 * NOTES:
 * - This is es6.
 * - Only the 'foo' spinner is completed in this code, so 'bar' would continue
 *   spinning indefinitely. Generally, you want to complete all your spinners.
 * - For a more complete demo, check out the cli-with-promises example in the
 *   examples section.
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

## Events

`node-multispinner` emits completion events with `EventEmitter`.

**done**

Emitted when all spinners are complete, irrespective of their completion state (success or error).

```js
multispinner.on('done', () => {
  // do something now that the spinners are all done
})
```

**success**

Emitted when all spinners are complete and in the success state.
If any spinners were completed with `multispinner.error(spinner)`, this event will not fire.

**err**

Emitted after all spinners are complete and any spinner was completed with `multispinner.error(spinner)`.
If multiple spinners were completed with `multispinner.error`, this event will fire once for each of them.
Emits the ID of the spinner with the `err` event.

Note that this event is `err`, not `error`, so it doesn't have to be handled.
Emitting `error` is functionally equivalent to `throw`, which should always be handled.
So, `err` is used here instead.
This gives flexibility -- ending a spinner with `multispinner.error(spinner)` does not have to mean an `Error` occured (but it might!).

This event is meant to supplement, not preclude, `Error` handling.
Event handling with `node-multispinner` is optional; `Error` handling should always be a priority.

```js
multispinner.on('err', (spinner) => {
  console.log(`spinner ${spinner} had an error`)
})
```
