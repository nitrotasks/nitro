import preact from 'preact'

import { TasksCollection } from '../models/tasksCollection.js'

export default class Task extends preact.Component {
  constructor(props) {
    super(props)
    this.state = {
      name: props.data.name,
      expanded: props.selectedTask === props.data.id
    }
  }
  triggerClick = () => {
    this.setState({
      expanded: !this.state.expanded
    })
  }
  triggerChange = e => {
    const value = e.currentTarget.value
    requestAnimationFrame(() => {
      this.setState({
        name: value
      })
    })

    // Update value in the model
    TasksCollection.update(this.props.data.id, { name: value })
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedTask === nextProps.data.id) {
      requestAnimationFrame(() => {
        this.setState({ expanded: true })

        requestAnimationFrame(() => {
          this.taskInput.focus()
        }, 250)
      })
    } else if (this.state.expanded === true) {
      setTimeout(() => {
        requestAnimationFrame(() => {
          this.setState({ expanded: false })
        })
      }, 275)
    }

    // TODO: handle this better
    this.setState({
      name: nextProps.data.name
    })
  }
  render() {
    let className = 'task-item'
    let expandedItems = null
    if (this.props.selectedTask === this.props.data.id) {
      className += ' expanded'
    }
    let label = (
      <div class="label" onClick={this.props.onClick}>{this.state.name}</div>
    )
    if (this.state.expanded) {
      expandedItems = (
        <div class="inner">
          <textarea placeholder="Notes" />
          <div class="button-bar">
            <img src="/img/icons/material/task-duedate.svg" />
            <img src="/img/icons/material/task-deadline.svg" />
            <img
              src="/img/icons/material/task-subtasks.svg"
              style={{ margin: '0 0.3rem 0 0' }}
            />
            <img src="/img/icons/material/task-more.svg" />
          </div>
        </div>
      )
      // focus on render
      label = (
        <input
          value={this.state.name}
          onChange={this.triggerChange}
          ref={input => {
            this.taskInput = input
          }}
        />
      )
    }
    return (
      <li class={className}>
        <div class="outer">
          <div class="check">
            <div class="box" />
          </div>
          {label}
        </div>
        {expandedItems}
      </li>
    )
  }
}
