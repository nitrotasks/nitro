import preact from 'preact'

import { TasksCollection } from '../models/tasksCollection.js'

export default class Task extends preact.Component {
  render() {
    let data = this.props.data
    return (
      <li class="task-item" onClick={this.props.onClick}>
        <div class="check">
          <div class="box" />
        </div>
        <div class="label">{data.name}</div> 
      </li>
    )
  }
}