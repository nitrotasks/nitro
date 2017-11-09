import preact from 'preact'

import { formatDate } from '../../helpers/date.js'
import { TasksCollection } from '../../models/tasksCollection.js'
import { CombinedCollection } from '../../models/combinedCollection.js'
import ContextMenuStore from '../../stores/contextmenu.js'
import TaskExpanded from './taskexpanded.jsx'

export default class Task extends preact.Component {
  constructor(props) {
    super(props)
    this.state = this.installState(props.data.id)
    this.state.expanded = props.selectedTask === props.data.id
  }
  componentDidMount() {
    TasksCollection.bind('updateTask', this.triggerUpdate)
    if (this.state.expanded) {
      window.addEventListener('resize', this.handleResize)
      this.handleResize()
    }
  }
  componentWillUnmount() {
    TasksCollection.unbind('updateTask', this.triggerUpdate)
  }
  onContextMenu = e => {
    e.preventDefault()
  }
  triggerCheck = () => {
    CombinedCollection.completeTask(this.props.data.id)
  }
  triggerChange = prop => {
    return e => {
      const value = e.currentTarget.value
      CombinedCollection.updateTask(this.props.data.id, { [prop]: value })
    }
  }
  triggerUpdate = data => {
    if (data === this.props.data.id) {
      this.setState(this.installState(this.props.data.id))
    }
  }
  installState = id => {
    const data = CombinedCollection.getTask(id)
    return {
      name: data.name,
      type: data.type,
      notes: data.notes,
      list: data.list,
      date: data.date,
      deadline: data.deadline,
      completed: data.completed,
      noRender: false
    }
  }
  triggerKeyUp = e => {
    if (e.keyCode === 13) {
      e.currentTarget.blur()
    }
  }
  componentWillReceiveProps(nextProps) {
    if (
      nextProps.selectedTask === nextProps.data.id &&
      this.state.expanded === false
    ) {
      requestAnimationFrame(() => {
        this.setState({ expanded: true })
        this.handleResize()
        window.addEventListener('resize', this.handleResize)

        // requestAnimationFrame(() => {
        // this.taskInput.focus()
        // }, 250)
      })
    } else if (
      nextProps.selectedTask !== nextProps.data.id &&
      this.state.expanded === true
    ) {
      setTimeout(() => {
        requestAnimationFrame(() => {
          this.setState({ expanded: false })
          window.removeEventListener('resize', this.handleResize)
        })
      }, 275)
    }
  }
  handleResize = () => {
    // doesn't render the expanded task if the width is too small
    if (window.innerWidth < 700 && this.state.noRender === false) {
      this.setState({
        noRender: true
      })
    } else if (window.innerWidth >= 700 && this.state.noRender === true) {
      this.setState({
        noRender: false
      })
    }
  }
  headingConvert = () => {
    CombinedCollection.updateTask(this.props.data.id, { type: 'task' })
  }
  deleteTask = () => {
    CombinedCollection.deleteTask(this.props.data.id)
  }
  triggerMenu = e => {
    const items = [
      { title: 'Change to Task', action: this.headingConvert },
      { title: 'Delete Heading', action: this.deleteTask }
    ]
    const rect = e.currentTarget.getBoundingClientRect()
    ContextMenuStore.create(rect.left, rect.top, 'top', 'right', items)
  }
  buildIndicators = () => {
    const indicators = []
    if (this.state.notes !== null && this.state.notes.length > 0) {
      indicators.push(
        <img key="notes-indicator" class="indicator indicator-notes" src="/img/icons/material/note.svg" />
      )
    }
    if (this.state.deadline !== null) {
      indicators.push(
        <img key="deadline-indicator" class="indicator indicator-deadline" src="/img/icons/material/task-deadline.svg" />
      ) 
    }
    if (['today', 'next'].indexOf(this.props.currentList) > -1) {
      if (this.state.list !== 'inbox') {
        indicators.push(
          <span class="indicator indicator-date">{CombinedCollection.getList(this.state.list).name}</span>
        )
      }
      // TODO: Add headings here too.
    }
    
    if (this.state.date !== null) {
      const todayMode = this.state.deadline === null ? 'today' : this.state.deadline
      const date = formatDate(this.state.date, this.state.type, todayMode)
      if (!(date === 'Today' && (['today', 'next'].indexOf(this.props.currentList) > -1) || this.state.completed !== null)) {
        indicators.push(
          <span class="indicator indicator-date">{date}</span>
        )
      }
    } else if (this.state.type === 'next' && this.props.currentList !== 'next' && this.state.completed === null) {
      indicators.push(
        <span class="indicator indicator-date">Next</span>
      ) 
    }
    return indicators
  }
  render() {
    let className = 'task-item'
    if (this.props.selectedTask === this.props.data.id) {
      className += ' expanded'
    } else if (this.state.expanded === true) {
      className += ' closing'
    } else if (this.props.shouldMove) {
      className += ' offset-down'
    }
    if (this.state.completed !== null) {
      className += ' completed'
    }
    const indicators = this.buildIndicators()
    let label = (
      <div class="label" onClick={this.props.onClick}>
        {this.state.name}{indicators}
      </div>
    )
    if (this.state.type === 'header' || (this.state.expanded && !this.state.noRender)) {
      label = (
        <input
          value={this.state.name}
          onChange={this.triggerChange('name')}
          onKeyUp={this.triggerKeyUp}
          ref={input => {
            this.taskInput = input
          }}
        />
      )
    }
    
    let expandedItems = <div class="inner" />
    if (this.state.expanded && !this.state.noRender) {
      expandedItems = <TaskExpanded task={this.props.data.id} />
    }
    if (this.state.type === 'header') {
      className = className.replace('task-item', 'header-item')
      return (
        <li class={className} onContextMenu={this.onContextMenu}>
          <div class="outer">
            {label}
            <button alt="Sublist Menu">
              <img
                src="/img/icons/material/task-more.svg"
                onClick={this.triggerMenu}
              />
            </button>
          </div>
        </li>
      )
    } else {
      return (
        <li
          class={className}
          onMouseDown={this.props.onDown}
          onMouseMove={this.props.onMove}
          onMouseUp={this.props.onUp}
          onTouchStart={this.props.onDown}
          onTouchMove={this.props.onMove}
          onTouchEnd={this.props.onUp}
          onTouchCancel={this.props.onUp}
          onContextMenu={this.onContextMenu}
        >
          <div class="outer">
            <div class="check" onClick={this.triggerCheck}>
              <div class="box" />
            </div>
            {label}
          </div>
          {expandedItems}
        </li>
      )
    }
  }
}
