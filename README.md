# Nitro 3

[![Build Status](https://travis-ci.org/nitrotasks/nitro.svg?branch=master)](https://travis-ci.org/CaffeinatedCode/nitro)
[![Dependency Status](https://david-dm.org/nitrotasks/nitro.svg?theme=shields.io)](https://david-dm.org/nitrotasks/nitro)
[![devDependency Status](https://david-dm.org/nitrotasks/nitro/dev-status.svg?theme=shields.io)](https://david-dm.org/nitrotasks/nitro#info=devDependencies)

A brand new rewrite. Check out the [Wiki](https://github.com/nitrotasks/nitro/wiki) for what's new and happening, or tweet me [@consindo](https://twitter.com/consindo).

## Build Instructions
- You will need node.js & npm installed.
- Then run `npm install`
- Then run `npm run build && npm run build-css`

## Development
- For development, use `npm run watch` & `npm run watch-css` respectively.
- Go to <https://github.com/nitrotasks/nitro-server> to use the server.
- You'll need to change the endpoint in `config.js` to this server to use it, otherwise you can set it to the live server.

## Production
- This is published as a npm package, prebuilt with the API route as /a.