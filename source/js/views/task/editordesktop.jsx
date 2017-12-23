import preact from 'preact'
import { CombinedCollection } from '../../models/combinedCollection.js'
import TaskExpanded from './taskexpanded.jsx'
import { taskExpandedStore } from '../../stores/taskexpanded.js'
import { back } from '../../stores/navigation.js'

class TasksPopover extends preact.Component {
  state = {
    data: {},
    scrollTop: 0,
    top: 0,
    opacity: 'hidden'
  }
  componentDidMount() {
    taskExpandedStore.bind('create', this.triggerCreate)
  }
  componentWillUnmount() {
    taskExpandedStore.unbind('create', this.triggerCreate)
  }
  triggerCreate = props => {
    const opacity = props[0] === null ? 'hidden' : 'visible'
    const data = CombinedCollection.getTask(props[0]) || {}
    requestAnimationFrame(() => {
      this.setState({
        data: data,
        opacity: opacity,
        scrollTop: window.scrollY,
        top: props[1]
      })
    })
  }
  closeTasks = e => {
    if (e.target === e.currentTarget) {
      if (window.location.pathname.split('/').length === 4) {
        back()
      }
    }
  }
  render() {
    const visibility = this.state.opacity
    return (
      <div
        class="tasks-popover-desktop-wrapper"
        style={{ top: this.state.scrollTop, visibility: visibility }}
        onClick={this.closeTasks}
      >
        <div class="tasks-popover-desktop" style={{ top: this.state.top }}>
          <div class="tasks-popover-content">
            <div class="content task-item">
              <div class="outer">
                <div class="check">
                  <div class="box" />
                </div>
                <div class="label">{this.state.data.name}</div>
              </div>
              <TaskExpanded expanded={true} task={this.props.task} />
            </div>
            <div class="bottom-hider" onClick={this.closeTasks} />
          </div>
        </div>
      </div>
    )
  }
}
export default TasksPopover
