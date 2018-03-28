import { Events }  from '../../../nitro.sdk'

class TaskExpandedStore extends Events {
  constructor(props) {
    super(props)
  }
  create(task, position) {
    this.trigger('create', [task, position])
  }
}
export const taskExpandedStore = new TaskExpandedStore()
