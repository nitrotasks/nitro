import React from 'react'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  findNodeHandle
} from 'react-native'

import { NitroSdk } from '../../../nitro.sdk'
import { TasksExpandedService } from '../../services/tasksExpandedService.js'
import { UiService } from '../../services/uiService.js'
import { headerMenu } from './taskMenu.js'
import { vars } from '../../styles.js'

import moreIcon from '../../../assets/icons/material/task-more.svg'
import dropDownIcon from '../../../assets/icons/material/drop-down.svg'

class TaskHeaderWithoutRouter extends React.PureComponent {
  static propTypes = {
    dataId: PropTypes.string,
    dataName: PropTypes.string,
    dataType: PropTypes.string,
    disabled: PropTypes.bool
  }
  state = {
    name: this.props.dataName,
    textInputFocus: false
  }
  textInputRef = React.createRef()
  componentDidMount() {
    TasksExpandedService.bind('indirect-focus', this.triggerIndirectFocus)
    this.triggerIndirectFocus() // picks up any lingering events
  }
  componentWillUnmount() {
    TasksExpandedService.unbind('indirect-focus', this.triggerIndirectFocus)
  }
  triggerIndirectFocus = () => {
    const taskId = TasksExpandedService.indirectFocusQueue
    if (this.props.dataId === taskId) {
      TasksExpandedService.indirectFocusQueue = null
      const node = findNodeHandle(this.textInputRef.current)
      if (node) {
        const obj = { top: node.getBoundingClientRect().top }
        UiService.scrollTo(obj)
        this.textInputRef.current.focus()
      }
    }
  }
  triggerClick = () => {
    if (this.props.disabled) {
      const list = NitroSdk.getList(this.props.dataId.split('-')[0])
      if (list !== null) {
        this.props.history.push('/' + list.id)
      }
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
      this.setState(this.setState({ name: this.props.dataName }))
      e.currentTarget.blur()
      // ENTER
    } else if (e.keyCode === 13) {
      e.currentTarget.blur()
    }
  }
  triggerCollapse = () => {
    const updateType =
      NitroSdk.getTask(this.props.dataId).type === 'header'
        ? 'header-collapsed'
        : 'header'
    NitroSdk.updateTask(this.props.dataId, {
      type: updateType
    })
  }
  triggerContextMenu = mode => {
    return e => {
      if (e.nativeEvent.target.tagName === 'INPUT') {
        return
      }
      e.preventDefault()
      const x = e.nativeEvent.pageX
      const y = e.nativeEvent.pageY - window.scrollY
      headerMenu(this.props.dataId, x, y, 'top', mode)
    }
  }
  render() {
    const wrapperInner = this.state.textInputFocus
      ? [styles.wrapperInner, styles.wrapperFocus]
      : styles.wrapperInner

    const collapse = this.props.disabled ? null : (
      <Text onClick={this.triggerCollapse} style={styles.collapseIcon}>
        <Image
          accessibilityLabel={
            this.props.dataType === 'header'
              ? 'Collapse Header'
              : 'Expand Header'
          }
          source={dropDownIcon}
          resizeMode="contain"
          style={
            this.props.dataType === 'header'
              ? [styles.dropDownIcon, styles.dropDownIconRotated]
              : styles.dropDownIcon
          }
        />
      </Text>
    )
    const controls = this.props.disabled ? null : (
      <TouchableOpacity
        style={styles.moreIcon}
        onClick={this.triggerContextMenu('right')}
        accessible={false}
      >
        <Image
          accessibilityLabel="More"
          source={moreIcon}
          resizeMode="contain"
          style={styles.barIcon}
        />
      </TouchableOpacity>
    )
    return (
      <View
        style={styles.wrapper}
        onClick={this.triggerClick}
        onContextMenu={this.triggerContextMenu('left')}
      >
        <View style={wrapperInner}>
          {collapse}
          <TextInput
            ref={this.textInputRef}
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
      </View>
    )
  }
}
const TaskHeader = withRouter(TaskHeaderWithoutRouter)
export { TaskHeader }

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: vars.padding,
    paddingBottom: vars.padding / 2,
    paddingLeft: vars.padding / 2,
    paddingRight: vars.padding / 2
  },
  wrapperInner: {
    flexDirection: 'row',
    borderBottomStyle: 'solid',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
  },
  wrapperFocus: {
    borderBottomColor: vars.accentColorMuted
  },
  collapseIcon: {
    fontSize: vars.taskHeaderFontSize - 1,
    justifyContent: 'center',
    paddingRight: 2
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
    color: vars.headerColor,
    opacity: 1
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
  },
  dropDownIcon: {
    width: 24,
    height: '95%'
  },
  dropDownIconRotated: {
    transform: [{ rotate: '90deg' }]
  }
})
