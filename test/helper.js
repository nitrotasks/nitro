import fetch from 'isomorphic-fetch'
import config from '../config.js'

// it takes https by default
config.endpoint = 'http://localhost:8040' + config.endpoint

global.testMode = true

// define localstorage
global.localStorage = {
  getItem: () => null,
  setItem: () => null,
}

// define requestAnimationFrame
global.requestAnimationFrame = process.nextTick

console.log('Created localStorage & requestAnimationFrame hacks')