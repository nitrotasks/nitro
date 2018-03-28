import ContextMenuStore from '../../stores/contextmenu.js'
import { NitroSdk } from '../../../../nitro.sdk'

const backLogic = function() {
  if (window.location.pathname.split('/').length > 3) {
    window.history.back()
  }
}

const archiveTask = function(task) {
  backLogic()
  try {
    NitroSdk.archiveTask(task)
  } catch(err) {
    // todo: make this a nicer error
    alert(err.message)
  }
}

const deleteTask = function(task) {
  backLogic()
  NitroSdk.deleteTask(task)
}

const headingConvert = function(task, mode = 'header') {
  backLogic()
  NitroSdk.updateTask(task, { type: mode })
}

const archiveHeading = (task) => {
  backLogic()
  NitroSdk.archiveHeading(task)
}

export const taskMenu = function(taskId, headingAllowed, x, y, bind1 = 'top', bind2 = 'left') {
  const items = [
    { title: 'Archive Task', action: () => archiveTask(taskId) },
    { title: 'Delete Task', action: () => deleteTask(taskId) }
  ]
  if (headingAllowed) {
    items.unshift({ title: 'Change to Heading', action: () => headingConvert(taskId) })
  }
  
  ContextMenuStore.create(x, y, bind1, bind2, items)
}

export const headerMenu = function(taskId, x, y, bind1 = 'top', bind2 = 'left') {
  const items = [
    { title: 'Archive Group', action: () => archiveHeading(taskId) },
    { title: 'Change to Task', action: () => headingConvert(taskId, 'task') },
    { title: 'Remove', action: () => deleteTask(taskId) }
  ]
  ContextMenuStore.create(x, y, bind1, bind2, items)
}