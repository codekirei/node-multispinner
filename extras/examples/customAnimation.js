'use strict'

// modules
const Multispinner = require('../../')
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

// initialize
const m = new Multispinner(spinners, opts)

// staggered completion
const t = 1500
let i = 0
function loop() {
  setTimeout(() => {
    m.success(spinners[i])
    i++
    if (i < spinners.length) loop()
  }, t)
}
loop()
