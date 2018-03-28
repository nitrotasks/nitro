import preact from 'preact'
import pikaday from 'pikaday'
import { formatDate } from '../../helpers/date.js'

import duedateSvg from '../../../../assets/icons/material/task-duedate.svg'
import deadlineSvg from '../../../../assets/icons/material/task-deadline.svg'

export default class Datepicker extends preact.Component {
  state = {
    visible: false
  }
  componentDidMount() {
    this.picker = new pikaday({
      field: this.datepickerField,
      container: this.datepickerWidget,
      onSelect: this.triggerSelect(),
      bound: false,
      keyboardInput: false,
    })
  }
  componentWillUnmount() {
    this.picker.destroy()
  }
  triggerSelect = value1 => {
    return value2 => {
      let value = value1 || value2
      this.props.onSelect(value)
      this.triggerHide()
    }
  }
  removeDate = e => {
    e.stopPropagation()
    this.props.onSelect(null)
  }
  triggerVisible = () => {
    this.setState({
      visible: true
    })
  }
  triggerHide = () => {
    this.setState({
      visible: false
    })
  }
  render() {
    // TODO: abstract this to translation library
    const pickerType = this.props.pickerType || 'date'
    let titleText = 'Pick Date'
    let buttonText = 'Date'
    let buttonsTop
    if (pickerType === 'deadline') {
      titleText = 'Set Deadline'
      buttonText = 'Deadline'
    }
    if (pickerType === 'date' || pickerType === 'deadline') {
      buttonsTop = (
        <div class="button-list">
          <button class="today" onClick={this.triggerSelect('today')}>Today</button>
          <button class="tomorrow" onClick={this.triggerSelect('tomorrow')}>Tomorrow</button>
          <button class="nextweek" onClick={this.triggerSelect('nextweek')}>Next Week</button>
        </div>
      )
    }

    let className = 'datepicker-wrapper' + (this.state.visible ? '' : ' hidden')
    let activator = null
    if (this.props.position === 'sheet' || this.props.position === 'sheet-hidden') {
      className += ' floating sheet'
      activator = (
        <button onClick={this.triggerVisible}>
          {this.props.type}{' '}
          {formatDate(this.props.date) || buttonText}
        </button>
      )
    } else if (this.props.position === 'popover') {
      className += ' floating popover'
      let imgSrc
      if (pickerType === 'deadline') {
        imgSrc = deadlineSvg
      } else {
        imgSrc = duedateSvg
      }
      // ensures we don't get a rogue 'next' value
      const next = pickerType === 'deadline' ? 'task' : this.props.type
      activator = <div onClick={this.triggerVisible}>
        <img src={imgSrc} />
        {formatDate(this.props.date, next) || buttonText}
        <button onClick={this.removeDate}>X</button>
      </div>
    }

    let bodyStyle = {}
    if (this.props.position === 'sheet-hidden') {
      bodyStyle = {display: 'none'}
    }

    return (
      <div className="datepicker-element">
        {activator}
        <div class={className} style={bodyStyle}>
          <div class="datepicker-container">
            <header>
              <h3>{titleText}</h3>
              <button class="close" onClick={this.triggerHide} title="Close" />
            </header>
            {buttonsTop}
            <input
              ref={e => (this.datepickerField = e)}
              type="date"
              class="hidden"
            />
            <div
              ref={e => (this.datepickerWidget = e)}
              class="datepicker-widget"
            />
          </div>
        </div>
      </div>
    )
  }
}
