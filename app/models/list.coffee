Spine = require('spine')

class window.List extends Spine.Model
  @configure 'List', 'name'

  @extend @Sync
  @include @Sync

  @current: null

module.exports = List
