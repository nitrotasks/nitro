import assert from 'assert'

import { promiseSerial } from '../nitro.sdk/helpers/promise.js'
import { checkStatus } from '../nitro.sdk/helpers/fetch.js'

describe('helpers', () => {
  describe('promiseSerial', () => {
    it('should run async functions in serial', done => {
      let whatever = '0'
      const funcs = [
        () => {
          return new Promise(resolve => {
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

  describe('checkStatus', () => {
    it('should pass through if the response is successful', done => {
      const response = { status: 200 }
      Promise.resolve(response)
        .then(checkStatus)
        .then(res => {
          assert.equal(res, response)
          done()
        })
    })
    it('should return an error with json if the status code indicates an error', done => {
      const msg = { message: 'some message' }
      const response = { status: 500, json: () => Promise.resolve(msg) }
      Promise.resolve(response)
        .then(checkStatus)
        .catch(err => {
          assert.equal(err instanceof Error, true)
          assert.equal(err.status, response.status)
          assert.equal(JSON.stringify(err.response), JSON.stringify(msg))
          done()
        })
    })
  })
})
