
{spawn} = require 'child_process'
http = require 'http'
fs = require 'fs'

task 'server', 'Start server', ->
  
  # Modules
  watchify = './node_modules/watchify/bin/cmd.js'
  browserify = './node_modules/browserify/bin/cmd.js'
  coffeeify = './node_modules/caching-coffeeify/index.js'

  # Configuration
  input = 'public/init.js'
  output = 'public/application.js'

  args = ['-v', '-t', coffeeify, input, '-o', output]
  
  # Start browserify
  terminal = spawn(watchify, args)
  terminal.stdout.on 'data', (data) -> console.log(data.toString())
  terminal.stderr.on 'data', (data) -> console.log(data.toString())
  terminal.on 'error', (data) -> console.log(data.toString())
  terminal.on 'close', (data) -> console.log(data.toString())
  
  # Run http server on localhost:9294
  server = http.createServer (req, res) ->

    # Load index.html by default
    if req.url is '/' then req.url = '/index.html'

    # Return file
    fs.readFile __dirname + '/public' + req.url, (err, data) ->
      if err?
        res.writeHead 404
        res.end JSON.stringify err
        return
      res.writeHead 200
      res.end data

  server.listen 9294

