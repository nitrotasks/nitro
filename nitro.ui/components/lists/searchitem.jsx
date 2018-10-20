import React from 'react'
import PropTypes from 'prop-types'

import { View, Text, Image, StyleSheet } from 'react-native'
import { Link } from '../reusable/link.jsx'
import { TouchableOpacity } from '../reusable/touchableOpacity.jsx'

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

export class SearchItem extends React.Component {
  static propTypes = {
    icon: PropTypes.string,
    url: PropTypes.string,
    name: PropTypes.string,
    subtitle: PropTypes.string
  }
  render() {
    const { icon, url, name, subtitle } = this.props
    let image = iconMap.get(icon)
    if (typeof image === 'undefined') {
      image = listIcon
    }
    return (
      <Link to={url}>
        <TouchableOpacity style={styles.resultWrapper} className="hover-5">
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
      </Link>
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
