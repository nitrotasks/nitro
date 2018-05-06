import { NitroSdk } from '../../../nitro.sdk'
import { ContextMenuService } from '../../services/contextMenuService.js'

const archiveTask = function(task) {
  try {
    NitroSdk.archiveTask(task)
  } catch (err) {
    // todo: make this a nicer error
    alert(err.message)
  }
}

const deleteTask = function(task) {
  NitroSdk.deleteTask(task)
}

const headingConvert = function(task, mode = 'header') {
  NitroSdk.updateTask(task, { type: mode })
}

const archiveHeading = task => {
  NitroSdk.archiveHeading(task)
}

export const taskMenu = function(
  taskId,
  headingAllowed,
  x,
  y,
  bind1 = 'top',
  bind2 = 'left'
) {
  const items = [
    { title: 'Archive Task', action: () => archiveTask(taskId) },
    { title: 'Delete Task', action: () => deleteTask(taskId) }
  ]
  if (headingAllowed) {
    items.unshift({
      title: 'Change to Heading',
      action: () => headingConvert(taskId)
    })
  }

  ContextMenuService.create(x, y, bind1, bind2, items)
}

export const headerMenu = function(
  taskId,
  x,
  y,
  bind1 = 'top',
  bind2 = 'left'
) {
  const items = [
    { title: 'Change to Task', action: () => headingConvert(taskId, 'task') },
    { title: 'Archive Group', action: () => archiveHeading(taskId) },
    { title: 'Remove', action: () => deleteTask(taskId) }
  ]
  ContextMenuService.create(x, y, bind1, bind2, items)
}
