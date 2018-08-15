import React from 'react'
import {
  View,
  TextInput,
  Image,
  StyleSheet,
  findNodeHandle
} from 'react-native'
import PropTypes from 'prop-types'

import { vars } from '../../styles.js'
import { UiService } from '../../services/uiService.js'
import addIcon from '../../../assets/icons/custom/add.svg'
import searchIcon from '../../../assets/icons/custom/search.svg'
import { TouchableOpacity } from '../reusable/touchableOpacity.jsx'

export class ListHeader extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    title: PropTypes.string,
    subtitle: PropTypes.string,
    backFn: PropTypes.func,
    actionFn: PropTypes.func,
    hideClose: PropTypes.bool
  }
  wrapper = React.createRef()

  componentDidMount() {
    this.wrapperNode = findNodeHandle(this.wrapper.current)
    this.wrapperNode.addEventListener('touchstart', this.triggerTouchStart)
  }
  componentWillUnmount() {
    this.wrapperNode.removeEventListener('touchstart', this.triggerTouchStart)
  }
  triggerLists = () => {
    UiService.setCardPosition('toggle', true, true)
  }
  triggerAddTask = () => {
    console.log('add task triggered')
  }
  triggerTouchStart = e => {
    UiService.state.headerEvent = e.target
  }
  triggerMax() {
    requestAnimationFrame(() => {
      const pos =
        UiService.state.cardPosition === 'map' ||
        UiService.state.cardPosition === 'max'
          ? 'default'
          : 'max'
      UiService.setCardPosition(pos, true, true)
    })
  }
  render() {
    return (
      <View
        style={styles.wrapper}
        ref={this.wrapper}
        className={this.props.className || ''}
      >
        <View style={styles.flexWrapper}>
          <View
            style={styles.pillWrapper}
            onClick={this.triggerMax}
            className="desktop-invisible"
          >
            <View style={styles.pill} />
          </View>
          <View style={styles.bottomWrapper}>
            <View style={styles.textWrapper}>
              <TextInput
                placeholder="Search"
                style={styles.text}
                numberOfLines={1}
              />
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.add} onClick={this.triggerAddTask}>
          <View style={styles.iconInner}>
            <Image source={addIcon} resizeMode="contain" style={styles.icon} />
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}
const paddingVertical = 12
const styles = StyleSheet.create({
  wrapper: {
    touchAction: 'none',
    boxShadow: '0 -1px 0 rgba(0,0,0,0.05) inset',
    flexDirection: 'row'
  },
  flexWrapper: {
    flex: 1,
    paddingBottom: paddingVertical
  },
  pillWrapper: {
    height: paddingVertical,
    paddingTop: paddingVertical / 2,
    paddingLeft: vars.padding * 2 + 25
  },
  pill: {
    backgroundColor: '#d8d8d8',
    width: 36,
    height: 5,
    borderRadius: 5,
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  bottomWrapper: {
    display: 'flex',
    flexDirection: 'row'
  },
  textWrapper: {
    flex: 1,
    paddingLeft: vars.padding,
    paddingTop: 6,
    paddingBottom: 4
  },
  text: {
    fontFamily: vars.fontFamily,
    lineHeight: 34,
    color: vars.headerColor,
    paddingLeft: vars.padding * 2,
    fontSize: 16,
    backgroundColor: '#e6e6e6',
    backgroundImage: `url(${searchIcon})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: '5px 50%',
    borderRadius: 5,
    outline: '0'
  },
  textHidden: {
    opacity: 0
  },
  list: {
    paddingLeft: vars.padding,
    paddingRight: vars.padding
  },
  add: {
    paddingLeft: vars.padding,
    paddingRight: vars.padding
  },
  icon: {
    height: 25,
    width: 25
  },
  iconInner: {
    marginTop: 'auto',
    marginBottom: 'auto'
  }
})
