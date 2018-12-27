import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity
} from 'react-native'

import { vars } from '../styles.js'
import { ModalService } from '../services/modalService.js'
import { ShortcutsService } from '../services/shortcutsService.js'

import closeIcon from '../../assets/icons/material/close.svg'

const TOGGLE_HOTKEY = '?'
const CLOSE_HOTKEY = 'esc'
let ALT = 'Alt'
let CTRL = 'Ctrl'
if (navigator.platform.indexOf('Mac') > -1) {
  ALT = 'Option'
  CTRL = '⌘'
}

export class ShortcutsModal extends React.Component {
  state = {
    show: false
  }
  confirmCallback = null
  componentWillMount() {
    ModalService.bind('show-shortcuts', this.showModal)
    ShortcutsService.bind(TOGGLE_HOTKEY, this.toggleModal)
    ShortcutsService.bind(CLOSE_HOTKEY, this.hideModal)
  }
  componentWillUnmount() {
    ModalService.unbind('show-shortcuts', this.showModal)
    ShortcutsService.unbind(TOGGLE_HOTKEY, this.toggleModal)
    ShortcutsService.unbind(CLOSE_HOTKEY, this.hideModal)
  }
  showModal = () => {
    this.setState({ show: true })
  }
  hideModal = () => {
    this.setState({ show: false })
  }
  toggleModal = () => {
    this.setState({ show: !this.state.show })
  }
  render() {
    if (this.state.show === false) {
      return null
    }
    return (
      <View style={styles.wrapper}>
        <View style={styles.innerModal}>
          <View style={styles.bar}>
            <Text style={styles.barText}>Keyboard Shortcuts</Text>
            <TouchableOpacity>
              <Image
                style={styles.close}
                source={closeIcon}
                accessibilityLabel="Close Window"
                title="Close Window"
                onClick={this.hideModal}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
          <ScrollView>
            <Text style={styles.header}>Basics</Text>
            <ShortcutRow
              title="Open List of Keyboard Shortcuts"
              shortcut={['?']}
              alt={true}
            />
            <ShortcutRow title="Quick Search" shortcut={['/', `${CTRL}+K`]} />
            <ShortcutRow
              title="Previous List"
              shortcut={[`${ALT}+↑`]}
              alt={true}
            />
            <ShortcutRow title="Next List" shortcut={[`${ALT}+↓`]} />

            <Text style={styles.header}>Tasks</Text>
            <ShortcutRow
              title="New Task"
              shortcut={['N', `${CTRL}+J`]}
              alt={true}
            />
            <ShortcutRow title="Next Task" shortcut={['J']} />
            <ShortcutRow title="Previous Task" shortcut={['K']} alt={true} />
            <ShortcutRow title="Set Date to Today" shortcut={['T']} />
            <ShortcutRow
              title="Mark Task as Completed"
              shortcut={['C']}
              alt={true}
            />
            <ShortcutRow title="Select / Deselect Task" shortcut={['Space']} />
            <ShortcutRow title="Move Task" shortcut={['↑', '↓']} alt={true} />
          </ScrollView>
        </View>
      </View>
    )
  }
}
const ShortcutRow = props => {
  const { title, shortcut } = props
  const shortcutRowStyle = props.alt
    ? [styles.shortcutRow, styles.shortcutRowAlt]
    : styles.shortcutRow
  return (
    <View style={shortcutRowStyle}>
      <View style={styles.shortcutRowTitle}>
        <Text style={styles.shortcutRowTitleText}>{title}</Text>
      </View>
      <View style={styles.shortcutRowShortcut}>
        {shortcut.map((s, i) => {
          return (
            <React.Fragment key={s.toString()}>
              {s.split('+').map(k => (
                <View key={`${s}+${k}`} style={styles.key}>
                  <Text style={styles.keyText}>{k}</Text>
                </View>
              ))}
              {i !== shortcut.length - 1 ? (
                <Text style={styles.seperator}>or</Text>
              ) : null}
            </React.Fragment>
          )
        })}
      </View>
    </View>
  )
}
const leftPadding = vars.padding * 1.5
const rightPadding = vars.padding * 1.5
const styles = StyleSheet.create({
  wrapper: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    backgroundColor: 'rgba(50, 70, 90, 0.7)'
  },
  innerModal: {
    paddingBottom: vars.padding,
    marginTop: '8vh',
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '90vw',
    maxWidth: '480px',
    maxHeight: '84vh',
    boxShadow: '0 1px 15px rgba(0,0,0,0.1)',
    borderRadius: '5px',
    backgroundColor: '#fff',
    overflow: 'hidden'
  },
  bar: {
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: '#ccc',
    paddingLeft: leftPadding,
    paddingRight: rightPadding,
    paddingTop: vars.padding * 0.75,
    paddingBottom: vars.padding * 0.625,
    backgroundColor: '#f6f6f6',
    flexDirection: 'row'
  },
  barText: {
    fontFamily: vars.fontFamily,
    fontWeight: '600',
    color: '#222',
    fontSize: 16,
    flex: 1,
    lineHeight: 24
  },
  close: {
    height: 24,
    width: 24
  },
  header: {
    fontFamily: vars.fontFamily,
    fontSize: 18,
    fontWeight: '600',
    marginLeft: leftPadding,
    marginRight: rightPadding,
    marginTop: vars.padding * 1.5,
    marginBottom: vars.padding / 2
  },
  shortcutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: leftPadding,
    paddingRight: rightPadding,
    paddingTop: vars.padding / 2,
    paddingBottom: vars.padding / 2
  },
  shortcutRowAlt: {
    backgroundColor: '#f5f5f5'
  },
  shortcutRowTitle: {
    flex: 1
  },
  shortcutRowTitleText: {
    fontFamily: vars.fontFamily,
    fontSize: 16
  },
  shortcutRowShortcut: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  key: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 3,
    paddingTop: vars.padding / 2,
    paddingBottom: vars.padding / 2,
    paddingLeft: vars.padding / 2,
    paddingRight: vars.padding / 2,
    marginLeft: vars.padding / 4
  },
  keyText: {
    fontFamily: vars.fontFamily,
    fontSize: 13
  },
  seperator: {
    fontFamily: vars.fontFamily,
    fontSize: 15,
    marginLeft: 8,
    marginRight: 3
  }
})
