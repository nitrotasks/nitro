import preact from 'preact'
import { route, Link } from 'preact-router'

import { NitroSdk } from '../../../nitro.sdk'

import ContextMenuStore from '../stores/contextmenu.js'
import DialogBoxStore from '../stores/dialogbox.js'
import { propsCompare } from '../helpers/compare.js'

import logoSvg from '../../../assets/icons/logo.svg'
import searchSvg from '../../../assets/icons/search.svg'
import menuSvg from '../../../assets/icons/menu.svg'

class SidebarItem extends preact.Component {
  shouldComponentUpdate(nextProps) {
    return propsCompare(this, nextProps)
  }
  render() {
    const className = 'list-' + this.props.id + (this.props.selected ? ' selected' : '')
    return (
      <li class={className}>
        <Link href={'/lists/' + this.props.id}>
          <span class={'icon icon-' + this.props.id}></span>
          <span class="label">{this.props.name}</span>
          <span class="count">{this.props.count}</span>
        </Link>
      </li>
    )
  }
}

export default class Lists extends preact.Component {
  state = {
    currentList: null,
    lists: NitroSdk.getLists(),
  }
  componentWillMount() {
    NitroSdk.bind('update', this.update)
    NitroSdk.bind('list-change', this.listChange)
  }
  componentWillUnmount() {
    NitroSdk.unbind('update', this.update)
    NitroSdk.unbind('list-change', this.listChange)
  }
  // essentially just updates the count & lists in view
  update = () => {
    this.setState({
      lists: NitroSdk.getLists()
    })
  }
  // much faster than using preact-router?
  listChange = (list) => {
    this.setState({
      currentList: list
    })
  }
  createList() {
    if (document.documentElement.clientWidth >= 700) {
      const newList = NitroSdk.addList({
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
          const newList = NitroSdk.addList({
            name: name
          })
          route('/lists/' + newList.id)
        }
      })
    }
  }
  signOut = () => {
    NitroSdk.signOut()
  }
  triggerSync = () => {
    NitroSdk.manualSync()
  }
  triggerMenu = e => {
    const rect = e.currentTarget.getBoundingClientRect()
    ContextMenuStore.create(
      rect.right - 5,
      rect.top + 5,
      'top',
      'right',
      [
        {title: 'Sync', action: this.triggerSync},
        {title: 'Settings', action: null},
        {title: 'Sign Out', action: this.signOut},
      ]
    )
  }
  render() {
    let focus = []
    let lists = []
    this.state.lists.forEach((item) => {
      const selected = this.state.currentList === item.id
      const el = <SidebarItem key={item.id} id={item.id} name={item.name} count={item.count} selected={selected} />
      if (item.id === 'inbox' || item.id === 'today' || item.id === 'next' || item.id === 'all') {
        focus.push(el)
      } else {
        lists.push(el)
      }
    })
    const className = 'sidebar-container' + (this.state.currentList ? ' hide' : '')
    return (
      <div class={className}>
        <div class="material-header-wrapper">
          <header class="material-header main-nav"> 
            <h1 class="brand header-child header-left">
              <img src={logoSvg} alt="Nitro Logo" />
              Nitro
            </h1>
            <h1 class="pwa header-child header-left">Lists</h1>
            <div class="search header-child">
              <img src={searchSvg} alt="Search" />
            </div>
            <div class="header-child header-right" onClick={this.triggerMenu}>
              <img src={menuSvg} alt="Menu" />
            </div>
          </header>
        </div>
      
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