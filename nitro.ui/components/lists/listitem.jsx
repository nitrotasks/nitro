import React from 'react'
import PropTypes from 'prop-types'
import { Image, View, Text, StyleSheet } from 'react-native'
import { Link } from '../reusable/link.jsx'
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
  proxyOnClick = () => {
    this.props.onClick()
    this.hideMenu()
  }
  hideMenu = e => {
    UiService.setCardPosition('map')
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
      UiService.state.currentList === this.props.id ? '' : 'hover-5'
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
        {(provided, snapshot) => {
          const draggableWrapper = (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              style={getItemStyle(
                snapshot.isDragging,
                provided.draggableProps.style
              )}
            >
              {inner}
            </div>
          )
          return this.props.onClick ? (
            <View onClick={this.proxyOnClick}>{draggableWrapper}</View>
          ) : (
            <Link onClick={this.hideMenu} to={`/${this.props.id}`}>
              {draggableWrapper}
            </Link>
          )
        }}
      </Draggable>
    )
  }
}

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
    flex: 1,
    flexDirection: 'row',
    marginBottom: 3
  },
  selected: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 5
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
    // borderRadius: isDragging ? 3 : 0,

    // // change background colour if dragging
    background: isDragging ? vars.dragColor : '',

    // styles we need to apply on draggables
    ...draggableStyle,

    cursor: 'default'
  }
  return style
}
