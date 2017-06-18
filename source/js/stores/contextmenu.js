import Events from '../models/events.js'

class ContextMenuStore extends Events {
  constructor(props) {
    super(props)
  }
  create(x, y, anchor, secondAnchor, items) {
    this.trigger('create', [x, y, anchor, secondAnchor, items])
  }
}
let contextMenuStore = new ContextMenuStore()
export default contextMenuStore
