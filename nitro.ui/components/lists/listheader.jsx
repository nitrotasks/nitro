import React from 'react'
import {
  View,
  TextInput,
  Image,
  StyleSheet,
  findNodeHandle
} from 'react-native'
import { string, func, bool } from 'prop-types'
import { withRouter } from 'react-router'

import { NitroSdk } from '../../../nitro.sdk'
import { TasksExpandedService } from '../../services/tasksExpandedService.js'
import { SidebarService } from '../../services/sidebarService.js'
import { ShortcutsService } from '../../services/shortcutsService.js'
import { vars } from '../../styles.js'
import { UiService } from '../../services/uiService.js'
import addIcon from '../../../assets/icons/custom/add.svg'
import searchIcon from '../../../assets/icons/custom/search.svg'
import { TouchableOpacity } from '../reusable/touchableOpacity.jsx'

const FOCUS_HOTKEY = '/'
const GLOBAL_FOCUS_HOTKEY = 'ctrl+k'

export class ListHeaderWithoutRouter extends React.Component {
  static propTypes = {
    className: string,
    backFn: func,
    actionFn: func,
    onSearch: func,
    hideClose: bool,
    value: string
  }
  wrapper = React.createRef()
  searchInput = React.createRef()

  state = {
    focus: false
  }

  componentDidMount() {
    SidebarService.bind('focus-search-box', this.triggerHotkey)
    this.wrapperNode = findNodeHandle(this.wrapper.current)
    this.wrapperNode.addEventListener('touchstart', this.triggerTouchStart)
    ShortcutsService.bind(FOCUS_HOTKEY, this.triggerHotkey)
    ShortcutsService.bind(GLOBAL_FOCUS_HOTKEY, this.triggerHotkey)
  }
  componentWillUnmount() {
    SidebarService.unbind('focus-search-box', this.triggerHotkey)
    this.wrapperNode.removeEventListener('touchstart', this.triggerTouchStart)
    ShortcutsService.unbind(FOCUS_HOTKEY, this.triggerHotkey)
    ShortcutsService.unbind(GLOBAL_FOCUS_HOTKEY, this.triggerHotkey)
  }
  triggerAddTask = () => {
    TasksExpandedService.triggerCreate(UiService.state.currentList)
  }
  triggerTouchStart = e => {
    UiService.state.headerEvent = e.target
  }
  triggerHotkey = () => {
    this.searchInput.current.focus()
  }
  triggerSearchFocus = () => {
    this.setState({ focus: true })
    if (UiService.state.cardPosition === 'map') {
      UiService.setCardPosition('max', true, true)
    }
  }
  triggerSearchBlur = () => {
    this.setState({ focus: false })
  }
  triggerSubmit = e => {
    if (window.innerWidth > 850) {
      const query = e.currentTarget.value.trim()
      if (query !== '') {
        const results = NitroSdk.search(query)
        if (results[0] === undefined) {
          return
        }
        const { url } = results[0]
        const parsedUrl = url.split('/')
        if (parsedUrl.length === 3) {
          TasksExpandedService.goToAnyTask(parsedUrl[1], parsedUrl[2])
        } else {
          TasksExpandedService.go(url)
        }
        SidebarService.hideSearchResults()
      }
    }
    // we have to manually blur it
    e.currentTarget.blur()
  }
  triggerKeyUp = e => {
    if (e.keyCode === 27) {
      e.currentTarget.value = ''
      e.currentTarget.blur()
      this.props.onSearch(e)
    } else if (e.keyCode === 40) {
      e.preventDefault()
      SidebarService.focusSearchItemFirst()
    }
  }
  triggerMax() {
    requestAnimationFrame(() => {
      // DISABLED we don't need default
      // const pos =
      //   UiService.state.cardPosition === 'map' ||
      //   UiService.state.cardPosition === 'max'
      //     ? 'default'
      //     : 'max'
      let pos = 'max'
      if (UiService.state.cardPosition === 'max') {
        pos = 'map'
      }
      UiService.setCardPosition(pos, true, true)
    })
  }
  render() {
    const { focus } = this.state
    const textStyles = focus ? [styles.text, styles.textFocus] : styles.text
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
          <View style={styles.bottomWrapper} className="desktop-padding-right">
            <View style={styles.textWrapper} className="desktop-padding-left">
              <TextInput
                ref={this.searchInput}
                className="hover-input"
                placeholder="Search"
                style={textStyles}
                numberOfLines={1}
                value={this.props.value}
                blurOnSubmit={false}
                onSubmitEditing={this.triggerSubmit}
                onFocus={this.triggerSearchFocus}
                onBlur={this.triggerSearchBlur}
                onChange={this.props.onSearch}
                onKeyUp={this.triggerKeyUp}
              />
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={styles.add}
          onClick={this.triggerAddTask}
          className="desktop-hidden"
        >
          <View style={styles.iconInner}>
            <Image source={addIcon} resizeMode="contain" style={styles.icon} />
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}
const ListHeader = withRouter(ListHeaderWithoutRouter)
export { ListHeader }

const paddingVertical = 12
const styles = StyleSheet.create({
  wrapper: {
    touchAction: 'none',
    flexDirection: 'row'
  },
  flexWrapper: {
    flex: 1
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
    flexDirection: 'row',
    paddingBottom: 0
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
    paddingLeft: vars.padding * 2.25,
    fontSize: 16,
    backgroundColor: '#e6e6e6',
    backgroundImage: `url(${searchIcon})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: '7px 50%',
    borderRadius: 5,
    outline: '0',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#e6e6e6',
    transitionDuration: '250ms, 250ms',
    transitionProperty: 'border-color, background-color',
    transitionTimingFunction: 'ease, ease'
  },
  textFocus: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderColor: vars.accentColorMuted
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
