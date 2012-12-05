Spine = require('spine')

class List extends Spine.Model
  @configure 'List', 'name'
  @extend @Local
  @current: undefined

module.exports = List
