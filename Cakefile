# sass    = require 'node-sass'
watch   = require 'node-watch'
Scrunch = require 'coffee-scrunch'
uglify  = require 'uglify-js'
server  = require 'node-static'
http    = require 'http'
fs      = require 'fs'

# Configuration
config =
  port: 9294
  public: 'app'
  js:
    folder: 'source/'
    input:  'source/scripts/init.coffee'
    output: 'app/js/app.js'
    min:    'app/js/app.js'
  css:
    folder: 'source/stylesheets'
    input:  'source/stylesheets/screen.scss'
    output: 'app/css/screen.css'

# Options
option '-p', '--port [port]', 'Set port for cake server'
option '-w', '--watch', 'Watch the folder for changes'

compile =

  watch_coffee: ->
    watch config.js.folder, ->
      date = new Date()
      h = date.getHours()
      m = date.getMinutes()
      s = date.getSeconds()
      console.log("#{h}:#{m}:#{s} - compiling")
      compile.coffee()

  coffee: (options={}) ->

    if options.watch
      return compile.watch_coffee()

    Scrunch(config.js).end()

  sass: (options={}) ->

    if options.watch
      compile.sass()
      watch config.css.folder, recursive: yes, ->
        compile.sass()
      return

    sass.render
      file: config.css.input
      success: (css) ->
        fs.writeFile config.css.output, css
        console.log '[SCSS] Done'
      error: ->
        console.log '[SCSS] [ERROR]', arguments

  minify: ->
    js = uglify.minify(config.js.output).code
    fs.writeFile config.js.min, js

  language: ->

    path = 'source/scripts/languages/'
    coffeeFile = 'languages.coffee'
    mainFile = 'default.json'
    main = null
    source = {}
    compiled = {}
    coffee = 'module.exports =\n'

    files = fs.readdirSync path + 'source'

    for file in files
      language = require './' + path + 'source/' + file
      if file is mainFile
        main = language
        compiled[mainFile] = []
      else
        source[file] = language
        compiled[file] = {}
      coffee += "  '#{ file[0..-6] }': require './compiled/#{ file }'\n"

    for text of main
      index = compiled[mainFile].push(text) - 1
      for file, language of source
        compiled[file][index] = language[text]

    for file, contents of compiled
      fs.writeFileSync path + 'compiled/' + file, JSON.stringify(contents, null, 2)

    fs.writeFileSync path + coffeeFile, coffee

# Tasks
task 'server', 'Start server', (options) ->

  # Compile files
  compile.language(options)
  compile.coffee(options)
  # compile.sass(options)

  # Start Server
  port = options.port or config.port
  file= new(server.Server)(config.public)
  server = http.createServer (req, res) ->
    req.addListener( 'end', ->
      file.serve(req, res)
    ).resume()
  server.listen(port)

  console.log 'Server started on ' + port

task 'build', 'Compile CoffeeScript and SASS', (options) ->
  compile.language(options)
  compile.coffee(options)

task 'minify', 'Minify application.js', compile.minify

task 'language', 'Compile language files', compile.language

