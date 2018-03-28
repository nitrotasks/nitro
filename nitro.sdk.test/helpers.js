import assert from 'assert'

import { promiseSerial } from '../nitro.sdk/helpers/promise.js'

describe('helpers', function() {
  describe('promiseSerial', function() {
    it('should run async functions in serial', function(done) {
      let whatever = '0'
      const funcs = [
        () => {
          return new Promise((resolve) => {
            setTimeout(() => {
              whatever = '1'
              resolve()
            }, 10)
          })
        },
        () => {
          whatever = '2'
          return Promise.resolve()
        }
      ]
      promiseSerial(funcs).then(() => {
        assert.equal(whatever, '2')
        done()
      })
    })
  })
})