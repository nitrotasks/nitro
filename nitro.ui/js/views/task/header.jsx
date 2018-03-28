import preact from 'preact'
import { route } from 'preact-router'
import ResizeObserver from 'resize-observer-polyfill'

import { CombinedCollection } from '../../models/combinedCollection.js'
import { BrowserStore } from '../../stores/browserStore.js'

import ContextMenuStore from '../../stores/contextmenu.js'
import DialogBoxStore from '../../stores/dialogbox.js'

import moreSvg from '../../../../assets/icons/material/more.svg'
import backSvg from '../../../../assets/icons/back.svg'
import addSvg from '../../../../assets/icons/material/add.svg'

const widthOffset = 3

export default class TasksHeader extends preact.Component {
  state = {
    header: '',
    inputValue: '',
    showCreator: false
  }
  componentDidMount() {
    this.listsUpdate('lists')
    CombinedCollection.bind('update', this.listsUpdate)

    this.observer = new ResizeObserver(this.triggerResize)
    this.observer.observe(this.fakeInput.parentElement)

    // TODO: Hide keyboard
    // very specific to android. probably won't work on iOS.
    // if (this.lastHeight < document.documentElement.clientHeight && this.state.showCreator === true) {
    //   this.setState({
    //     showCreator: false
    //   })
    // }

    // this.lastHeight = document.documentElement.clientHeight
  }
  componentWillReceiveProps = nextProps => {
    this.listsUpdate('lists', nextProps)

    // called on new list on desktop
    if (window.location.hash === '#rename') {
      setTimeout(() => {
        // rewrites the hash away
        route('/lists/' + nextProps.list, true)
        this.realInput.select()
      }, 5)
    }
  }
  componentWillUnmount() {
    CombinedCollection.unbind('update', this.listsUpdate)
    this.observer.disconnect()
  }
  shouldComponentUpdate(nextProps, nextState) {
    let shouldUpdate = false
    // does a shallow compare on the state & props
    if (nextProps !== this.props) {
      Object.keys(nextProps).some(key => {
        if (nextProps[key] !== this.props[key]) {
          shouldUpdate = true
          return
        }
      })
    } else {
      // does a shallow compare on the state
      Object.keys(nextState).some(key => {
        if (nextState[key] !== this.state[key]) {
          shouldUpdate = true
          return
        }
      })
    }
    return shouldUpdate
  }
  triggerResize = () => {
    requestAnimationFrame(this.sizeInput)
  }
  listsUpdate = (key, props = this.props) => {
    if (
      key !== 'lists' ||
      typeof props.name === 'undefined' ||
      props.name === this.state.header
    ) {
      return
    }
    this.setState({ header: props.name })
    BrowserStore.setTitle(props.name)
    requestAnimationFrame(this.sizeInput)
  }
  createTask = () => {
    if (this.state.inputValue.trim() !== '') {
      CombinedCollection.addTask({
        name: this.state.inputValue.trim(),
        list: this.props.list
      })
      this.setState({
        inputValue: ''
      })
    }
  }
  renameList = () => {
    this.realInput.select()
  }
  deleteList = () => {
    const toDelete = this.props.list
    const cb = () => {
      route('/', true)
      requestAnimationFrame(() => {
        CombinedCollection.deleteList(toDelete)
      })
    }

    DialogBoxStore.create({
      header: 'Delete List',
      content: (
        <span>
          Your list <strong>{this.state.header}</strong> and associated tasks
          will be deleted forever.
        </span>
      ),
      confirm: 'Delete List',
      cancel: 'Keep List',
      context: 'danger',
      callback: cb
    })
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
  triggerListChange = e => {
    let value = e.currentTarget.value.trim()
    this.fakeInput.textContent = value
    // resets the header
    if (value === '') {
      this.setState({
        header: this.state.header
      })
    } else {
      CombinedCollection.updateList(this.props.list, {
        name: value
      })
    }
    requestAnimationFrame(this.sizeInput)
  }
  triggerListKeyPress = e => {
    const value = e.currentTarget.value
    this.fakeInput.textContent = value + String.fromCharCode(e.which)
    const newWidth = this.fakeInput.offsetWidth
    this.realInput.style.width = newWidth + widthOffset + 'px'
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
  triggerMenu = e => {
    const rect = e.currentTarget.getBoundingClientRect()
    ContextMenuStore.create(rect.left, rect.top, 'top', 'left', [
      { title: 'Rename List', action: this.renameList },
      { title: 'Delete List', action: this.deleteList }
    ])
  }
  triggerBack = () => {
    // todo, hook it to the history
    if (window.innerWidth < 700) {
      route('/')
    } else {
      route('/lists/inbox')
    }
  }
  triggerCreate = () => {
    this.setState({
      showCreator: true
    })
    setTimeout(() => {
      this.taskInput.focus()
    }, 250)
  }
  triggerCreateHide = () => {
    this.setState({
      showCreator: false
    })
    this.createTask()
  }
  sizeInput = () => {
    const newWidth = this.fakeInput.offsetWidth + widthOffset
    this.setState({
      innerWidth: newWidth + 'px'
    })
  }
  render() {
    let creatorClass = 'tasks-creator'
    if (this.state.list === 'all') {
      creatorClass += ' hidden'
    }

    let stickyScale = 'tasks-sticky-container'

    if (this.props.stickyScale) {
      stickyScale += ' scale-header'
    }

    let listIcon = null
    if (['inbox', 'today', 'next', 'all'].indexOf(this.props.list) > -1) {
      listIcon = <div class={'icon icon-' + this.props.list} />
    }

    let moreBtn = null
    if (this.props.mutable && this.state.innerWidth !== '100%') {
      moreBtn = (
        <button
          class="list-context"
          onClick={this.triggerMenu}
          alt="List Options"
          title="List Options"
        >
          <img src={moreSvg} alt="" />
        </button>
      )
    }

    let tcreate = 'tasks-creator-background'
    let fab = 'floating-button'
    // can be null so weirder logic
    if (this.state.showCreator === true) {
      tcreate += ' show'
      fab += ' hide'
    } else if (this.state.showCreator === false) {
      tcreate += ' hide'
      fab += ' show'
    }

    let placeholder = 'Add a task...'
    if (['today', 'next'].indexOf(this.props.list) > -1) {
      placeholder = 'Add a task in “Inbox”'
    }
    return (
      <div class={stickyScale}>
        <header class="material-header">
          <button class="header-child header-left" onClick={this.triggerBack}>
            <img src={backSvg} alt="Back Icon" title="Back" />
          </button>
          <h1 class="header-child">{this.state.header}</h1>
        </header>
        <div class="tasks-fancy-header" id="header-resize">
          <h1>
            {listIcon}
            <input
              value={this.state.header}
              onChange={this.triggerListChange}
              onKeyUp={this.triggerListKeyUp}
              onInput={this.triggerListKeyPress}
              ref={e => (this.realInput = e)}
              alt="List Name"
              style={{ width: this.state.innerWidth }}
              disabled={!this.props.mutable}
            />
            {moreBtn}
            <span ref={e => (this.fakeInput = e)}>{this.state.header}</span>
          </h1>
        </div>
        <div class={tcreate}>
          <input
            type="text"
            ref={e => (this.taskInput = e)}
            placeholder={placeholder}
            class={creatorClass}
            value={this.state.inputValue}
            onInput={this.triggerInput}
            onKeyUp={this.triggerKeyUp}
            required={true}
            title="Create a new task"
          />
          <button
            alt="Create Task"
            class="tasks-create-button"
            onClick={this.triggerCreateHide}
          >
            <span class="img-vert-inverse" />
          </button>
        </div>
        <button alt="Create Task" class={fab} onClick={this.triggerCreate}>
          <img class="img-vert-inverse" src={addSvg} />
        </button>
      </div>
    )
  }
}
