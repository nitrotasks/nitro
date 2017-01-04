import preact from 'preact'
import { route } from 'preact-router'
import { ListsCollection } from '../models/lists.js'

export default class Lists extends preact.Component {
  navigate(id) {
    return () => {
      route(`/lists/${id}`)
    }
  }
  render() {
    let focus = []
    let lists = []
    ListsCollection.all().forEach((item) => {
      let el = (
        <li onClick={this.navigate(item.id)}>
          <span class="icon"></span>
          <span class="label">{item.name}</span>
          <span class="count">{Math.round(Math.random()*20)}</span>
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
          <h1>Nitro</h1>
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
          <li class="create">
            <span class="icon"></span>
            <span class="label">Create List</span>
          </li>
        </ul>
      </div>
    )
  }
}