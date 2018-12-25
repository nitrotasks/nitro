import React from 'react'
import PropTypes from 'prop-types'
import { TasksExpandedService } from '../../services/tasksExpandedService.js'
import { SidebarService } from '../../services/sidebarService.js'
import { UiService } from '../../services/uiService.js'

import { View, Text, Image, StyleSheet } from 'react-native'
import { TouchableOpacity } from '../reusable/touchableOpacity.jsx'

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

export class SearchItem extends React.Component {
  static propTypes = {
    icon: PropTypes.string,
    url: PropTypes.string,
    name: PropTypes.string,
    subtitle: PropTypes.string
  }
  triggerClick = () => {
    const { url } = this.props
    const parsedUrl = url.split('/')
    UiService.setCardPosition('map')
    if (parsedUrl.length === 3) {
      TasksExpandedService.goToAnyTask(parsedUrl[1], parsedUrl[2])
    } else {
      TasksExpandedService.go(url)
    }
    SidebarService.hideSearchResults()
  }
  triggerKeyDown = e => {
    // enter
    const keycode = e.keyCode
    if (keycode === 13) {
      this.triggerClick()
    } else if (keycode === 38) {
      const el = e.currentTarget.previousSibling
      if (el) {
        el.focus()
      } else {
        SidebarService.focusSearchBox()
      }
    } else if (keycode === 40) {
      const el = e.currentTarget.nextSibling
      if (el) el.focus()
    }
  }
  render() {
    const { icon, name, subtitle } = this.props
    let image = iconMap.get(icon)
    if (typeof image === 'undefined') {
      image = listIcon
    }
    return (
      <TouchableOpacity
        accessible={true}
        style={styles.resultWrapper}
        className="hover-5 search-item-focus"
        onClick={this.triggerClick}
        onKeyDown={this.triggerKeyDown}
        onFocus={this.triggerFocus}
        onBlur={this.triggerBlur}
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
  }
})
