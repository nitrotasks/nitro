import preact from 'preact'
import { TasksCollection } from '../models/tasksCollection.js'

export default class TasksEditor extends preact.Component {
  constructor(props) {
    super(props)
    this.state = this.installState(props)
    this.state.animate = false
    this.state.noRender = false
  }
  componentDidMount() {
    window.addEventListener('resize', this.showEditorCb)
    this.showEditorCb()
  }
  componentWillReceiveProps(newProps) {
    this.setState(this.installState(newProps))

    setTimeout(() => {
      this.setState({
        animate: false
      })
    }, 300)
  }
  installState(props) {
    const data = TasksCollection.find(props.task) || {}
    return {
      showEditor: ('task' in props),
      animate: true,
      name: data.name
    }
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.showEditorCb)
  }
  showEditorCb = () => {
    if (window.innerWidth < 700 && this.state.noRender === true) {
      this.setState({
        noRender: false
      })
    } else if (window.innerWidth >= 700 && this.state.noRender === false) {
      this.setState({
        noRender: true
      })
    }
  }
  triggerBack = () => {
    window.history.back()
  }
  render() {
    if (this.state.noRender) {
      return null
    }
    let className = 'tasks-editor'
    if (this.state.showEditor && this.state.animate) {
      className += ' animate-in'
    } else if (!this.state.showEditor && this.state.animate) {
      className += ' animate-out'
    } else if (!this.state.showEditor) {
      className += ' hide'
    }
    return(
      <section class={className}>
        <header class="material-header main-nav"> 
          <button class="header-child header-left" onClick={this.triggerBack}>
            <img src="/img/icons/back.svg" alt="Back Icon" title="Back" />
          </button>
          <h1 class="header-child">{this.state.name}</h1>
        </header>
        <p>Notes Control</p>
        <p>Due Date Control</p>
        <p>More controls!</p>
      </section>
    )
  }
}