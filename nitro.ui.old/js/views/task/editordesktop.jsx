import preact from 'preact'
import { NitroSdk } from '../../../../nitro.sdk'
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
    NitroSdk.bind('update', this.triggerUpdate)
  }
  componentWillUnmount() {
    taskExpandedStore.unbind('create', this.triggerCreate)
    NitroSdk.bind('update', this.triggerUpdate)
  }
  triggerCheck = () => {
    NitroSdk.completeTask(this.state.data.id)
  }
  triggerCreate = props => {
    const opacity = props[0] === null ? 'hidden' : 'visible'
    const data = NitroSdk.getTask(props[0]) || {}
    requestAnimationFrame(() => {
      this.setState({
        data: data,
        opacity: opacity,
        scrollTop: window.scrollY,
        top: props[1]
      })
    })
  }
  triggerUpdate = key => {
    if (key === 'tasks') {
      this.setState({
        data: NitroSdk.getTask(this.state.data.id) || {}
      })
    }
  }
  triggerKeyUp = e => {
    if (e.keyCode === 13) {
      e.currentTarget.blur()
    }
  }
  triggerChange = (e) => {
    const value = e.currentTarget.value
    NitroSdk.updateTask(this.state.data.id, { name: value })
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
    let className = 'content task-item'
    if (this.state.data.completed !== null) {
      className += ' completed'
    }
    let headersAllowed = false
    if (typeof this.state.data.list !== 'undefined') {
      headersAllowed = NitroSdk.getList(this.state.data.list).mutable.indexOf(
        'no-headings'
      ) === -1
    }
      
    return (
      <div
        class="tasks-popover-desktop-wrapper"
        style={{ top: this.state.scrollTop, visibility: visibility }}
        onClick={this.closeTasks}
      >
        <div class="tasks-popover-desktop" style={{ top: this.state.top }}>
          <div class="tasks-popover-content">
            <div class={className}>
              <div class="outer">
                <div class="check" onClick={this.triggerCheck}>
                  <div class="box" />
                </div>
                <input 
                  type="text"
                  class="label"
                  value={this.state.data.name} 
                  onChange={this.triggerChange}
                  onKeyUp={this.triggerKeyUp}
                />
              </div>
              <TaskExpanded
                expanded={true}
                task={this.props.task}
                headersAllowed={headersAllowed}
              />
            </div>
            <div class="bottom-hider" onClick={this.closeTasks} />
          </div>
        </div>
      </div>
    )
  }
}
export default TasksPopover
