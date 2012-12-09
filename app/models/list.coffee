Spine = require('spine')

class List extends Spine.Model
  @configure 'List', 'name'

  @extend @Sync
  @include @Sync

  @current: null

module.exports = List
