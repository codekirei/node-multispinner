'use strict'

// modules
const Multispinner = require('../../')
const figures = require('figures')

// constants
const spinners = ['task A', 'task B', 'task C']
const opts = {
  'interval': 120,
  'preText': 'Completing',
  'postSpace': ' : ',
  'frames': [
    '[      ]',
    '[*     ]',
    '[**    ]',
    '[ **   ]',
    '[  **  ]',
    '[   ** ]',
    '[    **]',
    '[     *]'
  ],
  'symbol': {
    'success': ' '.repeat(7) + figures.tick
  }
}

// initialize
const m = new Multispinner(spinners, opts)
spinners.forEach(function (spinner) {
  m.updateText(spinner, { postText : 'Starting' })
})

// staggered completion
const t = 1500
let i = 0
function loop() {
  // update text after 500 ms
  setTimeout(() => {
    m.updateText(spinners[i], { postText: 'Working' });
  }, 500)

  setTimeout(() => {
    m.success(spinners[i])
    m.updateText(spinners[i], { postText: 'Done' })
    i++
    if (i < spinners.length) loop()
  }, t)
}
loop()
