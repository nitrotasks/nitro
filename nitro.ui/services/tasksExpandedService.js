// @flow
import { NitroSdk, Events } from '../../nitro.sdk'
import { vars } from '../styles.js'

// TODO: change this from a magic number to something calculated
const NEW_TASK_POSITION = 105

let cancelIdleCallback = false
const idleCallback = (fn: () => mixed) => {
  // currently just setting timeout to 400
  setTimeout(() => {
    if (cancelIdleCallback) {
      cancelIdleCallback = false
      return
    }
    requestAnimationFrame(fn)
  }, 400)
}

class _tasksExpanded extends Events {
  constructor(props) {
    super(props)
    this.state = {
      taskTriggerInProgress: false,
      list: null,
      task: null,
      position: 0,
      height: 0
    }
    this.go = () => console.log('go history not working.')
    this.replace = () => console.log('replace history not working.')
  }
  setGo(push, replace) {
    this.go = push
    this.replace = replace
  }
  routeUpdate(routeProps: object) {
    const params = routeProps.match.params
    if (params.list !== undefined) {
      if (params.task !== undefined) {
        if (
          this.state.list === params.list &&
          this.state.task === params.task
        ) {
          return // do nothing, it's already been triggered.
        }
        this.state.list = params.list
        this.state.task = params.task

        if (params.task !== 'new' && !this.state.taskTriggerInProgress) {
          this.trigger('show', params.list, params.task)
        }
      } else {
        this.state.list = params.list
        if (this.state.task === null) {
          return
        }
        if (
          this.state.list !== params.list &&
          this.state.taskTriggerInProgress
        ) {
          return this.triggerBack()
        } else if (this.state.taskTriggerInProgress) {
          return
        }
        const oldTask = this.state.task
        this.state.task = null
        this.trigger('hide', params.list, oldTask)
      }
    }
  }
  triggerCreate(list: string) {
    this.state.taskTriggerInProgress = true
    this.state.position = NEW_TASK_POSITION
    this.trigger('show', list, 'new')

    idleCallback(() => {
      this.state.taskTriggerInProgress = false
      const url = `/${list}/new`
      this.go(url)
    })
  }
  triggerTask(list: string, task: string, position: number) {
    if (
      (this.state.list === list && this.state.task === task) ||
      this.state.taskTriggerInProgress
    ) {
      return
    }
    this.state.taskTriggerInProgress = true

    // rewrites history so the back button does what you would expect
    // this also works properly if you're going from open task -> open task
    let redirect = this.go
    if (list !== this.state.list) {
      this.state.list = list
      this.replace(`/${list}`)
    } else if (this.state.task !== null) {
      // if the list has not been changed, but you're still going from open task to open task
      // it does a replace, not a go
      redirect = this.replace
    }

    this.state.task = task
    const url = `/${list}/${task}`

    this.state.position = position
    this.trigger('show', list, task)

    idleCallback(() => {
      redirect(url)
      this.state.taskTriggerInProgress = false
    })
  }
  triggerReplace(list: string, task: string) {
    this.state.list = list
    this.state.task = task

    const url = `/${list}/${task}`
    this.replace(url)
    this.trigger('replace', list, task)
  }
  triggerBack() {
    if (this.state.taskTriggerInProgress) {
      cancelIdleCallback = true
      this.state.task = null
      this.state.taskTriggerInProgress = false
      this.trigger('hide', this.state.list)
    } else {
      window.history.back()
    }
  }
  triggerTaskHeight(height: number) {
    // TODO: Magic Numbers!

    // firefox has a weird 17 pixel thing at the bottom, except when it doesn't
    // so we have to add it in if it's not there
    if (
      navigator.userAgent.indexOf('Firefox') != -1 &&
      height === Math.round(height)
    ) {
      height = (height * vars.notesLineHeight + 17) / vars.notesLineHeight
    }
    const actualHeight = height * vars.notesLineHeight + 120
    this.state.height = actualHeight
    this.trigger('height', actualHeight)
  }
  triggerPosition(position: number) {
    TasksExpandedService.state.position = position
    this.trigger('position', position)
  }
  goToAnyTask(listId: string, taskId: string) {
    const task = NitroSdk.getTask(taskId)

    // this uncollapses the header that the task belongs to
    let collapsedHeader = null
    for (let o of NitroSdk.getTasks(listId).order) {
      const t = NitroSdk.getTask(o)
      if (t.type === 'header-collapsed') {
        // don't want to uncollapse collapsed headings if that's the task in question
        if (t.id === taskId) {
          collapsedHeader = null
        } else {
          collapsedHeader = t.id
        }
      }
      if (t.id === taskId) break
    }
    if (collapsedHeader !== null) {
      NitroSdk.updateTask(collapsedHeader, { type: 'header' })

      // waits a frame for the app to update and show the new header
      if (this.state.list === listId) {
        requestAnimationFrame(() => this.goToAnyTask(listId, taskId))
        return
      }
    }

    const isHeader =
      task !== null &&
      (task.type === 'header' || task.type === 'header-collapsed')
    if (this.state.list === listId && this.state.task === taskId) {
      return
    } else if (this.state.list === listId) {
      if (isHeader) {
        this.indirectFocusQueue = taskId
        this.trigger('indirect-focus', listId, taskId)
      } else {
        this.trigger('indirect-click', listId, taskId)
      }
    } else {
      if (isHeader) {
        this.go(`/${listId}`)
        this.indirectFocusQueue = taskId
        this.trigger('indirect-focus', listId, taskId)
      } else {
        this.triggerTask(listId, taskId, 0)
      }
    }
  }
  focusNameInput() {
    this.trigger('focus-name-input')
  }
}
export const TasksExpandedService = new _tasksExpanded()
