# Nitro 3

[![Build Status](https://travis-ci.org/nitrotasks/nitro.svg?branch=master)](https://travis-ci.org/nitrotasks/nitro)
[![Dependency Status](https://david-dm.org/nitrotasks/nitro.svg?theme=shields.io)](https://david-dm.org/nitrotasks/nitro)
[![devDependency Status](https://david-dm.org/nitrotasks/nitro/dev-status.svg?theme=shields.io)](https://david-dm.org/nitrotasks/nitro#info=devDependencies)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fnitrotasks%2Fnitro.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fnitrotasks%2Fnitro?ref=badge_shield)

A brand new rewrite. Check out the [Wiki](https://github.com/nitrotasks/nitro/wiki) for what's new and happening, or tweet me [@consindo](https://twitter.com/consindo).

## Build Instructions
- You will need node.js & npm installed.
- Then run `npm install`

## Development (without server)
- Use `npm run test:fast` to run tests only, without building and coverage.
- You can use `npm run watch`. It uses webpack-dev-server, which has nice live js & css reloading.
- Sign in with `local@nitrotasks.com`, no password.

## Development (with server)
- Go to <https://github.com/nitrotasks/nitro-server> to download and use the server.
- If you're developing the client too, the webpack-dev-server will proxy API requests to `localhost:8040/a` - you can change this in `webpack.config.js`.

## Production
- This is published as a npm package, prebuilt with the API route as /a.
- Nitro Server pulls the package from NPM, and serves the module as the app.

### Otherwise
- Use `npm run build` to create a production build.
- Serve this from nitro-server by changing the config.
- If you're the maintainer, use `npm publish` and change the wanted package in the nitro-server `package.json`.

## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fnitrotasks%2Fnitro.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fnitrotasks%2Fnitro?ref=badge_large)