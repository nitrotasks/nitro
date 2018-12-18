import { NitroSdk } from '../../../nitro.sdk'
import { ContextMenuService } from '../../services/contextMenuService.js'
import { ModalService } from '../../services/modalService.js'
import { TasksExpandedService } from '../../services/tasksExpandedService.js'
import { vars } from '../../styles.js'

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
        ModalService.show(
          {
            message: 'Are you sure you want to delete this list?',
            confirmText: 'Delete List',
            confirmColor: vars.negativeColor,
            cancelText: 'Cancel'
          },
          () => {
            callback()
            TasksExpandedService.replace('/inbox')
            NitroSdk.deleteList(listId)
          }
        )
      }
    }
  ]
  ContextMenuService.create(x, y, bind1, bind2, items)
}
