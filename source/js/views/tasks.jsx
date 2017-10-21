import preact from 'preact'
import { route } from 'preact-router'

import { ListsCollection } from '../models/listsCollection.js'
import { TasksCollection } from '../models/tasksCollection.js'
import { CombinedCollection } from '../models/combinedCollection.js'

import ContextMenuStore from '../stores/contextmenu.js'
import DialogBoxStore from '../stores/dialogbox.js'

import Sortable from './sortable.jsx'

const defaultList = 'inbox'
const defaultHeader = 'Inbox'
const widthOffset = 3

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
    this.passiveScrollWrapper = document.getElementById(
      'passive-scroll-wrapper'
    )
    this.passiveScrollWrapper.addEventListener('scroll', this.triggerScroll, OPTS)
    this.passiveScrollWrapper.addEventListener(
      'scroll',
      this.triggerStickyScroll,
      OPTS
    )
    window.addEventListener('resize', this.windowResize)
    this.lastHeight = document.documentElement.clientHeight

    // delay so it has time to render
    setTimeout(this.sizeInput, 200)
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
      this.sizeInput()

      // called on new list on desktop
      if (window.location.hash === '#rename') {
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
      if (this.props.list !== nextProps.list) {
        newProps.taskList = TasksCollection.findList(nextProps.list)
      }
      const list = ListsCollection.find(nextProps.list) || {}
      newProps.disposing = false
      newProps.list = nextProps.list
      newProps.header = list.name || 'inbox'
      newProps.headerIcon = false
      newProps.order = list.localOrder
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
      header: list.name,
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
  triggerInput = e => {
    this.setState({
      inputValue: e.currentTarget.value
    })
  }
  triggerKeyUp = e => {
    if (e.keyCode === 13) {
      this.createTask()
    }
  }
  createTask = () => {
    if (this.state.inputValue.trim() !== '') {
      CombinedCollection.addTask({
        name: this.state.inputValue.trim(),
        list: this.state.list
      })
      this.setState({
        inputValue: ''
      })
    }
  }
  triggerCreateHide = () => {
    this.setState({
      showCreator: false
    })
    this.createTask()
  }
  triggerCreate = () => {
    this.setState({
      showCreator: true
    })
    setTimeout(() => {
      this.taskInput.focus()
    }, 250)
  }
  hideCreate = () => {
    if (this.state.showCreator === true) {
      setTimeout(() => {
        this.setState({
          showCreator: false
        })
      }, 100)
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
    if (e.keyCode === 27) {
      // ESC
      e.currentTarget.value = this.state.header
      e.currentTarget.blur()
    } else if (e.keyCode === 13) {
      // ENTER
      e.currentTarget.blur()
    }
  }
  triggerListKeyPress = e => {
    const value = e.currentTarget.value
    this.fakeInput.textContent = value + String.fromCharCode(e.which)
    const newWidth = this.fakeInput.offsetWidth
    this.realInput.style.width = newWidth + widthOffset + 'px'
  }
  sizeInput = () => {
    const newWidth = this.fakeInput.offsetWidth + widthOffset
    this.setState({
      innerWidth: newWidth + 'px'
    })
  }
  triggerListChange = e => {
    const value = e.currentTarget.value.trim()
    this.fakeInput.textContent = value
    // resets the header
    if (value === '') {
      this.setState({
        header: this.state.header,
        innerWidth: this.fakeInput.offsetWidth + widthOffset + 'px'
      })
    } else {
      this.setState({
        header: value,
        innerWidth: this.fakeInput.offsetWidth + widthOffset + 'px'
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
  triggerMenu = e => {
    const rect = e.currentTarget.getBoundingClientRect()
    ContextMenuStore.create(
      rect.left,
      rect.top,
      'top',
      'left',
      [
        {title: 'Rename List', action: this.renameList},
        {title: 'Delete List', action: this.deleteList},
      ]
    )
  }
  closeTasks = e => {
    if (e.target === e.currentTarget || e.target.className === 'tasks-list') {
      if (window.location.pathname.split('/').length === 4) {
        window.history.back()
      }
    }
  }
  renameList = () => {
    this.realInput.select()
  }
  deleteList = () => {
    const toDelete = this.state.list
    const name = this.state.header

    const cb = () => {
      route('/', true)
      requestAnimationFrame(() => {
        CombinedCollection.deleteList(toDelete)
      })
    }

    DialogBoxStore.create({
      header: 'Delete List',
      content: <span>Your list <strong>{name}</strong> and associated tasks will be deleted forever.</span>,
      confirm: 'Delete List',
      cancel: 'Keep List',
      context: 'danger',
      callback: cb
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
    } else if (this.state.taskDisposing) {
      className += ' selected-task-hide'
    }

    let taskNotes = null
    if (this.state.taskNotes) {
      taskNotes = (
        <p class="tasks-notes">
          What even are notes???
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
        <img class="icon" src={'/img/icons/feather/' + this.state.headerIcon + '.svg'} alt="" />
      )
    }
    let moreBtn = null
    if (this.state.innerWidth !== '100%') {
      moreBtn = <button class="list-context" onClick={this.triggerMenu} alt="List Options" title="List Options">
        <img src="/img/icons/material/more.svg" alt="" />
      </button>
    }
    let fab = 'floating-button'
    let tcreate = 'tasks-creator-background'
    // can be null so weirder logic
    if (this.state.showCreator === true) {
      fab += ' hide'
      tcreate += ' show'
    } else if (this.state.showCreator === false) {
      fab += ' show'
      tcreate += ' hide'
    }
    return (
      <div
        class={className}
        id="passive-scroll-wrapper"
        onClick={this.closeTasks}
      >
        <header class={headerClass}>
          <button class="header-child header-left" onClick={this.triggerBack}>
            <img src="/img/icons/back.svg" alt="Back Icon" title="Back" />
          </button>
          <h1 class="header-child">{this.state.header}</h1>
        </header>
        <div class="tasks-content" id="passive-scroll">
          <div class="tasks-scrollwrap">
            <div class="tasks-sticky-helper" />
            <div class={stickyScale}>
              <div class="tasks-fancy-header">
                <h1>
                  {listIcon}
                  <input
                    value={this.state.header}
                    onChange={this.triggerListChange}
                    onKeyUp={this.triggerListKeyUp}
                    onInput={this.triggerListKeyPress}
                    ref={e => {
                      this.realInput = e
                    }}
                    alt="List Name"
                    style={{ width: this.state.innerWidth }}
                  />
                  {moreBtn}
                  <span
                    ref={e => {
                      this.fakeInput = e
                    }}
                  >
                    {this.state.header}
                  </span>
                </h1>
              </div>
              <div class={tcreate}>
                <input
                  type="text"
                  ref={e => this.taskInput = e}
                  placeholder="Add a task..."
                  class={creatorClass}
                  value={this.state.inputValue}
                  onInput={this.triggerInput}
                  onKeyUp={this.triggerKeyUp}
                  required={true}
                />
                <button alt="Create Task" class="tasks-create-button" onClick={this.triggerCreateHide}>
                  <span class="img-vert-inverse" />
                </button>
              </div>
            </div>
            {taskNotes}
            <Sortable 
              task={this.props.task}
              taskList={this.state.taskList}
              list={this.props.list}
              listOrder={this.state.order}
              triggerTask={this.triggerTask}
            />
          </div>
          <button alt="Create Task" class={fab} onClick={this.triggerCreate}>
            <img class="img-vert-inverse" src="/img/icons/material/add.svg" />
          </button>
        </div>
      </div>
    )
  }
}
