import preact from 'preact'
import { route } from 'preact-router'

import { ListsCollection } from '../models/lists.js'
import { TasksCollection } from '../models/tasks.js'

export default class Tasks extends preact.Component {
  triggerBack() {
    route('/')
  }
  render() {
    let list = ListsCollection.find(this.props.list)
    return (
      <div className="tasks-pane">
        <header class="material-header">
          <div class="back" onClick={this.triggerBack}>Back</div>
          <h1>{list.name}</h1>
        </header>
        <div className="tasks-content">
          Tasks in Here.
        </div>
      </div>
    )
  }
}