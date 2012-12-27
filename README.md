# Nitro 2 #

## Installation ##

Nitro 2 is written in [CoffeeScript](http://coffeescript.org/) and uses the [SpineJS](http://spinejs.com/) framework.

Spine uses the [Hem dependency management tool](https://github.com/maccman/hem). You'll need it to build and run Nitro 2.

### Install Hem and dependencies ###

```
npm install -g hem
git clone <repo> nitro
cd nitro
npm install .
```

### Start Hem Server ###

```
hem server
```

You should be open up [http://localhost:9294](http://localhost:9294) and be using Nitro 2.

### Build Nitro ###

```
hem build
```

This will compile and minify the app into the public folder.
