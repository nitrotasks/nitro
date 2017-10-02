import preact from 'preact'
import pikaday from 'pikaday'

export default class Datepicker extends preact.Component {
  state = {
    visible: false,
  }
  componentDidMount() {
    this.picker = new pikaday({
      field: this.datepickerField,
      container: this.datepickerWidget,
      onSelect: this.triggerSelect(),
      bound: false,
    })
  }
  componentWillUnmount() {
    this.picker.destroy()
  }
  triggerSelect = (value1) => {
    return (value2) => {
      let value = value1 || value2
      console.log(value)
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
    if (this.props.position === 'floating') {
      className += ' floating'
      activator = <button onClick={this.triggerVisible}>Choose a Date</button>
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
            <div ref={e => (this.datepickerWidget = e)} class="datepicker-widget" />
            {buttonsBottom}
          </div>
        </div>
      </div>
    )
  }
}

window.jono = pikaday
