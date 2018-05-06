import { Events } from '../../nitro.sdk'

class _contextMenuService extends Events {
  constructor(props) {
    super(props)
  }
  create(x, y, anchor, secondAnchor, items) {
    this.trigger('create', [
      Math.round(x),
      Math.round(y),
      anchor,
      secondAnchor,
      items
    ])
  }
}
let ContextMenuService = new _contextMenuService()
export { ContextMenuService }
