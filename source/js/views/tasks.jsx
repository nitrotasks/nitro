import preact from 'preact'
import { route } from 'preact-router'

import { ListsCollection } from '../models/listsCollection.js'
import { TasksCollection } from '../models/tasksCollection.js'
import { CombinedCollection } from '../models/combinedCollection.js'

import Task from './task.jsx'
import TaskEditor from './taskeditor.jsx'

const defaultList = 'inbox'
const defaultHeader = ListsCollection.find(defaultList).name

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
    let header = defaultHeader
    let disposing = true
    if (this.props.list) {
      header = ListsCollection.find(this.props.list).name 
      disposing = false
    }
    this.state = {
      selectedTask: props.task || null,
      header: header,
      inputValue: '',
      taskList: [],
      hideHeader: true,
      disposing: disposing
    }
    this.theme = document.getElementById('theme')
  }
  componentWillMount() {
    TasksCollection.bind('update', this.tasksUpdate)
    ListsCollection.bind('update', this.listsUpdate)
    this.setState({
      taskList: TasksCollection.findList(this.props.list || defaultList)
    })
  }
  componentDidMount() {
    // TODO: Polyfill this for Edge, Safari & Older Browsers
    this.passiveScroll = document.getElementById('passive-scroll')
    this.passiveScroll.addEventListener('scroll', this.triggerScroll, OPTS)
    window.addEventListener('resize', this.windowResize)
  }
  componentWillUnmount() {
    TasksCollection.unbind('update', this.tasksUpdate)
    ListsCollection.unbind('update', this.listsUpdate)
    this.passiveScroll.removeEventListener('scroll', this.triggerScroll, OPTS)
    window.removeEventListener('resize', this.windowResize)
  }
  componentWillReceiveProps(nextProps) {
    let newProps = {
      selectedTask: null
    }
    if (nextProps.task) {
      newProps.selectedTask = nextProps.task
    }
    if (nextProps.list) {
      if (this.props.list !== nextProps.list) {
        newProps.taskList = TasksCollection.findList(nextProps.list)
      }
      const list = ListsCollection.find(nextProps.list) || {}
      newProps.disposing = false,
      newProps.header = list.name || 'today'
    } else {
      const list = ListsCollection.find(defaultList) || {}
      newProps.disposing = true
    }
    this.setState(newProps)
  }
  // allows desktop to reset to default list when resized
  windowResize = () => {
    // wish css & js variables could cross over sometimes
    if (document.documentElement.clientWidth >= 700 && typeof(this.props.list) === 'undefined') {
      if (this.state.header !== defaultHeader) {
        this.listsUpdate()
        this.tasksUpdate()
      }
    }
  }
  tasksUpdate = (listId) => {
    if (listId === this.props.list || listId === defaultList) {
      this.setState({
        taskList: TasksCollection.findList(this.props.list || defaultList)
      })
    }
  }
  listsUpdate = () => {
    let list = ListsCollection.find(this.props.list || defaultList) || {}
    this.setState({
      header: list.name
    })
  }
  triggerBack = () => {
    // todo, hook it to the history
    route('/')
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
        list: this.props.list || defaultList
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
  changeList = () => {
    ListsCollection.update(this.props.list, {})
  }
  deleteList = () => {
    this.triggerBack()
    requestAnimationFrame(() => {
      CombinedCollection.deleteList(this.props.list)
    })
  }
  render() {
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
          <h1>{this.state.header}</h1>
        </header>
        <div class="tasks-content" id="passive-scroll"> 
          <div class="tasks-scrollwrap">
            <div class="tasks-fancy-header">
              <h1>{this.state.header}</h1>
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
            <button onClick={this.changeList}>Change List Name</button>
            <button onClick={this.deleteList}>Delete List</button>
          </div>
        </div>
        <TaskEditor task={this.state.selectedTask} back={this.triggerTask(null)} />
      </div>
    )
  }
}