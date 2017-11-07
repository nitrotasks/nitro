import preact from 'preact'

import { CombinedCollection } from '../../models/combinedCollection.js'
import { go, back } from '../../stores/navigation.js'

import Header from './header.jsx'
import Sortable from './sortable.jsx'

const defaultList = 'inbox'
const magicNumber = 16 * 3

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
    this.state.innerWidth = '100%'
  }
  resizeCb = -1
  componentWillMount() {
    CombinedCollection.bind('update', this.update)
    CombinedCollection.bind('order', this.update)
  }
  componentDidMount() {
    const scrollArgs = ['scroll', this.triggerStickyScroll, OPTS]
    this.passiveScroll = document.getElementById('passive-scroll')
    this.passiveScrollWrapper = document.getElementById(
      'passive-scroll-wrapper'
    )
    this.passiveScroll.addEventListener(...scrollArgs)
    this.passiveScrollWrapper.addEventListener(...scrollArgs)
    window.addEventListener('resize', this.windowResize)
  }
  componentWillUnmount() {
    CombinedCollection.unbind('update', this.update)
    CombinedCollection.unbind('order', this.update)

    const scrollArgs = ['scroll', this.triggerStickyScroll, OPTS]
    this.passiveScroll.removeEventListener(...scrollArgs)
    this.passiveScrollWrapper.removeEventListener(...scrollArgs)
    window.removeEventListener('resize', this.windowResize)
  }
  componentWillReceiveProps(nextProps) {
    this.setState(this.installProps(nextProps))

    if (!nextProps.task) {
      setTimeout(() => {
        this.setState({
          taskDisposing: false
        })
      }, 300)
    }
  }
  installProps(nextProps, firstRun = false) {
    let newProps = {
      selectedTask: null,
    }
    if (nextProps.task) {
      newProps.selectedTask = nextProps.task
      newProps.taskDisposing = true
    }
    if (firstRun) {
      newProps.stickyScale = false
    }

    if (document.documentElement.clientWidth >= 700) {
      if (!nextProps.list) {
        nextProps.list = defaultList
      }
    }
    if (nextProps.list) {
      const tasks = CombinedCollection.getTasks(nextProps.list)
      if (this.props.list !== nextProps.list || firstRun) {
        newProps.taskList = tasks.tasks
      }
      newProps.disposing = false
      newProps.list = nextProps.list
      newProps.order = tasks.order
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
      if (this.state.list !== defaultList) {
        this.update('lists')
      }
    }
    clearTimeout(this.resizeCb)
    this.resizeCb = setTimeout(this.sizeInput, 50)
  }
  update = (key, value) => {
    if (key !== 'task' || value === this.state.list) {
      const tasks = CombinedCollection.getTasks(this.state.list)
      this.setState({
        taskList: tasks.tasks,
        order: tasks.order
      })
    }
  }
  triggerStickyScroll = e => {
    const scrollPos = e.currentTarget.scrollTop
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
  triggerTask = task => {
    return () => {
      console.log('task triggered', task, this.state.list, this.props.task)
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
  render() {
    let className = 'tasks-pane'
    if (this.state.disposing === true) {
      className += ' hide'
    }
    if (this.props.task) {
      className += ' selected-task'
    } else if (this.state.taskDisposing) {
      className += ' selected-task-hide'
    }
    return (
      <div
        class={className}
        id="passive-scroll-wrapper"
        onClick={this.closeTasks}
      >
        <div class="tasks-content" id="passive-scroll">
          <div class="tasks-scrollwrap">
            <div class="tasks-sticky-helper" />
            <Header
              stickyScale={this.state.stickyScale}
              list={this.state.list}
            />
            <Sortable
              task={this.props.task}
              taskList={this.state.taskList}
              list={this.props.list}
              listOrder={this.state.order}
            />
          </div>
        </div>
      </div>
    )
  }
}
