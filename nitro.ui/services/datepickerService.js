// @flow
import { Events } from '../../nitro.sdk'

class _datepicker extends Events {
  constructor(props) {
    super(props)
    this.pickers = {}
  }
  activate(pickerId: string, props: object) {
    this.trigger('activate', pickerId, props)
  }
}
export const DatepickerService = new _datepicker()
