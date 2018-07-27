import { NitroSdk } from '../../../nitro.sdk'
import { ContextMenuService } from '../../services/contextMenuService.js'

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
        callback()
        NitroSdk.deleteList(listId)
      }
    }
  ]
  ContextMenuService.create(x, y, bind1, bind2, items)
}
