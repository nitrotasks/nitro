const path = require('path')
const fs = require('fs')

const DOMAIN = process.env.DOMAIN || ''
const html = fs
  .readFileSync(path.join(__dirname, 'dist/index.html'))
  .toString()
  .split('/generated/')
  .join(`${DOMAIN}/generated/`)

const sw = fs.readFileSync(path.join(__dirname, 'dist/sw.js')).toString()

exports.handler = async event => {
  const response = {
    statusCode: 200,
    headers: {
      'Content-Type':
        event.path === '/sw.js' ? 'application/javascript' : 'text/html'
    },
    body: event.path === '/sw.js' ? sw : html
  }
  return response
}
