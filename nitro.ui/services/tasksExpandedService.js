// @flow
import { Events } from '../../nitro.sdk'
import { vars } from '../styles.js'

const idleCallback = (fn: () => mixed) => {
  // currently just setting timeout to 350
  setTimeout(() => {
    requestAnimationFrame(fn)
  }, 350)
}

class _tasksExpanded extends Events {
  constructor(props) {
    super(props)
    this.state = {
      taskTriggerInProgress: false,
      list: null,
      task: null,
      position: 0
    }
    this.go = () => {
      console.log('history not working.')
    }
    this.replace = () => {
      console.log('history not working.')
    }
  }
  setGo(push, replace) {
    this.go = push
    this.replace = replace
  }
  routeUpdate(routeProps: object) {
    if (this.state.taskTriggerInProgress) {
      return
    }
    const params = routeProps.match.params
    if (typeof params.list !== 'undefined') {
      if (typeof params.task !== 'undefined') {
        if (
          this.state.list === params.list &&
          this.state.task === params.task
        ) {
          return // do nothing, it's already been triggered.
        }
        this.state.list = params.list
        this.state.task = params.task

        if (params.task !== 'new') {
          this.trigger('show', params.list, params.task)
        }
      } else {
        if (this.state.task === null) {
          return
        }
        this.state.list = params.list
        this.state.task = null
        this.trigger('hide', params.list)
      }
    }
  }
  triggerCreate(list: string) {
    this.state.taskTriggerInProgress = true
    this.state.position = 0 // TODO: what's the magic number that we want?
    this.trigger('show', list, 'new')

    idleCallback(() => {
      this.state.taskTriggerInProgress = false
      const url = `/${list}/new`
      this.go(url)
    })
  }
  triggerTask(list: string, task: string, position: number) {
    if (this.state.list === list && this.state.task === task) {
      return
    }
    this.state.taskTriggerInProgress = true
    this.state.list = list
    this.state.task = task
    this.state.position = position
    this.trigger('show', list, task)

    idleCallback(() => {
      this.state.taskTriggerInProgress = false
      const url = `/${list}/${task}`
      this.go(url)
    })
  }
  triggerReplace(list: string, task: string) {
    this.state.list = list
    this.state.task = task

    const url = `/${list}/${task}`
    this.replace(url)
    this.trigger('replace', list, task)
  }
  triggerTaskHeight(height: number) {
    // TODO: Magic Numbers!
    const actualHeight = height * vars.notesLineHeight + 120
    this.trigger('height', actualHeight)
  }
}
export const TasksExpandedService = new _tasksExpanded()
