import { Events } from '../../nitro.sdk'

class _modalService extends Events {
  show(confirmAction) {
    this.trigger('show', {
      confirmAction: confirmAction
    })
  }
}
let ModalService = new _modalService()
export { ModalService }
