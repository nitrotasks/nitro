import React from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'
import { Link } from '../reusable/link.jsx'

import { vars } from '../../styles'
import listIcon from '../../../assets/icons/feather/list.svg'
import inboxIcon from '../../../assets/icons/feather/inbox.svg'
import todayIcon from '../../../assets/icons/feather/today.svg'
import nextIcon from '../../../assets/icons/feather/next.svg'
import taskIcon from '../../../assets/icons/material/task.svg'

const iconMap = new Map()
iconMap.set('inbox', inboxIcon)
iconMap.set('today', todayIcon)
iconMap.set('next', nextIcon)
iconMap.set('task', taskIcon)

export class SearchContainer extends React.Component {
  render() {
    return (
      <View style={styles.wrapper}>
        {this.props.results.map(i => {
          let icon = iconMap.get(i.icon)
          if (typeof icon === 'undefined') {
            icon = listIcon
          }
          return (
            <Link key={i.id} to={i.url}>
              <View style={styles.resultWrapper}>
                <View style={styles.iconWrapper}>
                  <Image
                    source={icon}
                    resizeMode="contain"
                    style={styles.icon}
                  />
                </View>
                <View style={styles.nameWrapper}>
                  <Text style={styles.name}>{i.name}</Text>
                  {i.subtitle === null ? null : (
                    <Text style={styles.subtitle}>{i.subtitle}</Text>
                  )}
                </View>
              </View>
            </Link>
          )
        })}
      </View>
    )
  }
}

const iconHeight = vars.padding * 1.125
const iconWidth = vars.padding * 2
const iconPadding = vars.padding * 0.375
const styles = StyleSheet.create({
  wrapper: {
    paddingBottom: vars.padding * 0.5
  },
  resultWrapper: {
    paddingLeft: vars.padding * 0.5,
    paddingRight: vars.padding * 1,
    paddingBottom: vars.padding * 0.25,
    flex: 1,
    flexDirection: 'row'
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
    paddingTop: vars.padding * 0.125,
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
