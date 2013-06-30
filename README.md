# Nitro 2 #

## Installation ##

Nitro 2 is written in [CoffeeScript](http://coffeescript.org/) and uses the [SpineJS](http://spinejs.com/) framework.

### Installing ###

    git clone https://github.com/stayradiated/Nitro.git
    cd Nitro
    npm install .

### Local Development Server ###

    cake server

You should be open up [http://localhost:9294](http://localhost:9294) and be using Nitro 2.

### Build Nitro ###
    
    # Build once
    cake build
    
    # Build and watch
    cake -w build

This will compile and minify the app into the public folder.
