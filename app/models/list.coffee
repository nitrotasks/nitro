Spine = require('spine')

class List extends Spine.Model
  @configure 'List', 'name'
  @extend @Local
  @current: undefined
  @sort: yes

  @toggleSort: ->
    @sort = !@sort
    @trigger "changeSort", @current

module.exports = List
