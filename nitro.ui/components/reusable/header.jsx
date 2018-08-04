import React from 'react'
import { View, Text, StyleSheet, findNodeHandle } from 'react-native'
import PropTypes from 'prop-types'

import { vars } from '../../styles.js'
import { UiStore } from '../../stores/uiStore.js'
import CloseIcon from '../../../dist/icons/close.svg'
import { TouchableOpacity } from './touchableOpacity.jsx'

// not used for all headers yet...
export class Header extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    title: PropTypes.string,
    subtitle: PropTypes.string,
    backFn: PropTypes.func,
    actionIcon: PropTypes.node,
    actionFn: PropTypes.func,
    hideClose: PropTypes.bool,
  }
  wrapper = React.createRef()

  componentDidMount() {
    this.wrapperNode = findNodeHandle(this.wrapper.current)
    this.wrapperNode.addEventListener('touchstart', this.triggerTouchStart)
  }
  componentWillUnmount() {
    this.wrapperNode.removeEventListener('touchstart', this.triggerTouchStart)
  }
  triggerBack = () => {
    UiStore.goBack('/')
  }
  triggerTouchStart = e => {
    UiStore.state.headerEvent = e.target
  }
  triggerMax() {
    requestAnimationFrame(() => {
      const pos =
        UiStore.state.cardPosition === 'map' ||
        UiStore.state.cardPosition === 'max'
          ? 'default'
          : 'max'
      UiStore.setCardPosition(pos, true, true)
    })
  }
  render() {
    let subtitleStyle,
      subtitleElement,
      actionIcon = null
    if (typeof this.props.subtitle !== 'undefined') {
      subtitleStyle = {
        lineHeight: vars.headerHeight - paddingVertical * 2 - 18,
      }
      subtitleElement = (
        <Text numberOfLines={1} style={styles.subtitle}>
          {this.props.subtitle}&nbsp;
        </Text>
      )
    }

    if (typeof this.props.actionIcon !== 'undefined') {
      const style =
        this.props.hideClose === true ? styles.close : styles.secondary
      actionIcon = (
        <TouchableOpacity style={style} onClick={this.props.actionFn}>
          <View style={styles.iconInner}>{this.props.actionIcon}</View>
        </TouchableOpacity>
      )
    }
    const closeIcon =
      this.props.hideClose === true ? null : (
        <TouchableOpacity
          style={styles.close}
          onClick={this.props.backFn || this.triggerBack}
        >
          <View style={styles.iconInner}>
            <CloseIcon style={{ fill: vars.headerIconColor }} />
          </View>
        </TouchableOpacity>
      )
    const pillWrapperStyles =
      actionIcon && closeIcon
        ? [styles.pillWrapper, styles.pillWrapperExtra]
        : styles.pillWrapper
    return (
      <View
        style={styles.wrapper}
        ref={this.wrapper}
        className={(this.props.className || '') + ' desktop-square'}
      >
        <View style={styles.flexWrapper} onClick={this.triggerMax}>
          <View style={pillWrapperStyles} className="desktop-invisible">
            <View style={styles.pill} />
          </View>
          <View style={styles.bottomWrapper}>
            <View style={styles.textWrapper}>
              <Text style={[styles.text, subtitleStyle]} numberOfLines={1}>
                {this.props.title}&nbsp;
              </Text>
              {subtitleElement}
            </View>
          </View>
        </View>
        {actionIcon}
        {closeIcon}
      </View>
    )
  }
}
const paddingVertical = 12
const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    touchAction: 'none',
    boxShadow: '0 -1px 0 rgba(0,0,0,0.1) inset',
    flexDirection: 'row',
  },
  flexWrapper: {
    flex: 1,
    paddingBottom: paddingVertical,
  },
  pillWrapper: {
    height: paddingVertical,
    paddingTop: paddingVertical / 2,
    paddingLeft: 44,
  },
  pillWrapperExtra: {
    paddingLeft: 88,
  },
  pill: {
    backgroundColor: '#d8d8d8',
    width: 36,
    height: 5,
    borderRadius: 5,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  bottomWrapper: {
    display: 'flex',
    flexDirection: 'row',
  },
  textWrapper: {
    flex: 1,
    paddingLeft: vars.padding,
  },
  text: {
    fontFamily: vars.fontFamily,
    lineHeight: vars.headerHeight - paddingVertical * 2,
    color: vars.headerColor,
    fontSize: 18,
    fontWeight: '600',
  },
  subtitle: {
    fontFamily: vars.fontFamily,
    lineHeight: 18,
    fontSize: 14,
    color: '#444',
  },
  secondary: {
    paddingLeft: vars.padding * 0.875,
    paddingRight: vars.padding * 0.375,
  },
  close: {
    paddingLeft: vars.padding * 0.375,
    paddingRight: vars.padding * 0.875,
  },
  iconInner: {
    marginTop: 'auto',
    marginBottom: 'auto',
  },
})
export default Header
