import React, { useState } from 'react'
import { Image, View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { LinkComponent } from '../reusable/link.jsx'
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

const hideMenu = e => {
  e.currentTarget.blur()
  UiService.setCardPosition('map')

  setTimeout(() => {
    UiService.setCardScroll(0)
  }, 350)
}

const proxyOnClick = onClick => {
  return e => {
    e.preventDefault()
    onClick()
    hideMenu(e)
  }
}

const triggerNoOp = e => {
  e.preventDefault()
}

export const ListItem = ({ id, onClick, name, count, index }) => {
  const [hover, setHover] = useState(false)

  let icon = iconMap.get(id)
  if (typeof icon === 'undefined') {
    icon = listIcon
  }
  const style =
    UiService.state.currentList === id
      ? [styles.wrapper, styles.selected]
      : hover
      ? [styles.hover, styles.wrapper]
      : styles.wrapper
  return (
    <Draggable
      draggableId={'lists-' + id}
      index={index}
      isDragDisabled={
        // TODO: fix this dumb hack
        isNaN(parseInt(id)) || UiService.state.cardPosition !== 'max'
      }
      type="listsDroppable"
    >
      {(provided, snapshot) => (
        <LinkComponent
          onClick={onClick ? proxyOnClick(onClick) : hideMenu}
          to={onClick ? '/' : `/${id}`}
          innerRef={provided.innerRef}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onMouseDown={triggerNoOp}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={getItemStyle(
            snapshot.isDragging,
            provided.draggableProps.style
          )}
        >
          <TouchableOpacity style={style}>
            <View style={styles.iconWrapper}>
              <Image source={icon} resizeMode="contain" style={styles.icon} />
            </View>
            <View style={styles.nameWrapper}>
              <Text style={styles.name}>{name}</Text>
            </View>
            <View style={styles.countWrapper}>
              <Text style={styles.count}>{count}</Text>
            </View>
          </TouchableOpacity>
        </LinkComponent>
      )}
    </Draggable>
  )
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
  hover: {
    borderRadius: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.025)'
  },
  selected: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)'
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
    color: vars.navTextColor,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    paddingRight: vars.padding / 2
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
