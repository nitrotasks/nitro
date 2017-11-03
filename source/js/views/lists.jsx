import preact from 'preact'
import { route } from 'preact-router'

import { CombinedCollection } from '../models/combinedCollection.js'

import authenticationStore from '../stores/auth.js'
import ContextMenuStore from '../stores/contextmenu.js'
import DialogBoxStore from '../stores/dialogbox.js'

export default class Lists extends preact.Component {
  state = {
    lists: CombinedCollection.getLists()
  }
  componentWillMount() {
    CombinedCollection.bind('update', this.update)
  }
  componentWillUnmount() {
    CombinedCollection.unbind('update', this.update)
  }
  // essentially just updates the count & lists in view
  update = () => {
    this.setState({
      lists: CombinedCollection.getLists()
    })
  }
  navigate(id) {
    return () => {
      route(`/lists/${id}`)
    }
  }
  createList() {
    if (document.documentElement.clientWidth >= 700) {
      const newList = CombinedCollection.addList({
        name: 'Untitled List'
      })
      route('/lists/' + newList.id + '#rename')
    } else {
      // mobile shows a dialog instead of creating a blank list
      DialogBoxStore.create({
        header: 'Create List',
        content: 'List Name',
        confirm: 'Create List',
        cancel: 'Cancel',
        type: 'input',
        callback: name => {
          if (name.slice(0, 9) === 'nitrosys-') {
            name = name.slice(9)
          }
          const newList = CombinedCollection.addList({
            name: name
          })
          route('/lists/' + newList.id)
        }
      })
    }
  }
  signOut = () => {
    authenticationStore.signOut()
  }
  triggerMenu = e => {
    const rect = e.currentTarget.getBoundingClientRect()
    ContextMenuStore.create(
      rect.right - 5,
      rect.top + 5,
      'top',
      'right',
      [
        {title: 'Settings', action: null},
        {title: 'Sign Out', action: this.signOut},
      ]
    )
  }
  render() {
    let focus = []
    let lists = []
    this.state.lists.forEach((item) => {
      let el = (
        <li onClick={this.navigate(item.id)} class={item.id}>
          <span class="icon"></span>
          <span class="label">{item.name}</span>
          <span class="count">{item.count}</span>
        </li>
      )
      if (item.id === 'inbox' || item.id === 'today' || item.id === 'next' || item.id === 'all') {
        focus.push(el)
      } else {
        lists.push(el)
      }
    })
    return (
      <div class="sidebar-container">
        <header class="material-header main-nav"> 
          <h1 class="brand header-child header-left">
            <img src="/img/icons/logo.svg" alt="Nitro Logo" />
            Nitro
          </h1>
          <h1 class="pwa header-child header-left">Lists</h1>
          <div class="search header-child">
            <img src="/img/icons/search.svg" alt="Search" />
          </div>
          <div class="header-child header-right" onClick={this.triggerMenu}>
            <img src="/img/icons/menu.svg" alt="Menu" />
          </div>
        </header>
      
        <div class="lists-sidebar">
          <div class="search-container">
            <input type="text" placeholder="Search Everything"/>
          </div>
          <ul class="lists-list">
            {focus}
            {lists}
            <li class="add" onClick={this.createList}>
              <span class="icon"></span>
              <span class="label">Add List</span>
            </li>
          </ul>
        </div>
      </div>
    )
  }
}