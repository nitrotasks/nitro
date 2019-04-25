import React, { useState } from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import { TasksExpandedService } from '../../services/tasksExpandedService.js'
import { SidebarService } from '../../services/sidebarService.js'
import { UiService } from '../../services/uiService.js'

import { vars } from '../../styles'
import listIcon from '../../../assets/icons/feather/list.svg'
import inboxIcon from '../../../assets/icons/feather/inbox.svg'
import todayIcon from '../../../assets/icons/feather/today.svg'
import nextIcon from '../../../assets/icons/feather/next.svg'
import taskIcon from '../../../assets/icons/material/task.svg'
import headerIcon from '../../../assets/icons/material/drop-down.svg'

const iconMap = new Map()
iconMap.set('inbox', inboxIcon)
iconMap.set('today', todayIcon)
iconMap.set('next', nextIcon)
iconMap.set('task', taskIcon)
iconMap.set('header', headerIcon)

const triggerClick = url => () => {
  const parsedUrl = url.split('/')
  if (parsedUrl.length === 3) {
    TasksExpandedService.goToAnyTask(parsedUrl[1], parsedUrl[2])
  } else {
    UiService.setCardPosition('map')
    TasksExpandedService.go(url)
  }
  SidebarService.hideSearchResults()
}

const triggerKeyDown = url => e => {
  // enter
  const keycode = e.keyCode
  if (keycode === 13) {
    triggerClick(url)()
  } else if (keycode === 38) {
    const el = e.currentTarget.previousSibling
    if (el) {
      e.preventDefault()
      el.focus()
    } else {
      SidebarService.focusSearchBox()
    }
  } else if (keycode === 40) {
    const el = e.currentTarget.nextSibling
    if (el) {
      e.preventDefault()
      el.focus()
    }
  }
}

export const SearchItem = ({ icon, name, subtitle, url }) => {
  const [hover, setHover] = useState(false)
  const [focus, setFocus] = useState(false)

  let image = iconMap.get(icon)
  if (image === undefined) {
    image = listIcon
  }
  const style = focus
    ? [styles.resultWrapper, styles.focus]
    : hover
    ? [styles.resultWrapper, styles.hover]
    : styles.resultWrapper
  return (
    <TouchableOpacity
      accessible={true}
      style={style}
      onPress={triggerClick(url)}
      onKeyDown={triggerKeyDown(url)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
    >
      <View style={styles.iconWrapper}>
        <Image source={image} resizeMode="contain" style={styles.icon} />
      </View>
      <View style={styles.nameWrapper}>
        <Text style={styles.name}>{name}</Text>
        {subtitle === null ? null : (
          <Text style={styles.subtitle}>{subtitle}</Text>
        )}
      </View>
    </TouchableOpacity>
  )
}
const iconHeight = vars.padding * 1.125
const iconWidth = vars.padding * 1.75
const iconPadding = vars.padding * 0.375
const styles = StyleSheet.create({
  resultWrapper: {
    cursor: 'default',
    paddingLeft: vars.padding * 0.25,
    paddingRight: vars.padding * 1,
    paddingTop: vars.padding * 0.25,
    paddingBottom: vars.padding * 0.25,
    flex: 1,
    flexDirection: 'row',
    borderRadius: 4
  },
  iconWrapper: {
    width: iconWidth,
    paddingTop: iconPadding,
    paddingBottom: iconPadding,
    marginRight: vars.padding * 0.25
  },
  icon: {
    height: iconHeight
  },
  nameWrapper: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: vars.padding * 0.125
  },
  name: {
    fontFamily: vars.fontFamily,
    fontSize: vars.padding,
    fontWeight: '600',
    color: vars.navTextColor
  },
  subtitle: {
    fontFamily: vars.fontFamily,
    fontSize: vars.padding * 0.85,
    color: vars.navTextColorMuted
  },
  focus: {
    backgroundColor: vars.focusColor,
    outlineWidth: 0
  },
  hover: {
    borderRadius: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.025)'
  }
})
