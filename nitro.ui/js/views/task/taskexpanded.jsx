import preact from 'preact'

import { NitroSdk } from '../../../../nitro.sdk'
import { dateValue, deadlineValue } from '../../helpers/date.js'
import Datepicker from './datepicker.jsx'
import { taskMenu } from './contextmenu.jsx'

import moreSvg from '../../../../assets/icons/material/task-more.svg'

export default class TaskExpanded extends preact.Component {
  baseHeight = 70
  baseRows = 3
  currentRows = 0
  state = {
    date: null,
    deadline: null,
    notes: null
  }
  componentWillMount() {
    const task = NitroSdk.getTask(this.props.task)
    if (task === null) return
    this.setState({
      date: task.date,
      deadline: task.deadline,
      notes: task.notes
    })
  }
  componentWillReceiveProps() {
    const task = NitroSdk.getTask(this.props.task)
    if (task === null) return
    this.setState({
      date: task.date,
      deadline: task.deadline,
      notes: task.notes
    })
    requestAnimationFrame(() => {
      this.sizeTextarea()
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
      if (key === 'notes') {
        this.sizeTextarea(e)
      }
      this.setState(newData)
      NitroSdk.updateTask(this.props.task, newData)
    }
  }
  sizeTextarea = (e = this.textarea) => {
    const el = e.currentTarget || e
    el.rows = this.baseRows
    const rows = Math.ceil((el.scrollHeight - this.baseHeight) / 18)
    el.rows = rows + this.baseRows

    this.changeCss(el.rows)
  }
  changeCss(rows) {
    if (this.currentRows !== rows) {
      this.currentRows = rows
      const newHeight = 106 + (rows * 18)
      document.body.style.setProperty('--tasks-height', newHeight + 'px')
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
          onKeyUp={this.sizeTextarea}
          value={this.state.notes}
          ref={e => this.textarea = e}
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
            src={moreSvg}
            onClick={this.triggerMenu}
          />
        </div>
      </div>
    )
  }
}
