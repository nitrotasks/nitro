import preact from 'preact'

import { TasksCollection } from '../models/tasksCollection.js'

export default class TaskEditor extends preact.Component {
  /* PROPS */
  // task: id of selected task. null hides this window
  // back: fn that can be called to hide the editor
  constructor(props) {
    super(props)

    this.state = this.buildState(props)
  }
  componentWillReceiveProps(nextProps) {
    this.setState(this.buildState(nextProps))
  }
  buildState(props) {
    if (props.task !== null) {
      const task = TasksCollection.find(props.task)
      return {
        name: task.name,
        list: task.list
      }
    }
    return {}
  }
  render() {
    let className = 'task-editor'
    if (this.props.task !== null) {
      className += ' show'
    }
    return (
      <div class={className}>
        <header class="material-header">
          <div class="back" onClick={this.props.back}>
            <img src="/img/icons/back.svg" />
          </div>
          <h1>{this.state.name}</h1>
        </header>
        this is the editor for the tasks. this task belongs in {this.state.list}
      </div>
    )
  }
}