import preact from 'preact'

import { TasksCollection } from '../models/tasksCollection.js'

export default class Task extends preact.Component {
  constructor(props) {
    super(props)
    this.state = {
      expanded: false
    }
  }
  triggerClick = () => {
    this.setState({
      expanded: !this.state.expanded
    })
  }
  render() {
    let data = this.props.data
    let className = 'task-item'
    if (this.props.selectedTask === this.props.data.id) {
      className += ' expanded'
    }
    return (
      <li class={className} onClick={this.props.onClick}>
        <div class="check">
          <div class="box" />
        </div>
        <div class="label">{data.name}</div> 
      </li>
    )
  }
}