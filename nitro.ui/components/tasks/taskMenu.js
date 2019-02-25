import { NitroSdk } from '../../../nitro.sdk'
import { ContextMenuService } from '../../services/contextMenuService.js'
import { ModalService } from '../../services/modalService.js'
import { TasksExpandedService } from '../../services/tasksExpandedService.js'
import { vars } from '../../styles.js'

const ARCHIVE_WARNING =
  'Are you sure you want to archive this task?\n\nYou currently can’t view archived tasks in Nitro.'
const ARCHIVE_BUTTON = 'Archive Task'
const ARCHIVE_HEADER_WARNING =
  'Are you sure you want to archive this group of tasks?\n\nYou currently can’t view archived tasks in Nitro.'
const ARCHIVE_HEADER_BUTTON = 'Archive Group'
const DELETE_WARNING = 'Are you sure you want to delete this task?'
const DELETE_BUTTON = 'Delete Task'
const DELETE_HEADER_WARNING = 'Are you sure you want to remove this heading?'
const DELETE_HEADER_BUTTON = 'Remove'
const CANCEL_BUTTON = 'Cancel'

const TASK_MENU_ARCHIVE = 'Archive Task'
const TASK_MENU_DELETE = 'Delete Task'
const TASK_MENU_CONVERT = 'Change to Heading'
const TASK_MENU_VIEW = 'View in List'

const HEADER_MENU_ARCHIVE = 'Archive Group'
const HEADER_MENU_DELETE = 'Remove Heading'
const HEADER_MENU_CONVERT = 'Change to Task'

const PRIORITY_MENU_3 = 'High Priority'
const PRIORITY_MENU_2 = 'Medium Priority'
const PRIORITY_MENU_1 = 'Low Priority'

const archiveTask = (task, callback) => {
  ModalService.show(
    {
      message: ARCHIVE_WARNING,
      confirmText: ARCHIVE_BUTTON,
      confirmColor: vars.positiveColor,
      cancelText: CANCEL_BUTTON
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
      confirmText: DELETE_BUTTON,
      confirmColor: vars.negativeColor,
      cancelText: CANCEL_BUTTON
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
      confirmText: ARCHIVE_HEADER_BUTTON,
      confirmColor: vars.positiveColor,
      cancelText: CANCEL_BUTTON
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
      confirmText: DELETE_HEADER_BUTTON,
      confirmColor: vars.negativeColor,
      cancelText: CANCEL_BUTTON
    },
    () => {
      callback()
      NitroSdk.deleteTask(task)
    }
  )
}

const setPriority = (task, priority, callback) => {
  NitroSdk.updateTask(task, { priority: priority })
  callback()
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
      title: TASK_MENU_ARCHIVE,
      action: () => archiveTask(taskId, callback)
    },
    {
      title: TASK_MENU_DELETE,
      action: () => deleteTask(taskId, callback)
    }
  ]
  if (headingAllowed) {
    items.unshift({
      title: TASK_MENU_CONVERT,
      action: () => {
        callback()
        headingConvert(taskId)
      }
    })
  }
  if (viewInList) {
    items.unshift({
      title: TASK_MENU_VIEW,
      action: () => {
        const task = NitroSdk.getTask(taskId)
        TasksExpandedService.goToAnyTask(task.list, taskId)
      }
    })
  }

  ContextMenuService.create(x, y, bind1, bind2, items)
}

export const headerMenu = (
  taskId,
  x,
  y,
  bind1 = 'top',
  bind2 = 'left',
  callback = () => {}
) => {
  const items = [
    {
      title: HEADER_MENU_CONVERT,
      action: () => {
        callback()
        headingConvert(taskId, 'task')
      }
    },
    {
      title: HEADER_MENU_ARCHIVE,
      action: () => archiveHeading(taskId, callback)
    },
    {
      title: HEADER_MENU_DELETE,
      action: () => deleteHeading(taskId, callback)
    }
  ]
  ContextMenuService.create(x, y, bind1, bind2, items)
}

export const priorityMenu = (
  taskId,
  x,
  y,
  bind1 = 'top',
  bind2 = 'left',
  callback = () => {}
) => {
  const items = [
    {
      title: PRIORITY_MENU_3,
      action: () => setPriority(taskId, 3, callback)
    },
    {
      title: PRIORITY_MENU_2,
      action: () => setPriority(taskId, 2, callback)
    },
    {
      title: PRIORITY_MENU_1,
      action: () => setPriority(taskId, 1, callback)
    }
  ]
  ContextMenuService.create(x, y, bind1, bind2, items)
}
