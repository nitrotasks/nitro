import preact from 'preact'
import TaskExpanded from './taskexpanded.jsx'
import { taskExpandedStore } from '../../stores/taskexpanded.js'

class TasksPopover extends preact.Component {
  state = {
    scrollTop: 0,
    top: 0,
    opacity: 0,
  }
  componentDidMount() {
    taskExpandedStore.bind('create', this.triggerCreate)
  }
  componentWillUnmount() {
    taskExpandedStore.unbind('create', this.triggerCreate)
  }
  triggerCreate = (props) => {
    const opacity = props[0] === null ? 'hidden' : 'visible'
    requestAnimationFrame(() => {
      this.setState({
        opacity: opacity,
        scrollTop: window.scrollY,
        top: props[1]
      })
    })
  }
  render() {
    const visible = this.props.task === '' ? ' hide' : ''
    const visibility = this.state.opacity
    return (
      <div class={'tasks-popover-desktop-wrapper' + visible} style={{top: this.state.scrollTop, visibility: visibility}}>
        <div class="tasks-popover-desktop" style={{top: this.state.top}}>
          <div class="tasks-popover-content">
            <div class="content">
              Hi This is the content
            </div>
            <div class="bottom-hider"></div>
          </div>
        </div>
      </div>
    )
  }
}
export default TasksPopover