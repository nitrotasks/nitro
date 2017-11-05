import preact from 'preact'
import { route } from 'preact-router'

import { ListsCollection } from '../models/listsCollection.js'
import { TasksCollection } from '../models/tasksCollection.js'
import { CombinedCollection } from '../models/combinedCollection.js'

import Header from './tasksheader.jsx'
import Sortable from './sortable.jsx'

const defaultList = 'inbox'

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
    this.state.inputValue = ''
    this.state.showCreator = null
    this.theme = document.getElementById('theme')
  }
  resizeCb = -1
  componentWillMount() {
    TasksCollection.bind('update', this.tasksUpdate)
    ListsCollection.bind('update', this.listsUpdate)
    ListsCollection.bind('order', this.orderUpdate)
    this.setState({
      taskList: TasksCollection.findList(this.props.list || defaultList)
    })
  }
  componentDidMount() {
    // TODO: Polyfill this for Edge, Safari & Older Browsers
    this.passiveScroll = document.getElementById('passive-scroll')
    this.passiveScrollWrapper = document.getElementById('passive-scroll-wrapper')
    this.passiveScrollWrapper.addEventListener('scroll', this.triggerScroll, OPTS)
    this.passiveScrollWrapper.addEventListener(
      'scroll',
      this.triggerStickyScroll,
      OPTS
    )
    window.addEventListener('resize', this.windowResize)
    this.lastHeight = document.documentElement.clientHeight
  }
  componentWillUnmount() {
    TasksCollection.unbind('update', this.tasksUpdate)
    ListsCollection.unbind('update', this.listsUpdate)
    ListsCollection.unbind('order', this.orderUpdate)
    this.passiveScrollWrapper.removeEventListener('scroll', this.triggerScroll, OPTS)
    this.passiveScrollWrapper.removeEventListener(
      'scroll',
      this.triggerStickyScroll,
      OPTS
    )
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

    setTimeout(() => {
      // this.sizeInput()

      // called on new list on desktop
      if (window.location.hash === '#rename') {
        // rewrites the hash away
        route('/lists/' + nextProps.list, true)
        this.realInput.select()
      }
    }, 5)

  }
  installProps(nextProps, firstRun = false) {
    let newProps = {
      selectedTask: null
    }
    if (nextProps.task) {
      newProps.selectedTask = nextProps.task
      newProps.taskDisposing = true
    }
    if (firstRun) {
      newProps.hideHeader = true
      newProps.stickyScale = false
    }

    if (document.documentElement.clientWidth >= 700) {
      if (!nextProps.list) {
        nextProps.list = defaultList
      }
    }
    if (nextProps.list) {
      const tasks = CombinedCollection.getTasks(nextProps.list)
      if (this.props.list !== nextProps.list) {
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
        this.listsUpdate()
        this.tasksUpdate()
      }
    }
    clearTimeout(this.resizeCb)
    this.resizeCb = setTimeout(this.sizeInput, 50)

    // very specific to android. probably won't work on iOS.
    if (this.lastHeight < document.documentElement.clientHeight && this.state.showCreator === true) {
      this.setState({
        showCreator: false
      })
    }

    this.lastHeight = document.documentElement.clientHeight
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
      header: ListsCollection.escape(list.name),
      order: list.localOrder
    })
  }
  orderUpdate = () => {
    let list = ListsCollection.find(this.state.list) || {}
    this.setState({
      order: list.localOrder
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

    let headerClass = 'material-header'
    if (this.state.hideHeader) {
      headerClass += ' hide-header'
    }
    return (
      <div
        class={className}
        id="passive-scroll-wrapper"
        onClick={this.closeTasks}
      >
        <div class="tasks-content" id="passive-scroll">
          <div class="tasks-scrollwrap">
            <header class={headerClass}>
              <button class="header-child header-left" onClick={this.triggerBack}>
                <img src="/img/icons/back.svg" alt="Back Icon" title="Back" />
              </button>
              <h1 class="header-child">{this.state.header}</h1>
            </header>
            <div class="tasks-sticky-helper" />
            <Header stickyScale={this.state.stickyScale} list={this.state.list} />
            <Sortable 
              task={this.props.task}
              taskList={this.state.taskList}
              list={this.props.list}
              listOrder={this.state.order}
              triggerTask={this.triggerTask}
            />
          </div>
        </div>
      </div>
    )
  }
}
