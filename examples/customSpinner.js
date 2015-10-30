'use strict'

const Multispinner = require('../')

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
    '[     *]',
  ]
}

const m = new Multispinner(spinners, opts)

m.start()

setTimeout(() => m.success('task A'), 1500)
setTimeout(() => m.success('task B'), 2500)
setTimeout(() => m.success('task C'), 3500)
