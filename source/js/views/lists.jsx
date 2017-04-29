import preact from 'preact'
import { route } from 'preact-router'
import { ListsCollection } from '../models/lists.js'
import { TasksCollection } from '../models/tasks.js'

export default class Lists extends preact.Component {
  constructor(props) {
    super(props)
    this.state = {
      lists: ListsCollection.all()
    }
  }
  componentWillMount() {
    TasksCollection.bind('update', this.update)
    ListsCollection.bind('update', this.update)
  }
  componentWillUnmount() {
    TasksCollection.unbind('update', this.update)
    ListsCollection.unbind('update', this.update)
  }
  // essentially just updates the count & lists in view
  update = () => {
    this.setState({
      lists: ListsCollection.all()
    })
  }
  navigate(id) {
    return () => {
      route(`/lists/${id}`)
    }
  }
  createList() {
    ListsCollection.add({
      name: Math.random().toString()
    })
  }
  render() {
    let focus = []
    let lists = []
    this.state.lists.forEach((item) => {
      const count = TasksCollection.getListCount(item.id)

      let el = (
        <li onClick={this.navigate(item.id)}>
          <span class="icon"></span>
          <span class="label">{item.name}</span>
          <span class="count">{count}</span>
        </li>
      )
      if (item.id === 'today' || item.id === 'next' || item.id === 'all') {
        focus.push(el)
      } else {
        lists.push(el)
      }
    })
    return (
      <div class="lists-sidebar">
        <header class="material-header"> 
          <div class="logo">
            <img src="/img/icons/logo.svg" />
          </div>
          <h1>NITRO</h1>
          <div class="menu">
            <img src="/img/icons/menu.svg" />
          </div>
        </header>
        <h2>Focus</h2>
        <ul class="lists-list">
          {focus}
        </ul>
        <h2>Lists</h2>
        <ul class="lists-list">
          {lists}
          <li class="create" onClick={this.createList}>
            <span class="icon"></span>
            <span class="label">Create List</span>
          </li>
        </ul>
      </div>
    )
  }
}