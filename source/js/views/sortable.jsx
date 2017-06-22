import preact from 'preact'

import Task from './task.jsx'

export default class Sortable extends preact.Component {
  constructor(props) {
    super(props)
    this.state = {
      listTransforms: false
    }
  }
  triggerTouchStart = e => {
    // TODO: Distinguish between click & drag drop
    this.currentElement = e.currentTarget.offsetTop
    this.currentIndex = Array.from(e.currentTarget.parentElement.children).indexOf(e.currentTarget)
    e.currentTarget.style.transition = 'none'

    this.sizes = Array.from(e.currentTarget.parentElement.children).map((item) => {
      // cumualitive position, height of elem, has transformed?
      return [item.offsetTop - this.currentElement, item.offsetHeight, false]
    })
    this.stepSize = e.currentTarget.offsetHeight
    this.originalTouch = e.touches[0]
    this.hasBeenMoved = false

    this.setState({
      listTransforms: true
    })
  }
  triggerTouchMove = e => {
    e.preventDefault()
    this.hasBeenMoved = true
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

      if (this.currentIndex !== this.sizes.length) {
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
    if (this.newPos) {
      const offset = this.sizes[this.newPos][0]
      requestAnimationFrame(() => {
        style.transition = '200ms ease transform'
        style.transform = `translate3d(0, ${offset}px, 0)`
      })
    } else {
      requestAnimationFrame(() => {
        style.transition = '200ms ease transform'
        style.transform = ''
      })
    }

    setTimeout(() => {
      style.transition = ''
    }, 225)


    this.setState({
      listTransforms: false
    })
  }
  render() {
    const className = 'tasks-list' + (this.state.listTransforms ? ' tasks-transition' : '')
    return (
      <ul className={className}>
        {this.props.taskList.map(task => {
          return (
            <Task
              key={task.id}
              data={task}
              selectedTask={this.props.task}
              onClick={this.props.triggerTask(task)}
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
