import preact from 'preact'

import { dateValue, deadlineValue } from '../../helpers/date.js'
import { CombinedCollection } from '../../models/combinedCollection.js'
import ContextMenuStore from '../../stores/contextmenu.js'
import Datepicker from './datepicker.jsx'

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
  headingConvert = () => {
    window.history.back()
    CombinedCollection.updateTask(this.props.task, { type: 'header' })
  }
  triggerMenu = (e) => {
    const items = [
      { title: 'Delete Task', action: this.deleteTask }
    ]
    if (this.props.headersAllowed) {
      items.unshift({ title: 'Change to Heading', action: this.headingConvert })
    }
    const rect = e.currentTarget.getBoundingClientRect()
    ContextMenuStore.create(rect.left, rect.top, 'top', 'left', items)
  }
  deleteTask = () => {
    window.history.back()
    CombinedCollection.deleteTask(this.props.task)
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
