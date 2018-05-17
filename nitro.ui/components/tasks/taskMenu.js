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
  bind2 = 'left',
  callback = () => {}
) {
  const items = [
    {
      title: 'Archive Task',
      action: () => {
        callback()
        archiveTask(taskId)
      }
    },
    {
      title: 'Delete Task',
      action: () => {
        callback()
        deleteTask(taskId)
      }
    }
  ]
  if (headingAllowed) {
    items.unshift({
      title: 'Change to Heading',
      action: () => {
        callback()
        headingConvert(taskId)
      }
    })
  }

  ContextMenuService.create(x, y, bind1, bind2, items)
}

export const headerMenu = function(
  taskId,
  x,
  y,
  bind1 = 'top',
  bind2 = 'left',
  callback = () => {}
) {
  const items = [
    {
      title: 'Change to Task',
      action: () => {
        callback()
        headingConvert(taskId, 'task')
      }
    },
    {
      title: 'Archive Group',
      action: () => {
        callback()
        archiveHeading(taskId)
      }
    },
    {
      title: 'Remove',
      action: () => {
        callback()
        deleteTask(taskId)
      }
    }
  ]
  ContextMenuService.create(x, y, bind1, bind2, items)
}
