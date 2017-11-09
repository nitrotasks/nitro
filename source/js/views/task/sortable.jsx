import preact from 'preact'

import Task from './taskitem.jsx'
import { go, back } from '../../stores/navigation.js'
import { CombinedCollection } from '../../models/combinedCollection.js'

const pressDelay = 600

export default class Sortable extends preact.Component {
  constructor(props) {
    super(props)

    const newState = this.updateProps(props)
    this.taskMap = newState.taskMap
    this.isBeingMoved = false
    this.timeouts = []

    this.eventMode = null
    this.inProgress = false

    this.state = {
      order: newState.order,
      listTransforms: false
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
      order: props.listOrder || [],
      taskMap: taskMap
    }
  }
  onDown = e => {
    if (e.type === 'touchstart') {
      this.eventMode = 'touch'
      this.inProgress = true

    // stops propagation of touchstart -> mousedown
    } else if (e.type === 'mousedown' && this.inProgress === true) {
      return
    } else {
      this.eventMode = 'mouse'
    }

    // tests for primary mouse button
    if (this.eventMode === 'pointer' && e.which && e.which !== 1) {
      return
    }

    // there should be a better way to do this
    // but cause of hacked up pointer and touchevents, you can't just stop propagation
    if (e.target.className === 'check' || e.target.className === 'box') {
      return
    }

    // TODO: Distinguish between click & drag drop
    this.currentElement = e.currentTarget.offsetTop
    this.currentIndex = Array.from(e.currentTarget.parentElement.children).indexOf(e.currentTarget)
    this.newPos = this.currentIndex
    this.hasBeenMoved = false
    this.pressedAt = Date.now()

    const node = e.currentTarget
    this.currentOffset = 0
    this.canMove = false

    // press and hold, touch only interaction
    // because touch-action: press and hold doesn't exist grr
    if (this.eventMode === 'touch') {
      this.timeouts.push(setTimeout(() => {
        if (Math.abs(this.currentOffset) < 20) {
          requestAnimationFrame(() => {
            node.classList.add('active')
          })
          this.canMove = true
        }
      }, pressDelay))
    }

    if (!this.props.task) {
      this.sizes = Array.from(e.currentTarget.parentElement.children).map((item) => {
        // cumualitive position, height of elem, has transformed?
        return [item.offsetTop - this.currentElement, item.offsetHeight, false]
      })
      this.stepSize = e.currentTarget.offsetHeight
      this.originalNode = e.currentTarget

      if (this.eventMode === 'pointer' || this.eventMode === 'mouse') {
        this.isBeingMoved = true
        this.originalTouch = e
        if (this.eventMode === 'pointer') {
          e.currentTarget.setPointerCapture(e.pointerId)
        }
      } else if (this.eventMode === 'touch') {
        this.originalTouch = e.touches[0]
      }
    }
  }
  onMove = e => {
    // stops the mouseup event from working, when touch has overtaken
    if (e.type === 'mousemove' && this.eventMode === 'touch') {
      return
    }

    if (this.props.task) {
      return
    }

    // makes sure the same cursor is moving things
    if (this.eventMode === 'pointer' &&
        (!this.isBeingMoved || this.originalTouch.pointerId !== e.pointerId)) {
      return
    } else if (this.eventMode === 'mouse' && this.isBeingMoved === false) {
      return
    }

    // calculates how much it's moved
    let offset
    if (this.eventMode === 'pointer' || this.eventMode === 'mouse') {
      offset = e.y - this.originalTouch.y
    } else if (this.eventMode === 'touch') {
      offset = e.changedTouches[0].clientY - this.originalTouch.clientY
    }
    this.currentOffset = offset

    if ((this.eventMode === 'pointer' || this.eventMode === 'mouse') && Math.abs(offset) > 15 && !this.canMove) {
      const node = this.originalNode
      requestAnimationFrame(() => {
        node.classList.add('active')
        node.style.transition = '75ms ease transform'
        setTimeout(() => {
          node.style.transition = 'none'
        }, 101)
      })
      this.canMove = true
    }

    // prevents if they're just trying to click it
    if (!this.canMove) {
      if (Date.now() - this.pressedAt > pressDelay) {
        this.originalNode.classList.remove('active')
      }
      return
    }

    e.preventDefault()
    if (this.hasBeenMoved === false) {
      this.originalNode.style.transition = 'none'
      this.hasBeenMoved = true
      this.setState({
        listTransforms: true
      })
    }

    const children = this.originalNode.parentElement.children
    requestAnimationFrame(() => {
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
      // requestAnimationFrame(() => {
      rafDispatch.forEach(function(item, key) {
        children[key].style[item[0]] = item[1]
      })
    // })
    })
  }
  onUp = e => {
    // stops the mouseup event from working, when touch has overtaken
    if (e.type === 'mouseup' && this.eventMode === 'touch') {
      return
    }

    if (this.eventMode === 'pointer' && e.which && e.which !== 1) {
      return
    }

    // there should be a better way to do this
    // but cause of hacked up pointer and touchevents, you can't just stop propagation
    if (e.target.className === 'check' || e.target.className === 'box') {
      return
    }

    this.isBeingMoved = false
    const node = this.originalNode
    const style = this.originalNode.style

    // offset calculations
    const oldOffset = this.currentOffset
    this.timeouts.forEach(i => clearTimeout(i))
    this.timeouts = []
    requestAnimationFrame(() => {
      node.classList.remove('active')
    })
    // finds the actual offset
    let offset
    if (typeof this.originalTouch === 'undefined') {
      offset = 0
    } else if (this.eventMode === 'pointer' || this.eventMode === 'mouse') {
      offset = e.y - this.originalTouch.y
    } else if (this.eventMode === 'touch') {
      offset = e.changedTouches[0].clientY - this.originalTouch.clientY
    }

    if (this.hasBeenMoved === false) {
      const currentId = this.state.order[this.currentIndex]
      if (this.props.task && this.props.task === currentId) {
        return
      } else if (this.props.task) {
        // allows the onChange event to fire.
        requestAnimationFrame(() => back())
      } else if (Math.abs(offset) > 20 || Math.abs(oldOffset) > 20) {
        return
      } else {
        go('/lists/' + this.props.list + '/' + currentId)
      }
    } else if (this.newPos !== this.currentIndex) {
      const offset = this.sizes[this.newPos][0]
      requestAnimationFrame(() => {
        style.transition = '150ms ease-out transform'
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
        style.transition = '150ms ease-out transform'
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
      this.inProgress = false
    }, 175)
  }
  render() {
    const className = 'tasks-list' + (this.state.listTransforms ? ' tasks-transition' : '')
    let shouldMove = false
    return (
      <ul className={className}>
        {this.state.order.map(item => {
          const task = this.taskMap.get(item)
          if (this.props.task === task.id && window.innerWidth >= 700) {
            shouldMove = true
          }
          return (
            <Task
              key={task.id}
              data={task}
              currentList={this.props.list}
              selectedTask={this.props.task}
              shouldMove={shouldMove}
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
