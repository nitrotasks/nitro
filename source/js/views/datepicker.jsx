import preact from 'preact'
import pikaday from 'pikaday'

export default class Datepicker extends preact.Component {
  state = {
    visible: false
  }
  componentDidMount() {
    this.picker = new pikaday({
      field: this.datepickerField,
      container: this.datepickerWidget,
      onSelect: this.triggerSelect(),
      bound: false
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
    const pickerType = this.props.pickerType || 'date'
    let titleText = 'Pick Date'
    let buttonsTop
    if (pickerType === 'date') {
      buttonsTop = (
        <div class="button-list">
          <button class="today" onClick={this.triggerSelect('today')}>Today</button>
          <button class="next" onClick={this.triggerSelect('next')}>Next</button>
        </div>
      )
    } else if (pickerType === 'deadline') {
      titleText = 'Set Deadline'
      buttonsTop = (
        <div class="button-list">
          <button class="today" onClick={this.triggerSelect('today')}>Today</button>
          <button class="tomorrow" onClick={this.triggerSelect('next')}>Tomorrow</button>
        </div>
      )
    }

    let className = 'datepicker-wrapper'
    let activator = null
    if (this.props.position === 'sheet') {
      className += ' floating sheet'
      activator = (
        <button onClick={this.triggerVisible}>
          {this.props.type}{' '}
          {(this.props.date || '').toString() || 'Choose a Date'}
        </button>
      )
    } else if (this.props.position === 'popover') {
      className += ' floating popover'
      let imgSrc = '/img/icons/material/'
      if (pickerType === 'deadline') {
        imgSrc += 'task-deadline.svg'
      } else {
        imgSrc += 'task-duedate.svg'
      }
      activator = <img onClick={this.triggerVisible} src={imgSrc} />
    }
    if (!this.state.visible) {
      className += ' hidden'
    }

    return (
      <div className="datepicker-element">
        {activator}
        <div class={className}>
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

window.jono = pikaday
