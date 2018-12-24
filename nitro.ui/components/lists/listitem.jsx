import React from 'react'
import PropTypes from 'prop-types'
import { Image, View, Text, StyleSheet } from 'react-native'
import { LinkComponent } from '../reusable/link.jsx'
import { TouchableOpacity } from '../reusable/touchableOpacity.jsx'
import { UiService } from '../../services/uiService.js'
import { Draggable } from 'react-beautiful-dnd'

import { vars } from '../../styles'
import listIcon from '../../../assets/icons/feather/list.svg'
import inboxIcon from '../../../assets/icons/feather/inbox.svg'
import todayIcon from '../../../assets/icons/feather/today.svg'
import nextIcon from '../../../assets/icons/feather/next.svg'
import allIcon from '../../../assets/icons/feather/all.svg'
import addIcon from '../../../assets/icons/feather/add.svg'

const iconMap = new Map()
iconMap.set('inbox', inboxIcon)
iconMap.set('today', todayIcon)
iconMap.set('next', nextIcon)
iconMap.set('all', allIcon)
iconMap.set('add', addIcon)

export class ListItem extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    name: PropTypes.string,
    count: PropTypes.number,
    onClick: PropTypes.func
  }
  proxyOnClick = e => {
    e.preventDefault()
    this.props.onClick()
    this.hideMenu(e)
  }
  hideMenu = e => {
    e.currentTarget.blur()
    UiService.setCardPosition('map')

    setTimeout(() => {
      UiService.setCardScroll(0)
    }, 350)
  }
  triggerNoOp = e => {
    e.preventDefault()
  }
  render() {
    let icon = iconMap.get(this.props.id)
    if (typeof icon === 'undefined') {
      icon = listIcon
    }
    const style =
      UiService.state.currentList === this.props.id
        ? [styles.wrapper, styles.selected]
        : styles.wrapper
    const className =
      'sidebar-item-focus-inner ' +
      (UiService.state.currentList === this.props.id ? '' : 'hover-5')

    const inner = (
      <TouchableOpacity style={style} className={className}>
        <View style={styles.iconWrapper}>
          <Image source={icon} resizeMode="contain" style={styles.icon} />
        </View>
        <View style={styles.nameWrapper}>
          <Text style={styles.name}>{this.props.name}</Text>
        </View>
        <View style={styles.countWrapper}>
          <Text style={styles.count}>{this.props.count}</Text>
        </View>
      </TouchableOpacity>
    )
    return (
      <Draggable
        draggableId={'lists-' + this.props.id}
        index={this.props.index}
        isDragDisabled={
          // TODO: fix this dumb hack
          isNaN(parseInt(this.props.id)) ||
          UiService.state.cardPosition !== 'max'
        }
        type="listsDroppable"
      >
        {(provided, snapshot) => (
          <LinkComponent
            onClick={this.props.onClick ? this.proxyOnClick : this.hideMenu}
            to={this.props.onClick ? '/' : `/${this.props.id}`}
            innerRef={provided.innerRef}
            onMouseDown={this.triggerNoOp}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className="sidebar-item-focus"
            style={getItemStyle(
              snapshot.isDragging,
              provided.draggableProps.style
            )}
          >
            {inner}
          </LinkComponent>
        )}
      </Draggable>
    )
  }
}

const borderRadius = 5
const height = vars.padding * 2.5
const iconHeight = vars.padding * 1.5
const iconWidth = vars.padding * 2
const iconPadding = (height - iconHeight) / 2
const styles = StyleSheet.create({
  wrapper: {
    height: height,
    paddingLeft: vars.padding * 0.3125,
    paddingRight: vars.padding * 0.5,
    paddingBottom: vars.padding * 0.25,
    borderRadius: borderRadius,
    flex: 1,
    flexDirection: 'row'
  },
  selected: {
    backgroundColor: 'rgba(0,0,0,0.05)'
  },
  iconWrapper: {
    width: iconWidth,
    paddingTop: iconPadding,
    paddingBottom: iconPadding,
    marginRight: vars.padding / 2
  },
  icon: {
    height: iconHeight
  },
  nameWrapper: {
    flex: 1
  },
  name: {
    fontFamily: vars.fontFamily,
    fontSize: vars.padding * 1.125,
    fontWeight: '600',
    lineHeight: height,
    color: vars.navTextColor
  },
  countWrapper: {
    paddingLeft: vars.padding / 4,
    paddingRight: vars.padding / 4
  },
  count: {
    fontFamily: vars.fontFamily,
    fontSize: vars.padding,
    fontWeight: '600',
    lineHeight: height,
    color: vars.navTextColorMuted
  }
})

const getItemStyle = (isDragging, draggableStyle) => {
  const style = {
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    textDecoration: 'none',
    borderRadius: isDragging ? borderRadius : 0,
    marginBottom: 3,

    // change background colour if dragging
    background: isDragging ? vars.dragColor : '',

    // styles we need to apply on draggables
    ...draggableStyle,

    cursor: 'default'
  }
  return style
}
