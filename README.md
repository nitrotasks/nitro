# Nitro 2.1 #

## Installation ##

Nitro is written in [CoffeeScript](http://coffeescript.org/) and uses the [Base](http://github.com/stayradiated/base) framework.

### Installing ###

    git clone https://github.com/stayradiated/Nitro.git
    cd Nitro
    npm install

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

    # Minify application.js
    cake minify