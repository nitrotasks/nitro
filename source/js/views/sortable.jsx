import preact from 'preact'

import Task from './task.jsx'
import { ListsCollection } from '../models/listsCollection.js'

export default class Sortable extends preact.Component {
  constructor(props) {
    super(props)

    const newState = this.updateProps(props)
    this.taskMap = newState.taskMap

    this.state = {
      order: newState.order,
      listTransforms: false
    }
  }
  componentWillReceiveProps(newProps) {
    const newState = this.updateProps(newProps)
    this.taskMap = newState.taskMap
    this.setState({
      order: newState.order
    })
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
  triggerTouchStart = e => {
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
      this.originalTouch = e.touches[0]
    }
  }
  triggerTouchMove = e => {
    if (this.props.task) {
      return
    }

    e.preventDefault()
    if (this.hasBeenMoved === false) {
      e.currentTarget.style.transition = 'none'
      this.hasBeenMoved = true
      this.setState({
        listTransforms: true
      })
    }
    const offset = e.changedTouches[0].clientY - this.originalTouch.clientY
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
  triggerTouchEnd = e => {
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

      ListsCollection.updateOrder(this.props.list, newOrder)

      const children = Array.from(e.currentTarget.parentElement.children)
      setTimeout(() => {
        children.forEach((item) => {
          item.style.transform = ''
        })

        this.setState({
          listTransforms: false,
          order: newOrder,
        })

      }, 200)
    } else {
      requestAnimationFrame(() => {
        style.transition = '150ms ease transform'
        style.transform = ''
      })

      this.setState({
        listTransforms: false
      })
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
              onTouchStart={this.triggerTouchStart}
              onTouchMove={this.triggerTouchMove}
              onTouchEnd={this.triggerTouchEnd}
              onTouchCancel={this.triggerTouchEnd}
            />
          )
        })}
      </ul>
    )
  }
}
