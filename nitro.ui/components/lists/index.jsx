import React from 'react'
import { Image, View, Text, StyleSheet } from 'react-native'
import { Link } from 'react-router-dom'

import { NitroSdk } from '../../../nitro.sdk'

import { vars } from '../../styles'
import { Header } from './header.jsx'
import { ListItem } from './listitem.jsx'

export class Lists extends React.Component {
  render() {
    return (
      <View style={styles.wrapper}>
        <Header />
        <View style={styles.listWrapper}>
          {NitroSdk.getLists().map(list => {
            return (
              <ListItem 
                key={list.id}
                id={list.id}
                name={list.name}
                count={list.count}
              />
            )
          })}
        </View>
      </View>
    )
  }   
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: vars.backColor
  },
  listWrapper: {
    padding: vars.padding / 2
  }
})