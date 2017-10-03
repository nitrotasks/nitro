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
    let buttonsTop, buttonsBottom
    if (pickerType === 'date') {
      buttonsTop = (
        <div class="button-list">
          <button onClick={this.triggerSelect('today')}>Today</button>
          <button onClick={this.triggerSelect('next')}>Next</button>
        </div>
      )
      buttonsBottom = (
        <div class="button-list">
          <button onClick={this.triggerSelect('someday')}>Someday</button>
        </div>
      )
    } else if (pickerType === 'deadline') {
      buttonsTop = (
        <div class="button-list">
          <button onClick={this.triggerSelect('today')}>Today</button>
          <button onClick={this.triggerSelect('next')}>Next</button>
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
      activator = <img onClick={this.triggerVisible} src="/img/icons/material/task-duedate.svg" />
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
              <h3>Date</h3>
              <button onClick={this.triggerHide}>Close</button>
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
            {buttonsBottom}
          </div>
        </div>
      </div>
    )
  }
}

window.jono = pikaday
