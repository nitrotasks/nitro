import preact from 'preact'
import { route } from 'preact-router'

import { ListsCollection } from '../models/lists.js'
import { TasksCollection } from '../models/tasks.js'

import Task from './task.jsx'
import TaskEditor from './taskeditor.jsx'

let supportsPassive = false
try {
  let opts = Object.defineProperty({}, 'passive', {
    get: function() {
      supportsPassive = true
    }
  })
  window.addEventListener("test", null, opts)
} catch (e) {}
const OPTS = supportsPassive ? { passive: true } : false

export default class Tasks extends preact.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedTask: props.task || null,
      inputValue: '',
      taskList: [],
      hideHeader: true,
      disposing: false
    }
  }
  componentWillMount() {
    TasksCollection.bind('update', this.tasksUpdate)
    this.setState({
      taskList: TasksCollection.getList(this.props.list)
    })
  }
  componentDidMount() {
    // TODO: Polyfill this for Edge, Safari & Older Browsers
    this.passiveScroll = document.getElementById('passive-scroll')
    this.passiveScroll.addEventListener('scroll', this.triggerScroll, OPTS)
  }
  componentWillUnmount() {
    TasksCollection.unbind('update', this.tasksUpdate)
    this.passiveScroll.removeEventListener('scroll', this.triggerScroll, OPTS)
  }
  componentWillReceiveProps(nextProps) {
    let newProps = {
      selectedTask: null
    }
    if (nextProps.task) {
      newProps.selectedTask = nextProps.task
    }
    if (this.props.list !== nextProps.list) {
      newProps.taskList = TasksCollection.getList(nextProps.list)
    }
    this.setState(newProps)
  }
  tasksUpdate = (listId) => {
    if (listId === this.props.list) {
      this.setState({
        taskList: TasksCollection.getList(this.props.list)
      })
    }
  }
  triggerBack = () => {
    this.setState({
      disposing: true
    })
    // waits till the thing has disappeared
    setTimeout(function() {
      requestAnimationFrame(function() {
        route('/')
      })
    }, 300)
  }
  triggerChange = (e) => {
    this.setState({
      inputValue: e.currentTarget.value,
      tasks: []
    })
  }
  triggerKeyUp = (e) => {
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
  triggerScroll = (e) => {
    let scrollPos = e.currentTarget.scrollTop
    if (scrollPos <= 48 && this.state.hideHeader === false) {
      this.setState({
        hideHeader: true
      })
    } else if (scrollPos > 48 && this.state.hideHeader === true) {
      this.setState({
        hideHeader: false
      })
    }
  }
  triggerTask = (task) => {
    return () => {
      if (!task) {
        route('/lists/' + this.props.list)
      } else {
        route(this.props.url + '/' + task.id)
      }
    }
  }
  deleteList = () => {
    this.triggerBack()
    requestAnimationFrame(() => {
      ListsCollection.delete(this.props.list)
    })
  }
  render() {
    let list = ListsCollection.find(this.props.list)
    let creatorClass = 'tasks-creator'
    if (this.props.list === 'all') {
      creatorClass += ' hidden'
    }
    let headerClass = 'material-header'
    if (this.state.hideHeader) {
      headerClass += ' hide-header'
    }
    let className = 'tasks-pane'
    if (this.state.disposing === true) {
      className += ' hide'
    }
    return (
      <div class={className}>
        <header class={headerClass}>
          <div class="back" onClick={this.triggerBack}>
            <img src="/img/icons/back.svg" />
          </div>
          <h1>{list.name}</h1>
        </header>
        <div class="tasks-content" id="passive-scroll"> 
          <div class="tasks-scrollwrap">
            <div class="tasks-fancy-header">
              <h1>{list.name}</h1>
            </div>
            <input type="text"
              placeholder="Add a task..."
              class={creatorClass}
              value={this.state.inputValue}
              onChange={this.triggerChange}
              onKeyUp={this.triggerKeyUp}
            />
            <ul className="tasks-list">
              {this.state.taskList.map((task) => {
                return <Task data={task} onClick={this.triggerTask(task)} />
              })}
            </ul>
            <button onClick={this.deleteList}>Delete List</button>
          </div>
        </div>
        <TaskEditor task={this.state.selectedTask} back={this.triggerTask(null)} />
      </div>
    )
  }
}