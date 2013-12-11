translate = require '../utils/translate'
event = require '../utils/event'

template = {}

event.on 'load:language', ->

  template.special  = translate 'No tasks could be found.'
  template.standard = translate 'You haven\'t added any tasks to this list.'
  template.empty    = translate 'There are no tasks in here.'

  template.search   = translate 'What are you looking for?'
  template.addTask  = translate 'What do you need to do?'

module.exports = template
