// @flow
import { Events } from '../../nitro.sdk'

class _tasksExpanded extends Events {
  constructor(props) {
    super(props)
    this.state = {
      list: null,
      task: null
    }
  }
  routeUpdate(routeProps: Object) {
    const params = routeProps.match.params
    if (typeof params.list !== 'undefined') {
      if (typeof params.task !== 'undefined') {
        this.state.list = params.list
        this.state.task = params.task
        this.trigger('show', params.list, params.task)
      } else {
        this.state.list = params.list
        this.state.task = null
        this.trigger('hide', params.list)
      }
    }
  }
}
export const TasksExpandedService = new _tasksExpanded()
