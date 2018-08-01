import React from 'react'
import PropTypes from 'prop-types'
import { Image, View, Text, StyleSheet } from 'react-native'

import { vars } from '../styles'

import logo from '../../assets/icons/logo.svg'
import backIcon from '../../assets/icons/back.svg'
import menuIcon from '../../assets/icons/menu.svg'

export class MaterialHeader extends React.Component {
  static propTypes = {
    fixed: PropTypes.bool,
    leftIcon: PropTypes.string,
    leftAction: PropTypes.func,
    rightIcon: PropTypes.string,
    rightAction: PropTypes.func,
    h1Visible: PropTypes.bool,
    h1: PropTypes.string,
    shadow: PropTypes.bool
  }
  render() {
    let leftIcon = null
    let rightIcon = null
    if (this.props.leftIcon === 'logo') {
      leftIcon = logo
    } else if (this.props.leftIcon === 'back') {
      leftIcon = backIcon
    }
    if (this.props.rightIcon === 'menu') {
      rightIcon = menuIcon
    }

    const wrapperStyles = this.props.fixed
      ? [styles.wrapper, styles.wrapperFixed]
      : styles.wrapper

    const textStyles =
      this.props.h1Weight === '900'
        ? [styles.text, styles.textBold]
        : styles.text

    const h1Styles =
      this.props.h1Visible === false
        ? [styles.textContainer, styles.textContainerHidden]
        : styles.textContainer

    const wrapperClassName =
      this.props.h1Visible === false || this.props.shadow === false
        ? 'pseudo-shadow'
        : 'pseudo-shadow visible'
    return (
      <View style={wrapperStyles} className={wrapperClassName}>
        <View style={styles.leftContainer} onClick={this.props.leftAction}>
          <Image source={leftIcon} resizeMode="contain" style={styles.logo} />
        </View>
        <View style={h1Styles}>
          <Text style={textStyles}>{this.props.h1}</Text>
        </View>
        <View style={styles.rightContainer} onClick={this.props.rightAction}>
          <Image source={rightIcon} resizeMode="contain" style={styles.logo} />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  wrapper: {
    // flex: 1,
    flexDirection: 'row',
    paddingTop: vars.padding - 2,
    paddingLeft: vars.padding,
    paddingRight: vars.padding,
    paddingBottom: vars.padding - 2,
    height: vars.materialHeaderHeight
  },
  wrapperFixed: {
    position: 'fixed',
    top: 0,
    width: '100%',
    backgroundColor: '#fff',
    zIndex: 3
  },
  leftContainer: {
    width: 30,
    paddingRight: vars.padding / 2
  },
  rightContainer: {
    width: 30,
    paddingLeft: vars.padding / 2
  },
  textContainer: {
    flex: 1,
    transitionDuration: '200ms',
    transitionTimingFunction: 'ease',
    transitionProperty: 'opacity'
  },
  textContainerHidden: {
    opacity: 0
  },
  logo: {
    height: 28
  },
  text: {
    fontSize: vars.padding * 1.25,
    lineHeight: 28,
    fontFamily: vars.fontFamily
  },
  textBold: {
    fontWeight: '900'
  }
})
