import preact from 'preact'

import Task from './task.jsx'
import { ListsCollection } from '../models/listsCollection.js'
import { CombinedCollection } from '../models/combinedCollection.js'

export default class Sortable extends preact.Component {
  constructor(props) {
    super(props)

    const newState = this.updateProps(props)
    this.taskMap = newState.taskMap
    this.isBeingMoved = false

    let eventMode = 'touch'
    if (window.PointerEvent) {
      eventMode = 'pointer'
    }

    this.state = {
      order: newState.order,
      listTransforms: false,
      eventMode: eventMode
    }
  }
  componentWillReceiveProps(newProps) {
    const newState = this.updateProps(newProps)
    this.taskMap = newState.taskMap

    // prevents unecessary updates
    if (JSON.stringify(this.state.order) !== JSON.stringify(newState.order)) {
      this.setState({
        order: newState.order
      })
    }
  }
  updateProps(props) {
    const taskMap = new Map()
    props.taskList.forEach(task => {
      taskMap.set(task.id, task)
    })

    return {
      order: props.listOrder,
      taskMap: taskMap
    }
  }
  onDown = e => {
    // tests for primary mouse button
    if (this.state.eventMode === 'pointer' && e.which && e.which !== 1) {
      return
    }

    // TODO: Distinguish between click & drag drop
    this.currentElement = e.currentTarget.offsetTop
    this.currentIndex = Array.from(e.currentTarget.parentElement.children).indexOf(e.currentTarget)
    this.newPos = this.currentIndex
    this.hasBeenMoved = false

    if (!this.props.task) {
      this.sizes = Array.from(e.currentTarget.parentElement.children).map((item) => {
        // cumualitive position, height of elem, has transformed?
        return [item.offsetTop - this.currentElement, item.offsetHeight, false]
      })
      this.stepSize = e.currentTarget.offsetHeight

      if (this.state.eventMode === 'pointer') {
        this.isBeingMoved = true
        this.originalTouch = e
        e.currentTarget.setPointerCapture(e.pointerId)
      } else if (this.state.eventMode === 'touch') {
        this.originalTouch = e.touches[0]
      }
    }
  }
  onMove = e => {
    if (this.props.task) {
      return
    }

    // makes sure the same cursor is moving things
    if (this.state.eventMode === 'pointer' &&
        (!this.isBeingMoved || this.originalTouch.pointerId !== e.pointerId)) {
      return
    }

    // console.log(e.currentTarget)

    e.preventDefault()
    if (this.hasBeenMoved === false) {
      e.currentTarget.style.transition = 'none'
      this.hasBeenMoved = true
      this.setState({
        listTransforms: true
      })
    }

    let offset
    if (this.state.eventMode === 'pointer') {
      offset = e.y - this.originalTouch.y
    } else if (this.state.eventMode === 'touch') {
      offset = e.changedTouches[0].clientY - this.originalTouch.clientY
    }
    // console.log(offset)
    // console.log(offset)
    const children = e.currentTarget.parentElement.children
    let index = this.sizes.findIndex((item) => {
      return offset < item[0] + (item[1] / 2) && offset > item[0] - item[1]
    })
    if (index === -1) {
      if (Math.sign(offset) === -1) {
        index = 0
      } else {
        index = this.sizes.length - 1
      }
    }
    this.newPos = index

    // item index, prop, value
    const rafDispatch = new Map()

    // The initial move up and down
    // loops through array to adjust all elements according to position
    for (let i=0; i<Math.abs(index - this.currentIndex); i++) {
      const j = i * Math.sign(offset) * -1 + index
      if (j < this.sizes.length) {
        const childDir = this.stepSize * Math.sign(offset) * -1
        rafDispatch.set(j, ['transform', `translate3d(0, ${childDir}px, 0)`])
        this.sizes[j][2] = true
      }
    }

    // When they move it back in the other direction, we have to reset
    const bounds = [index + 1, this.sizes.length]
    if (Math.sign(offset) === -1) {
      bounds[0] = 0
      bounds[1] = index

      if (this.currentIndex !== this.sizes.length - 1) {
        // these are workarounds for skipping weirdness??
        rafDispatch.set(this.currentIndex + 1, ['transform', ''])
      }
    } else {
      if (this.currentIndex !== 0) {
        rafDispatch.set(this.currentIndex - 1, ['transform', ''])
      }
    }
    for (let i=bounds[0]; i<bounds[1]; i++) {
      if (this.sizes[i][2]) {
        rafDispatch.set(i, ['transform', ''])
        this.sizes[i][2] = false
      }
    }

    // movement of the mouseover
    rafDispatch.set(this.currentIndex, ['transform', `translate3d(0, ${offset}px, 0)`])

    // Runs all the transitions batched
    requestAnimationFrame(() => {
      rafDispatch.forEach(function(item, key) {
        children[key].style[item[0]] = item[1]
      })
    })
  }
  onUp = e => {
    this.isBeingMoved = false
    const style = e.currentTarget.style
    if (this.hasBeenMoved === false) {
      const currentId = this.state.order[this.currentIndex]
      if (this.props.task && this.props.task === currentId) {
        return
      } else if (this.props.task) {
        // allows the onChange event to fire.
        requestAnimationFrame(() => window.history.back())
      } else {
        this.props.triggerTask({id: currentId})()
      }
    } else if (this.newPos !== this.currentIndex) {
      const offset = this.sizes[this.newPos][0]
      requestAnimationFrame(() => {
        style.transition = '150ms ease transform'
        style.transform = `translate3d(0, ${offset}px, 0)`
      })

      const newOrder = this.state.order.slice()
      const idToMove = newOrder.splice(this.currentIndex, 1)[0]
      newOrder.splice(this.newPos, 0, idToMove)


      setTimeout(() => {
        this.setState({
          listTransforms: false,
          order: newOrder,
        })
        CombinedCollection.updateOrder(this.props.list, newOrder)
      }, 200)
    } else {
      requestAnimationFrame(() => {
        style.transition = '150ms ease transform'
        style.transform = ''
      })

      setTimeout(() => {
        this.setState({
          listTransforms: false
        })
      }, 200)
    }

    setTimeout(() => {
      style.transition = ''
    }, 175)
  }
  render() {
    const className = 'tasks-list' + (this.state.listTransforms ? ' tasks-transition' : '')
    return (
      <ul className={className}>
        {this.state.order.map(item => {
          const task = this.taskMap.get(item)
          return (
            <Task
              key={task.id}
              data={task}
              selectedTask={this.props.task}
              eventMode={this.state.eventMode}
              onDown={this.onDown}
              onMove={this.onMove}
              onUp={this.onUp}
              // best way to clean out the style prop
              ref={el => { if (el) el.base.style.transform = '' }}
            />
          )
        })}
      </ul>
    )
  }
}
