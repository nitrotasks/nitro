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
    let items = []
    ListsCollection.all().forEach((item) => {
      items.push(
        <li onClick={this.navigate(item.id)}>{item.name}</li>
      )
    })
    return (
      <div class="lists-sidebar">
        <header class="material-header"> 
          <h1>Nitro</h1>
        </header>
        <ul class="lists-list">
          {items}
        </ul>
      </div>
    )
  }
}