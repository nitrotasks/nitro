import React from 'react'
import PropTypes from 'prop-types'
import {
  View,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet
} from 'react-native'

import { NitroSdk } from '../../../nitro.sdk'
import { headerMenu } from './taskMenu.js'
import { vars } from '../../styles.js'

import moreIcon from '../../../assets/icons/material/task-more.svg'

export class TaskHeader extends React.PureComponent {
  static propTypes = {
    dataId: PropTypes.string,
    dataName: PropTypes.string,
    disabled: PropTypes.bool
  }
  constructor(props) {
    super(props)
    this.state = {
      name: this.props.dataName,
      textInputFocus: false 
    }
  }
  triggerFocus = () => {
    this.setState({
      textInputFocus: true
    })
  }
  triggerChange = e => {
    this.setState({
      name: e.currentTarget.value
    })
  }
  triggerBlur = () => {
    const name = this.state.name.trim()
    if (name === '') {
      const state = {
        name: this.props.dataName,
        textInputFocus: false 
      }
      this.setState(state)
    } else {
      if (NitroSdk.getTask(this.props.dataId).name !== this.state.name) {
        NitroSdk.updateTask(this.props.dataId, {
          name: this.state.name
        })
      }
      this.setState({
        textInputFocus: false
      })
    }
  }
  triggerKeyUp = e => {
    // ESC
    if (e.keyCode === 27) {
      this.setState(this.setState({name: this.props.dataName}))
      e.currentTarget.blur()
      // ENTER
    } else if (e.keyCode === 13) {
      e.currentTarget.blur()
    }
  }
  triggerMore = e => {
    const x = e.nativeEvent.pageX
    const y = e.nativeEvent.pageY - window.scrollY
    headerMenu(this.props.dataId, x, y, 'top', 'right')
  }
  render() {
    const wrapperStyles = this.state.textInputFocus
      ? [styles.wrapper, styles.wrapperFocus]
      : styles.wrapper
    const controls = this.props.disabled ? null : (
      <TouchableOpacity style={styles.moreIcon} onClick={this.triggerMore}>
        <Image
          accessibilityLabel="Choose Deadline"
          source={moreIcon}
          resizeMode="contain"
          style={styles.barIcon}
        />
      </TouchableOpacity>
    )
    return (
      <View style={wrapperStyles}>
        <TextInput
          style={styles.text}
          value={this.state.name}
          onChange={this.triggerChange}
          onFocus={this.triggerFocus}
          onBlur={this.triggerBlur}
          onKeyUp={this.triggerKeyUp}
          disabled={this.props.disabled}
        />
        {controls}
      </View>
    )
  }
}
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    marginTop: vars.padding,
    marginBottom: vars.padding / 2,
    marginLeft: vars.padding / 2,
    marginRight: vars.padding / 2,
    borderBottomStyle: 'solid',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
  },
  wrapperFocus: {
    borderBottomColor: vars.accentColorMuted
  },
  text: {
    fontSize: vars.taskHeaderFontSize,
    lineHeight: vars.taskHeaderFontSize,
    fontFamily: vars.fontFamily,
    paddingTop: vars.padding / 2,
    paddingBottom: vars.padding / 2,
    fontWeight: 'bold',
    outline: '0',
    flex: 1,
    color: vars.headerColor
  },
  moreIcon: {
    paddingTop: vars.padding / 2,
    paddingBottom: vars.padding / 2,
    paddingLeft: vars.padding / 2
  },
  barIcon: {
    opacity: 1,
    height: 24,
    width: 24
  }
})
