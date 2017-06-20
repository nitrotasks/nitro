import Events from '../models/events.js'

class DialogBoxStore extends Events {
  constructor(props) {
    super(props)
  }
  create(config) {
    this.trigger('create', config)
  }
}
let dialogBoxStore = new DialogBoxStore()
export default dialogBoxStore
