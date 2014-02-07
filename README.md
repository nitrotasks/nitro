# Nitro 2.1 #

[![Build Status](https://travis-ci.org/CaffeinatedCode/nitro.png?branch=master)](https://travis-ci.org/CaffeinatedCode/nitro)
[![Dependency Status](https://david-dm.org/CaffeinatedCode/nitro.png?theme=shields.io)](https://david-dm.org/CaffeinatedCode/nitro)
[![devDependency Status](https://david-dm.org/CaffeinatedCode/nitro/dev-status.png?theme=shields.io)](https://david-dm.org/CaffeinatedCode/nitro#info=devDependencies)

## Installation ##

Nitro is written in [CoffeeScript](http://coffeescript.org/) and currently uses the [Base](http://github.com/stayradiated/base) framework (based on Backbone).

### Installing ###

    # Clone repo
    git clone https://github.com/CaffeinatedCode/nitro.git

    # Open folder
    cd nitro

    # Install dependencies
    npm install

    # Start server
    cake server

    # Now browse to http://localhost:9294

### Local Development Server ###

    # Compile and serve on port 9294
    cake server

    # Compile, watch and serve on port 9294
    cake -w server

    # Compile, watch and serve on port 8080
    cake -w -p 8080 server

You should now open up [http://localhost:9294](http://localhost:9294) and be using Nitro 2.
If you use the `-w` parameter, then any changes you make to the `*.coffee` or `*.sass` files will automatically be
compiled.

### Build Nitro ###

Use these commands to compile and minify the app into the public folder.

    # Build once
    cake build

    # Build and watch
    cake -w build

    # Optional: minify application.js
    cake minify

### Stylesheets ###

To generate `app/css/style.css` you will need to install the [Sass
compiler](http://sass-lang.com/). If you have ruby installed you can use `gem install sass`.

    # Compile sass once
    npm run-script sass

    # Compile sass and watch folder for changes
    # Press Ctrl-C to exit Sass
    npm run-script sass-watch

### Translating Nitro ###

To make or edit a language translation.

    # Go to the languages folder
    cd source/scripts/languages/source

    # Copy the default language into a new file
    cp default.json es-ES.json

    # When editing the the language, keep the original on the left, and your translation on the right
    # 'Lists': 'Listas'

