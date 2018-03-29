import React from 'react'
import { Image, View, Text, StyleSheet } from 'react-native'
import { Link } from '../link.jsx'

import { vars } from '../../styles'
import listIcon from '../../../assets/icons/feather/list.svg'
import inboxIcon from '../../../assets/icons/feather/inbox.svg'
import todayIcon from '../../../assets/icons/feather/today.svg'
import nextIcon from '../../../assets/icons/feather/next.svg'
import allIcon from '../../../assets/icons/feather/all.svg'

const iconMap = new Map()
iconMap.set('inbox', inboxIcon)
iconMap.set('today', todayIcon)
iconMap.set('next', nextIcon)
iconMap.set('all', allIcon)

export class ListItem extends React.Component {
  render() {
    const id = this.props.id
    let icon = iconMap.get(this.props.id)
    if (typeof icon === 'undefined') {
      icon = listIcon
    }
    return (
      <Link to={`/${this.props.id}`}>
        <View style={styles.wrapper}>
          <View style={styles.iconWrapper}>
            <Image source={icon} resizeMode="contain" style={styles.icon} />
          </View>
          <View style={styles.nameWrapper}>
            <Text style={styles.name}>{this.props.name}</Text>
          </View>
          <View style={styles.countWrapper}>
            <Text style={styles.count}>{this.props.count}</Text>
          </View>
        </View>
      </Link>
    )
  }
}

const height = vars.padding * 2.75
const iconHeight = vars.padding * 1.5
const iconWidth = vars.padding * 2
const iconPadding = (height - iconHeight) / 2
const styles = StyleSheet.create({
  wrapper: {
    height: height,
    paddingLeft: vars.padding / 2,
    paddingRight: vars.padding / 2,
    marginBottom: vars.padding * 0.25,
    flex: 1,
    flexDirection: 'row'
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
    fontSize: vars.padding,
    fontWeight: '600',
    lineHeight: height,
    color: vars.navTextColorMuted
  }
})
