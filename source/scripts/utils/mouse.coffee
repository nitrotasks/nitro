Mouse = require 'mouse'

initMouse = ->

  mouse = new Mouse
    parent: $('.tasks')[0]
    query: '.task'
    offsetY: -37
    offsetX: 0
    helper: (elements) ->
      if elements.length is 1
        return elements[0].querySelector('.name').innerText
      return "Moving #{ elements.length } tasks"

  mouse.on 'drop', (elements, zone) ->
    list = zone.list
    for el in elements
      el.task.list().moveTask(el.task, list)

  mouse.init()

  module.exports.mouse = mouse

  return mouse

module.exports = {
  init: initMouse
}