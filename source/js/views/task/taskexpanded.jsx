import preact from 'preact'

import { dateValue, deadlineValue } from '../../helpers/date.js'
import { CombinedCollection } from '../../models/combinedCollection.js'
import Datepicker from './datepicker.jsx'
import { taskMenu } from './contextmenu.jsx'

export default class TaskExpanded extends preact.Component {
  state = {
    date: null,
    deadline: null,
    notes: null
  }
  componentWillMount() {
    const task = CombinedCollection.getTask(this.props.task)
    this.setState({
      date: task.date,
      deadline: task.deadline,
      notes: task.notes
    })
  }
  updateProp = (key) => {
    return (e) => {
      let newData
      if (key === 'date' || key === 'deadline') {
        if (key === 'date') {
          newData = dateValue(e)
        } else {
          newData = deadlineValue(e)
        }
      } else {
        newData = {
          [key]: e.currentTarget.value
        }
      }
      this.setState(newData)
      CombinedCollection.updateTask(this.props.task, newData)
    }
  }
  
  triggerMenu = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    taskMenu(this.props.task, this.props.headersAllowed, rect.left + 20, rect.top + 20 + window.scrollY)
  }
  render() {
    if (this.props.expanded === false) {
      return <div class="inner"></div>
    }
    // TODO: save notes after a timeout
    return (
      <div class="inner">
        <textarea
          placeholder="Notes"
          onChange={this.updateProp('notes')}
          value={this.state.notes}
        />
        <div class="button-bar">
          <Datepicker
            position="popover"
            onSelect={this.updateProp('date')}
            type={this.state.type}
            date={this.state.date}
          />
          <Datepicker
            position="popover"
            onSelect={this.updateProp('deadline')}
            type={this.state.type}
            date={this.state.deadline}
            pickerType="deadline"
          />
          <img
            src="/img/icons/material/task-more.svg"
            onClick={this.triggerMenu}
          />
        </div>
      </div>
    )
  }
}
