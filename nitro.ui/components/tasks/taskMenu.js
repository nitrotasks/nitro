import { NitroSdk } from '../../../nitro.sdk'
import { ContextMenuService } from '../../services/contextMenuService.js'
import { ModalService } from '../../services/modalService.js'
import { TasksExpandedService } from '../../services/tasksExpandedService.js'
import { vars } from '../../styles.js'

const ARCHIVE_WARNING =
  'Are you sure you want to archive this task?\n\nYou currently can’t view archived tasks in Nitro.'
const ARCHIVE_HEADER_WARNING =
  'Are you sure you want to archive this group of tasks?\n\nYou currently can’t view archived tasks in Nitro.'
const DELETE_WARNING = 'Are you sure you want to delete this task?'
const DELETE_HEADER_WARNING = 'Are you sure you want to remove this heading?'

const archiveTask = (task, callback) => {
  ModalService.show(
    {
      message: ARCHIVE_WARNING,
      confirmText: 'Archive Task',
      confirmColor: vars.positiveColor,
      cancelText: 'Cancel'
    },
    () => {
      try {
        callback()
        NitroSdk.archiveTask(task)
      } catch (err) {
        // todo: make this a nicer error
        alert(err.message)
      }
    }
  )
}

const deleteTask = (task, callback) => {
  ModalService.show(
    {
      message: DELETE_WARNING,
      confirmText: 'Delete Task',
      confirmColor: vars.negativeColor,
      cancelText: 'Cancel'
    },
    () => {
      callback()
      NitroSdk.deleteTask(task)
    }
  )
}

const headingConvert = function(task, mode = 'header') {
  NitroSdk.updateTask(task, { type: mode })
}

const archiveHeading = (task, callback) => {
  ModalService.show(
    {
      message: ARCHIVE_HEADER_WARNING,
      confirmText: 'Archive Task',
      confirmColor: vars.positiveColor,
      cancelText: 'Cancel'
    },
    () => {
      callback()
      NitroSdk.archiveHeading(task)
    }
  )
}

const deleteHeading = (task, callback) => {
  ModalService.show(
    {
      message: DELETE_HEADER_WARNING,
      confirmText: 'Remove',
      confirmColor: vars.negativeColor,
      cancelText: 'Cancel'
    },
    () => {
      callback()
      NitroSdk.deleteTask(task)
    }
  )
}

export const taskMenu = function(
  taskId,
  headingAllowed,
  viewInList,
  x,
  y,
  bind1 = 'top',
  bind2 = 'left',
  callback = () => {}
) {
  const items = [
    {
      title: 'Archive Task',
      action: () => archiveTask(taskId, callback)
    },
    {
      title: 'Delete Task',
      action: () => deleteTask(taskId, callback)
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
  if (viewInList) {
    items.unshift({
      title: 'View in List',
      action: () => {
        const task = NitroSdk.getTask(taskId)
        TasksExpandedService.goToAnyTask(task.list, taskId)
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
      action: () => archiveHeading(taskId, callback)
    },
    {
      title: 'Remove',
      action: () => deleteHeading(taskId, callback)
    }
  ]
  ContextMenuService.create(x, y, bind1, bind2, items)
}
