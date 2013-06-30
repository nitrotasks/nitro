{spawn, exec} = require 'child_process'
http = require 'http'
fs = require 'fs'

option '-p', '--port [port]', 'Set port for cake server'
option '-w', '--watch', 'Watch the folder for changes'


task 'server', 'Start server', (options) ->

  # Set port
  port = options.port or 9294
  
  # Modules
  watchify = './node_modules/watchify/bin/cmd.js'
  browserify = './node_modules/browserify/bin/cmd.js'
  coffeeify = './node_modules/caching-coffeeify/index.js'

  # Configuration
  input = 'app/init.coffee'
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

  server.listen port

  console.log 'Server started on ' + port


task 'build', 'Start server', (options) ->
  
  # Modules
  watchify = './node_modules/watchify/bin/cmd.js'
  browserify = './node_modules/browserify/bin/cmd.js'
  coffeeify = './node_modules/caching-coffeeify/index.js'

  # Configuration
  input = 'app/init.coffee'
  output = 'public/application.js'
  
  # Arguments
  args = ['-v', '-t', coffeeify, input, '-o', output]
  
  # Build or Watch
  if options.watch
    cmd = watchify
  else
    cmd = browserify
  
  # Start browserify
  terminal = spawn(cmd, args)
  terminal.stdout.on 'data', (data) -> console.log(data.toString())
  terminal.stderr.on 'data', (data) -> console.log(data.toString())
  terminal.on 'error', (data) -> console.log(data.toString())
  terminal.on 'close', (data) -> console.log(data.toString())


task 'minify', 'Minify application.js', ->

  uglify = './node_modules/uglify-js/bin/uglifyjs'

  # Config
  input = './application/application.js'
  output = './application.min.js'

  command = "#{ uglify } #{ input } -c -m -o #{ output }"

  exec command, (err, stdout, stderr) ->
    throw err if err
    console.log stdout + stderr
