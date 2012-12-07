Spine = require('spine')

class List extends Spine.Model
  @configure 'List', 'name'

  @extend @Local
  @extend @Sync
  @include @Sync

  @current: null

module.exports = List
