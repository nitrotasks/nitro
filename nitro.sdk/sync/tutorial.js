import { get, set } from 'idb-keyval'

import config from '../../config'
import authenticationStore from './auth.js'
import { checkStatus } from '../helpers/fetch.js'

export class Tutorial {
  _getLatestVersion() {
    return fetch(`${config.endpoint}/meta/latest-version`, {
      headers: authenticationStore.authHeader(true)
    })
      .then(checkStatus)
      .then(res => res.json())
  }
  checkTutorialCompleted = () => {
    return new Promise(resolve => {
      if (authenticationStore.isLocalAccount()) {
        get('meta-latest-version').then(data => {
          if (data === undefined) {
            resolve(false)
          } else {
            resolve(data.tutorialCompleted === true)
          }
        })
      } else {
        // if it's a 404 (key not set), it'll also be false
        this._getLatestVersion()
          .then(data => resolve(data.tutorialCompleted === true))
          .catch(() => resolve(false))
      }
    })
  }
  markTutorialCompleted = () => {
    return new Promise((resolve, reject) => {
      let data = { tutorialCompleted: true }
      if (authenticationStore.isLocalAccount()) {
        set('meta-latest-version', data)
          .then(resolve)
          .catch(reject)
      } else {
        this._getLatestVersion()
          .then(originalObject => (data = Object.assign(originalObject, data)))
          .catch(() => null)
          .then(() =>
            fetch(`${config.endpoint}/meta/latest-version`, {
              method: 'POST',
              headers: authenticationStore.authHeader(true),
              body: JSON.stringify(data)
            })
          )
          .then(checkStatus)
          .then(resolve)
          .catch(reject)
      }
    })
  }
}
