import preact from 'preact'
import { route } from 'preact-router'
import ResizeObserver from 'resize-observer-polyfill'

import { CombinedCollection } from '../../models/combinedCollection.js'

import ContextMenuStore from '../../stores/contextmenu.js'
import DialogBoxStore from '../../stores/dialogbox.js'

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
  componentWillReceiveProps = (nextProps) => {
    this.listsUpdate('lists', nextProps)

    // called on new list on desktop
    setTimeout(() => {
      if (window.location.hash === '#rename') {
        // rewrites the hash away
        route('/lists/' + nextProps.list, true)
        this.realInput.select()
      }
    }, 5)
  }
  componentWillUnmount() {
    CombinedCollection.unbind('update', this.listsUpdate)
    this.observer.disconnect()
  }
  triggerResize = () => {
    requestAnimationFrame(this.sizeInput)
  }
  listsUpdate = (key, props = this.props) => {
    if (key !== 'lists') {
      return
    }
    let name = ''
    let mutable = false
    if (typeof props.list !== 'undefined') {
      const list = CombinedCollection.getList(props.list)
      name = list.name
      mutable = list.mutable.indexOf('no-rename') ===  -1
    }
    // seems easiest to set document title here
    document.title = [name, 'Nitro'].join(' - ')
    this.setState({
      header: name,
      mutable: mutable
    })
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
      listIcon = (
        <img
          class="icon"
          src={'/img/icons/feather/' + this.props.list + '.svg'}
          alt=""
        />
      )
    }

    let moreBtn = null
    if (this.state.mutable && this.state.innerWidth !== '100%') {
      moreBtn = (
        <button
          class="list-context"
          onClick={this.triggerMenu}
          alt="List Options"
          title="List Options"
        >
          <img src="/img/icons/material/more.svg" alt="" />
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
            <img src="/img/icons/back.svg" alt="Back Icon" title="Back" />
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
              disabled={!this.state.mutable}
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
          <img class="img-vert-inverse" src="/img/icons/material/add.svg" />
        </button>
      </div>
    )
  }
}
