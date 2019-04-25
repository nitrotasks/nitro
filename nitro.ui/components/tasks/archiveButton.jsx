import React, { useState, forwardRef } from 'react'
import { vars } from '../../styles.js'
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native'

import { NitroSdk } from '../../../nitro.sdk'
import { ModalService } from '../../services/modalService.js'
import archiveIcon from '../../../assets/icons/material/archive.svg'

const ARCHIVE_MULTIPLE_WARNING =
  'Are you sure you want to archive these tasks?\n\nYou currently can’t view archived tasks in Nitro.'

const triggerArchive = listId => () => {
  ModalService.show(
    {
      message: ARCHIVE_MULTIPLE_WARNING,
      confirmText: 'Archive Tasks',
      confirmColor: vars.positiveColor,
      cancelText: 'Cancel'
    },
    () => NitroSdk.archiveCompletedList(listId)
  )
}

const triggerArchiveKeyDown = listId => e => {
  const keycode = e.keyCode
  if (keycode === 13) {
    this.triggerArchive(listId)()
    e.currentTarget.blur()
  } else if (keycode === 27) {
    e.currentTarget.blur()
  } else if (keycode === 38 || keycode === 75) {
    const node = e.currentTarget.parentNode.previousSibling.children[0]
    if (node) node.focus()
    e.preventDefault()
  }
}

export const ArchiveButton = forwardRef(({ completed, style, listId }, ref) => {
  const [hover, setHover] = useState(false)
  const archiveStyles = style
    ? [styles.archiveButtonWrapper, style]
    : styles.archiveButtonWrapper
  return (
    <View ref={ref} style={archiveStyles}>
      <TouchableOpacity
        onPress={triggerArchive(listId)}
        accessible={true}
        onKeyDown={triggerArchiveKeyDown(listId)}
      >
        <View
          style={
            hover
              ? [styles.archiveButton, styles.archiveHover]
              : styles.archiveButton
          }
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <Image
            accessibilityLabel="Archive Icon"
            source={archiveIcon}
            resizeMode="contain"
            style={styles.archiveIcon}
          />
          <Text style={styles.archiveButtonText}>
            Archive {completed} completed tasks
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  )
})
const styles = StyleSheet.create({
  archiveButtonWrapper: {
    display: 'flex',
    flexDirection: 'row',
    paddingTop: vars.padding,
    paddingBottom: vars.padding,
    paddingLeft: vars.padding / 4,
    transitionDuration: '300ms',
    transitionTimingFunction: 'ease',
    transitionProperty: 'transform'
  },
  archiveButton: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#ccc',
    borderRadius: 3,
    paddingLeft: vars.padding * 0.75,
    paddingRight: vars.padding * 0.75,
    paddingTop: vars.padding / 2,
    paddingBottom: vars.padding / 2
  },
  archiveIcon: {
    height: 11,
    width: 12
  },
  archiveButtonText: {
    textIndent: vars.padding * 0.375,
    fontFamily: vars.fontFamily,
    fontSize: 14
  },
  archiveHover: {
    backgroundColor: 'rgba(0,0,0,0.035)'
  }
})
