
Tab = require '../settings_tab'

about = new Tab

  id: 'about'

  selector: '.about'

  events:
    'mouseover .quote': 'play'

  methods: []

  load: ->

  play: ->
    audio = $('audio')[0]
    if audio.paused
      audio.load() # currentTime doesn't work for whatever reason
      audio.play()

module.exports = about
