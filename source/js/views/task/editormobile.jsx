import preact from 'preact'
import Datepicker from './datepicker.jsx'
import { dateValue, deadlineValue } from '../../helpers/date.js'
import { TasksCollection } from '../../models/tasksCollection.js'
import { shallowCompare } from '../../helpers/compare.js'

export default class TasksEditor extends preact.Component {
  constructor(props) {
    super(props)
    this.state = this.installState(props)
    this.state.animate = props.task !== ''
    this.state.noRender = false
    this.state.datepicker = true
  }
  componentDidMount() {
    TasksCollection.bind('updateTask', this.triggerUpdate)
    window.addEventListener('resize', this.showEditorCb)
    this.showEditorCb()
  }
  shouldComponentUpdate(newProps, newState) {
    return shallowCompare(this, newProps, newState)
  }
  componentWillReceiveProps(newProps) {
    if (newProps.task !== this.props.task) {
      const newState = this.installState(newProps)
      newState.datepicker = false
      this.setState(newState)

      if (newProps.task !== '') {
        setTimeout(() => {
          this.setState({
            datepicker: true
          })
        }, 500)
      }
    }
  }
  installState(props) {
    if (props.task === '') {
      return {
        showEditor: false
      }
    }
    const data = TasksCollection.find(props.task) || {}
    return {
      animate: true,
      showEditor: true,
      name: data.name,
      notes: data.notes,
      type: data.type,
      date: data.date,
      deadline: data.deadline,
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
    const newData = dateValue(value)
    this.setState(newData)
    TasksCollection.update(this.props.task, newData)
  }
  triggerDeadline = value => {
    const newData = deadlineValue(value)
    this.setState(newData)
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
    let datepicker = 'sheet-hidden'
    if (this.state.datepicker) {
      datepicker = 'sheet'
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
        <br /><br /><br /><br />
        <Datepicker
          position={datepicker}
          onSelect={this.triggerDate}
          type={this.state.type}
          date={this.state.date}
        />
        <Datepicker
          position={datepicker}
          onSelect={this.triggerDeadline}
          type={this.state.type}
          date={this.state.deadline}
          pickerType="deadline"
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
