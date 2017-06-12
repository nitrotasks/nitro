import preact from 'preact'

import { TasksCollection } from '../models/tasksCollection.js'

export default class Task extends preact.Component {
  constructor(props) {
    super(props)
    this.state = {
      expanded: props.selectedTask === props.data.id
    }
  }
  triggerClick = () => {
    this.setState({
      expanded: !this.state.expanded
    })
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedTask === nextProps.data.id) {
      this.setState({expanded: true})
    } else if (this.state.expanded === true) {
      setTimeout(() => {
        this.setState({expanded: false})
      }, 275)
    }
  }
  render() {
    let data = this.props.data
    let className = 'task-item'
    let expandedItems = null
    if (this.props.selectedTask === this.props.data.id) {
      className += ' expanded'
    } 
    if (this.state.expanded) {
      expandedItems = (
        <div class="inner"> 
          <textarea placeholder="Notes"></textarea>
          <div class="button-bar">
            <img src='/img/icons/material/task-duedate.svg' />
            <img src='/img/icons/material/task-deadline.svg' />
            <img src='/img/icons/material/task-subtasks.svg' style={{margin: '0 0.3rem 0 0'}} />
            <img src='/img/icons/material/task-more.svg' />
          </div>
        </div>
      )
    }
    return (
      <li class={className}>
        <div class="outer">
          <div class="check">
            <div class="box" />
          </div>
          <div class="label" onClick={this.props.onClick}>{data.name}</div> 
        </div>
        {expandedItems}
      </li>
    )
  }
}