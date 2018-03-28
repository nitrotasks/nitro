import { Events }  from '../../../nitro.sdk'

class ContextMenuStore extends Events {
  constructor(props) {
    super(props)
  }
  create(x, y, anchor, secondAnchor, items) {
    this.trigger('create', [Math.round(x), Math.round(y), anchor, secondAnchor, items])
  }
}
let contextMenuStore = new ContextMenuStore()
export default contextMenuStore
