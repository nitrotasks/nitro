import preact from 'preact'
import { route } from 'preact-router'

import { ListsCollection } from '../models/listsCollection.js'
import { TasksCollection } from '../models/tasksCollection.js'
import { CombinedCollection } from '../models/combinedCollection.js'

import Task from './task.jsx'

const defaultList = 'inbox'
const defaultHeader = 'Inbox'

let supportsPassive = false
try {
  let opts = Object.defineProperty({}, 'passive', {
    get: function() {
      supportsPassive = true
    }
  })
  window.addEventListener('test', null, opts)
} catch (e) {}
const OPTS = supportsPassive ? { passive: true } : false

export default class Tasks extends preact.Component {
  constructor(props) {
    super(props)
    this.state = this.installProps(props, true)
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
    this.passiveScrollWrapper = document.getElementById(
      'passive-scroll-wrapper'
    )
    this.passiveScroll.addEventListener('scroll', this.triggerScroll, OPTS)
    this.passiveScrollWrapper.addEventListener(
      'scroll',
      this.triggerStickyScroll,
      OPTS
    )
    window.addEventListener('resize', this.windowResize)
  }
  componentWillUnmount() {
    TasksCollection.unbind('update', this.tasksUpdate)
    ListsCollection.unbind('update', this.listsUpdate)
    this.passiveScroll.removeEventListener('scroll', this.triggerScroll, OPTS)
    this.passiveScrollWrapper.removeEventListener(
      'scroll',
      this.triggerStickyScroll,
      OPTS
    )
    window.removeEventListener('resize', this.windowResize)
  }
  componentWillReceiveProps(nextProps) {
    this.setState(this.installProps(nextProps))
  }
  installProps(nextProps, firstRun = false) {
    let newProps = {
      selectedTask: null
    }
    if (nextProps.task) {
      newProps.selectedTask = nextProps.task
    }
    if (firstRun) {
      newProps.hideHeader = true
      newProps.stickyScale = false

      if (!nextProps.list) {
        nextProps.list = defaultList
      }
    }
    if (nextProps.list) {
      if (this.props.list !== nextProps.list) {
        newProps.taskList = TasksCollection.findList(nextProps.list)
      }
      const list = ListsCollection.find(nextProps.list) || {}
      newProps.disposing = false
      newProps.list = nextProps.list
      newProps.header = list.name || 'inbox'
      newProps.headerIcon = false
      newProps.taskNotes = null
      if (['inbox', 'today', 'next', 'all'].indexOf(nextProps.list) > -1) {
        newProps.headerIcon = nextProps.list
        newProps.taskNotes = false
      }
    } else {
      newProps.disposing = true
    }
    return newProps
  }
  // allows desktop to reset to default list when resized
  windowResize = () => {
    // wish css & js variables could cross over sometimes
    if (
      document.documentElement.clientWidth >= 700 &&
      typeof this.props.list === 'undefined'
    ) {
      if (this.state.header !== defaultHeader) {
        this.listsUpdate()
        this.tasksUpdate()
      }
    }
  }
  tasksUpdate = listId => {
    if (listId === this.state.list) {
      this.setState({
        taskList: TasksCollection.findList(this.state.list)
      })
    }
  }
  listsUpdate = () => {
    let list = ListsCollection.find(this.state.list) || {}
    this.setState({
      header: list.name
    })
  }
  triggerBack = () => {
    // todo, hook it to the history
    if (window.innerWidth < 700) {
      route('/')  
    } else {
      route('/lists/inbox')
    }
  }
  triggerKeyUp = e => {
    let taskName = e.currentTarget.value
    if (e.keyCode === 13 && taskName !== '') {
      this.setState({
        inputValue: ''
      })
      e.currentTarget.blur()

      TasksCollection.add({
        name: taskName,
        list: this.state.list
      })
    }
  }
  triggerScroll = e => {
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
  triggerStickyScroll = e => {
    const magicNumber = 16 * 3
    let scrollPos = e.currentTarget.scrollTop
    if (scrollPos <= magicNumber - 5 && this.state.stickyScale === true) {
      this.setState({
        stickyScale: false
      })
    } else if (
      scrollPos > magicNumber + 5 &&
      this.state.stickyScale === false
    ) {
      this.setState({
        stickyScale: true
      })
    }
  }
  triggerListKeyUp = e => {
    if (e.keyCode === 27) { // ESC
      e.currentTarget.value = this.state.header
      e.currentTarget.blur()
    } else if (e.keyCode === 13) { // ENTER
      e.currentTarget.blur()
    }
  }
  triggerListChange = e => {
    const value = e.currentTarget.value
    // resets the header
    if (value === '') {
      this.setState({
        header: this.state.header
      })
    } else {
      this.setState({
        header: value
      })
      ListsCollection.update(this.state.list, {
        name: value
      })
    }
  }
  triggerTask = task => {
    return () => {
      if (!task) {
        route('/lists/' + this.state.list)
      } else if (typeof this.props.task !== 'undefined') {
        window.history.back()
      } else {
        route('/lists/' + this.state.list + '/' + task.id)
      }
    }
  }
  closeTasks = e => {
    if (e.target === e.currentTarget || e.target.className === 'tasks-list') {
      if (window.location.pathname.split('/').length === 4) {
        window.history.back()
      }
    }
  }
  deleteList = () => {
    const toDelete = this.state.list
    this.triggerBack()
    requestAnimationFrame(() => {
      CombinedCollection.deleteList(toDelete)
    })
  }
  render() {
    let creatorClass = 'tasks-creator'
    // todo: FIX THIS ON BACK
    if (this.state.list === 'all') {
      creatorClass += ' hidden'
    }
    let headerClass = 'material-header'
    if (this.state.hideHeader) {
      headerClass += ' hide-header'
    }
    let stickyScale = 'tasks-sticky-container'
    if (this.state.stickyScale) {
      stickyScale += ' scale-header'
    }
    let className = 'tasks-pane'
    if (this.state.disposing === true) {
      className += ' hide'
    }
    if (this.props.task) {
      className += ' selected-task'
    }

    let taskNotes = null
    if (this.state.taskNotes) {
      taskNotes = (
        <p class="tasks-notes">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
          eiusmod
          tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
          veniam,
          quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
          commodo
          consequat. Duis aute irure dolor in reprehenderit in voluptate velit
          esse
          cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
          cupidatat non
          proident, sunt in culpa qui officia deserunt mollit anim id est
          laborum.
        </p>
      )
    }

    // TODO: add emoji support
    let listIcon = null
    if (this.state.headerIcon) {
      listIcon = (
        <img src={'/img/icons/feather/' + this.state.headerIcon + '.svg'} />
      )
    }
    return (
      <div
        class={className}
        id="passive-scroll-wrapper"
        onClick={this.closeTasks}
      >
        <header class={headerClass}>
          <div class="back" onClick={this.triggerBack}>
            <img src="/img/icons/back.svg" />
          </div>
          <h1>{this.state.header}</h1>
        </header>
        <div class="tasks-content" id="passive-scroll">
          <div class="tasks-scrollwrap">
            <div class={stickyScale}>
              <div class="tasks-fancy-header">
                <h1>
                  {listIcon}
                  <input 
                    value={this.state.header}
                    onChange={this.triggerListChange}
                    onKeyUp={this.triggerListKeyUp}
                    // disabled={true}
                  />
                </h1>
              </div>
              <div class="tasks-creator-background">
                <input
                  type="text"
                  placeholder="Add a task..."
                  class={creatorClass}
                  value={this.state.inputValue}
                  onKeyUp={this.triggerKeyUp}
                />
              </div>
            </div>
            {taskNotes}
            <ul className="tasks-list">
              {this.state.taskList.map(task => {
                return (
                  <Task
                    key={task.id}
                    data={task}
                    selectedTask={this.props.task}
                    onClick={this.triggerTask(task)}
                  />
                )
              })}
            </ul>
            <button onClick={this.deleteList}>Delete List</button>
          </div>
        </div>
      </div>
    )
  }
}
