List = require '../controllers/lists'
Base = require 'base'

class Search extends Base.View

  events:
    'keyup': 'search'

  constructor: ->
    super
    @originalList = null

  search: =>

    if List.current.id isnt 'filter'
      @originalList = List.current

    query = @el.val()

    if query.length is 0
      @clearSearch()

    else
      List.open
        name: "Results for #{ query }"
        id: 'filter'
        tasks: Task.search query
        disabled: yes
        permanent: yes

  clearSearch: =>
    List.open @originalList

module.exports = Search
