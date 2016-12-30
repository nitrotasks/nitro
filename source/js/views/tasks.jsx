import preact from 'preact'
import { TasksCollection } from '../models/tasks.js'

export default class Tasks extends preact.Component {
  render() {
    return (
      <div>
        Tasks Component. List Id: {this.props.list}
      </div>
    )
  }
}