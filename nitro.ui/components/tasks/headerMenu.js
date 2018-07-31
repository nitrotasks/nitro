import { NitroSdk } from '../../../nitro.sdk'
import { ContextMenuService } from '../../services/contextMenuService.js'
import { ModalService } from '../../services/modalService.js'

export const headerMenu = function(
  listId,
  x,
  y,
  bind1 = 'top',
  bind2 = 'left',
  callback = () => {}
) {
  const items = [
    {
      title: 'Delete List',
      action: () => {
        ModalService.show(() => {
          callback()
          NitroSdk.deleteList(listId)
        })
      }
    }
  ]
  ContextMenuService.create(x, y, bind1, bind2, items)
}
