import fetch from 'isomorphic-fetch'
import config from '../config'

// it takes https by default
config.endpoint = 'http://localhost:8040' + config.endpoint

global.testMode = true

// define localstorage
global.indexedDB = require('fake-indexeddb')

// define requestAnimationFrame
global.requestAnimationFrame = process.nextTick

console.log('Created localStorage & requestAnimationFrame hacks')

global.window = {}
