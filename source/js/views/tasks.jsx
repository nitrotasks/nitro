import preact from 'preact'
import { route } from 'preact-router'

import { ListsCollection } from '../models/lists.js'
import { TasksCollection } from '../models/tasks.js'

export default class Tasks extends preact.Component {
  constructor(props) {
    super(props)
    this.state = {
      inputValue: '',
      taskList: []
    }
    this.tasksUpdate = this.tasksUpdate.bind(this)
    this.triggerChange = this.triggerChange.bind(this)
    this.triggerKeyUp = this.triggerKeyUp.bind(this)
  }
  componentWillMount() {
    TasksCollection.bind('update', this.tasksUpdate)
    this.setState({
      taskList: TasksCollection.getList(this.props.list)
    })
  }
  componentWillUnmount() {
    TasksCollection.unbind('update', this.tasksUpdate)
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      taskList: TasksCollection.getList(nextProps.list)
    })
  }
  tasksUpdate(listId) {
    if (listId === this.props.list) {
      this.setState({
        taskList: TasksCollection.getList(this.props.list)
      })
    }
  }
  triggerBack() {
    route('/')
  }
  triggerChange(e) {
    this.setState({
      inputValue: e.currentTarget.value,
      tasks: []
    })
  }
  triggerKeyUp(e) {
    let taskName = e.currentTarget.value
    if (e.keyCode === 13 && taskName !== '') {
      this.setState({
        inputValue: ''
      })

      TasksCollection.add({
        name: taskName,
        list: this.props.list
      })
    }
  }
  render() {
    let list = ListsCollection.find(this.props.list)
    let creatorClass = 'tasks-creator'
    if (this.props.list === 'all') {
      creatorClass += ' hidden'
    }
    return (
      <div class="tasks-pane">
        <header class="material-header">
          <div class="back" onClick={this.triggerBack}>
            <img src="/img/icons/back.svg" />
          </div>
          <h1>{list.name}</h1>
        </header>
        <div class="tasks-content">
          <input type="text"
            placeholder="Add a task..."
            class={creatorClass}
            value={this.state.inputValue}
            onChange={this.triggerChange}
            onKeyUp={this.triggerKeyUp}
          />
          <ul className="tasks-list">
            {this.state.taskList.map(function(task) {
              return <li>{task.name}</li>
            })}
          </ul>
        </div>
      </div>
    )
  }
}