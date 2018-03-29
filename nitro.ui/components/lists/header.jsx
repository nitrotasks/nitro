import React from 'react'
import logo from '../../../assets/icons/logo.svg';
import { Image, View, Text, StyleSheet } from 'react-native'

import { vars } from '../../styles'

export class Header extends React.Component {
  render() {
    return (
      <View style={styles.wrapper}>
        <View style={styles.logoContainer}>
          <Image
            accessibilityLabel="Nitro Logo" 
            source={logo} 
            resizeMode="contain"
            style={styles.logo}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.text}>Nitro</Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    padding: vars.padding,
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
    height: 29
  },
  text: {
    fontSize: vars.padding * 1.25,
    fontWeight: '900',
    textTransform: 'uppercase'
  }
})