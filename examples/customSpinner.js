'use strict'

// modules
const Multispinner = require('../')
const figures = require('figures')

// constants
const spinners = ['task A', 'task B', 'task C']
const opts = {
  'interval': 120,
  'preText': 'Completing',
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

// initialize and start
const m = new Multispinner(spinners, opts)
m.start()

// staggered completion
let i = 0
let t = 1500
function loop() {
  setTimeout(() => {
    m.success(spinners[i])
    i++
    if (i < spinners.length) loop()
  }, t)
}
loop()
