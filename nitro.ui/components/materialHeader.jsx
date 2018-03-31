import React from 'react'
import PropTypes from 'prop-types'
import logo from '../../assets/icons/logo.svg'
import backIcon from '../../assets/icons/back.svg'
import { Image, View, Text, StyleSheet } from 'react-native'

import { vars } from '../styles'

export class MaterialHeader extends React.Component {
  render() {
    let leftIcon = null
    if (this.props.leftIcon === 'logo') {
      leftIcon = logo
    } else if (this.props.leftIcon === 'back') {
      leftIcon = backIcon
    }
    const textStyles = this.props.h1Weight === '900' ? StyleSheet.flatten([styles.text, styles.textBold]) : styles.text
    return (
      <View style={styles.wrapper}>
        <View style={styles.logoContainer} onClick={this.props.leftAction}>
          <Image
            accessibilityLabel="Nitro Logo"
            source={leftIcon}
            resizeMode="contain"
            style={styles.logo}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={textStyles}>{this.props.h1}</Text>
        </View>
      </View>
    )
  }
}

MaterialHeader.propTypes = {
  leftIcon: PropTypes.string,
  leftAction: PropTypes.func,
  rightIcon: PropTypes.string,
  rightAction: PropTypes.func,
  h1: PropTypes.string,
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: vars.padding - 2,
    paddingLeft: vars.padding,
    paddingRight: vars.padding,
    paddingBottom: vars.padding - 2,
    height: 56
  },
  logoContainer: {
    width: 30,
    paddingRight: vars.padding / 2
  },
  textContainer: {
    flex: 1
  },
  logo: {
    height: 28
  },
  text: {
    fontSize: vars.padding * 1.25,
    lineHeight: 24
  },
  textBold: {
    fontWeight: '900'
  }
})
