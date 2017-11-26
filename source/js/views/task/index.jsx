import preact from 'preact'

import { CombinedCollection } from '../../models/combinedCollection.js'
import { back } from '../../stores/navigation.js'

import Header from './header.jsx'
import Sortable from './sortable.jsx'

const defaultList = 'inbox'

export default class Tasks extends preact.Component {
  constructor(props) {
    super(props)
    this.state = this.installProps(props, true)
    this.state.innerWidth = '100%'
  }
  componentWillMount() {
    CombinedCollection.bind('update', this.update)
    CombinedCollection.bind('order', this.update)
  }
  componentDidMount() {
    window.addEventListener('resize', this.windowResize)

    const options = {
      root: document.getElementById('passive-scroll-wrapper'),
      rootMargin: '-12px',
      threshold: 0
    }
    this.observer = new IntersectionObserver(this.triggerStickyScroll, options)    
    this.observer.observe(document.getElementById('tasks-sticky-helper'))
  }
  componentWillUnmount() {
    CombinedCollection.unbind('update', this.update)
    CombinedCollection.unbind('order', this.update)
    window.removeEventListener('resize', this.windowResize)
    this.observer.disconnect()
  }
  componentWillReceiveProps(nextProps) {
    const state = this.installProps(nextProps)
    this.setState(state)

    if (!nextProps.task && state.taskDisposing === true) {
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
      newProps.list = defaultList
      newProps.stickyScale = false
      newProps.taskList = []
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
        this.setState(this.installProps(this.props, true))
      }
    }
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
  triggerStickyScroll = entries => {
    this.setState({
      stickyScale: !entries[0].isIntersecting
    })
  }
  closeTasks = e => {
    if (e.target === e.currentTarget || e.target.className === 'tasks-list') {
      if (window.location.pathname.split('/').length === 4) {
        back()
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
        <div class="tasks-content">
          <div class="tasks-scrollwrap">
            <div id="tasks-sticky-helper" class="tasks-sticky-helper" />
            <Header
              stickyScale={this.state.stickyScale}
              list={this.state.list}
            />
            <Sortable
              task={this.props.task}
              taskList={this.state.taskList}
              list={this.state.list}
              listOrder={this.state.order}
            />
          </div>
        </div>
      </div>
    )
  }
}
