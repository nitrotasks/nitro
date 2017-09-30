import preact from 'preact'
import pikaday from 'pikaday'

export default class Datepicker extends preact.Component {
  componentDidMount() {
    this.picker = new pikaday({
      field: this.datepickerField,
      container: this.datepickerWidget,
      bound: false,
    })
  }
  componentWillUnmount() {
    this.picker.destroy()
  }
  render() {
    const pickerType = this.props.pickerType || 'date'
    let buttonsTop, buttonsBottom
    if (pickerType === 'date') {
      buttonsTop = (
        <div class="button-list">
          <button>Today</button>
          <button>Next</button>
        </div>
      )
      buttonsBottom = (
        <div class="button-list">
          <button>Someday</button>
        </div>
      )
    } else if (pickerType === 'deadline') {
      buttonsTop = (
        <div class="button-list">
          <button>Today</button>
          <button>Next</button>
        </div>
      )
    }

    return (
      <div class="datepicker-container">
        {buttonsTop}
        <input ref={e => this.datepickerField = e} type="date" class="hidden" />
        <div ref={e => this.datepickerWidget = e} class="datepicker-widget" />
        {buttonsBottom}
      </div>
    )
  }
}

window.jono = pikaday