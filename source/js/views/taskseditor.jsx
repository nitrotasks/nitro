import preact from 'preact'
import Datepicker from './datepicker.jsx'
import { TasksCollection } from '../models/tasksCollection.js'

export default class TasksEditor extends preact.Component {
  constructor(props) {
    super(props)
    this.state = this.installState(props)
    this.state.animate = false
    this.state.noRender = false
  }
  componentDidMount() {
    TasksCollection.bind('updateTask', this.triggerUpdate)
    window.addEventListener('resize', this.showEditorCb)
    this.showEditorCb()
  }
  componentWillReceiveProps(newProps) {
    const newState = this.installState(newProps)
    newState.animate = true
    this.setState(newState)

    setTimeout(() => {
      this.setState({
        animate: false
      })
    }, 300)
  }
  installState(props) {
    const data = TasksCollection.find(props.task) || {}
    return {
      showEditor: 'task' in props,
      name: data.name,
      notes: data.notes,
      type: data.type,
      date: data.date,
      deadline: data.deadline
    }
  }
  componentWillUnmount() {
    TasksCollection.unbind('updateTask', this.triggerUpdate)
    window.removeEventListener('resize', this.showEditorCb)
  }
  triggerUpdate = data => {
    if (data === this.props.task) {
      this.setState(this.installState(this.props))
    }
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
  triggerChange = prop => {
    return e => {
      const value = e.currentTarget.value
      this.setState({
        [prop]: value
      })
      // Update value in the model
      TasksCollection.update(this.props.task, { [prop]: value })
    }
  }
  triggerDate = value => {
    let newData = {}
    if (value.constructor === Date) {
      newData.type = 'task'
      newData.date = value
    } else if (value === 'today') {
      newData.type = 'next'
      newData.date = new Date()
    } else if (value === 'next') {
      newData.type = 'next'
      newData.date = null
    } else if (value === 'someday') {
      newData.type = 'someday'
      newData.date = null
    }
    TasksCollection.update(this.props.task, newData)
  }
  triggerKeyUp = e => {
    if (e.keyCode === 13) {
      e.currentTarget.blur()
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
    return (
      <section class={className}>
        <header class="material-header main-nav">
          <button class="header-child header-left" onClick={this.triggerBack}>
            <img src="/img/icons/back.svg" alt="Back Icon" title="Back" />
          </button>
          <input
            class="header-child grow"
            value={this.state.name}
            onChange={this.triggerChange('name')}
            onKeyUp={this.triggerKeyUp}
          />
        </header>
        <Datepicker
          position="floating"
          onSelect={this.triggerDate}
          type={this.state.type}
          date={this.state.date}
        />
        <textarea
          placeholder="Add a note..."
          onChange={this.triggerChange('notes')}
          value={this.state.notes}
        />
        <p>More controls!</p>
      </section>
    )
  }
}
