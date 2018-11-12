import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

import { vars } from '../styles.js'
import { ContextMenuService } from '../services/contextMenuService.js'

const MENU_ITEM_HEIGHT = 42
export class ContextMenu extends React.Component {
  state = {
    x: 0,
    y: 0,
    show: false,
    items: []
  }
  componentWillMount() {
    ContextMenuService.bind('create', this.createMenu)
  }
  componentWillUnmount() {
    ContextMenuService.unbind('create', this.createMenu)
  }
  createMenu = params => {
    const [x, y, anchor, secondAnchor, items] = params
    const newState = {}
    if (anchor === 'top') {
      newState.y = y
    } else if (anchor === 'bottom') {
      newState.y = y - items.length * MENU_ITEM_HEIGHT - vars.padding
    }
    if (secondAnchor === 'left') {
      newState.x = x
    } else if (secondAnchor === 'right') {
      newState.x = (window.innerWidth - x) * -1
    }
    newState.show = true
    newState.items = items
    this.setState(newState)
  }
  triggerHide = e => {
    e.preventDefault()
    this.setState({
      show: false
    })
  }
  render() {
    let wrapperStyles = styles.wrapper
    let pointerEvents = 'auto'
    if (!this.state.show) {
      wrapperStyles = [styles.wrapper, styles.wrapperHide]
      pointerEvents = 'none'
    }
    const menuStyle = {
      top: this.state.y
    }
    if (this.state.x > 0) {
      menuStyle.left = this.state.x
    } else {
      menuStyle.right = Math.abs(this.state.x)
    }
    const menuStyleComposed = [styles.menu, menuStyle]
    return (
      <View
        onClick={this.triggerHide}
        onContextMenu={this.triggerHide}
        style={wrapperStyles}
        pointerEvents={pointerEvents}
      >
        <View style={menuStyleComposed}>
          {this.state.items.map((item, key) => {
            return (
              <View
                key={key}
                style={styles.menuItem}
                onClick={item.action}
                className="hover-5"
              >
                <Text style={styles.menuText}>{item.title}</Text>
              </View>
            )
          })}
        </View>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  wrapper: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1
  },
  wrapperHide: {
    opacity: 0
  },
  menu: {
    position: 'absolute',
    backgroundColor: vars.backColor,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#ccc',
    paddingTop: vars.padding / 2,
    paddingBottom: vars.padding / 2
  },
  menuItem: {
    paddingLeft: vars.padding,
    paddingRight: vars.padding,
    cursor: 'default'
  },
  menuItemHover: {
    backgroundColor: 'rgba(0,0,0,0.1)'
  },
  menuText: {
    fontFamily: vars.fontFamily,
    fontSize: 16,
    lineHeight: MENU_ITEM_HEIGHT
  }
})
